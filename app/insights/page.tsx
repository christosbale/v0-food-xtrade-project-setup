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
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-[#FFB84D]" />
            <h1 className="text-display-large font-bold text-black">
              Market Insights
            </h1>
          </div>
          <p className="text-title-large text-black/60 max-w-2xl mx-auto mb-8">
            Real-time buyer demand trends across categories, origins and countries.
          </p>
          
          {/* Time range filter */}
          <div className="flex items-center justify-center gap-4">
            <span className="text-body-large text-black/60">Time period:</span>
            <div className="flex gap-2">
              <Link
                href="/insights?range=7"
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  timeRange === 7
                    ? 'border-[#FFB84D] bg-[#FFB84D] text-black font-bold'
                    : 'border-border hover:border-[#FFB84D]'
                }`}
              >
                Last 7 days
              </Link>
              <Link
                href="/insights?range=30"
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  timeRange === 30
                    ? 'border-[#FFB84D] bg-[#FFB84D] text-black font-bold'
                    : 'border-border hover:border-[#FFB84D]'
                }`}
              >
                Last 30 days
              </Link>
              <Link
                href="/insights?range=90"
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  timeRange === 90
                    ? 'border-[#FFB84D] bg-[#FFB84D] text-black font-bold'
                    : 'border-border hover:border-[#FFB84D]'
                }`}
              >
                Last 90 days
              </Link>
            </div>
          </div>
        </div>
        
        {/* AI Market Summary section */}
        <AIMarketSummary timeRange={timeRange} />
        
        <div className="space-y-16">
          {/* 1. Top demanded commodities */}
          {insights && (
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-headline-large font-bold text-black">
                  Top Demanded Commodities
                </CardTitle>
                <p className="text-body-large text-muted-foreground">
                  Most searched, requested and viewed products
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-4 px-4 text-title-medium font-bold text-black">
                          Rank
                        </th>
                        <th className="text-left py-4 px-4 text-title-medium font-bold text-black">
                          Category
                        </th>
                        <th className="text-left py-4 px-4 text-title-medium font-bold text-black">
                          Subcategory
                        </th>
                        <th className="text-right py-4 px-4 text-title-medium font-bold text-black">
                          Total Events
                        </th>
                        <th className="text-right py-4 px-4 text-title-medium font-bold text-black">
                          Searches
                        </th>
                        <th className="text-right py-4 px-4 text-title-medium font-bold text-black">
                          RFQs
                        </th>
                        <th className="text-right py-4 px-4 text-title-medium font-bold text-black">
                          Views
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.topCommodities.map((item, index) => (
                        <tr
                          key={`${item.category}:${item.subcategory}`}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <Badge
                              variant={index < 3 ? 'default' : 'outline'}
                              className={
                                index < 3
                                  ? 'bg-[#FFB84D] text-black font-bold'
                                  : ''
                              }
                            >
                              #{index + 1}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-body-large text-black/70">
                            {item.categoryLabel}
                          </td>
                          <td className="py-4 px-4 text-body-large font-medium text-black">
                            {item.subcategoryLabel}
                          </td>
                          <td className="py-4 px-4 text-right text-title-large font-bold text-black">
                            {item.totalEvents}
                          </td>
                          <td className="py-4 px-4 text-right text-body-large text-black/70">
                            {item.searches}
                          </td>
                          <td className="py-4 px-4 text-right text-body-large text-black/70">
                            {item.rfqs}
                          </td>
                          <td className="py-4 px-4 text-right text-body-large text-black/70">
                            {item.views}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* 2. Rising demand (momentum) */}
          {insights && (
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-headline-large font-bold text-black flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  Trending Up
                </CardTitle>
                <p className="text-body-large text-muted-foreground">
                  Commodities with the highest demand growth
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {insights.risingDemand.map((item) => (
                    <div
                      key={item.subcategory}
                      className="flex items-center justify-between p-6 border-2 border-border rounded-lg hover:border-[#FFB84D] transition-colors"
                    >
                      <div>
                        <h3 className="text-title-large font-bold text-black mb-1">
                          {item.subcategoryLabel}
                        </h3>
                        <p className="text-body-medium text-muted-foreground">
                          {item.currentEvents} events (vs {item.previousEvents} previous period)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-headline-medium font-bold text-green-600">
                          +{item.percentChange.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* 3. Demand by destination country */}
          {insights && (
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-headline-large font-bold text-black">
                  Demand by Destination Country
                </CardTitle>
                <p className="text-body-large text-muted-foreground">
                  Where buyers are located and what they're requesting
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left py-4 px-4 text-title-medium font-bold text-black">
                          Country
                        </th>
                        <th className="text-right py-4 px-4 text-title-medium font-bold text-black">
                          RFQs
                        </th>
                        <th className="text-left py-4 px-4 text-title-medium font-bold text-black">
                          Top Requested Commodities
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {insights.countryDemand.map((item) => (
                        <tr
                          key={item.country}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-4 text-body-large font-medium text-black">
                            {item.country}
                          </td>
                          <td className="py-4 px-4 text-right text-title-large font-bold text-black">
                            {item.rfqCount}
                          </td>
                          <td className="py-4 px-4 text-body-large text-black/70">
                            {item.topSubcategories.join(', ') || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* 4. Origin preference insights */}
          {insights && (
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-headline-large font-bold text-black">
                  Origin Preference Insights
                </CardTitle>
                <p className="text-body-large text-muted-foreground">
                  Which origins buyers prefer for each commodity
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {insights.originPreferences.map((item) => (
                    <div key={item.subcategory} className="space-y-4">
                      <h3 className="text-title-large font-bold text-black">
                        {item.subcategoryLabel}
                      </h3>
                      <div className="grid gap-3">
                        {item.origins.map((origin) => (
                          <div
                            key={origin.country}
                            className="flex items-center justify-between p-4 border border-border rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-body-large font-medium text-black">
                                  {origin.country}
                                </span>
                                <Badge variant="outline">
                                  {origin.count} events
                                </Badge>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-[#FFB84D] h-2 rounded-full transition-all"
                                  style={{ width: `${origin.percentage}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-title-large font-bold text-black ml-4">
                              {origin.percentage.toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* 5. Fresh produce specific insight */}
          {insights && insights.freshDemand.length > 0 && (
            <Card className="border-2 border-border bg-gradient-to-br from-white to-green-50">
              <CardHeader>
                <CardTitle className="text-headline-large font-bold text-black">
                  Fresh Produce Trends
                </CardTitle>
                <p className="text-body-large text-muted-foreground">
                  Most demanded fresh produce items
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.freshDemand.map((item) => (
                    <div
                      key={item.subcategory}
                      className="flex items-center justify-between p-6 bg-white border-2 border-border rounded-lg hover:border-green-500 transition-colors"
                    >
                      <span className="text-title-large font-medium text-black">
                        {item.subcategoryLabel}
                      </span>
                      <Badge className="bg-green-600 text-white">
                        {item.count} events
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-body-medium text-muted-foreground">
            Insights are calculated from buyer searches, RFQ submissions, and product views.
            <br />
            Data refreshes in real-time as buyers interact with the platform.
          </p>
        </div>
      </div>
    </div>
  )
}
