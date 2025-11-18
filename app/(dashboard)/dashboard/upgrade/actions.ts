'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upgradeToSupplier(
  companyId: string,
  supplierInfo: {
    businessDescription: string
    productCategories: string
    exportExperience: string
    certifications: string
  }
) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify user owns this company
  const { data: company } = await supabase
    .from('companies')
    .select('user_id, can_sell')
    .eq('id', companyId)
    .single()

  if (!company || company.user_id !== user.id) {
    throw new Error('Unauthorized')
  }

  if (company.can_sell) {
    throw new Error('Company is already a supplier')
  }

  // Update company to enable selling capabilities
  // Set verification to pending for admin review
  const { error: updateError } = await supabase
    .from('companies')
    .update({
      can_sell: true,
      company_type: 'supplier',
      verification_status: 'pending',
      verification_notes: `Supplier upgrade request: ${supplierInfo.businessDescription}. Categories: ${supplierInfo.productCategories}. Export experience: ${supplierInfo.exportExperience}. Certifications: ${supplierInfo.certifications || 'None'}`,
    })
    .eq('id', companyId)

  if (updateError) throw updateError

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/upgrade')
  
  return { success: true }
}
