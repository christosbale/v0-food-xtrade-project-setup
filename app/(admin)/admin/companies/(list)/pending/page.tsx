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
import { AlertCircle, CheckCircle, CheckCircle2 } from 'lucide-react'

export default async function PendingCompaniesPage() {
  const supabase = await createClient()
  
  console.log('[v0] Fetching pending suppliers for verification...')
  
  const { data: pendingSuppliers, error } = await supabase
    .from('companies')
    .select('id, company_name, country, created_at, company_type, business_email, tax_id, vat_validated')
    .eq('verification_status', 'pending')
    .eq('company_type', 'supplier')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching pending suppliers:', error)
  } else {
    console.log('[v0] Fetched pending suppliers:', pendingSuppliers?.length || 0)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Supplier Verification</h2>
          <p className="text-muted-foreground mt-2">
            Review and verify supplier applications before they can list products
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/companies">View All Companies</Link>
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/10">
        <CardContent className="pt-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">Manual Verification Required</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                All suppliers must be manually verified by an admin before they can list products or receive RFQs on the platform. 
                This ensures the quality and trustworthiness of our marketplace.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Awaiting Verification</CardTitle>
          <CardDescription className="text-base">
            {pendingSuppliers?.length || 0} suppliers pending manual review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSuppliers && pendingSuppliers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>VAT Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.company_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{supplier.business_email}</TableCell>
                    <TableCell>{supplier.country}</TableCell>
                    <TableCell>
                      {supplier.tax_id ? (
                        supplier.vat_validated ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Validated
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )
                      ) : (
                        <span className="text-xs text-muted-foreground">No VAT</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(supplier.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        asChild
                      >
                        <Link href={`/admin/companies/${supplier.id}`}>
                          Review Application
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-muted-foreground mt-1">
                No suppliers waiting for verification at the moment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
