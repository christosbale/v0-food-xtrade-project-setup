'use server'

import { createClient } from '@/lib/supabase/server'

export type DemandEventType = 'search' | 'rfq' | 'view'

interface DemandEventData {
  event_type: DemandEventType
  buyer_id?: string | null
  buyer_country?: string | null
  category?: string | null
  subcategory?: string | null
  origin_country?: string | null
  customs_status?: string | null
  quantity?: number | null
  quantity_unit?: string | null
  product_id?: string | null
  rfq_id?: string | null
  metadata?: any
}

async function logDemandEvent(event: DemandEventData): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('demand_events')
      .insert([{
        event_type: event.event_type,
        buyer_id: event.buyer_id || null,
        buyer_country: event.buyer_country || null,
        category: event.category || null,
        subcategory: event.subcategory || null,
        origin_country: event.origin_country || null,
        customs_status: event.customs_status || null,
        quantity: event.quantity || null,
        quantity_unit: event.quantity_unit || null,
        product_id: event.product_id || null,
        rfq_id: event.rfq_id || null,
        metadata: event.metadata || null,
      }])

    if (error) {
      console.warn('[v0] Failed to log demand event:', error.message)
      return
    }

    console.log(`[v0] Demand event logged: ${event.event_type}`)
  } catch (err) {
    console.warn('[v0] Error logging demand event:', err)
  }
}
// </CHANGE>

export async function trackProductSearch(filters: {
  searchQuery?: string
  category?: string
  subcategory?: string
  origin?: string
  customsStatus?: string[]
  certifications?: string[]
  minPrice?: string
  maxPrice?: string
}) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    let buyerCountry: string | null = null
    
    if (user) {
      const { data: company } = await supabase
        .from('companies')
        .select('country')
        .eq('user_id', user.id)
        .single()
      
      buyerCountry = company?.country || null
    }

    await logDemandEvent({
      event_type: 'search',
      buyer_id: user?.id || null,
      buyer_country: buyerCountry,
      category: filters.category || null,
      subcategory: filters.subcategory || null,
      origin_country: filters.origin || null,
      customs_status: filters.customsStatus?.[0] || null,
      metadata: {
        search_query: filters.searchQuery,
        certifications: filters.certifications,
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        all_filters: filters,
      },
    })
  } catch (error) {
    console.warn('[v0] Failed to track product search:', error)
  }
}

export async function logRFQDemandEvent(data: {
  rfqId: string
  buyerCountry: string
  category?: string
  subcategory?: string
  originCountry?: string
  customsStatus?: string
  quantity?: number
  quantityUnit?: string
  productId: string
  targetPrice?: number
  incoterm?: string
  packaging?: string
  fullRfq?: any
}) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()

    await logDemandEvent({
      event_type: 'rfq',
      buyer_id: user?.id || null,
      buyer_country: data.buyerCountry,
      category: data.category || null,
      subcategory: data.subcategory || null,
      origin_country: data.originCountry || null,
      customs_status: data.customsStatus || null,
      quantity: data.quantity || null,
      quantity_unit: data.quantityUnit || null,
      rfq_id: data.rfqId,
      metadata: {
        product_id: data.productId,
        target_price: data.targetPrice,
        incoterm: data.incoterm,
        packaging: data.packaging,
        full_rfq: data.fullRfq,
      },
    })
  } catch (error) {
    console.warn('[v0] Failed to log RFQ demand event:', error)
  }
}
