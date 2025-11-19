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
import { CheckCircle2, XCircle } from 'lucide-react'

function getRiskCategory(riskScore: number | null): 'low' | 'medium' | 'high' | 'unknown' {
  if (riskScore === null) return 'unknown'
  if (riskScore < 40) return 'high'
  if (riskScore <= 70) return 'medium'
  return 'low'
}

export default async function CompaniesListPage({
  searchParams,
}: {
  searchParams: { 
    verification_status?: string
    subscription_plan?: string
    risk?: string
  }
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('companies')
    .select('id, company_name, country, city, website, verification_status, verification_level, risk_score, subscription_plan, onboarding_completed, created_at, company_type')
  
  // Apply filters from query params
  if (searchParams.verification_status && searchParams.verification_status !== 'all') {
    query = query.eq('verification_status', searchParams.verification_status)
  }
  
  if (searchParams.subscription_plan && searchParams.subscription_plan !== 'all') {
    query = query.eq('subscription_plan', searchParams.subscription_plan)
  }
  
  const { data: companies, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching companies:', error)
  }

  let filteredCompanies = companies || []
  if (searchParams.risk && searchParams.risk !== 'all') {
    filteredCompanies = filteredCompanies.filter(c => 
      getRiskCategory(c.risk_score) === searchParams.risk
    )
  }

  const verifiedCount = filteredCompanies.filter(c => c.verification_status === 'verified').length
  const pendingCount = filteredCompanies.filter(c => c.verification_status === 'pending').length
  const rejectedCount = filteredCompanies.filter(c => c.verification_status === 'rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
        <p className="text-muted-foreground">
          Manage and review all registered companies
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <Badge variant="default">{verifiedCount}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Badge variant="secondary">{pendingCount}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <Badge variant="destructive">{rejectedCount}</Badge>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Verification:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!searchParams.verification_status || searchParams.verification_status === 'all' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?verification_status=all">All</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.verification_status === 'verified' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?verification_status=verified">Verified</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.verification_status === 'pending' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?verification_status=pending">Pending</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.verification_status === 'rejected' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?verification_status=rejected">Rejected</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Plan:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!searchParams.subscription_plan || searchParams.subscription_plan === 'all' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?subscription_plan=all">All</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.subscription_plan === 'basic' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?subscription_plan=basic">Basic</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.subscription_plan === 'pro' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?subscription_plan=pro">Pro</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.subscription_plan === 'premium' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?subscription_plan=premium">Premium</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Risk:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!searchParams.risk || searchParams.risk === 'all' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?risk=all">All</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.risk === 'low' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?risk=low">Low</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.risk === 'medium' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?risk=medium">Medium</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.risk === 'high' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/companies?risk=high">High</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
          <CardDescription>
            {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCompanies.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Verification Status</TableHead>
                      <TableHead>Verification Level</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Subscription Plan</TableHead>
                      <TableHead>Onboarding</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => {
                      const riskCategory = getRiskCategory(company.risk_score)
                      
                      return (
                        <TableRow 
                          key={company.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => window.location.href = `/admin/companies/${company.id}`}
                        >
                          <TableCell className="font-medium">
                            <Link href={`/admin/companies/${company.id}`} className="hover:underline">
                              {company.company_name}
                            </Link>
                          </TableCell>
                          <TableCell>{company.country}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                company.verification_status === 'verified' ? 'verified' :
                                company.verification_status === 'pending' ? 'secondary' :
                                'destructive'
                              }
                              className="capitalize"
                            >
                              {company.verification_status === 'verified' && '✓ '}
                              {company.verification_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {company.verification_level ? (
                              <Badge variant="outline" className="capitalize">
                                {company.verification_level}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {company.risk_score !== null ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{company.risk_score}</span>
                                <Badge 
                                  variant={
                                    riskCategory === 'low' ? 'risk-low' :
                                    riskCategory === 'medium' ? 'risk-medium' :
                                    riskCategory === 'high' ? 'risk-high' :
                                    'outline'
                                  }
                                  className="text-xs capitalize"
                                >
                                  {riskCategory}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {company.subscription_plan ? (
                              <Badge 
                                variant="outline"
                                className="capitalize"
                              >
                                {company.subscription_plan}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {company.onboarding_completed ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-sm">Completed</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <XCircle className="h-4 w-4" />
                                <span className="text-sm">Not completed</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link href={`/admin/companies/${company.id}`}>
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {filteredCompanies.map((company) => {
                  const riskCategory = getRiskCategory(company.risk_score)
                  
                  return (
                    <Card key={company.id} className="border border-[#E2E2E2]">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/admin/companies/${company.id}`}
                              className="font-semibold text-[#0D1117] hover:underline block truncate"
                            >
                              {company.company_name}
                            </Link>
                            <p className="text-sm text-[#7A7A7A] mt-0.5">{company.country}</p>
                          </div>
                          <Badge 
                            variant={
                              company.verification_status === 'verified' ? 'verified' :
                              company.verification_status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                            className="capitalize flex-shrink-0"
                          >
                            {company.verification_status === 'verified' && '✓ '}
                            {company.verification_status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Verification Level</p>
                            {company.verification_level ? (
                              <Badge variant="outline" className="capitalize text-xs">
                                {company.verification_level}
                              </Badge>
                            ) : (
                              <span className="text-[#7A7A7A]">—</span>
                            )}
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Risk Score</p>
                            {company.risk_score !== null ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#0D1117]">{company.risk_score}</span>
                                <Badge 
                                  variant={
                                    riskCategory === 'low' ? 'risk-low' :
                                    riskCategory === 'medium' ? 'risk-medium' :
                                    riskCategory === 'high' ? 'risk-high' :
                                    'outline'
                                  }
                                  className="text-xs capitalize"
                                >
                                  {riskCategory}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-[#7A7A7A]">—</span>
                            )}
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Plan</p>
                            {company.subscription_plan ? (
                              <Badge variant="outline" className="capitalize text-xs">
                                {company.subscription_plan}
                              </Badge>
                            ) : (
                              <span className="text-[#7A7A7A]">—</span>
                            )}
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Onboarding</p>
                            {company.onboarding_completed ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                <span className="text-xs">Done</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[#7A7A7A]">
                                <XCircle className="h-3 w-3" />
                                <span className="text-xs">Pending</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          asChild
                        >
                          <Link href={`/admin/companies/${company.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No companies found matching the selected filters
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
