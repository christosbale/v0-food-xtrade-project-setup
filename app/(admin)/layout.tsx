import { Building2, Users, FileCheck, LayoutDashboard, Package, CreditCard } from 'lucide-react'
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { checkAdmin } from '@/lib/auth/check-admin'

const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Pending companies", href: "/admin/companies/pending", icon: FileCheck },
  { name: "All companies", href: "/admin/companies", icon: Building2 },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Billing", href: "/admin/billing", icon: CreditCard },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await checkAdmin()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">foodXtrade</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {adminNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">foodXtrade Admin</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.email}</span>
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

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
