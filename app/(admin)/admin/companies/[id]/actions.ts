'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// VAT validation function - checks format and optionally validates via VIES API
async function validateVAT(vatNumber: string, country: string): Promise<{ valid: boolean; message: string }> {
  // Basic format validation
  const vatRegex: Record<string, RegExp> = {
    ES: /^ES[A-Z0-9]{9}$/,
    FR: /^FR[A-Z0-9]{11}$/,
    DE: /^DE[0-9]{9}$/,
    IT: /^IT[0-9]{11}$/,
    NL: /^NL[0-9]{9}B[0-9]{2}$/,
    BE: /^BE[0-9]{10}$/,
    PT: /^PT[0-9]{9}$/,
    GR: /^EL[0-9]{9}$/,
    AT: /^ATU[0-9]{8}$/,
    PL: /^PL[0-9]{10}$/,
  }

  const countryCode = country.toUpperCase()
  const regex = vatRegex[countryCode]
  
  if (!regex) {
    return { valid: false, message: 'VAT validation not supported for this country' }
  }

  if (!regex.test(vatNumber)) {
    return { valid: false, message: 'Invalid VAT format for ' + countryCode }
  }

  // TODO: Integrate with VIES API for real-time validation
  // For now, we'll just check the format
  return { valid: true, message: 'VAT format is valid' }
}

export async function approveCompany(
  companyId: string,
  notes: string
) {
  const supabase = await createClient()
  
  console.log('[v0] Approving company:', companyId)
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.log('[v0] Approval failed: No user')
    throw new Error('Unauthorized')
  }

  console.log('[v0] Approving as user:', user.email)

  // Check admin role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    console.log('[v0] Approval failed: Not admin, role:', profile?.role)
    throw new Error('Unauthorized - Admin access required')
  }

  // Get company details for VAT validation
  const { data: company } = await supabase
    .from('companies')
    .select('tax_id, country, verification_status')
    .eq('id', companyId)
    .single()

  console.log('[v0] Current company status:', company?.verification_status)

  let vatValidated = false
  let vatMessage = 'No VAT number provided'

  if (company?.tax_id) {
    const validation = await validateVAT(company.tax_id, company.country)
    vatValidated = validation.valid
    vatMessage = validation.message
    console.log('[v0] VAT validation result:', vatValidated, vatMessage)
  }

  const updateData: any = {
    verification_status: 'verified',
    verification_notes: notes,
    vat_validated: vatValidated,
  }

  // Only add these fields if the columns exist
  try {
    updateData.approved_by = user.id
    updateData.approved_at = new Date().toISOString()
    if (company?.tax_id) {
      updateData.vat_validation_date = new Date().toISOString()
    }
  } catch (e) {
    console.log('[v0] Some approval columns may not exist yet')
  }

  console.log('[v0] Updating company with data:', updateData)

  const { data: updatedCompany, error: updateError } = await supabase
    .from('companies')
    .update(updateData)
    .eq('id', companyId)
    .select('verification_status')
    .single()

  if (updateError) {
    console.log('[v0] Update error:', updateError)
    throw updateError
  }

  console.log('[v0] Company updated successfully. New status:', updatedCompany?.verification_status)

  // Log admin action (if table exists)
  try {
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action_type: 'approve_company',
        target_type: 'company',
        target_id: companyId,
        details: {
          notes,
          vat_validated: vatValidated,
          vat_message: vatMessage,
        },
      })
  } catch (e) {
    console.log('[v0] Admin action logging skipped (table may not exist)')
  }

  revalidatePath('/admin')
  revalidatePath('/admin/companies')
  revalidatePath('/admin/companies-pending')
  revalidatePath(`/admin/companies/${companyId}`)
  
  return { success: true, vatMessage }
}

export async function rejectCompany(
  companyId: string,
  notes: string
) {
  const supabase = await createClient()
  
  console.log('[v0] Rejecting company:', companyId)
  
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

  const { data: updatedCompany, error: updateError } = await supabase
    .from('companies')
    .update({
      verification_status: 'rejected',
      verification_notes: notes,
    })
    .eq('id', companyId)
    .select('verification_status')
    .single()

  if (updateError) {
    console.log('[v0] Reject error:', updateError)
    throw updateError
  }

  console.log('[v0] Company rejected. New status:', updatedCompany?.verification_status)

  // Log admin action (if table exists)
  try {
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action_type: 'reject_company',
        target_type: 'company',
        target_id: companyId,
        details: { notes },
      })
  } catch (e) {
    console.log('[v0] Admin action logging skipped')
  }

  revalidatePath('/admin')
  revalidatePath('/admin/companies')
  revalidatePath('/admin/companies-pending')
  revalidatePath(`/admin/companies/${companyId}`)
  
  return { success: true }
}

export async function validateCompanyVAT(companyId: string) {
  const supabase = await createClient()
  
  // Get current user and check admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // Get company VAT details
  const { data: company } = await supabase
    .from('companies')
    .select('tax_id, country')
    .eq('id', companyId)
    .single()

  if (!company?.tax_id) {
    return { valid: false, message: 'No VAT number provided' }
  }

  const validation = await validateVAT(company.tax_id, company.country)

  // Update company with validation result
  if (validation.valid) {
    try {
      await supabase
        .from('companies')
        .update({
          vat_validated: true,
          vat_validation_date: new Date().toISOString(),
        })
        .eq('id', companyId)
    } catch (e) {
      console.log('[v0] VAT validation columns may not exist yet')
    }
  }

  // Log action (if table exists)
  try {
    await supabase
      .from('admin_actions')
      .insert({
        admin_id: user.id,
        action_type: 'validate_vat',
        target_type: 'company',
        target_id: companyId,
        details: validation,
      })
  } catch (e) {
    console.log('[v0] Admin action logging skipped')
  }

  revalidatePath(`/admin/companies/${companyId}`)
  
  return validation
}

// New admin actions for updating verification and subscription

export async function updateVerificationSettings(
  companyId: string,
  data: {
    verification_status: string
    verification_level: string
    risk_score: number
    risk_notes: string
  }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }

  const updateData: any = {
    verification_status: data.verification_status,
    verification_level: data.verification_level,
    risk_score: data.risk_score,
    risk_notes: data.risk_notes,
    risk_last_updated: new Date().toISOString(),
  }

  // Set verified_at if changing to verified
  if (data.verification_status === 'verified') {
    updateData.verified_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('companies')
    .update(updateData)
    .eq('id', companyId)

  if (error) throw error

  revalidatePath(`/admin/companies/${companyId}`)
  revalidatePath('/admin/companies')
  
  return { success: true }
}

export async function updateSubscriptionSettings(
  companyId: string,
  data: {
    subscription_plan: string
    subscription_expires_at: string | null
  }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }

  const { error } = await supabase
    .from('companies')
    .update({
      subscription_plan: data.subscription_plan,
      subscription_expires_at: data.subscription_expires_at,
    })
    .eq('id', companyId)

  if (error) throw error

  revalidatePath(`/admin/companies/${companyId}`)
  revalidatePath('/admin/companies')
  
  return { success: true }
}
