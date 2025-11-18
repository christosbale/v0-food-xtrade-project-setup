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
    <div className="space-y-10">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Welcome back! Here's your business overview
          </p>
        </div>
        {company && company.company_type === 'supplier' && (
          <Button asChild size="lg">
            <Link href="/dashboard/products/new">
              <Package className="mr-2 h-5 w-5" />
              Add Product
            </Link>
          </Button>
        )}
        {company && company.company_type === 'buyer' && (
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard/upgrade">
              Become a Supplier
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Total Products</CardTitle>
            <Package className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalProducts}</div>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>+12% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Active RFQs</CardTitle>
            <ShoppingCart className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.activeRFQs}</div>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>+8% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Monthly Revenue</CardTitle>
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${(stats.monthlyRevenue / 1000).toFixed(0)}k</div>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>+15% from last month</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">New Buyers</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.newBuyers}</div>
            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>+20% from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl">Recent RFQs</CardTitle>
            <CardDescription className="text-base">Latest quote requests from buyers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRFQs.map((rfq) => (
              <div key={rfq.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="space-y-1">
                  <p className="font-semibold">{rfq.title}</p>
                  <p className="text-sm text-muted-foreground">{rfq.buyer}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={rfq.status === 'responded' ? 'secondary' : 'outline'}>
                    {rfq.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{rfq.date}</p>
                </div>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full mt-4" size="lg">
              <Link href="/dashboard/rfqs">
                View All RFQs
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
            <CardDescription className="text-base">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline" size="lg">
              <Link href="/dashboard/products/new">
                <Package className="mr-3 h-5 w-5" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline" size="lg">
              <Link href="/dashboard/rfqs">
                <ShoppingCart className="mr-3 h-5 w-5" />
                Browse RFQs
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline" size="lg">
              <Link href="/dashboard/messages">
                <MessageSquare className="mr-3 h-5 w-5" />
                Check Messages
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline" size="lg">
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
