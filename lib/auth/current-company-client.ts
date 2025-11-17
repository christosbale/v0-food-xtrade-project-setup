'use client'

import { createClient } from '@/lib/supabase/client'
import type { Company, UserSession } from '@/lib/types/database'

/**
 * Get the current authenticated user and their associated company (client-side)
 * This should be called from Client Components
 */
export async function getCurrentCompanyClient(): Promise<UserSession | null> {
  const supabase = createClient()
  
  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null
  }

  // Fetch the user's company profile
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (companyError) {
    console.error('[foodXtrade] Error fetching company:', companyError)
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email || '',
    },
    company: company as Company | null,
  }
}
