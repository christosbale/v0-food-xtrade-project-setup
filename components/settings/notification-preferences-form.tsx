'use client'

import { useState, useTransition } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Lock } from 'lucide-react'
import { saveNotificationPreferences } from '@/app/(dashboard)/dashboard/settings/notifications/actions'

interface NotificationPreferencesFormProps {
  userId: string
  initialPreferences: {
    email_welcome: boolean
    email_supplier_onboarding: boolean
    email_rfq_match: boolean
    email_subscription: boolean
    email_password_reset: boolean
    email_product_updates: boolean
    email_platform_news: boolean
  }
  isSupplier: boolean
}

export function NotificationPreferencesForm({ 
  userId, 
  initialPreferences,
  isSupplier 
}: NotificationPreferencesFormProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  async function handleSave() {
    startTransition(async () => {
      try {
        const formData = new FormData()
        Object.entries(preferences).forEach(([key, value]) => {
          formData.append(key, String(value))
        })

        const result = await saveNotificationPreferences(formData)
        
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Your notification preferences have been updated.',
          })
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to save preferences. Please try again.',
          variant: 'destructive',
        })
      }
    })
  }

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="border-b border-border pb-3">
          <h2 className="text-title-large font-bold text-foreground">
            Account & Security
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Welcome emails */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <Label 
                htmlFor="email-welcome"
                className="text-body-medium font-semibold text-foreground cursor-pointer"
              >
                Welcome & account emails
              </Label>
              <p className="text-body-small text-muted-foreground">
                Receive welcome messages and important account information
              </p>
            </div>
            <Switch
              id="email-welcome"
              checked={preferences.email_welcome}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, email_welcome: checked }))
              }
              className="data-[state=checked]:bg-foreground"
            />
          </div>

          {/* Password reset - always enabled */}
          <div className="flex items-start justify-between gap-4 opacity-75">
            <div className="flex-1 space-y-1">
              <Label 
                htmlFor="email-password-reset"
                className="text-body-medium font-semibold text-foreground flex items-center gap-2"
              >
                Password reset emails
                <Lock className="h-3 w-3 text-muted-foreground" />
              </Label>
              <p className="text-body-small text-muted-foreground">
                Required for account security
              </p>
            </div>
            <Switch
              id="email-password-reset"
              checked={true}
              disabled
              className="data-[state=checked]:bg-foreground"
            />
          </div>
        </div>
      </div>

      {isSupplier && (
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-title-large font-bold text-foreground">
              Supplier activity
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Supplier onboarding */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor="email-supplier-onboarding"
                  className="text-body-medium font-semibold text-foreground cursor-pointer"
                >
                  Supplier onboarding and status
                </Label>
                <p className="text-body-small text-muted-foreground">
                  Updates about your supplier verification and onboarding progress
                </p>
              </div>
              <Switch
                id="email-supplier-onboarding"
                checked={preferences.email_supplier_onboarding}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, email_supplier_onboarding: checked }))
                }
                className="data-[state=checked]:bg-foreground"
              />
            </div>

            {/* RFQ matches */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor="email-rfq-match"
                  className="text-body-medium font-semibold text-foreground cursor-pointer"
                >
                  RFQ matches for my products
                </Label>
                <p className="text-body-small text-muted-foreground">
                  Receive notifications when buyers request quotes matching your products
                </p>
              </div>
              <Switch
                id="email-rfq-match"
                checked={preferences.email_rfq_match}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, email_rfq_match: checked }))
                }
                className="data-[state=checked]:bg-foreground"
              />
            </div>

            {/* Subscription & billing */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor="email-subscription"
                  className="text-body-medium font-semibold text-foreground cursor-pointer"
                >
                  Subscription & billing emails
                </Label>
                <p className="text-body-small text-muted-foreground">
                  Important updates about your subscription and payment information
                </p>
              </div>
              <Switch
                id="email-subscription"
                checked={preferences.email_subscription}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, email_subscription: checked }))
                }
                className="data-[state=checked]:bg-foreground"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="border-b border-border pb-3">
          <h2 className="text-title-large font-bold text-foreground">
            Updates & Insights
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Product updates */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <Label 
                htmlFor="email-product-updates"
                className="text-body-medium font-semibold text-foreground cursor-pointer"
              >
                Product updates & alerts
              </Label>
              <p className="text-body-small text-muted-foreground">
                Notifications about product availability, pricing changes, and market trends
              </p>
            </div>
            <Switch
              id="email-product-updates"
              checked={preferences.email_product_updates}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, email_product_updates: checked }))
              }
              className="data-[state=checked]:bg-foreground"
            />
          </div>

          {/* Platform news */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <Label 
                htmlFor="email-platform-news"
                className="text-body-medium font-semibold text-foreground cursor-pointer"
              >
                Platform news & insights
              </Label>
              <p className="text-body-small text-muted-foreground">
                Market intelligence reports, platform updates, and industry insights
              </p>
            </div>
            <Switch
              id="email-platform-news"
              checked={preferences.email_platform_news}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, email_platform_news: checked }))
              }
              className="data-[state=checked]:bg-foreground"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <Button 
          onClick={handleSave} 
          disabled={isPending}
          className="bg-foreground text-background hover:bg-foreground/90 font-bold px-8"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save preferences
        </Button>
      </div>
    </div>
  )
}
