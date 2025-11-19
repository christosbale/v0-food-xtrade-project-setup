import { Building2, Users, FileCheck, LayoutDashboard, Package, CreditCard, TrendingUp, FileText } from 'lucide-react'
import Link from "next/link"
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUserContext } from '@/lib/auth/getCurrentUserContext'
import { createClient } from '@/lib/supabase/server'

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Pending", href: "/admin/companies/pending", icon: FileCheck },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "RFQs", href: "/admin/rfqs", icon: FileText },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Billing", href: "/admin/billing", icon: CreditCard },
  { name: "Market Insights", href: "/insights", icon: TrendingUp },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await getCurrentUserContext()

  if (!ctx.isAdmin) {
    redirect('/')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - BlueBlack background, white text */}
      <aside className="w-64 bg-[#0D1117] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-white" />
            <span className="font-bold text-lg text-white tracking-tight">foodXtrade</span>
          </Link>
          <p className="text-xs text-white/60 mt-1 font-medium uppercase tracking-wide">Admin Console</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {adminNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/dashboard" className="text-xs text-white/60 hover:text-white/80 transition-colors font-medium">
            ← Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content - white with massive whitespace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top bar */}
        <header className="border-b border-[#E2E2E2] bg-white px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0D1117] tracking-tight">Operations Console</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#0D1117] text-white text-xs font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-[#0D1117]">{user?.email}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/api/auth/signout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content - massive whitespace */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="px-8 py-6 sm:px-12 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
