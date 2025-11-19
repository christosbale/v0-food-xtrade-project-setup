'use client'

import { useState, useEffect, useTransition } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getNotificationPreferences, upsertNotificationPreferences } from '@/lib/notifications'
import Link from 'next/link'

export function NotificationSettings() {
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [userId, setUserId] = useState<string | null>(null)
  const [preferences, setPreferences] = useState({
    email_welcome: true,
    email_supplier_onboarding: true,
    email_rfq_match: true,
    email_subscription: true,
    email_password_reset: true,
    email_product_updates: true,
    email_platform_news: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    async function loadPreferences() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUserId(user.id)
          const prefs = await getNotificationPreferences(user.id)
          setPreferences(prefs)
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [])

  async function handleSave() {
    if (!userId) return

    startTransition(async () => {
      try {
        await upsertNotificationPreferences(userId, preferences)
        
        toast({
          title: 'Settings saved',
          description: 'Your notification preferences have been updated.',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to save settings. Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-rfq">RFQ Match Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email when buyers request quotes matching your products
            </p>
          </div>
          <Switch
            id="email-rfq"
            checked={preferences.email_rfq_match}
            onCheckedChange={(checked) =>
              setPreferences((s) => ({ ...s, email_rfq_match: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-product">Product Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about your product listings and market trends
            </p>
          </div>
          <Switch
            id="email-product"
            checked={preferences.email_product_updates}
            onCheckedChange={(checked) =>
              setPreferences((s) => ({ ...s, email_product_updates: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-platform">Platform News</Label>
            <p className="text-sm text-muted-foreground">
              Receive platform updates and market intelligence reports
            </p>
          </div>
          <Switch
            id="email-platform"
            checked={preferences.email_platform_news}
            onCheckedChange={(checked) =>
              setPreferences((s) => ({ ...s, email_platform_news: checked }))
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Link 
          href="/dashboard/settings/notifications"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          View all notification settings
          <ExternalLink className="h-3 w-3" />
        </Link>
        
        <Button onClick={handleSave} disabled={isPending || !userId}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
