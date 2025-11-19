'use server'

import { createClient } from '@/lib/supabase/server'
import { sendRFQConfirmationEmail, sendRFQMatchNotificationEmail } from '@/lib/email'

export async function trackProductSearch(searchParams: {
  category?: string
  subcategory?: string
  originCountry?: string
  customsStatus?: string
  searchQuery?: string
  userRole?: string
  userId?: string
}) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.from('demand_events').insert({
      event_type: 'product_search',
      category: searchParams.category || null,
      subcategory: searchParams.subcategory || null,
      origin_country: searchParams.originCountry || null,
      customs_status: searchParams.customsStatus || null,
      search_query: searchParams.searchQuery || null,
      user_role: searchParams.userRole || null,
      user_id: searchParams.userId || null,
      metadata: searchParams,
    })

    if (error) {
      console.error('[v0] Error tracking product search:', error)
    }
  } catch (error) {
    console.error('[v0] Error in trackProductSearch:', error)
  }
}

export async function logRFQDemandEvent(eventData: {
  rfqId: string
  buyerCountry: string
  category?: string
  subcategory?: string
  originCountry?: string
  customsStatus?: string
  quantity?: number
  quantityUnit?: string
  productId?: string
  targetPrice?: number
  incoterm?: string
  packaging?: string
  fullRfq?: any
}) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.from('demand_events').insert({
      event_type: 'rfq_created',
      rfq_id: eventData.rfqId,
      product_id: eventData.productId || null,
      category: eventData.category || null,
      subcategory: eventData.subcategory || null,
      origin_country: eventData.originCountry || null,
      customs_status: eventData.customsStatus || null,
      buyer_country: eventData.buyerCountry,
      quantity: eventData.quantity || null,
      quantity_unit: eventData.quantityUnit || null,
      target_price: eventData.targetPrice || null,
      metadata: {
        incoterm: eventData.incoterm,
        packaging: eventData.packaging,
        fullRfq: eventData.fullRfq,
      },
    })

    if (error) {
      console.error('[v0] Error logging RFQ demand event:', error)
    }
  } catch (error) {
    console.error('[v0] Error in logRFQDemandEvent:', error)
  }
}

export async function sendRFQEmails({
  rfqId,
  productName,
  quantity,
  buyerEmail,
  buyerName,
  buyerCountry,
  supplierEmail,
  customsCode,
}: {
  rfqId: string
  productName: string
  quantity: string
  buyerEmail: string
  buyerName: string
  buyerCountry: string
  supplierEmail: string
  customsCode: string
}) {
  try {
    // Send confirmation email to buyer
    const buyerResult = await sendRFQConfirmationEmail(buyerEmail, {
      product: productName,
      qty: quantity,
      buyerName: buyerName,
    })

    if (buyerResult.error) {
      console.error('[v0] Failed to send buyer confirmation email:', buyerResult.error)
    }

    // Send notification email to supplier
    const supplierResult = await sendRFQMatchNotificationEmail(supplierEmail, {
      product: productName,
      qty: quantity,
      country: buyerCountry,
      customs: customsCode,
      rfqId: rfqId,
    })

    if (supplierResult.error) {
      console.error('[v0] Failed to send supplier notification email:', supplierResult.error)
    }

    return { 
      success: !buyerResult.error && !supplierResult.error,
      error: buyerResult.error || supplierResult.error ? 'Some emails failed to send' : undefined
    }
  } catch (error) {
    console.error('[v0] Error sending RFQ emails:', error)
    return { success: false, error: 'Failed to send emails' }
  }
}
