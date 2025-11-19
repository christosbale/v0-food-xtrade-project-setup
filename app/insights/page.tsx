import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'
import { AIMarketSummary } from '@/components/insights/ai-market-summary'
import Link from 'next/link'

interface TopCommodity {
  category: string
  subcategory: string
  categoryLabel: string
  subcategoryLabel: string
  totalEvents: number
  searches: number
  rfqs: number
  views: number
}

interface RisingDemand {
  subcategory: string
  subcategoryLabel: string
  percentChange: number
  currentEvents: number
  previousEvents: number
}

interface CountryDemand {
  country: string
  rfqCount: number
  topSubcategories: string[]
}

interface OriginPreference {
  subcategory: string
  subcategoryLabel: string
  origins: { country: string; count: number; percentage: number }[]
}

async function getMarketInsights(timeRange: number) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - timeRange)
  
  // 1. Top demanded commodities
  const { data: demandEvents } = await supabase
    .from('demand_events')
    .select('*')
    .gte('created_at', startDate.toISOString())
  
  const topCommodities: TopCommodity[] = []
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
  
  commodityMap.forEach((counts, key) => {
    const [category, subcategory] = key.split(':')
    const categoryObj = PRODUCT_CATEGORIES.find((c) => c.id === category)
    const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
    
    if (categoryObj && subcategoryObj) {
      topCommodities.push({
        category,
        subcategory,
        categoryLabel: categoryObj.label,
        subcategoryLabel: subcategoryObj.label,
        totalEvents: counts.searches + counts.rfqs + counts.views,
        searches: counts.searches,
        rfqs: counts.rfqs,
        views: counts.views,
      })
    }
  })
  
  topCommodities.sort((a, b) => b.totalEvents - a.totalEvents)
  
  // 2. Rising demand (momentum)
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
  
  const risingDemand: RisingDemand[] = []
  
  currentCounts.forEach((currentCount, subcategory) => {
    const previousCount = previousCounts.get(subcategory) || 1
    const percentChange = ((currentCount - previousCount) / previousCount) * 100
    
    const categoryObj = PRODUCT_CATEGORIES.find((c) =>
      c.subcategories.some((s) => s.id === subcategory)
    )
    const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
    
    if (subcategoryObj && percentChange > 0) {
      risingDemand.push({
        subcategory,
        subcategoryLabel: subcategoryObj.label,
        percentChange,
        currentEvents: currentCount,
        previousEvents: previousCount,
      })
    }
  })
  
  risingDemand.sort((a, b) => b.percentChange - a.percentChange)
  
  // 3. Demand by destination country
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
  
  const countryDemand: CountryDemand[] = []
  
  countryDemandMap.forEach((data, country) => {
    const topSubcategories = Array.from(data.subcategories)
      .slice(0, 3)
      .map((subId) => {
        for (const cat of PRODUCT_CATEGORIES) {
          const sub = cat.subcategories.find((s) => s.id === subId)
          if (sub) return sub.label
        }
        return subId
      })
    
    countryDemand.push({
      country,
      rfqCount: data.count,
      topSubcategories,
    })
  })
  
  countryDemand.sort((a, b) => b.rfqCount - a.rfqCount)
  
  // 4. Origin preference insights
  const originMap = new Map<string, Map<string, number>>()
  
  demandEvents?.forEach((event) => {
    if (!event.subcategory || !event.origin_country) return
    
    if (!originMap.has(event.subcategory)) {
      originMap.set(event.subcategory, new Map())
    }
    
    const origins = originMap.get(event.subcategory)!
    origins.set(event.origin_country, (origins.get(event.origin_country) || 0) + 1)
  })
  
  const originPreferences: OriginPreference[] = []
  
  originMap.forEach((origins, subcategory) => {
    const categoryObj = PRODUCT_CATEGORIES.find((c) =>
      c.subcategories.some((s) => s.id === subcategory)
    )
    const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
    
    if (!subcategoryObj) return
    
    const total = Array.from(origins.values()).reduce((sum, count) => sum + count, 0)
    const originList = Array.from(origins.entries())
      .map(([country, count]) => ({
        country,
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    originPreferences.push({
      subcategory,
      subcategoryLabel: subcategoryObj.label,
      origins: originList,
    })
  })
  
  originPreferences.sort((a, b) => {
    const aTotal = a.origins.reduce((sum, o) => sum + o.count, 0)
    const bTotal = b.origins.reduce((sum, o) => sum + o.count, 0)
    return bTotal - aTotal
  })
  
  // 5. Fresh produce specific insight
  const freshProduceEvents = demandEvents?.filter((e) => e.category === 'fresh_produce') || []
  
  const freshMap = new Map<string, number>()
  freshProduceEvents.forEach((event) => {
    if (!event.subcategory) return
    freshMap.set(event.subcategory, (freshMap.get(event.subcategory) || 0) + 1)
  })
  
  const freshDemand = Array.from(freshMap.entries())
    .map(([subcategory, count]) => {
      const categoryObj = PRODUCT_CATEGORIES.find((c) => c.id === 'fresh_produce')
      const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
      
      return {
        subcategory,
        subcategoryLabel: subcategoryObj?.label || subcategory,
        count,
      }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  
  return {
    topCommodities: topCommodities.slice(0, 15),
    risingDemand: risingDemand.slice(0, 10),
    countryDemand: countryDemand.slice(0, 10),
    originPreferences: originPreferences.slice(0, 10),
    freshDemand,
  }
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: { range?: string }
}) {
  const timeRange = parseInt(searchParams.range || '30')
  const insights = await getMarketInsights(timeRange)
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container-boxed py-24">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-10 w-10 text-[#FFD036]" />
            <h1 className="text-display-medium font-bold text-[#0D1117]">
              Market Insights
            </h1>
          </div>
          <p className="text-body-large text-[#7A7A7A] max-w-3xl mb-12">
            Real-time buyer demand intelligence across categories, origins and destination markets.
          </p>
          
          {/* Time range filter - minimal button design */}
          <div className="flex items-center gap-3">
            <span className="text-body-medium text-[#7A7A7A]">Time period:</span>
            <div className="flex gap-2">
              <Link
                href="/insights?range=7"
                className={`px-5 py-2 text-sm font-bold transition-all ${
                  timeRange === 7
                    ? 'bg-[#0D1117] text-white'
                    : 'bg-white text-[#0D1117] border border-[#E2E2E2] hover:border-[#0D1117]'
                }`}
                style={{ borderRadius: '6px' }}
              >
                7 Days
              </Link>
              <Link
                href="/insights?range=30"
                className={`px-5 py-2 text-sm font-bold transition-all ${
                  timeRange === 30
                    ? 'bg-[#0D1117] text-white'
                    : 'bg-white text-[#0D1117] border border-[#E2E2E2] hover:border-[#0D1117]'
                }`}
                style={{ borderRadius: '6px' }}
              >
                30 Days
              </Link>
              <Link
                href="/insights?range=90"
                className={`px-5 py-2 text-sm font-bold transition-all ${
                  timeRange === 90
                    ? 'bg-[#0D1117] text-white'
                    : 'bg-white text-[#0D1117] border border-[#E2E2E2] hover:border-[#0D1117]'
                }`}
                style={{ borderRadius: '6px' }}
              >
                90 Days
              </Link>
            </div>
          </div>
        </div>
        
        {/* AI Market Summary section */}
        <AIMarketSummary timeRange={timeRange} />
        
        <div className="space-y-20">
          {/* 1. Top demanded commodities - white background */}
          {insights && (
            <section className="bg-white">
              <div className="border border-[#E2E2E2] p-8">
                <div className="mb-8">
                  <h2 className="text-headline-medium font-bold text-[#0D1117] mb-3">
                    Top Demanded Commodities
                  </h2>
                  <p className="text-body-medium text-[#7A7A7A]">
                    Most searched, requested and viewed products
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E2E2E2]">
                        <th className="text-left py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Rank
                        </th>
                        <th className="text-left py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Category
                        </th>
                        <th className="text-left py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Subcategory
                        </th>
                        <th className="text-right py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Total
                        </th>
                        <th className="text-right py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Searches
                        </th>
                        <th className="text-right py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          RFQs
                        </th>
                        <th className="text-right py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.topCommodities.map((item, index) => (
                        <tr
                          key={`${item.category}:${item.subcategory}`}
                          className="border-b border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors"
                        >
                          <td className="py-4 px-3">
                            <span className="text-sm font-bold text-[#0D1117]">
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-sm text-[#7A7A7A]">
                            {item.categoryLabel}
                          </td>
                          <td className="py-4 px-3 text-sm font-medium text-[#0D1117]">
                            {item.subcategoryLabel}
                          </td>
                          <td className="py-4 px-3 text-right text-base font-bold text-[#0D1117]">
                            {item.totalEvents}
                          </td>
                          <td className="py-4 px-3 text-right text-sm text-[#7A7A7A]">
                            {item.searches}
                          </td>
                          <td className="py-4 px-3 text-right text-sm text-[#7A7A7A]">
                            {item.rfqs}
                          </td>
                          <td className="py-4 px-3 text-right text-sm text-[#7A7A7A]">
                            {item.views}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
          
          {/* 2. Rising demand (momentum) - SoftGrey background */}
          {insights && (
            <section className="bg-[#F6F6F6] -mx-8 px-8 py-12">
              <div className="container-boxed">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <h2 className="text-headline-medium font-bold text-[#0D1117]">
                      Trending Up
                    </h2>
                  </div>
                  <p className="text-body-medium text-[#7A7A7A]">
                    Commodities with the highest demand growth
                  </p>
                </div>
                
                <div className="grid gap-3">
                  {insights.risingDemand.map((item) => (
                    <div
                      key={item.subcategory}
                      className="flex items-center justify-between p-6 bg-white border border-[#E2E2E2] hover:border-[#0D1117] transition-colors"
                    >
                      <div>
                        <h3 className="text-base font-bold text-[#0D1117] mb-1">
                          {item.subcategoryLabel}
                        </h3>
                        <p className="text-sm text-[#7A7A7A]">
                          {item.currentEvents} events (vs {item.previousEvents} previous period)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-xl font-bold text-green-600">
                          +{item.percentChange.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* 3. Demand by destination country - white background */}
          {insights && (
            <section className="bg-white">
              <div className="border border-[#E2E2E2] p-8">
                <div className="mb-8">
                  <h2 className="text-headline-medium font-bold text-[#0D1117] mb-3">
                    Demand by Destination Country
                  </h2>
                  <p className="text-body-medium text-[#7A7A7A]">
                    Where buyers are located and what they're requesting
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E2E2E2]">
                        <th className="text-left py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Country
                        </th>
                        <th className="text-right py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          RFQs
                        </th>
                        <th className="text-left py-4 px-3 text-sm font-bold text-[#0D1117] uppercase tracking-wide">
                          Top Requested Commodities
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.countryDemand.map((item) => (
                        <tr
                          key={item.country}
                          className="border-b border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors"
                        >
                          <td className="py-4 px-3 text-sm font-medium text-[#0D1117]">
                            {item.country}
                          </td>
                          <td className="py-4 px-3 text-right text-base font-bold text-[#0D1117]">
                            {item.rfqCount}
                          </td>
                          <td className="py-4 px-3 text-sm text-[#7A7A7A]">
                            {item.topSubcategories.join(', ') || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
          
          {/* 4. Origin preference insights - SoftGrey background */}
          {insights && (
            <section className="bg-[#F6F6F6] -mx-8 px-8 py-12">
              <div className="container-boxed">
                <div className="mb-8">
                  <h2 className="text-headline-medium font-bold text-[#0D1117] mb-3">
                    Origin Preference Insights
                  </h2>
                  <p className="text-body-medium text-[#7A7A7A]">
                    Which origins buyers prefer for each commodity
                  </p>
                </div>
                
                <div className="space-y-8">
                  {insights.originPreferences.map((item) => (
                    <div key={item.subcategory} className="bg-white border border-[#E2E2E2] p-6">
                      <h3 className="text-base font-bold text-[#0D1117] mb-6">
                        {item.subcategoryLabel}
                      </h3>
                      <div className="grid gap-3">
                        {item.origins.map((origin) => (
                          <div
                            key={origin.country}
                            className="flex items-center gap-6"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-medium text-[#0D1117] min-w-[120px]">
                                  {origin.country}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {origin.count}
                                </Badge>
                              </div>
                              <div className="w-full bg-[#E2E2E2] h-1.5">
                                <div
                                  className="bg-[#0D1117] h-1.5 transition-all"
                                  style={{ width: `${origin.percentage}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-base font-bold text-[#0D1117] min-w-[60px] text-right">
                              {origin.percentage.toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* 5. Fresh produce specific insight - white background */}
          {insights && insights.freshDemand.length > 0 && (
            <section className="bg-white">
              <div className="border border-[#E2E2E2] p-8">
                <div className="mb-8">
                  <h2 className="text-headline-medium font-bold text-[#0D1117] mb-3">
                    Fresh Produce Trends
                  </h2>
                  <p className="text-body-medium text-[#7A7A7A]">
                    Most demanded fresh produce items
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insights.freshDemand.map((item) => (
                    <div
                      key={item.subcategory}
                      className="flex items-center justify-between p-5 bg-[#F6F6F6] border border-[#E2E2E2] hover:border-[#0D1117] transition-colors"
                    >
                      <span className="text-sm font-medium text-[#0D1117]">
                        {item.subcategoryLabel}
                      </span>
                      <Badge className="bg-green-600 text-white text-xs">
                        {item.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
        
        {/* Footer note */}
        <div className="mt-20 text-center">
          <p className="text-sm text-[#7A7A7A]">
            Insights calculated from buyer searches, RFQ submissions, and product views.
            <br />
            Data refreshes in real-time as buyers interact with the platform.
          </p>
        </div>
      </div>
    </div>
  )
}
