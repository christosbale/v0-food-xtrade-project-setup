import { createClient } from '@/lib/supabase/server'

export type SubscriptionPlan = 'basic' | 'pro' | 'premium'

export interface UserContext {
  userId: string | null
  role: 'admin' | 'buyer' | 'supplier'
  companyId?: string | null
  subscriptionPlan?: SubscriptionPlan
  subscriptionActive?: boolean
  isAdmin: boolean
  isSupplierBasic: boolean
  isSupplierPro: boolean
  isSupplierPremium: boolean
}

/**
 * Get comprehensive user context including role, company, and subscription info
 * This should be called from Server Components or Server Actions
 * 
 * @returns UserContext with all user information and helper booleans
 */
export async function getCurrentUserContext(): Promise<UserContext> {
  const supabase = await createClient()

  const defaultContext: UserContext = {
    userId: null,
    role: 'buyer',
    companyId: null,
    subscriptionPlan: undefined,
    subscriptionActive: false,
    isAdmin: false,
    isSupplierBasic: false,
    isSupplierPro: false,
    isSupplierPremium: false,
  }

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return defaultContext
  }

  let { data: profile } = await supabase
    .from('user_profiles')
    .select('role, id')
    .eq('id', user.id)
    .maybeSingle()

  // If no profile exists, create one
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        role: 'buyer',
      })
      .select('role, id')
      .single()

    if (insertError || !newProfile) {
      // Failed to create profile, return default context
      return defaultContext
    }

    profile = newProfile
  }

  const role = (profile.role as 'admin' | 'buyer' | 'supplier') || 'buyer'

  let subscriptionPlan: SubscriptionPlan | undefined = undefined
  let subscriptionActive = false
  let companyId: string | null = null

  if (role === 'supplier') {
    const { data: company } = await supabase
      .from('companies')
      .select('id, subscription_plan, subscription_expires_at')
      .eq('user_id', user.id)
      .maybeSingle()

    if (company) {
      companyId = company.id
      subscriptionPlan = company.subscription_plan as SubscriptionPlan | undefined
      
      // Compute subscription active status
      if (company.subscription_expires_at) {
        subscriptionActive = new Date(company.subscription_expires_at) > new Date()
      } else {
        // If expires_at is null, subscription is considered active (lifetime/manual)
        subscriptionActive = true
      }
    }
  }

  if (role === 'admin') {
    subscriptionPlan = 'premium'
    subscriptionActive = true
  }

  const isAdmin = role === 'admin'
  const isSupplierBasic = 
    role === 'supplier' && 
    subscriptionPlan === 'basic' && 
    subscriptionActive
  const isSupplierPro = 
    role === 'supplier' && 
    subscriptionPlan === 'pro' && 
    subscriptionActive
  const isSupplierPremium = 
    role === 'supplier' && 
    subscriptionPlan === 'premium' && 
    subscriptionActive

  return {
    userId: user.id,
    role,
    companyId,
    subscriptionPlan,
    subscriptionActive,
    isAdmin,
    isSupplierBasic,
    isSupplierPro,
    isSupplierPremium,
  }
}

/**
 * Require specific subscription tier
 * Throws an error if user doesn't have the required tier
 * 
 * @param requiredTier - Minimum subscription tier required ('basic', 'pro', or 'premium')
 * @returns UserContext if user has required tier
 */
export async function requireSubscriptionTier(
  requiredTier: SubscriptionPlan
): Promise<UserContext> {
  const context = await getCurrentUserContext()

  if (!context.userId) {
    throw new Error('Authentication required')
  }

  if (context.role !== 'supplier') {
    throw new Error('Supplier account required')
  }

  if (!context.subscriptionActive) {
    throw new Error('Active subscription required')
  }

  const tierHierarchy: Record<SubscriptionPlan, number> = {
    basic: 1,
    pro: 2,
    premium: 3,
  }

  const userTierLevel = tierHierarchy[context.subscriptionPlan || 'basic']
  const requiredTierLevel = tierHierarchy[requiredTier]

  if (userTierLevel < requiredTierLevel) {
    throw new Error(`${requiredTier} subscription required`)
  }

  return context
}

/**
 * Check if user has access to insights features
 * Basic: No access
 * Pro: Limited insights (30 days)
 * Premium: Full insights (90 days)
 * Admin: Full access
 * 
 * @returns Object with access level information
 */
export async function checkInsightsAccess(): Promise<{
  hasAccess: boolean
  maxDays: number
  tier: SubscriptionPlan | 'none'
}> {
  const context = await getCurrentUserContext()

  if (context.isAdmin) {
    return { hasAccess: true, maxDays: 90, tier: 'premium' }
  }

  if (!context.subscriptionActive || !context.subscriptionPlan) {
    return { hasAccess: false, maxDays: 0, tier: 'none' }
  }

  switch (context.subscriptionPlan) {
    case 'premium':
      return { hasAccess: true, maxDays: 90, tier: 'premium' }
    case 'pro':
      return { hasAccess: true, maxDays: 30, tier: 'pro' }
    case 'basic':
    default:
      return { hasAccess: false, maxDays: 0, tier: 'basic' }
  }
}

/**
 * Check if user can access a specific insights section based on their subscription tier
 * 
 * @param sectionKey - The section identifier
 * @param ctx - User context (optional, will be fetched if not provided)
 * @returns true if user has access to the section
 */
export async function canAccessInsightsSection(
  sectionKey: string,
  ctx?: UserContext
): Promise<boolean> {
  const context = ctx || (await getCurrentUserContext())

  if (context.isAdmin) {
    return true
  }

  if (context.role !== 'supplier') {
    return false
  }

  if (!context.subscriptionActive) {
    return false
  }

  const accessMap: Record<SubscriptionPlan, string[]> = {
    basic: [
      'insights_overview',
    ],
    pro: [
      'insights_overview',
      'insights_rising_demand',
      'insights_by_country',
      'insights_origin_preferences',
      'insights_fresh_produce',
    ],
    premium: [
      'insights_overview',
      'insights_rising_demand',
      'insights_by_country',
      'insights_origin_preferences',
      'insights_fresh_produce',
      'insights_ai_summary',
    ],
  }

  const allowedSections = accessMap[context.subscriptionPlan || 'basic']
  return allowedSections.includes(sectionKey)
}
