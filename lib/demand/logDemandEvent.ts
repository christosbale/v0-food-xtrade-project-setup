import { createClient } from '@/lib/supabase/server'

export type DemandEventType = 'search' | 'rfq' | 'view'

export interface DemandEventData {
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

/**
 * Logs a demand event to the demand_events table
 * Failures are caught and logged but don't throw errors
 */
export async function logDemandEvent(event: DemandEventData): Promise<void> {
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
