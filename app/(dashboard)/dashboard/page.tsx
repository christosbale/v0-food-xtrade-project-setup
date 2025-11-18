import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, Users, ArrowUpRight, ArrowDownRight, MessageSquare, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { redirect } from 'next/navigation'

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
    // Continue rendering with null values
  }

  // If no user data at all, show basic message
  if (!user) {
    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Loading Dashboard...</CardTitle>
            <CardDescription className="text-base">
              Please wait while we load your account
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // If user but no company, show setup message
  if (!company) {
    return (
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Welcome to FoodXtrade!</CardTitle>
            <CardDescription className="text-base">
              Complete your registration to start trading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Your email: <strong>{user?.email}</strong>
            </p>
            <p className="text-base">
              Please complete your company registration to access the full platform.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/register/supplier">Register as Supplier</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/register/buyer">Register as Buyer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // TODO: Fetch actual data from API
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
    <div className="mx-auto max-w-7xl space-y-16 px-6">
      <div className="flex items-start justify-between gap-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Welcome back! Here's your business overview
          </p>
        </div>
        {company && company.company_type === 'supplier' && (
          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-base px-8 py-6 h-auto">
            <Link href="/dashboard/products/new">
              <Package className="mr-3 h-5 w-5" />
              Add Product
            </Link>
          </Button>
        )}
        {company && company.company_type === 'buyer' && (
          <Button asChild variant="outline" size="lg" className="font-bold text-base px-8 py-6 h-auto border-2">
            <Link href="/dashboard/upgrade">
              Become a Supplier
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border border-border p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 p-0">
            <CardTitle className="text-lg font-bold">Total Products</CardTitle>
            <Package className="h-7 w-7 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="text-5xl font-bold">{stats.totalProducts}</div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>+12% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-border p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 p-0">
            <CardTitle className="text-lg font-bold">Active RFQs</CardTitle>
            <ShoppingCart className="h-7 w-7 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="text-5xl font-bold">{stats.activeRFQs}</div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>+8% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-border p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 p-0">
            <CardTitle className="text-lg font-bold">Monthly Revenue</CardTitle>
            <TrendingUp className="h-7 w-7 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="text-5xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(0)}k</div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>+15% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-border p-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 p-0">
            <CardTitle className="text-lg font-bold">New Buyers</CardTitle>
            <Users className="h-7 w-7 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="text-5xl font-bold">{stats.newBuyers}</div>
            <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>+20% from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-white border border-border p-10">
          <CardHeader className="space-y-3 pb-8 p-0">
            <CardTitle className="text-3xl font-bold">Recent RFQs</CardTitle>
            <CardDescription className="text-base leading-relaxed">Latest quote requests from buyers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-0">
            {recentRFQs.map((rfq) => (
              <div key={rfq.id} className="flex items-center justify-between p-6 rounded-sm border hover:bg-muted/30 transition-colors">
                <div className="space-y-2">
                  <p className="font-bold text-base">{rfq.title}</p>
                  <p className="text-sm text-muted-foreground">{rfq.buyer}</p>
                </div>
                <div className="text-right space-y-2">
                  <Badge variant={rfq.status === 'responded' ? 'default' : 'outline'} className="font-semibold">
                    {rfq.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{rfq.date}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full mt-6 font-bold border-2" size="lg">
              <Link href="/dashboard/rfqs">
                View All RFQs
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border p-10">
          <CardHeader className="space-y-3 pb-8 p-0">
            <CardTitle className="text-3xl font-bold">Quick Actions</CardTitle>
            <CardDescription className="text-base leading-relaxed">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <Button asChild className="w-full justify-start bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold" size="lg">
              <Link href="/dashboard/products/new">
                <Package className="mr-3 h-5 w-5" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="w-full justify-start border-2 font-bold" variant="outline" size="lg">
              <Link href="/dashboard/rfqs">
                <ShoppingCart className="mr-3 h-5 w-5" />
                Browse RFQs
              </Link>
            </Button>
            <Button asChild className="w-full justify-start border-2 font-bold" variant="outline" size="lg">
              <Link href="/dashboard/messages">
                <MessageSquare className="mr-3 h-5 w-5" />
                Check Messages
              </Link>
            </Button>
            <Button asChild className="w-full justify-start border-2 font-bold" variant="outline" size="lg">
              <Link href="/dashboard/analytics">
                <BarChart3 className="mr-3 h-5 w-5" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
