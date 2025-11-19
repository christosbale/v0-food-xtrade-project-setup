'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, BarChart3, Settings, Building2, CreditCard, ShieldCheck, LogOut } from 'lucide-react'
import { isCurrentUserAdmin } from '@/lib/auth/current-company-client'
import { ICON_CLASSES } from '@/lib/icon-system'

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Company Profile',
    href: '/dashboard/company',
    icon: Building2,
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    title: 'RFQs',
    href: '/dashboard/rfqs',
    icon: ShoppingCart,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    title: 'Billing & Plan',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    isCurrentUserAdmin().then(setIsAdmin)
  }, [])

  return (
    <aside className="sticky top-0 h-screen w-[260px] bg-[#0D1117] flex flex-col">
      {/* Logo area */}
      <div className="px-6 py-8 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Building2 className={ICON_CLASSES.navigation} strokeWidth={1.5} />
          <span className="font-bold text-base text-white tracking-tight">foodXtrade</span>
        </Link>
        <p className="text-[11px] text-white/60 mt-1 font-medium uppercase tracking-wide">Dashboard</p>
      </div>

      {/* Admin link */}
      {isAdmin && (
        <div className="px-4 pt-6 pb-3">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white bg-[#3DA9FC]/20 hover:bg-[#3DA9FC]/30 transition-colors border-l-[4px] border-[#3DA9FC]"
          >
            <ShieldCheck className={ICON_CLASSES.inline} strokeWidth={1.5} />
            Admin Panel
          </Link>
        </div>
      )}
      
      {/* Navigation items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors',
                    isActive
                      ? 'text-white bg-white/10 border-l-[4px] border-[#3DA9FC]'
                      : 'text-white/80 hover:text-white hover:bg-white/5 border-l-[4px] border-transparent'
                  )}
                >
                  <Icon className={ICON_CLASSES.inline} strokeWidth={1.5} />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout at bottom */}
      <div className="px-4 py-6 border-t border-white/10">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium text-white/60 hover:text-white/80 hover:bg-white/5 transition-colors"
        >
          <LogOut className={ICON_CLASSES.inline} strokeWidth={1.5} />
          Logout
        </Link>
      </div>
    </aside>
  )
}
