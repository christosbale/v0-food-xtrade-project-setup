import { createClient } from '@/lib/supabase/server'
import { isInSeason } from './seasonality'

export interface OriginComparisonData {
  origin: string
  avgPrice: number
  minPrice: number
  maxPrice: number
  supplierCount: number
  verifiedSupplierCount: number
  euClearedCount: number
  nonEuCount: number
  bondedCount: number
  trend: number | null // % change
  inSeason: boolean
  productCount: number
}

export async function getOriginComparisonData(
  subcategory: string
): Promise<OriginComparisonData[]> {
  const supabase = await createClient()

  // Fetch all products for this subcategory
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      origin_country,
      price_per_unit,
      currency,
      customs_status,
      company_id,
      category,
      harvest_start_month,
      harvest_end_month,
      companies!products_company_id_fkey (
        verification_status
      )
    `)
    .eq('product_type', subcategory)
    .eq('status', 'published')

  if (error || !products || products.length === 0) {
    console.error('[v0] Error fetching products for comparison:', error)
    return []
  }

  // Get price history for last 60 days
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const { data: priceHistory, error: priceError } = await supabase
    .from('price_history')
    .select('*')
    .eq('subcategory', subcategory)
    .gte('created_at', sixtyDaysAgo.toISOString())

  // Group products by origin country
  const originMap = new Map<string, OriginComparisonData>()

  for (const product of products) {
    const origin = product.origin_country || 'Unknown'
    
    if (!originMap.has(origin)) {
      originMap.set(origin, {
        origin,
        avgPrice: 0,
        minPrice: Infinity,
        maxPrice: -Infinity,
        supplierCount: 0,
        verifiedSupplierCount: 0,
        euClearedCount: 0,
        nonEuCount: 0,
        bondedCount: 0,
        trend: null,
        inSeason: false,
        productCount: 0,
      })
    }

    const data = originMap.get(origin)!
    data.productCount++

    // Price calculations (convert all to EUR for comparison)
    const price = product.price_per_unit || 0
    const priceInEur = product.currency === 'USD' ? price * 0.92 : price
    
    data.avgPrice += priceInEur
    data.minPrice = Math.min(data.minPrice, priceInEur)
    data.maxPrice = Math.max(data.maxPrice, priceInEur)

    // Count unique suppliers
    const uniqueSuppliers = new Set<string>()
    uniqueSuppliers.add(product.company_id)
    data.supplierCount = uniqueSuppliers.size

    // Verified suppliers
    if (product.companies?.verification_status === 'verified') {
      data.verifiedSupplierCount++
    }

    // Customs status distribution
    if (product.customs_status === 'EU-cleared') {
      data.euClearedCount++
    } else if (product.customs_status === 'Non-EU') {
      data.nonEuCount++
    } else if (product.customs_status === 'Bonded warehouse') {
      data.bondedCount++
    }

    // Seasonality (check if any product from this origin is in season)
    if (product.category === 'fresh_produce') {
      if (isInSeason(product)) {
        data.inSeason = true
      }
    }
  }

  // Calculate averages and trends
  const result: OriginComparisonData[] = []
  
  for (const [origin, data] of originMap.entries()) {
    data.avgPrice = data.avgPrice / data.productCount

    // Calculate trend from price history
    if (priceHistory) {
      const originPrices = priceHistory.filter(ph => ph.origin_country === origin)
      
      if (originPrices.length >= 2) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentPrices = originPrices.filter(
          ph => new Date(ph.created_at) >= thirtyDaysAgo
        )
        const olderPrices = originPrices.filter(
          ph => new Date(ph.created_at) < thirtyDaysAgo
        )

        if (recentPrices.length > 0 && olderPrices.length > 0) {
          const recentAvg =
            recentPrices.reduce((sum, ph) => sum + (ph.price || 0), 0) /
            recentPrices.length
          const olderAvg =
            olderPrices.reduce((sum, ph) => sum + (ph.price || 0), 0) /
            olderPrices.length

          if (olderAvg > 0) {
            data.trend = ((recentAvg - olderAvg) / olderAvg) * 100
          }
        }
      }
    }

    result.push(data)
  }

  // Sort by average price (lowest first)
  return result.sort((a, b) => a.avgPrice - b.avgPrice)
}
