import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SettingsIcon, User, Bell, Lock, Shield, Mail } from 'lucide-react'
import { getCurrentCompany } from '@/lib/auth/current-company'
import { redirect } from 'next/navigation'
import { PasswordChangeForm } from '@/components/settings/password-change-form'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { ProfileSettingsForm } from '@/components/settings/profile-settings-form'
import { AccountTypeSwitcher } from '@/components/settings/account-type-switcher'

export default async function SettingsPage() {
  const session = await getCurrentCompany()
  
  if (!session) {
    redirect('/login')
  }

  const { user, company } = session

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your account details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
              <p className="mt-1 text-base font-medium flex items-center gap-2">
                {user.email}
                <Badge variant="secondary" className="text-xs">Verified</Badge>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company</p>
              <p className="mt-1 text-base font-medium">
                {company?.company_name || 'No company profile'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Type</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {company?.company_type || 'User'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subscription</p>
              <Badge className="mt-1 bg-[#9FE870] text-black hover:bg-[#8FD860] capitalize">
                {company?.subscription_tier || 'Free'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Type Switcher */}
      {company && !company.can_sell && (
        <AccountTypeSwitcher 
          currentType={company.company_type} 
          canSell={company.can_sell || false}
          currentTier={company.subscription_tier || 'free'}
        />
      )}

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileSettingsForm user={user} />
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your password and security preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationSettings />
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Data
          </CardTitle>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your data is encrypted and secure. We never share your personal information with third parties without your consent.
            </AlertDescription>
          </Alert>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Data Download</p>
            <p className="text-muted-foreground">
              Request a copy of all your data stored in our platform.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Support
          </CardTitle>
          <CardDescription>Get help with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Need assistance? Our support team is here to help.
          </p>
          <a
            href="mailto:support@foodxtrade.com"
            className="text-sm font-medium text-primary hover:underline"
          >
            Contact Support
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
