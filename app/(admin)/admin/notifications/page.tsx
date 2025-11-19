import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getGlobalNotificationSettings } from '@/lib/notifications'
import { GlobalNotificationForm } from '@/components/admin/global-notification-form'

export default async function AdminNotificationsPage() {
  const settings = await getGlobalNotificationSettings()

  return (
    <div className="container-boxed py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-[2.5rem] font-bold tracking-tight text-[#0D1117] leading-[1.2]">
          Email Notifications
        </h2>
        <p className="text-lg text-[#7A7A7A] leading-relaxed max-w-2xl">
          Control which transactional emails are active across the platform. These settings act as a global kill-switch on top of per-user preferences.
        </p>
      </div>

      {/* Notification Settings Card */}
      <Card className="bg-white border border-[#E2E2E2] shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold text-[#0D1117] tracking-tight">
            Global Email Settings
          </CardTitle>
          <CardDescription className="text-[#7A7A7A]">
            When a toggle is OFF, no users will receive that type of email regardless of their personal preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalNotificationForm initialSettings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}
