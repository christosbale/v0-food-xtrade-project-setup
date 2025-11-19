import { createClient } from '@/lib/supabase/server'

export interface PriceHistoryEntry {
  product_id: string
  supplier_id: string
  category: string
  subcategory: string
  origin_country: string
  customs_status: string | null
  price: number
  currency: string
}

export interface PriceStats {
  latest: number
  average_7d: number
  average_30d: number
  min_7d: number
  max_7d: number
  min_30d: number
  max_30d: number
}

/**
 * Log a price entry to the price_history table
 */
export async function logPriceHistory(entry: PriceHistoryEntry): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.from('price_history').insert({
    product_id: entry.product_id,
    supplier_id: entry.supplier_id,
    category: entry.category,
    subcategory: entry.subcategory,
    origin_country: entry.origin_country,
    customs_status: entry.customs_status,
    price: entry.price,
    currency: entry.currency,
  })

  if (error) {
    console.error('[v0] Error logging price history:', error)
    throw error
  }

  console.log('[v0] Price history logged successfully for product:', entry.product_id)
}

/**
 * Get the latest price for a specific subcategory
 */
export async function getLatestPrice(
  subcategory: string,
  currency: string = 'EUR'
): Promise<number | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('price_history')
    .select('price')
    .eq('subcategory', subcategory)
    .eq('currency', currency)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) {
    console.log('[v0] No price history found for subcategory:', subcategory)
    return null
  }

  return data.price
}

/**
 * Get average price for a subcategory within a time range
 */
export async function getAveragePrice(
  subcategory: string,
  days: number = 30,
  currency: string = 'EUR'
): Promise<number | null> {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('price_history')
    .select('price')
    .eq('subcategory', subcategory)
    .eq('currency', currency)
    .gte('created_at', startDate.toISOString())

  if (error || !data || data.length === 0) {
    console.log(`[v0] No price history found for subcategory ${subcategory} in last ${days} days`)
    return null
  }

  const sum = data.reduce((acc, row) => acc + row.price, 0)
  return sum / data.length
}

/**
 * Get min/max prices for a subcategory within a time range
 */
export async function getPriceRange(
  subcategory: string,
  days: number = 30,
  currency: string = 'EUR'
): Promise<{ min: number; max: number } | null> {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('price_history')
    .select('price')
    .eq('subcategory', subcategory)
    .eq('currency', currency)
    .gte('created_at', startDate.toISOString())

  if (error || !data || data.length === 0) {
    console.log(`[v0] No price history found for subcategory ${subcategory} in last ${days} days`)
    return null
  }

  const prices = data.map((row) => row.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

/**
 * Get comprehensive price statistics for a subcategory
 */
export async function getPriceStats(
  subcategory: string,
  currency: string = 'EUR'
): Promise<PriceStats | null> {
  const [latest, avg7d, avg30d, range7d, range30d] = await Promise.all([
    getLatestPrice(subcategory, currency),
    getAveragePrice(subcategory, 7, currency),
    getAveragePrice(subcategory, 30, currency),
    getPriceRange(subcategory, 7, currency),
    getPriceRange(subcategory, 30, currency),
  ])

  if (latest === null) {
    return null
  }

  return {
    latest: latest,
    average_7d: avg7d || latest,
    average_30d: avg30d || latest,
    min_7d: range7d?.min || latest,
    max_7d: range7d?.max || latest,
    min_30d: range30d?.min || latest,
    max_30d: range30d?.max || latest,
  }
}
