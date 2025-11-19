'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendSupplierOnboardingCompleteEmail } from '@/lib/email'

export interface OnboardSupplierData {
  plan: 'basic' | 'pro' | 'premium'
  companyName: string
  country: string
  city: string
  website?: string
}

export async function onboardSupplier(data: OnboardSupplierData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { 
      success: false, 
      error: 'Not authenticated. Please log in to continue.' 
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, role, email')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError || !profile) {
    return { 
      success: false, 
      error: 'User profile not found. Please contact support.' 
    }
  }

  const now = new Date().toISOString()

  try {
    // Check if user already has a company
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id, onboarding_started_at')
      .eq('user_id', user.id)
      .maybeSingle()

    let companyId: string

    // If company exists, update it
    if (existingCompany) {
      const { error: updateError } = await supabase
        .from('companies')
        .update({
          company_name: data.companyName,
          country: data.country,
          city: data.city,
          website: data.website || null,
          subscription_plan: data.plan,
          onboarding_started_at: existingCompany.onboarding_started_at || now,
          onboarding_completed: true,
          onboarding_completed_at: now,
        })
        .eq('id', existingCompany.id)

      if (updateError) {
        console.error('[v0] Error updating company:', updateError)
        return { 
          success: false, 
          error: 'Failed to update company information.' 
        }
      }

      companyId = existingCompany.id
    } else {
      // If company doesn't exist, create new company
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          company_name: data.companyName,
          country: data.country,
          city: data.city,
          website: data.website || null,
          subscription_plan: data.plan,
          company_type: 'supplier',
          verification_status: 'pending',
          onboarding_started_at: now,
          onboarding_completed: true,
          onboarding_completed_at: now,
        })
        .select('id')
        .single()

      if (insertError || !newCompany) {
        console.error('[v0] Error creating company:', insertError)
        return { 
          success: false, 
          error: 'Failed to create company. Please try again.' 
        }
      }

      companyId = newCompany.id

      // Update user_profiles with role
      const { error: profileUpdateError } = await supabase
        .from('user_profiles')
        .update({
          role: profile.role === 'admin' ? 'admin' : 'supplier',
        })
        .eq('id', user.id)

      if (profileUpdateError) {
        console.error('[v0] Error updating user profile:', profileUpdateError)
      }
    }

    try {
      const userEmail = profile.email || user.email
      if (userEmail) {
        await sendSupplierOnboardingCompleteEmail(
          userEmail,
          data.companyName,
          data.plan
        )
        console.log('[v0] Onboarding complete email sent to:', userEmail)
      }
    } catch (emailError) {
      console.error('[v0] Error sending onboarding complete email:', emailError)
      // Don't fail the onboarding if email fails
    }

    revalidatePath('/dashboard')
    return { 
      success: true, 
      companyId 
    }
  } catch (error) {
    console.error('[v0] Unexpected error during onboarding:', error)
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    }
  }
}

export interface OnboardingFormData {
  companyName: string
  tradeName?: string
  country: string
  city: string
  website?: string
  productCategories: string[]
  exportMarkets?: string
  comments?: string
}

export async function submitSupplierOnboarding(
  plan: 'basic' | 'pro' | 'premium',
  formData: OnboardingFormData
): Promise<{ success: boolean; error?: string; companyId?: string }> {
  // Call the main function with simplified data
  return onboardSupplier({
    plan,
    companyName: formData.companyName,
    country: formData.country,
    city: formData.city,
    website: formData.website,
  })
}
