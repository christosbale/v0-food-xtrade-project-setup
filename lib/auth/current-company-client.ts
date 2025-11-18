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

/**
 * Check if the current user has admin role (client-side)
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  console.log('[v0] Checking if user is admin...')
  
  const supabase = createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  console.log('[v0] Admin check - User:', user?.email, 'Error:', userError)
  
  if (userError || !user) {
    console.log('[v0] Admin check - No user found, returning false')
    return false
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.log('[v0] Admin check - Profile error:', profileError.message)
    // Fallback: Check if email is in admin list (temporary workaround)
    const adminEmails = ['balesdravos@gmail.com']
    const isAdmin = adminEmails.includes(user.email || '')
    console.log('[v0] Admin check - Using fallback, is admin:', isAdmin)
    return isAdmin
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
  console.log('[v0] Admin check - Profile role:', profile?.role, 'Is admin:', isAdmin)

  return isAdmin
}
