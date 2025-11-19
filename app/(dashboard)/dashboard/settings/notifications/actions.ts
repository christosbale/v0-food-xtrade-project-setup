'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { upsertNotificationPreferences } from '@/lib/notifications'

export async function saveNotificationPreferences(formData: FormData) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  // Extract preferences from form data
  const preferences = {
    email_welcome: formData.get('email_welcome') === 'true',
    email_supplier_onboarding: formData.get('email_supplier_onboarding') === 'true',
    email_rfq_match: formData.get('email_rfq_match') === 'true',
    email_subscription: formData.get('email_subscription') === 'true',
    email_password_reset: formData.get('email_password_reset') === 'true',
    email_product_updates: formData.get('email_product_updates') === 'true',
    email_platform_news: formData.get('email_platform_news') === 'true',
  }

  // Save preferences
  await upsertNotificationPreferences(user.id, preferences)

  return { success: true }
}
