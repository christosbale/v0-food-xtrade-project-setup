'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UpdateCompanyData {
  company_name: string
  country: string
  city?: string
  website?: string
  business_email?: string
  business_registration_number?: string
}

export async function updateCompanyInfo(companyId: string, data: UpdateCompanyData) {
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

  // Verify user owns this company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id, user_id')
    .eq('id', companyId)
    .single()

  if (companyError || !company) {
    return { 
      success: false, 
      error: 'Company not found.' 
    }
  }

  if (company.user_id !== user.id) {
    return { 
      success: false, 
      error: 'You do not have permission to edit this company.' 
    }
  }

  // Update company
  const { error: updateError } = await supabase
    .from('companies')
    .update({
      company_name: data.company_name,
      country: data.country,
      city: data.city || null,
      website: data.website || null,
      business_email: data.business_email || null,
      business_registration_number: data.business_registration_number || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', companyId)

  if (updateError) {
    console.error('[v0] Error updating company:', updateError)
    return { 
      success: false, 
      error: 'Failed to update company information. Please try again.' 
    }
  }

  revalidatePath('/dashboard/company')
  return { 
    success: true 
  }
}
