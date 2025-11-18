'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markProductAsReviewed(
  productId: string,
  notes: string
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

  // Update product
  const { error: updateError } = await supabase
    .from('products')
    .update({
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: notes,
    })
    .eq('id', productId)

  if (updateError) throw updateError

  // Log admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: 'review_product',
      target_type: 'product',
      target_id: productId,
      details: { notes },
    })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${productId}`)
  
  return { success: true }
}

export async function updateProductStatus(
  productId: string,
  status: 'draft' | 'published',
  notes: string
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

  // Update product status
  const { error: updateError } = await supabase
    .from('products')
    .update({
      status,
      admin_notes: notes,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', productId)

  if (updateError) throw updateError

  // Log admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: status === 'published' ? 'publish_product' : 'unpublish_product',
      target_type: 'product',
      target_id: productId,
      details: { status, notes },
    })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${productId}`)
  revalidatePath('/products')
  
  return { success: true }
}
