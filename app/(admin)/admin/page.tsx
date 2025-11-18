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
    <div className="mx-auto max-w-7xl space-y-16 px-6">
      <div className="space-y-4">
        <h2 className="text-5xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
          Overview of company verifications and platform activity
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="bg-white border border-border p-10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 p-0">
            <CardTitle className="text-lg font-bold">
              Pending Verifications
            </CardTitle>
            <Clock className="h-7 w-7 text-orange-500" />
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="text-5xl font-bold">{pendingCount}</div>
            <p className="text-sm text-muted-foreground mt-4">
              Companies awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border p-10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 p-0">
            <CardTitle className="text-lg font-bold">
              Verified Companies
            </CardTitle>
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="text-5xl font-bold">{verifiedCount}</div>
            <p className="text-sm text-muted-foreground mt-4">
              Active verified suppliers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border p-10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 p-0">
            <CardTitle className="text-lg font-bold">
              Rejected Companies
            </CardTitle>
            <XCircle className="h-7 w-7 text-red-600" />
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div className="text-5xl font-bold">{rejectedCount}</div>
            <p className="text-sm text-muted-foreground mt-4">
              Requiring more information
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-border p-12">
        <CardHeader className="space-y-3 pb-10 p-0">
          <CardTitle className="text-3xl font-bold">Latest Pending Companies</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Most recent supplier registrations awaiting verification
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {latestPendingCompanies && latestPendingCompanies.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2">
                    <TableHead className="text-base font-bold h-14">Company Name</TableHead>
                    <TableHead className="text-base font-bold">Country</TableHead>
                    <TableHead className="text-base font-bold">Submitted</TableHead>
                    <TableHead className="text-right text-base font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestPendingCompanies.map((company) => (
                    <TableRow key={company.id} className="h-20 hover:bg-muted/20">
                      <TableCell className="font-bold text-base">{company.company_name}</TableCell>
                      <TableCell className="text-base">{company.country}</TableCell>
                      <TableCell className="text-base">
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
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold"
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
              
              <div className="mt-10 text-center">
                <Button variant="outline" size="lg" className="font-bold border-2 px-8" asChild>
                  <Link href="/admin/companies/pending">
                    View All Pending Companies
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-16 text-lg">
              No pending companies at the moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
