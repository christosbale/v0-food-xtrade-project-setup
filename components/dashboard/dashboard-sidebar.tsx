'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, BarChart3, Settings, Menu, X, CreditCard, Building2, ShieldCheck } from 'lucide-react'
import { isCurrentUserAdmin } from '@/lib/auth/current-company-client'

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
  const [isOpen, setIsOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    isCurrentUserAdmin().then(setIsAdmin)
  }, [])

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-20 z-40 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-[64px] z-30 h-[calc(100vh-64px)] w-72 border-r bg-sidebar transition-transform duration-300 lg:sticky lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex h-full flex-col gap-2 p-6">
          {isAdmin && (
            <>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-semibold transition-all border-2',
                  pathname?.startsWith('/admin')
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'border-secondary text-secondary hover:bg-secondary/10 hover:shadow-sm'
                )}
              >
                <ShieldCheck className="h-5 w-5" />
                Admin Panel
              </Link>
              <div className="h-px bg-border my-3" />
            </>
          )}
          
          {sidebarNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
