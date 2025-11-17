import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Building2, CheckCircle2, Clock, XCircle, Mail, ExternalLink, Upload, Eye, RefreshCw, Package, Plus } from 'lucide-react'
import { getCurrentCompany } from '@/lib/auth/current-company'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function CompanyProfilePage() {
  const session = await getCurrentCompany()
  
  if (!session || !session.company) {
    redirect('/login')
  }

  const { company } = session
  const supabase = await createClient()

  // Fetch products for this company
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('[v0] Error fetching products:', productsError)
  }

  const documents = [
    {
      id: '1',
      name: 'Business Registration Certificate',
      filename: 'business-registration.pdf',
      uploadedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'HACCP Certification',
      filename: 'haccp-cert-2024.pdf',
      uploadedAt: '2024-02-10',
    },
    {
      id: '3',
      name: 'ISO 9001 Certificate',
      filename: 'iso-9001-certificate.pdf',
      uploadedAt: '2024-02-10',
    },
  ]

  const verificationStatus = company.verification_status || 'pending'

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      badgeVariant: 'secondary' as const,
      title: 'Company Under Review',
      description: 'Your company is currently under review. We usually respond within 24–48 hours.',
    },
    verified: {
      icon: CheckCircle2,
      color: 'bg-green-50 border-green-200 text-green-800',
      badgeVariant: 'default' as const,
      title: 'Company Verified',
      description: 'Your company is currently: Verified. You can list products and receive RFQs.',
    },
    rejected: {
      icon: XCircle,
      color: 'bg-red-50 border-red-200 text-red-800',
      badgeVariant: 'destructive' as const,
      title: 'More Information Required',
      description:
        'Your company verification was rejected. Please review the feedback and submit additional documentation.',
    },
  }

  const currentStatus = statusConfig[verificationStatus as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = currentStatus.icon

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
        <p className="text-muted-foreground">
          Manage your company information and verification status
        </p>
      </div>

      {/* Verification Status Banner */}
      <Alert className={currentStatus.color}>
        <StatusIcon className="h-5 w-5" />
        <AlertTitle className="flex items-center gap-2">
          {currentStatus.title}
          <Badge variant={currentStatus.badgeVariant} className="capitalize">
            {verificationStatus}
          </Badge>
        </AlertTitle>
        <AlertDescription>{currentStatus.description}</AlertDescription>
      </Alert>

      {/* Company Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>Your registered company details</CardDescription>
            </div>
            <Button variant="outline">Edit Company Info</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Company Name</p>
              <p className="mt-1 text-base font-medium">{company.company_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
              <p className="mt-1 text-base font-medium">{company.country || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Website</p>
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-base font-medium text-primary hover:underline"
                >
                  {company.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="mt-1 text-base text-muted-foreground">Not specified</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Business Email</p>
              <p className="mt-1 text-base font-medium">{company.business_email || 'Not specified'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                VAT/EORI/Registration Number
              </p>
              <p className="mt-1 text-base font-medium">{company.business_registration_number || 'Not specified'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Company Type</p>
              <Badge variant="secondary" className="mt-2 capitalize">
                {company.company_type || 'Not specified'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Your Products
              </CardTitle>
              <CardDescription>All listings associated with this company</CardDescription>
            </div>
            <Button asChild className="bg-[#9FE870] text-black hover:bg-[#8FD860]">
              <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">This company has no products listed yet</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Start building your product catalog to attract buyers and receive quote requests.
              </p>
              <Button asChild className="bg-[#9FE870] text-black hover:bg-[#8FD860]">
                <Link href="/dashboard/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Link>
              </Button>
            </div>
          ) : (
            // Products table
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Product Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Origin</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <Link 
                          href={`/dashboard/products?selected=${product.id}`}
                          className="font-medium hover:text-[#9FE870] transition-colors"
                        >
                          {product.product_name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {product.origin_country}
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={product.status === 'published' ? 'default' : 'secondary'}
                          className={product.status === 'published' ? 'bg-[#9FE870] text-black hover:bg-[#8FD860]' : ''}
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/products?selected=${product.id}`}>
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 text-sm text-muted-foreground">
                Total: {products.length} {products.length === 1 ? 'product' : 'products'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance & Documents Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance & Documents</CardTitle>
              <CardDescription>
                Manage your business registration and certification documents
              </CardDescription>
            </div>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Additional Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4"
              >
                <div className="flex-1">
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.filename} • Uploaded {doc.uploadedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Replace
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact & Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Need help with verification or have questions about your company profile?
          </p>
          <Button variant="outline" className="mt-4 gap-2" asChild>
            <a href="mailto:support@foodxtrade.com">
              <Mail className="h-4 w-4" />
              Contact Support
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
