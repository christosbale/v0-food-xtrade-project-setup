'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentCompany } from '@/lib/auth/current-company'
import { revalidatePath } from 'next/cache'

export async function changePlan(planId: string) {
  try {
    const session = await getCurrentCompany()
    
    if (!session?.company) {
      return { success: false, error: 'Not authenticated' }
    }

    const supabase = await createClient()

    // Get the plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      return { success: false, error: 'Plan not found' }
    }

    // End current subscription
    const { error: endError } = await supabase
      .from('subscription_history')
      .update({ 
        ended_at: new Date().toISOString(),
        status: 'cancelled'
      })
      .eq('company_id', session.company.id)
      .eq('status', 'active')

    if (endError) {
      console.error('[v0] Error ending subscription:', endError)
    }

    // Create new subscription history
    const { error: historyError } = await supabase
      .from('subscription_history')
      .insert({
        company_id: session.company.id,
        plan_id: planId,
        status: 'active',
        started_at: new Date().toISOString()
      })

    if (historyError) {
      console.error('[v0] Error creating subscription history:', historyError)
      return { success: false, error: 'Failed to create subscription' }
    }

    // Update company subscription tier
    const { error: updateError } = await supabase
      .from('companies')
      .update({ 
        subscription_tier: planId,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.company.id)

    if (updateError) {
      console.error('[v0] Error updating company:', updateError)
      return { success: false, error: 'Failed to update subscription' }
    }

    revalidatePath('/dashboard/billing')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error in changePlan:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function addPaymentMethod(data: {
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  cvv: string
}) {
  try {
    const session = await getCurrentCompany()
    
    if (!session?.company) {
      return { success: false, error: 'Not authenticated' }
    }

    const supabase = await createClient()

    // Extract card brand and last 4 digits
    const lastFour = data.cardNumber.slice(-4)
    let cardBrand = 'Unknown'
    
    if (data.cardNumber.startsWith('4')) cardBrand = 'Visa'
    else if (data.cardNumber.startsWith('5')) cardBrand = 'Mastercard'
    else if (data.cardNumber.startsWith('3')) cardBrand = 'Amex'

    // Set all existing cards to non-default
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('company_id', session.company.id)

    // Insert new payment method
    const { error } = await supabase
      .from('payment_methods')
      .insert({
        company_id: session.company.id,
        card_last_four: lastFour,
        card_brand: cardBrand,
        expiry_month: data.expiryMonth,
        expiry_year: data.expiryYear,
        is_default: true
      })

    if (error) {
      console.error('[v0] Error adding payment method:', error)
      return { success: false, error: 'Failed to add payment method' }
    }

    revalidatePath('/dashboard/billing')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error in addPaymentMethod:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
