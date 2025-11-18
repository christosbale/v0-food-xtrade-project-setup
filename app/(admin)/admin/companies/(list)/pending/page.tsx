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
    .select('id, company_name, country, created_at, company_type, business_email, tax_id, vat_validated, verification_status')
    .eq('verification_status', 'pending')
    .eq('company_type', 'supplier')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching pending suppliers:', error)
  } else {
    console.log('[v0] Fetched pending suppliers count:', pendingSuppliers?.length || 0)
    console.log('[v0] Pending suppliers:', pendingSuppliers)
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">Supplier Verification</h1>
          <p className="text-lg text-gray-600">
            Review and verify supplier applications before they can list products
          </p>
        </div>
        <Button variant="outline" size="lg" asChild className="h-12 px-6">
          <Link href="/admin/companies">View All Companies</Link>
        </Button>
      </div>

      <Card className="border-2 border-yellow-400 bg-yellow-50">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-start gap-6">
            <AlertCircle className="h-8 w-8 text-black flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-black">Manual Verification Required</h3>
              <p className="text-base text-gray-700 leading-relaxed">
                All suppliers must be manually verified by an admin before they can list products or receive RFQs on the platform. 
                This ensures the quality and trustworthiness of our marketplace.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader className="space-y-3 pb-8">
          <CardTitle className="text-3xl font-bold">Awaiting Verification</CardTitle>
          <CardDescription className="text-lg">
            {pendingSuppliers?.length || 0} suppliers pending manual review
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {pendingSuppliers && pendingSuppliers.length > 0 ? (
            <div className="border-2 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-bold text-black py-5">Company Name</TableHead>
                    <TableHead className="font-bold text-black py-5">Email</TableHead>
                    <TableHead className="font-bold text-black py-5">Country</TableHead>
                    <TableHead className="font-bold text-black py-5">VAT Status</TableHead>
                    <TableHead className="font-bold text-black py-5">Submitted</TableHead>
                    <TableHead className="text-right font-bold text-black py-5">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-gray-50">
                      <TableCell className="font-semibold py-6">{supplier.company_name}</TableCell>
                      <TableCell className="text-sm text-gray-600 py-6">{supplier.business_email}</TableCell>
                      <TableCell className="py-6">{supplier.country}</TableCell>
                      <TableCell className="py-6">
                        {supplier.tax_id ? (
                          supplier.vat_validated ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Validated
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-2">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )
                        ) : (
                          <span className="text-sm text-gray-500">No VAT</span>
                        )}
                      </TableCell>
                      <TableCell className="py-6">
                        {new Date(supplier.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-right py-6">
                        <Button
                          size="lg"
                          className="h-12 px-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
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
            </div>
          ) : (
            <div className="text-center py-20">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <p className="text-2xl font-bold mb-2">All caught up!</p>
              <p className="text-gray-600 text-lg">
                No suppliers waiting for verification at the moment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
