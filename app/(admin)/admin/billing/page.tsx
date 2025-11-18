import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminBillingPage() {
  const supabase = await createClient()
  
  // Fetch all companies with their subscription info
  const { data: companies } = await supabase
    .from('companies')
    .select('id, company_name, country, subscription_tier, created_at')
    .order('created_at', { ascending: false })

  // Fetch subscription history
  const { data: subscriptionHistory } = await supabase
    .from('subscription_history')
    .select(`
      *,
      companies:company_id (
        company_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  const basicTier = companies?.filter(c => c.subscription_tier === 'basic') || []
  const proTier = companies?.filter(c => c.subscription_tier === 'pro') || []
  const premiumTier = companies?.filter(c => c.subscription_tier === 'premium') || []

  // Calculate revenue (mock calculation for demo)
  const totalRevenue = (proTier.length * 99 + premiumTier.length * 299)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing Management</h2>
        <p className="text-muted-foreground">
          Manage subscriptions and billing for all companies
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Basic Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{basicTier.length}</div>
            <p className="text-xs text-muted-foreground">Free</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pro Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proTier.length}</div>
            <p className="text-xs text-muted-foreground">$99/month each</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Premium Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{premiumTier.length}</div>
            <p className="text-xs text-muted-foreground">$299/month each</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}/month</div>
          <p className="text-sm text-muted-foreground mt-1">
            Monthly recurring revenue from paid plans
          </p>
        </CardContent>
      </Card>

      {/* Companies by Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Companies by Subscription</CardTitle>
          <CardDescription>
            Manage company subscriptions and grant promotions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({companies?.length || 0})</TabsTrigger>
              <TabsTrigger value="basic">Basic ({basicTier.length})</TabsTrigger>
              <TabsTrigger value="pro">Pro ({proTier.length})</TabsTrigger>
              <TabsTrigger value="premium">Premium ({premiumTier.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {companies && companies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Current Plan</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.company_name}</TableCell>
                        <TableCell>{company.country}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              company.subscription_tier === 'premium' ? 'default' :
                              company.subscription_tier === 'pro' ? 'secondary' :
                              'outline'
                            }
                            className="capitalize"
                          >
                            {company.subscription_tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(company.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/billing/${company.id}`}>
                              Manage
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No companies found</p>
              )}
            </TabsContent>

            <TabsContent value="basic" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {basicTier.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.company_name}</TableCell>
                      <TableCell>{company.country}</TableCell>
                      <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/billing/${company.id}`}>Manage</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pro" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proTier.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.company_name}</TableCell>
                      <TableCell>{company.country}</TableCell>
                      <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/billing/${company.id}`}>Manage</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="premium" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {premiumTier.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.company_name}</TableCell>
                      <TableCell>{company.country}</TableCell>
                      <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/billing/${company.id}`}>Manage</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Subscription History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscription Changes</CardTitle>
          <CardDescription>
            Latest subscription updates and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionHistory && subscriptionHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Promo Months</TableHead>
                  <TableHead>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionHistory.slice(0, 10).map((sub: any) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.companies?.company_name || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {sub.plan_id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sub.promotional_months > 0 ? (
                        <Badge className="bg-green-500">
                          {sub.promotional_months} months free
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(sub.started_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No subscription history
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
