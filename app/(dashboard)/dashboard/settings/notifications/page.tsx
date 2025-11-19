import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getNotificationPreferences } from '@/lib/notifications'
import { NotificationPreferencesForm } from '@/components/settings/notification-preferences-form'

export default async function NotificationSettingsPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }

  // Get user's company to check if they're a supplier
  const { data: company } = await supabase
    .from('companies')
    .select('company_type')
    .eq('user_id', user.id)
    .maybeSingle()

  const isSupplier = company?.company_type === 'supplier'

  // Fetch current notification preferences
  const preferences = await getNotificationPreferences(user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-headline-medium font-bold text-foreground tracking-tight">
          Notification settings
        </h1>
        <p className="text-body-medium text-muted-foreground mt-2">
          Choose which emails you want to receive from foodXtrade.
        </p>
      </div>

      <NotificationPreferencesForm 
        userId={user.id}
        initialPreferences={preferences}
        isSupplier={isSupplier}
      />
    </div>
  )
}
