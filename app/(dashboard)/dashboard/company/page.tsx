import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Building2, CheckCircle2, Clock, XCircle, Mail, ExternalLink, Upload, Eye, RefreshCw, Package, Plus, Shield, AlertTriangle } from 'lucide-react'
import { getCurrentCompany } from '@/lib/auth/current-company'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { VerificationComplianceForm } from '@/components/dashboard/verification-compliance-form'
import { EditCompanyDialog } from '@/components/dashboard/edit-company-dialog'

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
  const verificationLevel = company.verification_level // 'basic' | 'trusted' | 'premium'
  const verifiedAt = company.verified_at
  const riskScore = company.risk_score

  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      badgeVariant: 'secondary' as const,
      title: 'Verification in Progress',
      description: 'Your company is currently under review. We usually respond within 24–48 hours.',
    },
    verified: {
      icon: CheckCircle2,
      color: 'bg-green-50 border-green-200 text-green-800',
      badgeVariant: 'default' as const,
      title: 'Verified Supplier',
      description: 'Your company is verified. You can list products and receive RFQs from buyers.',
    },
    rejected: {
      icon: XCircle,
      color: 'bg-red-50 border-red-200 text-red-800',
      badgeVariant: 'destructive' as const,
      title: 'Verification Rejected',
      description:
        'Your company verification was rejected. Please review the feedback and submit additional documentation.',
    },
  }

  const levelConfig = {
    basic: { label: 'Basic Verified', color: 'bg-blue-100 text-blue-800', icon: Shield },
    trusted: { label: 'Trusted Supplier', color: 'bg-purple-100 text-purple-800', icon: Shield },
    premium: { label: 'Premium Verified Supplier', color: 'bg-amber-100 text-amber-800', icon: Shield },
  }

  const currentStatus = statusConfig[verificationStatus as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = currentStatus.icon
  const currentLevel = verificationLevel ? levelConfig[verificationLevel as keyof typeof levelConfig] : null

  const hasSubmittedVerification = company.verification_documents && 
    Object.keys(company.verification_documents).length > 0
  const canEditVerification = !hasSubmittedVerification || verificationStatus === 'pending'

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

      {verificationStatus === 'verified' && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle2 className="h-5 w-5" />
              Verification Details
            </CardTitle>
            <CardDescription>Your company has been verified by foodXtrade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Verification Level */}
              {currentLevel && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Verification Level</p>
                  <Badge className={`${currentLevel.color} text-sm px-3 py-1`}>
                    <currentLevel.icon className="h-4 w-4 mr-1.5" />
                    {currentLevel.label}
                  </Badge>
                </div>
              )}

              {/* Verified Date */}
              {verifiedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Verified On</p>
                  <p className="text-base font-medium text-green-900">
                    {new Date(verifiedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              )}

              {/* Risk Score */}
              {riskScore !== null && riskScore !== undefined && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Risk Assessment</p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-green-900">
                      {riskScore}/100
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {riskScore < 30 ? '(Low risk)' : riskScore < 60 ? '(Medium risk)' : '(Higher review)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-green-900">
                <strong>Benefits:</strong> Verified badge on your company profile and products, higher visibility in search results, and increased buyer trust.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
            <EditCompanyDialog company={company} />
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
                <Shield className="h-5 w-5" />
                Verification & Compliance
              </CardTitle>
              <CardDescription>
                Submit your company documentation for verification
              </CardDescription>
            </div>
            {hasSubmittedVerification && verificationStatus !== 'pending' && (
              <Badge variant={verificationStatus === 'verified' ? 'default' : 'secondary'}>
                {verificationStatus === 'verified' ? 'Documents Verified' : 'Under Review'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!canEditVerification && verificationStatus === 'verified' ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Verification Complete</AlertTitle>
              <AlertDescription className="text-green-800">
                Your company documentation has been verified. Contact support if you need to update any information.
              </AlertDescription>
            </Alert>
          ) : (
            <VerificationComplianceForm 
              company={company}
              canEdit={canEditVerification}
            />
          )}
        </CardContent>
      </Card>

      {/* Your Products */}
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
            <Button asChild className="bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
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
              <Button asChild className="bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
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
                          className={product.status === 'published' ? 'bg-[#0D1117] text-white' : ''}
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
