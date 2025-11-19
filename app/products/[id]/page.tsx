import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, MapPin, Package, DollarSign, FileCheck, ShieldCheck, ArrowLeft, Globe, MessageSquare, CheckCircle2, Shield, BarChart3, TrendingUp, TrendingDown, Minus, Calculator } from 'lucide-react'
import { RFQForm } from '@/components/products/rfq-form'
import { createClient } from '@/lib/supabase/server'
import { formatPriceWithConversion, type Currency } from '@/lib/utils/currency'
import { getOriginComparisonData } from '@/lib/utils/origin-comparison'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

async function getProduct(id: string) {
  const supabase = createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      companies:company_id (
        id,
        company_name,
        country,
        verification_status,
        verification_level
      )
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error || !product) {
    return null
  }

  return product
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.product_name} | foodXtrade`,
    description: `${product.product_name} - ${product.category} from ${product.origin_country}`,
  }
}

async function logProductViewEvent(data: {
  event_type: 'view'
  buyer_id?: string | null
  buyer_country?: string | null
  category?: string | null
  subcategory?: string | null
  origin_country?: string | null
  customs_status?: string | null
  product_id?: string | null
  metadata?: any
}): Promise<void> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('demand_events')
      .insert([data])

    if (error) {
      console.warn('[v0] Failed to log demand event:', error.message)
      return
    }

    console.log('[v0] Demand event logged: view')
  } catch (err) {
    console.warn('[v0] Error logging demand event:', err)
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const isOwnProduct = user && product.company_id === user.id
  
  if (!isOwnProduct) {
    let buyerCountry: string | null = null
    
    if (user) {
      const { data: company } = await supabase
        .from('companies')
        .select('country, company_type')
        .eq('user_id', user.id)
        .single()
      
      if (company?.company_type === 'buyer') {
        buyerCountry = company.country
      }
    }
    
    await logProductViewEvent({
      event_type: 'view',
      buyer_id: user?.id || null,
      buyer_country: buyerCountry,
      category: product.category,
      subcategory: product.product_type || null,
      origin_country: product.origin_country,
      customs_status: product.customs_status || null,
      product_id: product.id,
      metadata: {
        price: product.price_per_unit,
        currency: product.currency,
        available_quantity: product.available_quantity,
        supplier_id: product.company_id,
      },
    })
  }

  const originComparisons = product.product_type 
    ? await getOriginComparisonData(product.product_type) 
    : []
  
  const topOrigins = originComparisons
    .filter(o => o.origin !== product.origin_country)
    .slice(0, 3)

  const supplier = {
    name: product.companies?.company_name || 'Unknown Supplier',
    country: product.companies?.country || 'Unknown',
    verified: product.companies?.verification_status === 'verified',
    verificationLevel: product.companies?.verification_level,
    id: product.companies?.id
  }

  const formattedProduct = {
    id: product.id,
    name: product.product_name,
    category: product.category,
    origin: product.origin_country,
    availableQuantity: product.available_quantity,
    unit: product.unit,
    priceRange: formatPriceWithConversion(
      product.price_per_unit, 
      (product.currency || 'EUR') as Currency,
      true
    ),
    customsStatus: product.customs_status || 'Not specified',
    certifications: product.certifications || [],
    supplier: supplier,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Product Detail */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
              <Image
                src={`/.jpg?key=5zggi&height=600&width=600&query=${encodeURIComponent(product.product_name)}`}
                alt={product.product_name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold text-balance">{product.product_name}</h1>
                {supplier.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="shrink-0 cursor-help bg-[#FFB84D]/10 text-[#FFB84D] border-[#FFB84D]/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          Verified by foodXtrade based on company documentation, export history and compliance checks.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-muted-foreground">{product.category}</p>
            </div>

            {product.product_type && (
              <Link href={`/compare/${product.product_type}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Compare origins for this product type
                </Button>
              </Link>
            )}

            {/* Supplier Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Link 
                      href={`/companies/${supplier.id}`}
                      className="font-medium hover:underline flex items-center gap-2"
                    >
                      {supplier.name}
                      {supplier.verified && (
                        <CheckCircle2 className="h-4 w-4 text-[#FFB84D] flex-shrink-0" />
                      )}
                    </Link>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      {supplier.country}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Origin</p>
                  <p className="font-medium">{product.origin_country}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <Package className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Available Quantity</p>
                  <p className="font-medium">{product.available_quantity?.toLocaleString()} {product.unit}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <DollarSign className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {formatPriceWithConversion(
                      product.price_per_unit,
                      (product.currency || 'EUR') as Currency,
                      true
                    )} per {product.unit}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Customs Status</p>
                  <p className="font-medium">{product.customs_status || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert: string) => (
                    <Badge key={cert} variant="outline" className="bg-secondary/10">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logistics Calculator */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Logistics Calculator
              </CardTitle>
              <CardDescription>
                Calculate container loads and shipping requirements for this product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/logistics?product_id=${product.id}`}>
                <Button className="w-full bg-[#FFB84D] text-black hover:bg-[#FFB84D]/90">
                  Calculate load →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {topOrigins.length > 0 && product.product_type && (
          <div className="mt-12 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Compare Origins
                </CardTitle>
                <CardDescription>
                  See how different origins compare for {product.product_type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {topOrigins.map((origin) => {
                    const trendIcon = origin.trend === null ? (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    ) : origin.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )

                    return (
                      <div 
                        key={origin.origin}
                        className="p-4 border rounded-lg hover:border-[#FFB84D]/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{origin.origin}</h4>
                          {trendIcon}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg. Price:</span>
                            <span className="font-medium">€{origin.avgPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Verified Suppliers:</span>
                            <span className="font-medium">{origin.verifiedSupplierCount}</span>
                          </div>
                          {origin.trend !== null && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">30-day trend:</span>
                              <span className={`font-medium ${origin.trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {origin.trend > 0 ? '+' : ''}{origin.trend.toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                <Link href={`/compare/${product.product_type}`}>
                  <Button className="w-full" variant="outline">
                    Compare all origins →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="border-2 border-[#9FE870]/20">
            <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#9FE870] rounded-full flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-black" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Request a Quote for This Product</CardTitle>
                  <CardDescription className="text-gray-300 mt-1">
                    Connect directly with {supplier.name} to negotiate pricing and terms
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <RFQForm product={formattedProduct} />
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Secure Transactions</CardTitle>
              <CardDescription>
                All quotes and transactions are protected and monitored for your safety
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Direct Communication</CardTitle>
              <CardDescription>
                Connect directly with verified suppliers to negotiate terms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Guaranteed</CardTitle>
              <CardDescription>
                All suppliers are vetted and products meet international standards
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
}
