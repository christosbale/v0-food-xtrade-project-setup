import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, ExternalLink, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CompanyApprovalActions } from '@/components/admin/company-approval-actions'

export default async function CompanyReviewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  console.log('[v0] Loading company review for ID:', params.id)
  
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!company) {
    console.log('[v0] Company not found:', params.id)
    notFound()
  }

  console.log('[v0] Company loaded:', company.company_name, 'Status:', company.verification_status)

  // Fetch documents for this company
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('company_id', params.id)
    .order('uploaded_at', { ascending: false })

  const { data: products } = await supabase
    .from('products')
    .select('id, product_name, status, created_at')
    .eq('company_id', params.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Review</h2>
          <p className="text-muted-foreground">
            Review and verify supplier application
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/companies/pending">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Link>
        </Button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge 
          variant={
            company.verification_status === 'verified' ? 'default' :
            company.verification_status === 'rejected' ? 'destructive' :
            'secondary'
          }
          className="text-sm"
        >
          Status: {company.verification_status}
        </Badge>
        {company.vat_validated && (
          <Badge className="bg-green-500 hover:bg-green-600 text-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            VAT Validated
          </Badge>
        )}
        {company.tax_id && !company.vat_validated && (
          <Badge variant="outline" className="text-sm">
            <AlertCircle className="h-3 w-3 mr-1" />
            VAT Not Validated
          </Badge>
        )}
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Basic details about the supplier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="text-lg font-medium">{company.company_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Country</Label>
              <p className="text-lg font-medium">{company.country}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">VAT/Tax ID</Label>
              <p className="text-lg font-medium">{company.tax_id || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Business Registration</Label>
              <p className="text-lg font-medium">{company.business_registration_number || 'Not provided'}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <a 
                href={`mailto:${company.business_email}`}
                className="font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                {company.business_email}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              {company.phone ? (
                <a 
                  href={`tel:${company.phone}`}
                  className="font-medium text-primary hover:underline"
                >
                  {company.phone}
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">Website</Label>
              {company.website ? (
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  {company.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground">Address</Label>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address}, ${company.city}, ${company.postal_code}, ${company.country}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              {company.address}, {company.city}, {company.postal_code}, {company.country}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div>
            <Label className="text-muted-foreground">Company Type</Label>
            <Badge variant="outline" className="capitalize">
              {company.company_type}
            </Badge>
          </div>

          <div>
            <Label className="text-muted-foreground">Submitted At</Label>
            <p className="text-sm mt-1">
              {new Date(company.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {company.approved_by && company.approved_at && (
            <div>
              <Label className="text-muted-foreground">Approved At</Label>
              <p className="text-sm mt-1">
                {new Date(company.approved_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {products && products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Company Products</CardTitle>
            <CardDescription>
              Products listed by this company ({products.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{product.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Status: <span className="capitalize">{product.status}</span> • Listed {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/products/${product.id}`}>
                      View Product
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Review compliance and verification documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents && documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Type: {doc.document_type || 'General'} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a 
                      href={doc.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      View Document
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No documents uploaded
            </p>
          )}
        </CardContent>
      </Card>

      {company.verification_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Notes</CardTitle>
            <CardDescription>Internal notes from previous review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{company.verification_notes}</p>
          </CardContent>
        </Card>
      )}

      <CompanyApprovalActions 
        companyId={company.id}
        currentStatus={company.verification_status}
        hasVAT={!!company.tax_id}
        vatValidated={company.vat_validated}
      />
    </div>
  )
}
