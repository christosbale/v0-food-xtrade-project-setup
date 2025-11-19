'use server'

import { createClient } from '@/lib/supabase/server'

export type NotificationType =
  | 'welcome'
  | 'supplier_onboarding'
  | 'rfq_match'
  | 'subscription'
  | 'password_reset'
  | 'product_updates'
  | 'platform_news'

export interface NotificationPreferences {
  id: string
  user_id: string
  email_welcome: boolean
  email_supplier_onboarding: boolean
  email_rfq_match: boolean
  email_subscription: boolean
  email_password_reset: boolean
  email_product_updates: boolean
  email_platform_news: boolean
  created_at: string
  updated_at: string
}

export interface GlobalNotificationSettings {
  id: number
  email_welcome_enabled: boolean
  email_supplier_onboarding_enabled: boolean
  email_rfq_match_enabled: boolean
  email_subscription_enabled: boolean
  email_password_reset_enabled: boolean
  email_product_updates_enabled: boolean
  email_platform_news_enabled: boolean
}

const DEFAULT_PREFERENCES: Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  email_welcome: true,
  email_supplier_onboarding: true,
  email_rfq_match: true,
  email_subscription: true,
  email_password_reset: true,
  email_product_updates: true,
  email_platform_news: false,
}

const DEFAULT_GLOBAL_SETTINGS: Omit<GlobalNotificationSettings, 'id'> = {
  email_welcome_enabled: true,
  email_supplier_onboarding_enabled: true,
  email_rfq_match_enabled: true,
  email_subscription_enabled: true,
  email_password_reset_enabled: true,
  email_product_updates_enabled: true,
  email_platform_news_enabled: false,
}

/**
 * Get global notification settings (single row with id=1)
 * Creates default settings if they don't exist
 */
export async function getGlobalNotificationSettings(): Promise<GlobalNotificationSettings> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      // If no settings found, create them
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: insertError } = await supabase
          .from('notification_settings')
          .insert({
            id: 1,
            ...DEFAULT_GLOBAL_SETTINGS,
          })
          .select()
          .single()

        if (insertError) {
          console.error('[v0] Error creating global notification settings:', insertError)
          return { id: 1, ...DEFAULT_GLOBAL_SETTINGS }
        }

        return newSettings
      }
      
      console.error('[v0] Error fetching global notification settings:', error)
      return { id: 1, ...DEFAULT_GLOBAL_SETTINGS }
    }

    return data
  } catch (error) {
    console.error('[v0] Error in getGlobalNotificationSettings:', error)
    return { id: 1, ...DEFAULT_GLOBAL_SETTINGS }
  }
}

/**
 * Update global notification settings
 */
export async function updateGlobalNotificationSettings(
  settings: Partial<Omit<GlobalNotificationSettings, 'id'>>
): Promise<GlobalNotificationSettings | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notification_settings')
      .update(settings)
      .eq('id', 1)
      .select()
      .single()

    if (error) {
      console.error('[v0] Error updating global notification settings:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Error in updateGlobalNotificationSettings:', error)
    return null
  }
}

/**
 * Get notification preferences for a user
 * Returns default preferences if no row exists
 */
export async function getNotificationPreferences(userId: string): Promise<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no preferences found, return defaults
      if (error.code === 'PGRST116') {
        return DEFAULT_PREFERENCES
      }
      console.error('[v0] Error fetching notification preferences:', error)
      return DEFAULT_PREFERENCES
    }

    return {
      email_welcome: data.email_welcome,
      email_supplier_onboarding: data.email_supplier_onboarding,
      email_rfq_match: data.email_rfq_match,
      email_subscription: data.email_subscription,
      email_password_reset: data.email_password_reset,
      email_product_updates: data.email_product_updates,
      email_platform_news: data.email_platform_news,
    }
  } catch (error) {
    console.error('[v0] Error in getNotificationPreferences:', error)
    return DEFAULT_PREFERENCES
  }
}

/**
 * Upsert notification preferences for a user
 */
export async function upsertNotificationPreferences(
  userId: string,
  prefs: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<NotificationPreferences | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...prefs,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Error upserting notification preferences:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('[v0] Error in upsertNotificationPreferences:', error)
    return null
  }
}

/**
 * Check if an email should be sent to a user for a specific notification type
 * Main function to call before sending any email
 * Now checks global settings first, then user preferences
 */
export async function shouldSendEmail(userId: string, type: NotificationType): Promise<boolean> {
  try {
    const globalSettings = await getGlobalNotificationSettings()
    
    const typeToGlobalColumnMap: Record<NotificationType, keyof Omit<GlobalNotificationSettings, 'id'>> = {
      'welcome': 'email_welcome_enabled',
      'supplier_onboarding': 'email_supplier_onboarding_enabled',
      'rfq_match': 'email_rfq_match_enabled',
      'subscription': 'email_subscription_enabled',
      'password_reset': 'email_password_reset_enabled',
      'product_updates': 'email_product_updates_enabled',
      'platform_news': 'email_platform_news_enabled',
    }

    const globalColumnName = typeToGlobalColumnMap[type]
    
    // If globally disabled, return false immediately
    if (!globalSettings[globalColumnName]) {
      return false
    }

    const preferences = await getNotificationPreferences(userId)
    
    const typeToColumnMap: Record<NotificationType, keyof typeof DEFAULT_PREFERENCES> = {
      'welcome': 'email_welcome',
      'supplier_onboarding': 'email_supplier_onboarding',
      'rfq_match': 'email_rfq_match',
      'subscription': 'email_subscription',
      'password_reset': 'email_password_reset',
      'product_updates': 'email_product_updates',
      'platform_news': 'email_platform_news',
    }

    const columnName = typeToColumnMap[type]
    return preferences[columnName]
  } catch (error) {
    console.error('[v0] Error in shouldSendEmail:', error)
    // Default to true for critical emails, false for optional ones
    return type === 'password_reset' || type === 'welcome' || type === 'subscription'
  }
}

/**
 * Toggle a specific notification preference
 */
export async function toggleNotificationPreference(
  userId: string,
  notificationType: NotificationType
): Promise<boolean> {
  try {
    const preferences = await getNotificationPreferences(userId)
    
    if (!preferences) {
      return false
    }

    const currentValue = preferences[`email_${notificationType}` as keyof typeof DEFAULT_PREFERENCES]
    const updated = await upsertNotificationPreferences(userId, {
      [`email_${notificationType}` as keyof typeof DEFAULT_PREFERENCES]: !currentValue,
    })

    return updated !== null
  } catch (error) {
    console.error('[v0] Error in toggleNotificationPreference:', error)
    return false
  }
}

/**
 * Disable all notifications for a user
 */
export async function disableAllNotifications(userId: string): Promise<boolean> {
  try {
    const allDisabled = Object.keys(DEFAULT_PREFERENCES).reduce((acc, key) => ({
      ...acc,
      [key]: false,
    }), {})

    const updated = await upsertNotificationPreferences(userId, allDisabled)
    return updated !== null
  } catch (error) {
    console.error('[v0] Error in disableAllNotifications:', error)
    return false
  }
}

/**
 * Enable all notifications for a user
 */
export async function enableAllNotifications(userId: string): Promise<boolean> {
  try {
    const updated = await upsertNotificationPreferences(userId, DEFAULT_PREFERENCES)
    return updated !== null
  } catch (error) {
    console.error('[v0] Error in enableAllNotifications:', error)
    return false
  }
}
