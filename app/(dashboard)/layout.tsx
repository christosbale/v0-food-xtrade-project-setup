import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-[1400px] px-8 py-16">
          {children}
        </div>
      </main>
    </div>
  )
}
