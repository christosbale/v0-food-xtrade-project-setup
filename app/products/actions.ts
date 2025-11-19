'use server'

import { logDemandEvent } from '@/lib/demand/logDemandEvent'
import { createClient } from '@/lib/supabase/server'

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
    
    // Get current user if logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    let buyerCountry: string | null = null
    
    // If user is logged in, try to get their country from their company profile
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
