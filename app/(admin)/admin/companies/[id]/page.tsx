import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, FileText, ArrowLeft, Users, Package } from 'lucide-react'
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { AdminCompanyControls } from '@/components/admin/admin-company-controls'

function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export default async function AdminCompanyDetailPage({ params }: { params: { id: string } }) {
  if (params.id === 'pending') {
    redirect('/admin/companies-pending')
  }
  
  if (!isValidUUID(params.id)) {
    notFound()
  }

  const supabase = await createClient()
  
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!company) {
    notFound()
  }

  // Fetch related data in parallel
  const [
    { data: users },
    { data: products },
    { data: rfqs }
  ] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('id, email, role, created_at')
      .eq('company_id', params.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('products')
      .select('id, product_name, category, customs_status, price_per_unit, currency, status, created_at')
      .eq('company_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('rfqs')
      .select('id, buyer_country, target_category, target_subcategory, status, created_at')
      .eq('supplier_company_id', params.id)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  // Parse verification documents if exists
  let documents: any[] = []
  if (company.verification_documents) {
    try {
      documents = Array.isArray(company.verification_documents) 
        ? company.verification_documents 
        : []
    } catch (e) {
      console.error('Failed to parse verification documents')
    }
  }

  // Format subscription expiry
  const subscriptionActive = company.subscription_expires_at 
    ? new Date(company.subscription_expires_at) > new Date()
    : true // null means active

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Details</h2>
          <p className="text-muted-foreground">
            Manage verification, subscription, and company information
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/companies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Link>
        </Button>
      </div>

      {/* Company Header Card */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{company.company_name || company.name}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {company.city}, {company.country}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Badge 
                variant={
                  company.verification_status === 'verified' ? 'verified' :
                  company.verification_status === 'rejected' ? 'destructive' :
                  'secondary'
                }
                className="text-sm"
              >
                {company.verification_status === 'verified' && '✓ '}
                {company.verification_status}
              </Badge>
              {company.subscription_plan && (
                <Badge 
                  variant="outline"
                  className="text-sm capitalize"
                  style={{ 
                    backgroundColor: subscriptionActive ? '#FFB84D' : '#666',
                    color: subscriptionActive ? '#000' : '#fff',
                    borderColor: 'transparent'
                  }}
                >
                  {company.subscription_plan}
                </Badge>
              )}
              {company.risk_score !== null && (
                <Badge 
                  variant={
                    company.risk_score >= 70 ? 'risk-low' :
                    company.risk_score >= 40 ? 'risk-medium' :
                    'risk-high'
                  }
                  className="text-sm"
                >
                  Risk: {company.risk_score}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {company.website_url && (
              <div>
                <Label className="text-muted-foreground">Website</Label>
                <a
                  href={company.website_url.startsWith('http') ? company.website_url : `https://${company.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  {company.website_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {company.verified_at && (
              <div>
                <Label className="text-muted-foreground">Verified Date</Label>
                <p className="font-medium">
                  {new Date(company.verified_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
          
          {company.onboarding_completed && (
            <div>
              <Label className="text-muted-foreground">Onboarding Status</Label>
              <Badge variant="default" className="ml-2">Completed</Badge>
              {company.onboarding_completed_at && (
                <span className="text-sm text-muted-foreground ml-2">
                  on {new Date(company.onboarding_completed_at).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Controls */}
      <AdminCompanyControls company={company} />

      {/* Company Users */}
      {users && users.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Company Users</CardTitle>
            </div>
            <CardDescription>
              User accounts associated with this company
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Role: <span className="capitalize">{user.role}</span> • 
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products */}
      {products && products.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Products</CardTitle>
            </div>
            <CardDescription>
              Products listed by this company (showing {products.length} most recent)
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
                      {product.category} • 
                      {product.customs_status && (
                        <Badge variant="customs" className="ml-1 text-xs">
                          {product.customs_status}
                        </Badge>
                      )}
                      {!product.customs_status && ' N/A'} • 
                      {product.price_per_unit && product.currency 
                        ? ` ${product.price_per_unit} ${product.currency}`
                        : ' Price N/A'
                      }
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {product.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Documents */}
      {documents.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Verification Documents</CardTitle>
            <CardDescription>
              Uploaded compliance and certification documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.type || 'Document'}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.filename || doc.name || 'File'}
                        {doc.uploadedAt && ` • Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  {doc.url && (
                    <Button size="sm" variant="outline" asChild>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFQs (Optional) */}
      {rfqs && rfqs.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent RFQs</CardTitle>
            <CardDescription>
              Quote requests received by this supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rfqs.map((rfq) => (
                <div
                  key={rfq.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {rfq.target_subcategory || rfq.target_category || 'RFQ'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      From {rfq.buyer_country} • {new Date(rfq.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {rfq.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
