import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeRangeParam = searchParams.get('timeRange') || '30d'
    
    // Parse time range
    const timeRange = parseInt(timeRangeParam.replace('d', ''))
    
    console.log('[v0] AI Market Summary: Starting request for', timeRange, 'days')
    
    const supabase = await createClient()
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)
    
    // Fetch demand events
    const { data: demandEvents } = await supabase
      .from('demand_events')
      .select('*')
      .gte('created_at', startDate.toISOString())
    
    console.log('[v0] AI Market Summary: Fetched', demandEvents?.length || 0, 'demand events')
    
    // Aggregate top commodities
    const commodityMap = new Map<string, { searches: number; rfqs: number; views: number }>()
    
    demandEvents?.forEach((event) => {
      if (!event.category || !event.subcategory) return
      const key = `${event.category}:${event.subcategory}`
      
      if (!commodityMap.has(key)) {
        commodityMap.set(key, { searches: 0, rfqs: 0, views: 0 })
      }
      
      const counts = commodityMap.get(key)!
      if (event.event_type === 'search') counts.searches++
      else if (event.event_type === 'rfq') counts.rfqs++
      else if (event.event_type === 'view') counts.views++
    })
    
    const topCommodities = Array.from(commodityMap.entries())
      .map(([key, counts]) => {
        const [category, subcategory] = key.split(':')
        const categoryObj = PRODUCT_CATEGORIES.find((c) => c.id === category)
        const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
        
        return {
          category: categoryObj?.label || category,
          subcategory: subcategoryObj?.label || subcategory,
          totalEvents: counts.searches + counts.rfqs + counts.views,
          searches: counts.searches,
          rfqs: counts.rfqs,
          views: counts.views,
        }
      })
      .sort((a, b) => b.totalEvents - a.totalEvents)
      .slice(0, 10)
    
    // Calculate rising demand (momentum)
    const previousStart = new Date()
    previousStart.setDate(previousStart.getDate() - timeRange * 2)
    const previousEnd = new Date()
    previousEnd.setDate(previousEnd.getDate() - timeRange)
    
    const { data: previousEvents } = await supabase
      .from('demand_events')
      .select('*')
      .gte('created_at', previousStart.toISOString())
      .lt('created_at', previousEnd.toISOString())
    
    const currentCounts = new Map<string, number>()
    const previousCounts = new Map<string, number>()
    
    demandEvents?.forEach((event) => {
      if (!event.subcategory) return
      currentCounts.set(event.subcategory, (currentCounts.get(event.subcategory) || 0) + 1)
    })
    
    previousEvents?.forEach((event) => {
      if (!event.subcategory) return
      previousCounts.set(event.subcategory, (previousCounts.get(event.subcategory) || 0) + 1)
    })
    
    const risingDemand = Array.from(currentCounts.entries())
      .map(([subcategory, currentCount]) => {
        const previousCount = previousCounts.get(subcategory) || 1
        const percentChange = ((currentCount - previousCount) / previousCount) * 100
        
        const categoryObj = PRODUCT_CATEGORIES.find((c) =>
          c.subcategories.some((s) => s.id === subcategory)
        )
        const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
        
        return {
          subcategory: subcategoryObj?.label || subcategory,
          percentChange,
          currentEvents: currentCount,
          previousEvents: previousCount,
        }
      })
      .filter(item => item.percentChange > 0)
      .sort((a, b) => b.percentChange - a.percentChange)
      .slice(0, 10)
    
    // Country demand from RFQs
    const { data: rfqData } = await supabase
      .from('rfqs')
      .select('*')
      .gte('created_at', startDate.toISOString())
    
    const countryDemandMap = new Map<string, { count: number; subcategories: Set<string> }>()
    
    rfqData?.forEach((rfq) => {
      if (!rfq.buyer_country) return
      
      if (!countryDemandMap.has(rfq.buyer_country)) {
        countryDemandMap.set(rfq.buyer_country, { count: 0, subcategories: new Set() })
      }
      
      const countryData = countryDemandMap.get(rfq.buyer_country)!
      countryData.count++
      
      if (rfq.target_subcategory) {
        countryData.subcategories.add(rfq.target_subcategory)
      }
    })
    
    const countryDemand = Array.from(countryDemandMap.entries())
      .map(([country, data]) => {
        const topSubcategories = Array.from(data.subcategories)
          .slice(0, 3)
          .map((subId) => {
            for (const cat of PRODUCT_CATEGORIES) {
              const sub = cat.subcategories.find((s) => s.id === subId)
              if (sub) return sub.label
            }
            return subId
          })
        
        return {
          country,
          rfqCount: data.count,
          topSubcategories,
        }
      })
      .sort((a, b) => b.rfqCount - a.rfqCount)
      .slice(0, 10)
    
    // Origin preferences
    const originMap = new Map<string, Map<string, number>>()
    
    demandEvents?.forEach((event) => {
      if (!event.subcategory || !event.origin_country) return
      
      if (!originMap.has(event.subcategory)) {
        originMap.set(event.subcategory, new Map())
      }
      
      const origins = originMap.get(event.subcategory)!
      origins.set(event.origin_country, (origins.get(event.origin_country) || 0) + 1)
    })
    
    const originPreferences = Array.from(originMap.entries())
      .map(([subcategory, origins]) => {
        const categoryObj = PRODUCT_CATEGORIES.find((c) =>
          c.subcategories.some((s) => s.id === subcategory)
        )
        const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
        
        const total = Array.from(origins.values()).reduce((sum, count) => sum + count, 0)
        const topOrigin = Array.from(origins.entries())
          .sort((a, b) => b[1] - a[1])[0]
        
        return {
          subcategory: subcategoryObj?.label || subcategory,
          topOrigin: topOrigin[0],
          percentage: ((topOrigin[1] / total) * 100).toFixed(0),
        }
      })
      .slice(0, 10)
    
    console.log('[v0] AI Market Summary: Aggregated data, sending to OpenAI')
    
    // Build AI prompt
    const prompt = `You are a market intelligence analyst for a B2B food trading platform. Analyze the following buyer demand data from the last ${timeRange} days and create a concise market intelligence report.

Data Summary:

Top 10 Demanded Commodities:
${topCommodities.map((c, i) => `${i + 1}. ${c.subcategory} (${c.category}) - ${c.totalEvents} total events (${c.searches} searches, ${c.rfqs} RFQs, ${c.views} views)`).join('\n')}

Top 10 Fastest Rising Commodities (by growth %):
${risingDemand.map((r, i) => `${i + 1}. ${r.subcategory} - +${r.percentChange.toFixed(0)}% (${r.currentEvents} current vs ${r.previousEvents} previous period)`).join('\n')}

Top Destination Countries and Their Interests:
${countryDemand.map((cd) => `- ${cd.country}: ${cd.rfqCount} RFQs, interested in: ${cd.topSubcategories.join(', ')}`).join('\n')}

Notable Origin Preferences:
${originPreferences.map((op) => `- ${op.subcategory}: ${op.topOrigin} (${op.percentage}% preference)`).join('\n')}

Instructions:
1. Write a concise market intelligence report (4-8 short paragraphs or sections with bullet lists).
2. Focus on:
   - Top 3 most demanded commodities with context
   - Top 3 fastest rising commodities with insights
   - 3-5 key destination countries and what they're seeking
   - Notable origin trends (e.g., "Greek figs rising in UAE demand")
3. Be specific, data-driven, and actionable for suppliers.
4. Use clear section headers.
5. Keep it professional but engaging.

Return ONLY the market report text, no JSON wrapper or markdown code blocks.`

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      temperature: 0.5,
      maxTokens: 1500,
    })
    
    console.log('[v0] AI Market Summary: Generated summary successfully')
    
    return NextResponse.json({
      success: true,
      timeRange: `${timeRange}d`,
      summary: text.trim(),
    })
    
  } catch (error) {
    console.error('[v0] AI Market Summary: Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate market summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
