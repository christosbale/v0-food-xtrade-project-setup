'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logPriceHistory } from '@/lib/utils/price-history'
import { getCurrentCompany } from '@/lib/auth/current-company'

export async function createProduct(productData: any) {
  try {
    console.log('[v0] Creating product with data:', productData)
    
    const supabase = await createClient()
    
    const session = await getCurrentCompany()
    
    if (!session?.company) {
      return {
        success: false,
        error: 'You must have a company profile to create products.'
      }
    }
    
    if (session.company.company_type !== 'supplier') {
      return {
        success: false,
        error: 'Only suppliers can create products.'
      }
    }
    
    if (session.company.verification_status !== 'verified') {
      return {
        success: false,
        error: 'Your company must be verified before you can create products. Please complete the verification process or contact support.'
      }
    }
    
    // Ensure the product is being created for the current user's company
    productData.company_id = session.company.id
    
    // Insert product
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (insertError) {
      console.error('[v0] Error inserting product:', insertError)
      throw insertError
    }

    console.log('[v0] Product created successfully:', product.id)

    await logPriceHistory({
      product_id: product.id,
      supplier_id: product.company_id,
      category: product.category,
      subcategory: product.product_type,
      origin_country: product.origin_country,
      customs_status: product.customs_status,
      price: product.price_per_unit,
      currency: product.currency || 'EUR',
    })

    revalidatePath('/dashboard/products')
    return { success: true, data: product }
  } catch (error) {
    console.error('[v0] Error in createProduct:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create product' 
    }
  }
}

export async function updateProduct(productId: string, productData: any, oldPrice?: number) {
  try {
    console.log('[v0] Updating product:', productId, 'with data:', productData)
    
    const supabase = await createClient()
    
    // Update product
    const { data: product, error: updateError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', productId)
      .select()
      .single()

    if (updateError) {
      console.error('[v0] Error updating product:', updateError)
      throw updateError
    }

    console.log('[v0] Product updated successfully:', product.id)

    if (oldPrice !== undefined && product.price_per_unit !== oldPrice) {
      console.log('[v0] Price changed from', oldPrice, 'to', product.price_per_unit, '- logging to price_history')
      
      await logPriceHistory({
        product_id: product.id,
        supplier_id: product.company_id,
        category: product.category,
        subcategory: product.product_type,
        origin_country: product.origin_country,
        customs_status: product.customs_status,
        price: product.price_per_unit,
        currency: product.currency || 'EUR',
      })
    }

    revalidatePath('/dashboard/products')
    revalidatePath(`/products/${productId}`)
    return { success: true, data: product }
  } catch (error) {
    console.error('[v0] Error in updateProduct:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update product' 
    }
  }
}
