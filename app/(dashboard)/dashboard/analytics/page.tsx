'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Package, ShoppingCart, Eye, MessageSquare, DollarSign, Users, Lock, AlertCircle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getCurrentCompanyClient } from '@/lib/auth/current-company-client'
import { createClient } from '@/lib/supabase/client'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type AnalyticsData = {
  overview: {
    totalProducts: number
    totalRFQs: number
    totalMessages: number
    productViews: number
    rfqResponseRate: number
    avgResponseTime: number
  }
  productsOverTime: Array<{ month: string; count: number }>
  rfqsOverTime: Array<{ month: string; count: number }>
  productsByCategory: Array<{ category: string; count: number }>
  rfqsByStatus: Array<{ status: string; count: number }>
  topProducts: Array<{ name: string; views: number; rfqs: number }>
  messageActivity: Array<{ day: string; count: number }>
}

const COLORS = ['#0D1117', '#1a1f2b', '#3DA9FC', '#7A7A7A', '#E2E2E2']

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [company, setCompany] = useState<any>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true)
        const session = await getCurrentCompanyClient()
        
        if (!session || !session.company) {
          setError('no_company')
          setIsLoading(false)
          return
        }

        setCompany(session.company)
        const supabase = createClient()

        const [productsRes, rfqsRes, messagesRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('company_id', session.company.id),
          supabase
            .from('rfqs')
            .select('*')
            .eq('supplier_company_id', session.company.id),
          supabase
            .from('messages')
            .select('*')
            .eq('sender_id', session.user.id)
        ])

        const products = productsRes.data || []
        const rfqs = rfqsRes.data || []
        const messages = messagesRes.data || []

        const productsByMonth = processTimeSeriesData(products, 'created_at')
        const rfqsByMonth = processTimeSeriesData(rfqs, 'created_at')
        const messagesByDay = processMessageActivity(messages)
        
        const productsByCategory = processProductsByCategory(products)
        const rfqsByStatus = processRFQsByStatus(rfqs)
        
        const analyticsData: AnalyticsData = {
          overview: {
            totalProducts: products.length,
            totalRFQs: rfqs.length,
            totalMessages: messages.length,
            productViews: products.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
            rfqResponseRate: calculateResponseRate(rfqs),
            avgResponseTime: calculateAvgResponseTime(rfqs)
          },
          productsOverTime: productsByMonth,
          rfqsOverTime: rfqsByMonth,
          productsByCategory,
          rfqsByStatus,
          topProducts: calculateTopProducts(products, rfqs),
          messageActivity: messagesByDay
        }

        setAnalytics(analyticsData)
        setIsLoading(false)
      } catch (err) {
        console.error('[v0] Error loading analytics:', err)
        setError(err instanceof Error ? err.message : 'Could not load analytics')
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [timeRange])

  function processTimeSeriesData(items: any[], dateField: string): Array<{ month: string; count: number }> {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const last6Months: Array<{ month: string; count: number }> = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      last6Months.push({
        month: months[date.getMonth()],
        count: 0
      })
    }

    items.forEach(item => {
      const itemDate = new Date(item[dateField])
      const monthsDiff = (now.getFullYear() - itemDate.getFullYear()) * 12 + (now.getMonth() - itemDate.getMonth())
      if (monthsDiff >= 0 && monthsDiff < 6) {
        const index = 5 - monthsDiff
        if (last6Months[index]) {
          last6Months[index].count++
        }
      }
    })

    return last6Months
  }

  function processProductsByCategory(products: any[]) {
    const categoryMap = new Map()
    products.forEach(p => {
      const cat = p.category || 'Other'
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
    })
    return Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }))
  }

  function processRFQsByStatus(rfqs: any[]) {
    const statusMap = new Map()
    rfqs.forEach(r => {
      const status = r.status || 'pending'
      statusMap.set(status, (statusMap.get(status) || 0) + 1)
    })
    return Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }))
  }

  function processMessageActivity(messages: any[]): Array<{ day: string; count: number }> {
    const last7Days: Array<{ day: string; count: number }> = []
    const now = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      last7Days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: 0
      })
    }

    messages.forEach(msg => {
      const msgDate = new Date(msg.created_at)
      const daysDiff = Math.floor((now.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysDiff >= 0 && daysDiff < 7) {
        const index = 6 - daysDiff
        if (last7Days[index]) {
          last7Days[index].count++
        }
      }
    })

    return last7Days
  }

  function calculateResponseRate(rfqs: any[]) {
    if (rfqs.length === 0) return 0
    const responded = rfqs.filter(r => r.status !== 'pending').length
    return Math.round((responded / rfqs.length) * 100)
  }

  function calculateAvgResponseTime(rfqs: any[]) {
    const responded = rfqs.filter(r => r.updated_at && r.created_at && r.status !== 'pending')
    if (responded.length === 0) return 0
    
    const totalHours = responded.reduce((sum, r) => {
      const created = new Date(r.created_at).getTime()
      const updated = new Date(r.updated_at).getTime()
      return sum + (updated - created) / (1000 * 60 * 60)
    }, 0)
    
    return Math.round(totalHours / responded.length)
  }

  function calculateTopProducts(products: any[], rfqs: any[]) {
    const productMap = new Map()
    
    products.forEach(p => {
      productMap.set(p.id, {
        name: p.product_name,
        views: p.views || 0,
        rfqs: 0
      })
    })

    rfqs.forEach(r => {
      if (productMap.has(r.product_id)) {
        const product = productMap.get(r.product_id)
        product.rfqs++
      }
    })

    return Array.from(productMap.values())
      .sort((a, b) => (b.views + b.rfqs * 10) - (a.views + a.rfqs * 10))
      .slice(0, 5)
  }

  const isFreeTier = !company?.subscription_tier || company?.subscription_tier === 'free'
  const isPremiumTier = company?.subscription_tier === 'premium' || company?.subscription_tier === 'enterprise'

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading analytics...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error === 'no_company') {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Company Profile Not Found</AlertTitle>
          <AlertDescription>
            Your company profile hasn't been set up yet. Please contact support or complete your registration.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Analytics</AlertTitle>
          <AlertDescription>{error || 'Could not load analytics data'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your business performance and insights
          </p>
        </div>
        <Badge variant={isFreeTier ? 'secondary' : 'default'} className="text-sm">
          {company?.subscription_tier?.toUpperCase() || 'FREE'} PLAN
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Listed in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalRFQs}</div>
            <p className="text-xs text-muted-foreground">
              Inquiries received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Total sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.rfqResponseRate}%</div>
            <p className="text-xs text-muted-foreground">
              RFQs responded to
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          {isPremiumTier && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Products Added Over Time</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: 'Products',
                      color: '#0D1117',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.productsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="count" stroke="#0D1117" fill="#0D1117" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RFQ Activity</CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: 'RFQs',
                      color: '#1a1f2b',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.rfqsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="count" stroke="#1a1f2b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Products by Category</CardTitle>
                <CardDescription>Distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                {isFreeTier ? (
                  <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="text-center space-y-3">
                      <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upgrade to view detailed charts</p>
                      <Button asChild size="sm" className="bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
                        <Link href="/dashboard/billing">Upgrade Plan</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      count: {
                        label: 'Products',
                        color: '#0D1117',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.productsByCategory}
                          dataKey="count"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {analytics.productsByCategory.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>By views and RFQs</CardDescription>
              </CardHeader>
              <CardContent>
                {isFreeTier ? (
                  <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <div className="text-center space-y-3">
                      <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upgrade to view product performance</p>
                      <Button asChild size="sm" className="bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
                        <Link href="/dashboard/billing">Upgrade Plan</Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.views} views • {product.rfqs} RFQs
                          </p>
                        </div>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rfqs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>RFQ Status Distribution</CardTitle>
                <CardDescription>Current status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: 'RFQs',
                      color: '#0D1117',
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.rfqsByStatus}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#0D1117" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key RFQ indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Rate</span>
                    <span className="text-2xl font-bold">{analytics.overview.rfqResponseRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-[#0D1117] h-2 rounded-full" 
                      style={{ width: `${analytics.overview.rfqResponseRate}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Response Time</span>
                    <span className="text-2xl font-bold">{analytics.overview.avgResponseTime}h</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.overview.avgResponseTime < 24 ? 'Great response time!' : 'Consider responding faster'}
                  </p>
                </div>

                {isFreeTier && (
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertTitle>Unlock More Insights</AlertTitle>
                    <AlertDescription>
                      Upgrade to see conversion rates, revenue projections, and custom reports.
                    </AlertDescription>
                    <Button asChild size="sm" className="mt-3 bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
                      <Link href="/dashboard/billing">Upgrade Now</Link>
                    </Button>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isPremiumTier && (
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Message Activity</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: 'Messages',
                        color: '#1a1f2b',
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.messageActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#1a1f2b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Metrics</CardTitle>
                  <CardDescription>Premium analytics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Product Engagement Score</span>
                    <Badge className="bg-[#0D1117] text-white">8.5/10</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Market Visibility</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="text-sm font-medium">12.5%</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Projected Revenue (30d)</span>
                    <span className="text-sm font-medium">$24,500</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {isFreeTier && (
        <Card className="border-[#0D1117]">
          <CardHeader>
            <CardTitle>Unlock Full Analytics</CardTitle>
            <CardDescription>
              Upgrade to Premium or Enterprise to access advanced analytics, custom reports, and real-time insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Premium features include:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Detailed product performance metrics</li>
                <li>• Revenue projections and forecasting</li>
                <li>• Custom report generation</li>
                <li>• Export data to CSV/Excel</li>
              </ul>
            </div>
            <Button asChild className="bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
              <Link href="/dashboard/billing">View Plans</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
