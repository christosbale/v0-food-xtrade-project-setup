import { createClient } from '@/lib/supabase/server'
import type { Company, UserSession } from '@/lib/types/database'

/**
 * Get the current authenticated user and their associated company
 * This should be called from Server Components or Server Actions
 */
export async function getCurrentCompany(): Promise<UserSession | null> {
  try {
    const supabase = await createClient()
    
    const { data: { user, session }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('[v0] getCurrentCompany: Auth error:', userError.message)
      return null
    }
    
    if (!user) {
      console.log('[v0] getCurrentCompany: No authenticated user found')
      return null
    }

    console.log('[v0] getCurrentCompany: User authenticated:', user.id)

    // Fetch the user's company profile
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (companyError) {
      console.error('[v0] getCurrentCompany: Error fetching company:', companyError.message)
      return null
    }

    console.log('[v0] getCurrentCompany: Company found:', company?.id || 'none')

    return {
      user: {
        id: user.id,
        email: user.email || '',
      },
      company: company as Company | null,
    }
  } catch (error: any) {
    console.error('[v0] getCurrentCompany: Unexpected error:', error?.message || error)
    return null
  }
}

/**
 * Get just the company ID for the current user
 * Useful for quick lookups where full company data isn't needed
 */
export async function getCurrentCompanyId(): Promise<string | null> {
  const session = await getCurrentCompany()
  return session?.company?.id || null
}

/**
 * Require authentication and company profile
 * Throws an error if user is not authenticated or has no company
 */
export async function requireCompany(): Promise<{ user: { id: string; email: string }; company: Company }> {
  const session = await getCurrentCompany()
  
  if (!session) {
    throw new Error('Authentication required')
  }
  
  if (!session.company) {
    throw new Error('Company profile required')
  }
  
  return session as { user: { id: string; email: string }; company: Company }
}
