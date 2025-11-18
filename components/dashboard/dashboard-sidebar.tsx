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

      <aside
        className={cn(
          'fixed left-0 top-[64px] z-30 h-[calc(100vh-64px)] w-80 border-r bg-white transition-transform duration-300 lg:sticky lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex h-full flex-col gap-3 p-12">
          {isAdmin && (
            <>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 rounded-sm bg-secondary px-6 py-5 text-base font-bold text-secondary-foreground transition-all hover:bg-secondary/90 hover:shadow-lg"
              >
                <ShieldCheck className="h-6 w-6" />
                Admin Panel
              </Link>
              <div className="h-px bg-border my-6" />
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
                  'flex items-center gap-4 rounded-sm px-6 py-5 text-base font-semibold transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-6 w-6" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
