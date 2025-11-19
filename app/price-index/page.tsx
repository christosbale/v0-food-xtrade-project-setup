import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

interface PriceIndexData {
  subcategory: string
  subcategoryLabel: string
  category: string
  categoryLabel: string
  avgPrice: number
  minPrice: number
  maxPrice: number
  trend: number
  count: number
}

async function getPriceIndexData(): Promise<PriceIndexData[]> {
  const supabase = await createClient()
  
  // Get price history for last 30 days grouped by subcategory
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { data: priceData, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('currency', 'EUR')
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  if (error || !priceData || priceData.length === 0) {
    console.log('[v0] No price history data found')
    return []
  }
  
  // Group by subcategory and calculate stats
  const groupedData = new Map<string, any[]>()
  
  priceData.forEach((entry) => {
    if (!entry.subcategory) return
    const key = `${entry.category}:${entry.subcategory}`
    if (!groupedData.has(key)) {
      groupedData.set(key, [])
    }
    groupedData.get(key)?.push(entry)
  })
  
  const indexData: PriceIndexData[] = []
  
  groupedData.forEach((entries, key) => {
    const [category, subcategory] = key.split(':')
    
    // Find category and subcategory labels
    const categoryObj = PRODUCT_CATEGORIES.find((c) => c.id === category)
    const subcategoryObj = categoryObj?.subcategories.find((s) => s.id === subcategory)
    
    if (!categoryObj || !subcategoryObj) return
    
    // Calculate current average (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentEntries = entries.filter(
      (e) => new Date(e.created_at) >= sevenDaysAgo
    )
    const olderEntries = entries.filter(
      (e) => new Date(e.created_at) < sevenDaysAgo
    )
    
    if (recentEntries.length === 0) return
    
    const avgPrice =
      recentEntries.reduce((sum, e) => sum + e.price, 0) / recentEntries.length
    const prices = recentEntries.map((e) => e.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    // Calculate trend vs previous period
    let trend = 0
    if (olderEntries.length > 0) {
      const oldAvg =
        olderEntries.reduce((sum, e) => sum + e.price, 0) / olderEntries.length
      trend = ((avgPrice - oldAvg) / oldAvg) * 100
    }
    
    indexData.push({
      subcategory,
      subcategoryLabel: subcategoryObj.label,
      category,
      categoryLabel: categoryObj.label,
      avgPrice,
      minPrice,
      maxPrice,
      trend,
      count: recentEntries.length,
    })
  })
  
  // Sort by category and then subcategory
  return indexData.sort((a, b) => {
    if (a.category !== b.category) {
      return a.categoryLabel.localeCompare(b.categoryLabel)
    }
    return a.subcategoryLabel.localeCompare(b.subcategoryLabel)
  })
}

function TrendIndicator({ trend }: { trend: number }) {
  if (Math.abs(trend) < 0.5) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Minus className="h-4 w-4" />
        <span className="text-sm font-medium">0%</span>
      </div>
    )
  }
  
  const isPositive = trend > 0
  return (
    <div
      className={`flex items-center gap-1 ${
        isPositive ? 'text-red-600' : 'text-green-600'
      }`}
    >
      {isPositive ? (
        <TrendingUp className="h-4 w-4" />
      ) : (
        <TrendingDown className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">
        {isPositive ? '+' : ''}
        {trend.toFixed(1)}%
      </span>
    </div>
  )
}

export default async function PriceIndexPage() {
  const indexData = await getPriceIndexData()
  
  // Group by category
  const categorizedData = new Map<string, PriceIndexData[]>()
  indexData.forEach((item) => {
    if (!categorizedData.has(item.category)) {
      categorizedData.set(item.category, [])
    }
    categorizedData.get(item.category)?.push(item)
  })
  
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-white">
        <div className="container-boxed py-24">
          {/* Header */}
          <div className="mb-20">
            <h1 className="text-display-medium font-bold text-[#0D1117] mb-6">
              Global Price Index
            </h1>
            <p className="text-body-large text-[#7A7A7A] max-w-3xl">
              Real-time wholesale price trends across food commodities. All prices in EUR per kilogram.
            </p>
          </div>
          
          {indexData.length === 0 ? (
            <div className="border border-[#E2E2E2] p-12 text-center">
              <p className="text-body-medium text-[#7A7A7A]">
                No price data available yet. Price index will populate as suppliers add products.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {Array.from(categorizedData.entries()).map(([categoryId, items]) => {
                const categoryLabel = items[0].categoryLabel
                
                return (
                  <section key={categoryId} className="space-y-6">
                    <div className="border-b border-[#E2E2E2] pb-4">
                      <h2 className="text-headline-medium font-bold text-[#0D1117]">
                        {categoryLabel}
                      </h2>
                    </div>
                    
                    <div className="grid gap-3">
                      {items.map((item) => (
                        <div
                          key={`${item.category}:${item.subcategory}`}
                          className="border border-[#E2E2E2] p-6 hover:border-[#0D1117] transition-colors bg-white"
                        >
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-[#0D1117]">
                              {item.subcategoryLabel}
                            </h3>
                            <TrendIndicator trend={item.trend} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <p className="text-xs text-[#7A7A7A] mb-2 uppercase tracking-wide">
                                Average Price
                              </p>
                              <p className="text-2xl font-bold text-[#0D1117]">
                                €{item.avgPrice.toFixed(2)}
                                <span className="text-sm text-[#7A7A7A] ml-2 font-normal">
                                  /kg
                                </span>
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-[#7A7A7A] mb-2 uppercase tracking-wide">
                                Price Range
                              </p>
                              <p className="text-base font-medium text-[#0D1117]">
                                €{item.minPrice.toFixed(2)} – €{item.maxPrice.toFixed(2)}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-xs text-[#7A7A7A] mb-2 uppercase tracking-wide">
                                30-Day Trend
                              </p>
                              <div className="flex items-center gap-2">
                                <TrendIndicator trend={item.trend} />
                                <Badge variant="outline" className="text-xs">
                                  {item.count} samples
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          )}
          
          {/* Footer note */}
          <div className="mt-20 text-center">
            <p className="text-sm text-[#7A7A7A]">
              Prices calculated from recent supplier listings and updated continuously.
              <br />
              All prices shown in EUR per kilogram (€/kg).
            </p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
