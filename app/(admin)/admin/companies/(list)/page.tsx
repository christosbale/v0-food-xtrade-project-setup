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

export default async function CompaniesListPage() {
  const supabase = await createClient()
  
  console.log('[v0] Fetching all companies...')
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, company_name, country, created_at, company_type, verification_status')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching companies:', error)
  } else {
    console.log('[v0] Fetched companies count:', companies?.length || 0)
  }

  const verifiedCount = companies?.filter(c => c.verification_status === 'verified').length || 0
  const pendingCount = companies?.filter(c => c.verification_status === 'pending').length || 0
  const rejectedCount = companies?.filter(c => c.verification_status === 'rejected').length || 0

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
            <Badge variant="warning">{pendingCount}</Badge>
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
          <CardTitle>All Companies</CardTitle>
          <CardDescription>
            {companies?.length || 0} companies registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          {companies && companies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.company_name}</TableCell>
                    <TableCell>{company.country}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {company.company_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          company.verification_status === 'verified' ? 'default' :
                          company.verification_status === 'pending' ? 'secondary' :
                          'destructive'
                        }
                        className="capitalize"
                      >
                        {company.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(company.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
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
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No companies found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
