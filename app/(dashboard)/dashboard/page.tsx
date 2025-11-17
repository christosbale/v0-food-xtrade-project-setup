import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SupplierDashboardPage() {
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
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your business overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="inline-flex items-center text-secondary">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +4
              </span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRFQs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="inline-flex items-center text-secondary">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2
              </span>
              {' '}from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="inline-flex items-center text-secondary">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Buyers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newBuyers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="inline-flex items-center text-red-500">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2
              </span>
              {' '}from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent RFQs and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent RFQs</CardTitle>
            <CardDescription>
              Latest buyer requests waiting for your response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRFQs.map((rfq) => (
                <div key={rfq.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{rfq.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {rfq.buyer} • {rfq.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      rfq.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {rfq.status}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/rfqs/${rfq.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/dashboard/rfqs">View All RFQs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your business efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/dashboard/products/new">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/products">
                <Package className="mr-2 h-4 w-4" />
                View All Products
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/rfqs">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Browse RFQs
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/profile">
                <Users className="mr-2 h-4 w-4" />
                Update Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
