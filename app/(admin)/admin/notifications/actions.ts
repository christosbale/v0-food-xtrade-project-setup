'use server'

import { revalidatePath } from 'next/cache'
import { updateGlobalNotificationSettings, GlobalNotificationSettings } from '@/lib/notifications'

export async function saveGlobalNotificationSettings(
  settings: Partial<Omit<GlobalNotificationSettings, 'id'>>
) {
  try {
    const result = await updateGlobalNotificationSettings(settings)
    
    if (!result) {
      return { error: 'Failed to update notification settings' }
    }

    revalidatePath('/admin/notifications')
    return { success: true, data: result }
  } catch (error) {
    console.error('[v0] Error saving global notification settings:', error)
    return { error: 'An unexpected error occurred' }
  }
}
