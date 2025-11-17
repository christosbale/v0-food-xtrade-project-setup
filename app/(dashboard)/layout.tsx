import { SiteHeader } from '@/components/site-header'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  )
}
