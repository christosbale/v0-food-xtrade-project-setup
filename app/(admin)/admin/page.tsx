import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Building2, Users, Package, FileText, Activity, ShieldCheck, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  
  // User profiles stats
  const { data: userProfiles } = await supabase
    .from('user_profiles')
    .select('role')
  
  const totalAdmins = userProfiles?.filter(u => u.role === 'admin').length || 0
  const totalBuyers = userProfiles?.filter(u => u.role === 'buyer').length || 0
  const totalSuppliers = userProfiles?.filter(u => u.role === 'supplier').length || 0
  
  // Companies stats
  const { data: companies } = await supabase
    .from('companies')
    .select('id, company_name, country, verification_status, subscription_plan, created_at, company_type')
  
  const totalCompanies = companies?.length || 0
  const verifiedSuppliers = companies?.filter(c => c.verification_status === 'verified').length || 0
  const pendingVerification = companies?.filter(c => c.verification_status === 'pending').length || 0
  
  const basicPlan = companies?.filter(c => c.subscription_plan === 'basic').length || 0
  const proPlan = companies?.filter(c => c.subscription_plan === 'pro').length || 0
  const premiumPlan = companies?.filter(c => c.subscription_plan === 'premium').length || 0
  
  // Products stats
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
  
  // RFQs stats
  const { data: rfqs } = await supabase
    .from('rfqs')
    .select('id, status, created_at, buyer_company_name, target_category')
  
  const totalRFQs = rfqs?.length || 0
  const openRFQs = rfqs?.filter(r => r.status === 'open' || r.status === 'pending').length || 0
  
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const rfqsLast7Days = rfqs?.filter(r => new Date(r.created_at) > sevenDaysAgo).length || 0
  
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const rfqsLast30Days = rfqs?.filter(r => new Date(r.created_at) > thirtyDaysAgo).length || 0
  
  // Demand events stats (last 30 days)
  const { count: demandEventsLast30Days } = await supabase
    .from('demand_events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  // Get latest RFQs for table
  const latestRFQs = rfqs?.slice(0, 10) || []
  
  // Get new companies for table
  const newCompanies = companies
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10) || []
  
  // Get high-demand subcategories from demand events
  const { data: demandEvents } = await supabase
    .from('demand_events')
    .select('subcategory, event_type')
    .gte('created_at', thirtyDaysAgo.toISOString())
  
  const subcategoryDemand = demandEvents?.reduce((acc, event) => {
    if (event.subcategory) {
      acc[event.subcategory] = (acc[event.subcategory] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  const topSubcategories = Object.entries(subcategoryDemand || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  return (
    <div className="container-boxed py-16 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-[2.5rem] font-bold tracking-tight text-[#0D1117] leading-[1.2]">Platform Overview</h2>
        <p className="text-lg text-[#7A7A7A] leading-relaxed max-w-2xl">
          Key performance indicators and recent activity across the foodXtrade marketplace.
        </p>
      </div>

      {/* KPI Cards - white, minimal, subtle shadows */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border border-[#E2E2E2] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-[#0D1117] uppercase tracking-wide">Total Suppliers</CardTitle>
            <Building2 className="h-5 w-5 text-[#7A7A7A]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-[#0D1117] tracking-tight">{totalSuppliers}</div>
            <p className="text-xs text-[#7A7A7A] leading-relaxed">
              {verifiedSuppliers} verified • {pendingVerification} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E2E2E2] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-[#0D1117] uppercase tracking-wide">Verified Suppliers</CardTitle>
            <ShieldCheck className="h-5 w-5 text-[#7A7A7A]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-[#0D1117] tracking-tight">{verifiedSuppliers}</div>
            <p className="text-xs text-[#7A7A7A] leading-relaxed">
              Active and approved suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E2E2E2] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-[#0D1117] uppercase tracking-wide">Buyers</CardTitle>
            <Users className="h-5 w-5 text-[#7A7A7A]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-[#0D1117] tracking-tight">{totalBuyers}</div>
            <p className="text-xs text-[#7A7A7A] leading-relaxed">
              Registered buyer accounts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E2E2E2] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-[#0D1117] uppercase tracking-wide">Open RFQs</CardTitle>
            <FileText className="h-5 w-5 text-[#7A7A7A]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-[#0D1117] tracking-tight">{openRFQs}</div>
            <p className="text-xs text-[#7A7A7A] leading-relaxed">
              {rfqsLast7Days} in last 7 days • {rfqsLast30Days} in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E2E2E2] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-[#0D1117] uppercase tracking-wide">Products Listed</CardTitle>
            <Package className="h-5 w-5 text-[#7A7A7A]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-[#0D1117] tracking-tight">{totalProducts || 0}</div>
            <p className="text-xs text-[#7A7A7A] leading-relaxed">
              Available product listings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-[#E2E2E2] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-bold text-[#0D1117] uppercase tracking-wide">Demand Events (30d)</CardTitle>
            <Activity className="h-5 w-5 text-[#7A7A7A]" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-4xl font-bold text-[#0D1117] tracking-tight">{demandEventsLast30Days || 0}</div>
            <p className="text-xs text-[#7A7A7A] leading-relaxed">
              Searches, views, RFQs tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card className="bg-white border border-[#E2E2E2] shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold text-[#0D1117] tracking-tight">Subscription Plans</CardTitle>
          <CardDescription className="text-[#7A7A7A]">Distribution of supplier subscription tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wide">Basic Plan</p>
              <p className="text-3xl font-bold text-[#0D1117] tracking-tight">{basicPlan}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wide">Pro Plan</p>
              <p className="text-3xl font-bold text-[#0D1117] tracking-tight">{proPlan}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-[#7A7A7A] uppercase tracking-wide">Premium Plan</p>
              <p className="text-3xl font-bold text-[#0D1117] tracking-tight">{premiumPlan}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tables - minimal, thin grey borders, large row spacing */}
      <Card className="bg-white border border-[#E2E2E2] shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold text-[#0D1117] tracking-tight">Recent RFQs</CardTitle>
          <CardDescription className="text-[#7A7A7A]">Latest 10 request for quotations</CardDescription>
        </CardHeader>
        <CardContent>
          {latestRFQs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E2E2E2]">
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Buyer Company</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Category</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Status</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestRFQs.map((rfq) => (
                  <TableRow key={rfq.id} className="border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors">
                    <TableCell className="font-medium text-[#0D1117] py-4">{rfq.buyer_company_name || 'N/A'}</TableCell>
                    <TableCell className="text-[#7A7A7A] py-4">{rfq.target_category || 'N/A'}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant={rfq.status === 'open' ? 'default' : 'secondary'}>
                        {rfq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#7A7A7A] py-4">
                      {new Date(rfq.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-[#7A7A7A] py-12">No RFQs yet</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white border border-[#E2E2E2] shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold text-[#0D1117] tracking-tight">New Companies</CardTitle>
          <CardDescription className="text-[#7A7A7A]">Latest 10 company registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {newCompanies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E2E2E2]">
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Company Name</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Country</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Type</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Status</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Registered</TableHead>
                  <TableHead className="text-right font-bold text-[#0D1117] uppercase text-xs tracking-wide">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newCompanies.map((company) => (
                  <TableRow key={company.id} className="border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors">
                    <TableCell className="font-medium text-[#0D1117] py-4">{company.company_name}</TableCell>
                    <TableCell className="text-[#7A7A7A] py-4">{company.country}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="capitalize">
                        {company.company_type || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant={company.verification_status === 'verified' ? 'verified' : 'secondary'}>
                        {company.verification_status === 'verified' && '✓ '}
                        {company.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#7A7A7A] py-4">
                      {new Date(company.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Button size="sm" variant="outline" asChild className="border-[#0D1117] text-[#0D1117] hover:bg-[#0D1117] hover:text-white">
                        <Link href={`/admin/companies/${company.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-[#7A7A7A] py-12">No companies yet</p>
          )}
        </CardContent>
      </Card>

      {topSubcategories.length > 0 && (
        <Card className="bg-white border border-[#E2E2E2] shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-bold text-[#0D1117] tracking-tight">High-Demand Subcategories</CardTitle>
            <CardDescription className="text-[#7A7A7A]">Top 10 most searched/requested product types (last 30 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#E2E2E2]">
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Subcategory</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide text-right">Demand Events</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSubcategories.map(([subcategory, count]) => (
                  <TableRow key={subcategory} className="border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors">
                    <TableCell className="font-medium text-[#0D1117] py-4">{subcategory}</TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end gap-2">
                        <TrendingUp className="h-4 w-4 text-[#7A7A7A]" />
                        <span className="font-bold text-[#0D1117]">{count}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
