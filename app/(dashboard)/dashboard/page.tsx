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
  let stats = {
    totalProducts: 0,
    activeRFQs: 0,
    monthlyRevenue: 0,
    newBuyers: 0,
  }
  let recentRFQs: any[] = []
  let authError = false

  try {
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('[v0] Dashboard: Auth error:', userError.message)
      authError = true
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
        console.error('[v0] Dashboard: Company fetch error:', companyError.message)
      } else {
        company = companyData
      }

      if (company) {
        // Get total products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', company.id)

        stats.totalProducts = productsCount || 0

        // Get active RFQs count
        const { count: rfqsCount } = await supabase
          .from('rfqs')
          .select('*', { count: 'exact', head: true })
          .eq('supplier_company_id', company.id)
          .in('status', ['new', 'in_discussion'])

        stats.activeRFQs = rfqsCount || 0

        // Get recent RFQs with product information
        const { data: rfqsData } = await supabase
          .from('rfqs')
          .select(`
            id,
            buyer_company_name,
            desired_quantity,
            unit,
            status,
            created_at,
            products!inner (
              product_name
            )
          `)
          .eq('supplier_company_id', company.id)
          .order('created_at', { ascending: false })
          .limit(3)

        if (rfqsData) {
          recentRFQs = rfqsData.map(rfq => ({
            id: rfq.id,
            title: `${(rfq.products as any)?.product_name} - ${rfq.desired_quantity}${rfq.unit}`,
            buyer: rfq.buyer_company_name,
            date: getRelativeTime(rfq.created_at),
            status: rfq.status,
          }))
        }

        // Note: Monthly revenue and new buyers stats would require additional tables/logic
        // Setting to 0 for now as they're not in the current schema
        stats.monthlyRevenue = 0
        stats.newBuyers = 0
      }
    }
  } catch (error: any) {
    console.error('[v0] Dashboard: Fatal error:', error?.message || error)
    authError = true
  }

  if (authError) {
    return (
      <div className="space-y-8">
        <Card className="border-[#E2E2E2] p-8">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-2xl font-bold text-[#0D1117]">Authentication Error</CardTitle>
            <CardDescription className="text-base text-[#7A7A7A]">
              We're having trouble connecting to the authentication service
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <p className="text-base text-[#0D1117]">
              Please try refreshing the page or logging in again.
            </p>
            <div className="flex gap-4">
              <Button asChild className="bg-[#0D1117] text-white hover:bg-[#0D1117]/90 font-bold px-6 py-3 h-auto rounded-md">
                <Link href="/login">Go to Login</Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()} className="border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6] font-bold px-6 py-3 h-auto rounded-md">
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <Card className="border-[#E2E2E2] p-8">
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-2xl font-bold text-[#0D1117]">Please Log In</CardTitle>
            <CardDescription className="text-base text-[#7A7A7A]">
              You need to be logged in to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <Button asChild className="bg-[#0D1117] text-white hover:bg-[#0D1117]/90 font-bold px-6 py-3 h-auto rounded-md">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
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

  return (
    <div className="space-y-8 sm:space-y-12 md:space-y-16">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0D1117]">Dashboard</h1>
          <p className="text-sm sm:text-base text-[#7A7A7A] leading-relaxed max-w-2xl">
            Welcome back. Here's your business overview
          </p>
        </div>
        {company && company.company_type === 'supplier' && (
          <Button asChild className="w-full sm:w-auto bg-[#0D1117] text-white hover:bg-[#0D1117]/90 font-bold px-5 sm:px-6 py-3 h-11 sm:h-auto rounded-md text-[15px]">
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

      <div className="grid gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border-[#E2E2E2] p-6 sm:p-7 md:p-8 rounded-md">
          <CardHeader className="p-0 pb-4 sm:pb-5 md:pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">Total Products</CardTitle>
              <Package className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl sm:text-4xl font-bold text-[#0D1117]">{stats.totalProducts}</div>
            <p className="text-xs text-[#7A7A7A] mt-2 sm:mt-3">
              Active products
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-[#E2E2E2] p-6 sm:p-7 md:p-8 rounded-md">
          <CardHeader className="p-0 pb-4 sm:pb-5 md:pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">Active RFQs</CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl sm:text-4xl font-bold text-[#0D1117]">{stats.activeRFQs}</div>
            <p className="text-xs text-[#7A7A7A] mt-2 sm:mt-3">
              Pending responses
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-[#E2E2E2] p-6 sm:p-7 md:p-8 rounded-md">
          <CardHeader className="p-0 pb-4 sm:pb-5 md:pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl sm:text-4xl font-bold text-[#0D1117]">N/A</div>
            <p className="text-xs text-[#7A7A7A] mt-2 sm:mt-3">
              Coming soon
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-[#E2E2E2] p-6 sm:p-7 md:p-8 rounded-md">
          <CardHeader className="p-0 pb-4 sm:pb-5 md:pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">New Buyers</CardTitle>
              <Users className="h-4 w-4 text-[#7A7A7A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl sm:text-4xl font-bold text-[#0D1117]">N/A</div>
            <p className="text-xs text-[#7A7A7A] mt-2 sm:mt-3">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:gap-7 md:gap-8 lg:grid-cols-2">
        <Card className="bg-white border-[#E2E2E2] p-6 sm:p-7 md:p-8 rounded-md">
          <CardHeader className="p-0 pb-6 sm:pb-7 md:pb-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-[#0D1117]">Recent RFQs</CardTitle>
            <CardDescription className="text-sm text-[#7A7A7A] mt-2">Latest quote requests from buyers</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-3 sm:space-y-4">
            {recentRFQs.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-[#7A7A7A]/30 mx-auto mb-3" />
                <p className="text-sm text-[#7A7A7A]">No RFQs yet</p>
                <p className="text-xs text-[#7A7A7A] mt-1">When buyers request quotes, they'll appear here</p>
              </div>
            ) : (
              <>
                {recentRFQs.map((rfq) => (
                  <div key={rfq.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 rounded-md border border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-[#0D1117]">{rfq.title}</p>
                      <p className="text-xs text-[#7A7A7A]">{rfq.buyer}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 self-stretch sm:self-auto">
                      <Badge variant={rfq.status === 'closed' ? 'outline' : 'default'} className="text-xs font-bold uppercase">
                        {rfq.status === 'new' ? 'New' : rfq.status === 'in_discussion' ? 'In Discussion' : 'Closed'}
                      </Badge>
                      <p className="text-xs text-[#7A7A7A]">{rfq.date}</p>
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4 sm:mt-6 border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6] font-bold rounded-md h-11">
                  <Link href="/dashboard/rfqs">
                    View All RFQs
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E2E2] p-6 sm:p-7 md:p-8 rounded-md">
          <CardHeader className="p-0 pb-6 sm:pb-7 md:pb-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-[#0D1117]">Quick Actions</CardTitle>
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

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return diffMins <= 1 ? '1 minute ago' : `${diffMins} minutes ago`
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  } else {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  }
}
