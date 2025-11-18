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
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  
  // Get company verification statistics
  const { data: companies } = await supabase
    .from('companies')
    .select('id, company_name, country, verification_status, created_at')
  
  const pendingCount = companies?.filter(c => c.verification_status === 'pending').length || 0
  const verifiedCount = companies?.filter(c => c.verification_status === 'verified').length || 0
  const rejectedCount = companies?.filter(c => c.verification_status === 'rejected').length || 0
  
  // Get latest pending companies
  const { data: latestPendingCompanies } = await supabase
    .from('companies')
    .select('id, company_name, country, created_at')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-lg text-muted-foreground">
          Overview of company verifications and platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">
              Pending Verifications
            </CardTitle>
            <Clock className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{pendingCount}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Companies awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">
              Verified Companies
            </CardTitle>
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{verifiedCount}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Active verified suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">
              Rejected Companies
            </CardTitle>
            <XCircle className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{rejectedCount}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Requiring more information
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Pending Companies */}
      <Card className="border-2">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-2xl">Latest Pending Companies</CardTitle>
          <CardDescription className="text-base">
            Most recent supplier registrations awaiting verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {latestPendingCompanies && latestPendingCompanies.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base">Company Name</TableHead>
                    <TableHead className="text-base">Country</TableHead>
                    <TableHead className="text-base">Submitted</TableHead>
                    <TableHead className="text-right text-base">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestPendingCompanies.map((company) => (
                    <TableRow key={company.id} className="h-16">
                      <TableCell className="font-semibold">{company.company_name}</TableCell>
                      <TableCell>{company.country}</TableCell>
                      <TableCell>
                        {new Date(company.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="default"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/admin/companies/${company.id}`}>
                            Review
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6 text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/admin/companies/pending">
                    View All Pending Companies
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12 text-base">
              No pending companies at the moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
