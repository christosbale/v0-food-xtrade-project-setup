import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { RequestQuoteModal } from '@/components/products/request-quote-modal'
import { ExternalLink, MapPin, CheckCircle2, Building2, Globe, Shield, Info, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { Company, Product } from '@/lib/types/database'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { computeRiskScore, getRiskCategoryColor } from '@/lib/utils/risk-scoring'

interface CompanyPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ aiScore?: string; aiExplanation?: string }>
}

export default async function CompanyPage({ params, searchParams }: CompanyPageProps) {
  const { id } = await params
  const { aiScore, aiExplanation } = await searchParams
  const supabase = await createClient()

  // Fetch company
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (companyError || !company) {
    notFound()
  }

  // Fetch published products from this company
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const publishedProducts = products || []

  // Extract main categories from products
  const mainCategories = Array.from(
    new Set(publishedProducts.map((p) => p.category))
  ).slice(0, 5)

  const riskScore = computeRiskScore({
    website_url: company.website_url,
    company_address: company.company_address,
    vat_number: company.vat_number,
    verification_documents: company.verification_documents,
    verification_status: company.verification_status
  })

  const getVerificationBadge = () => {
    const status = company.verification_status
    const level = company.verification_level

    if (status === 'verified') {
      const levelConfig = {
        basic: { label: 'Basic Verified', color: 'bg-blue-500/10 text-blue-700 border-blue-500/30' },
        trusted: { label: 'Trusted Supplier', color: 'bg-purple-500/10 text-purple-700 border-purple-500/30' },
        premium: { label: 'Premium Verified', color: 'bg-amber-500/10 text-amber-700 border-amber-500/30' },
      }

      const levelStyle = level && levelConfig[level as keyof typeof levelConfig]
      const badgeLabel = levelStyle ? levelStyle.label : 'Verified Supplier'
      const badgeColor = levelStyle ? levelStyle.color : 'bg-[#FFB84D]/10 text-[#FFB84D] border-[#FFB84D]/30'

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={`${badgeColor} border flex items-center gap-1.5 px-4 py-2 text-sm cursor-help`}>
                <CheckCircle2 className="h-4 w-4" />
                {badgeLabel}
                <Info className="h-3 w-3 ml-1" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Verified by foodXtrade based on company documentation, export history and compliance checks.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else if (status === 'pending') {
      return (
        <Badge variant="secondary" className="text-xs text-muted-foreground">
          Verification pending
        </Badge>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Company Header */}
      <section className="bg-gray-50 border-b py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-white border-2 rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight text-foreground">
                  {company.company_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{company.country}</span>
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#FFB84D] transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              {/* AI Match Score section */}
              {aiScore && (
                <div className="rounded-lg border bg-gradient-to-br from-[#FFB84D]/5 to-transparent p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#FFB84D]" />
                    <span className="font-semibold text-lg">AI Match Score: {aiScore}/100</span>
                  </div>
                  {aiExplanation && (
                    <div className="bg-white/50 rounded-md p-3 border">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {decodeURIComponent(aiExplanation)}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground italic">
                    This score was calculated based on your RFQ requirements and this supplier's capabilities.
                  </p>
                </div>
              )}

              {getVerificationBadge()}

              {company.company_type === 'supplier' && (
                <div className="space-y-2">
                  <Badge 
                    className={`${getRiskCategoryColor(riskScore.category)} border flex items-center gap-1.5 px-4 py-2 text-sm w-fit`}
                  >
                    <Shield className="h-4 w-4" />
                    {riskScore.category === 'low' ? 'Low Risk' : riskScore.category === 'medium' ? 'Medium Risk' : 'High Risk'}
                  </Badge>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium">Risk score:</span> {riskScore.score}/100
                    </p>
                    {company.risk_last_updated && (
                      <p>
                        <span className="font-medium">Last updated:</span>{' '}
                        {new Date(company.risk_last_updated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                    <p className="text-xs italic mt-2">
                      Calculated automatically based on verification data, documentation and supplier completeness.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Categories */}
            {mainCategories.length > 0 && (
              <div className="mt-6">
                <p className="text-muted-foreground text-sm mb-2">Main Product Categories</p>
                <div className="flex flex-wrap gap-2">
                  {mainCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-white border"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <p className="text-muted-foreground text-sm mt-6">
              This is a B2B {company.company_type} on foodXtrade.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Published Products</h2>
          <p className="text-muted-foreground mb-8">
            {publishedProducts.length > 0
              ? `Showing ${publishedProducts.length} product${publishedProducts.length !== 1 ? 's' : ''} from this company`
              : 'Browse available products from this supplier'}
          </p>

          {publishedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedProducts.map((product: Product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 bg-muted flex items-center justify-center">
                      <img
                        src={`/.jpg?height=200&width=400&query=${encodeURIComponent(product.product_name)}`}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 right-3 bg-black text-white">
                        {product.incoterm}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold mb-1">
                          {product.product_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.category} · Origin: {product.origin_country}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium">
                          {product.available_quantity} {product.unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold text-lg">
                          ${product.price_per_unit.toLocaleString()} / {product.unit}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {product.customs_status}
                        </Badge>
                        {product.certifications && product.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.certifications.map((cert: string) => (
                              <Badge
                                key={cert}
                                className="text-xs bg-[#9FE870]/10 text-[#9FE870] border-[#9FE870]/30"
                              >
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex gap-3">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/products/${product.id}`}>View Details</Link>
                    </Button>
                    <RequestQuoteModal
                      product={{
                        id: product.id,
                        name: product.product_name,
                        unit: product.unit,
                        supplier: {
                          name: company.company_name,
                        },
                      }}
                    >
                      <Button className="flex-1 bg-[#9FE870] text-black hover:bg-[#8DD760]">
                        Request Quote
                      </Button>
                    </RequestQuoteModal>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            // Empty State
            <Card className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No published products</h3>
              <p className="text-muted-foreground mb-6">
                This company has no published products at the moment.
              </p>
              <Button variant="outline" asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
