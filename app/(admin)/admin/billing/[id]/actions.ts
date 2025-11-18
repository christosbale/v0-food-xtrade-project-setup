'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function changeCompanyPlan(
  companyId: string,
  newPlan: 'basic' | 'pro' | 'premium'
) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check admin role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }

  // Update company plan
  const { error: updateError } = await supabase
    .from('companies')
    .update({ subscription_tier: newPlan })
    .eq('id', companyId)

  if (updateError) throw updateError

  // End current active subscription
  await supabase
    .from('subscription_history')
    .update({ 
      status: 'ended',
      ended_at: new Date().toISOString()
    })
    .eq('company_id', companyId)
    .eq('status', 'active')

  // Create new subscription record
  await supabase
    .from('subscription_history')
    .insert({
      company_id: companyId,
      plan_id: newPlan,
      status: 'active',
      started_at: new Date().toISOString(),
    })

  // Log admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: 'change_plan',
      target_type: 'company',
      target_id: companyId,
      details: { new_plan: newPlan },
    })

  revalidatePath('/admin/billing')
  revalidatePath(`/admin/billing/${companyId}`)
  
  return { success: true }
}

export async function grantFreeMonths(
  companyId: string,
  months: number,
  reason: string
) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check admin role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }

  // Update current active subscription with promotional months
  const { error: updateError } = await supabase
    .from('subscription_history')
    .update({ 
      promotional_months: months,
      granted_by: user.id,
      promotion_reason: reason,
    })
    .eq('company_id', companyId)
    .eq('status', 'active')

  if (updateError) throw updateError

  // Log admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: 'grant_free_months',
      target_type: 'company',
      target_id: companyId,
      details: { months, reason },
    })

  revalidatePath(`/admin/billing/${companyId}`)
  
  return { success: true }
}
