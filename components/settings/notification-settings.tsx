'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function NotificationSettings() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    emailNewRfq: true,
    emailNewMessage: true,
    emailProductUpdates: false,
    emailMarketingNews: false,
  })
  const { toast } = useToast()

  async function handleSave() {
    setLoading(true)

    try {
      // TODO: Implement notification settings API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-rfq">New RFQ Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email when you get a new quote request
            </p>
          </div>
          <Switch
            id="email-rfq"
            checked={settings.emailNewRfq}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, emailNewRfq: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-message">New Message Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email for new messages from buyers
            </p>
          </div>
          <Switch
            id="email-message"
            checked={settings.emailNewMessage}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, emailNewMessage: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-product">Product Updates</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about your product listings
            </p>
          </div>
          <Switch
            id="email-product"
            checked={settings.emailProductUpdates}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, emailProductUpdates: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-marketing">Marketing & News</Label>
            <p className="text-sm text-muted-foreground">
              Receive platform updates and marketing emails
            </p>
          </div>
          <Switch
            id="email-marketing"
            checked={settings.emailMarketingNews}
            onCheckedChange={(checked) =>
              setSettings((s) => ({ ...s, emailMarketingNews: checked }))
            }
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </div>
  )
}
