import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, Users, MessageSquare, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  let company = null
  let user = null

  try {
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('[v0] Dashboard: User fetch error:', userError)
    } else {
      user = userData
    }
    
    if (user) {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (companyError) {
        console.error('[v0] Dashboard: Company fetch error:', companyError)
      } else {
        company = companyData
      }
    }
  } catch (error) {
    console.error('[v0] Dashboard: Fatal error:', error)
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <Card className="border-[#E2E2E2] p-8">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-2xl font-bold text-[#0D1117]">Loading Dashboard...</CardTitle>
            <CardDescription className="text-base text-[#7A7A7A]">
              Please wait while we load your account
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="space-y-8">
        <Card className="border-[#E2E2E2] p-8">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-2xl font-bold text-[#0D1117]">Welcome to foodXtrade</CardTitle>
            <CardDescription className="text-base text-[#7A7A7A]">
              Complete your registration to start trading
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <p className="text-sm text-[#7A7A7A]">
              Your email: <strong className="text-[#0D1117]">{user?.email}</strong>
            </p>
            <p className="text-base text-[#0D1117]">
              Please complete your company registration to access the full platform.
            </p>
            <div className="flex gap-4">
              <Button asChild className="bg-[#0D1117] text-white hover:bg-[#0D1117]/90 font-bold px-6 py-3 h-auto rounded-md">
                <Link href="/register/supplier">Register as Supplier</Link>
              </Button>
              <Button variant="outline" asChild className="border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6] font-bold px-6 py-3 h-auto rounded-md">
                <Link href="/register/buyer">Register as Buyer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = {
    totalProducts: 48,
    activeRFQs: 12,
    monthlyRevenue: 125000,
    newBuyers: 8,
  }

  const recentRFQs = [
    { id: 1, title: 'Organic Apples - 500kg', buyer: 'FreshMart Ltd', date: '2 hours ago', status: 'pending' },
    { id: 2, title: 'Premium Coffee Beans - 100kg', buyer: 'Cafe Express', date: '5 hours ago', status: 'pending' },
    { id: 3, title: 'Fresh Tomatoes - 1000kg', buyer: 'Grocery Chain', date: '1 day ago', status: 'responded' },
  ]

  return (
    <div className="space-y-16">
      {/* Page header */}
      <div className="flex items-start justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-[#0D1117]">Dashboard</h1>
          <p className="text-base text-[#7A7A7A] leading-relaxed max-w-2xl">
            Welcome back. Here's your business overview
          </p>
        </div>
        {company && company.company_type === 'supplier' && (
          <Button asChild className="bg-[#0D1117] text-white hover:bg-[#0D1117]/90 font-bold px-6 py-3 h-auto rounded-md">
            <Link href="/dashboard/products/new">
              <Package className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        )}
        {company && company.company_type === 'buyer' && (
          <Button asChild variant="outline" className="border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6] font-bold px-6 py-3 h-auto rounded-md">
            <Link href="/dashboard/upgrade">
              Become a Supplier
            </Link>
          </Button>
        )}
      </div>

      {/* KPI Cards - clay.global style */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-[#E2E2E2] p-8 rounded-md">
          <CardHeader className="p-0 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">Total Products</CardTitle>
              <Package className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-[#0D1117]">{stats.totalProducts}</div>
            <p className="text-xs text-[#7A7A7A] mt-3">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-[#E2E2E2] p-8 rounded-md">
          <CardHeader className="p-0 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">Active RFQs</CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-[#0D1117]">{stats.activeRFQs}</div>
            <p className="text-xs text-[#7A7A7A] mt-3">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-[#E2E2E2] p-8 rounded-md">
          <CardHeader className="p-0 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-[#0D1117]">${(stats.monthlyRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-[#7A7A7A] mt-3">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-[#E2E2E2] p-8 rounded-md">
          <CardHeader className="p-0 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">New Buyers</CardTitle>
              <Users className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-[#0D1117]">{stats.newBuyers}</div>
            <p className="text-xs text-[#7A7A7A] mt-3">
              +20% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content cards */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-white border-[#E2E2E2] p-8 rounded-md">
          <CardHeader className="p-0 pb-8">
            <CardTitle className="text-2xl font-bold text-[#0D1117]">Recent RFQs</CardTitle>
            <CardDescription className="text-sm text-[#7A7A7A] mt-2">Latest quote requests from buyers</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {recentRFQs.map((rfq) => (
              <div key={rfq.id} className="flex items-center justify-between p-4 rounded-md border border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors">
                <div className="space-y-1">
                  <p className="font-bold text-sm text-[#0D1117]">{rfq.title}</p>
                  <p className="text-xs text-[#7A7A7A]">{rfq.buyer}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={rfq.status === 'responded' ? 'default' : 'outline'} className="text-xs font-bold uppercase">
                    {rfq.status}
                  </Badge>
                  <p className="text-xs text-[#7A7A7A]">{rfq.date}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full mt-6 border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6] font-bold rounded-md">
              <Link href="/dashboard/rfqs">
                View All RFQs
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E2E2] p-8 rounded-md">
          <CardHeader className="p-0 pb-8">
            <CardTitle className="text-2xl font-bold text-[#0D1117]">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-[#7A7A7A] mt-2">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <Button asChild className="w-full justify-start bg-[#0D1117] text-white hover:bg-[#0D1117]/90 font-bold rounded-md h-auto py-3">
              <Link href="/dashboard/products/new">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="w-full justify-start border-[#E2E2E2] text-[#0D1117] hover:bg-[#F6F6F6] font-bold rounded-md h-auto py-3" variant="outline">
              <Link href="/dashboard/rfqs">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Browse RFQs
              </Link>
            </Button>
            <Button asChild className="w-full justify-start border-[#E2E2E2] text-[#0D1117] hover:bg-[#F6F6F6] font-bold rounded-md h-auto py-3" variant="outline">
              <Link href="/dashboard/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Messages
              </Link>
            </Button>
            <Button asChild className="w-full justify-start border-[#E2E2E2] text-[#0D1117] hover:bg-[#F6F6F6] font-bold rounded-md h-auto py-3" variant="outline">
              <Link href="/dashboard/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
