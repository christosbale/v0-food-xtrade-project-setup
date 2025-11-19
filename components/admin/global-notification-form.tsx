'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { saveGlobalNotificationSettings } from '@/app/(admin)/admin/notifications/actions'
import { GlobalNotificationSettings } from '@/lib/notifications'
import { Loader2 } from 'lucide-react'

interface GlobalNotificationFormProps {
  initialSettings: GlobalNotificationSettings
}

const notificationTypes = [
  {
    key: 'email_welcome_enabled' as const,
    label: 'Welcome emails',
    description: 'Sent when new users register as buyers or suppliers',
  },
  {
    key: 'email_supplier_onboarding_enabled' as const,
    label: 'Supplier onboarding emails',
    description: 'Sent when suppliers complete the onboarding process',
  },
  {
    key: 'email_rfq_match_enabled' as const,
    label: 'RFQ match emails',
    description: 'Sent to suppliers when new RFQs match their products',
  },
  {
    key: 'email_subscription_enabled' as const,
    label: 'Subscription emails',
    description: 'Sent when subscription plans are activated or changed',
  },
  {
    key: 'email_password_reset_enabled' as const,
    label: 'Password reset emails',
    description: 'Critical security emails for password recovery',
  },
  {
    key: 'email_product_updates_enabled' as const,
    label: 'Product updates emails',
    description: 'Notifications about product changes and marketplace updates',
  },
  {
    key: 'email_platform_news_enabled' as const,
    label: 'Platform news & marketing emails',
    description: 'Newsletter and platform announcements',
  },
]

export function GlobalNotificationForm({ initialSettings }: GlobalNotificationFormProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleToggle = (key: keyof Omit<GlobalNotificationSettings, 'id'>) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    const result = await saveGlobalNotificationSettings({
      email_welcome_enabled: settings.email_welcome_enabled,
      email_supplier_onboarding_enabled: settings.email_supplier_onboarding_enabled,
      email_rfq_match_enabled: settings.email_rfq_match_enabled,
      email_subscription_enabled: settings.email_subscription_enabled,
      email_password_reset_enabled: settings.email_password_reset_enabled,
      email_product_updates_enabled: settings.email_product_updates_enabled,
      email_platform_news_enabled: settings.email_platform_news_enabled,
    })

    setIsSaving(false)

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Settings saved',
        description: 'Global notification settings have been updated successfully.',
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Notification toggles */}
      <div className="space-y-6">
        {notificationTypes.map((type) => (
          <div
            key={type.key}
            className="flex items-start justify-between gap-6 pb-6 border-b border-[#E2E2E2] last:border-0"
          >
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={type.key}
                className="text-[#0D1117] font-bold text-base cursor-pointer"
              >
                {type.label}
              </Label>
              <p className="text-sm text-[#7A7A7A] leading-relaxed">
                {type.description}
              </p>
            </div>
            <Switch
              id={type.key}
              checked={settings[type.key]}
              onCheckedChange={() => handleToggle(type.key)}
              className="mt-1"
            />
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="flex justify-end pt-4 border-t border-[#E2E2E2]">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#0D1117] text-white font-bold hover:bg-[#0D1117]/90 px-8"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save global settings
        </Button>
      </div>
    </div>
  )
}
