import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, MapPin, Package, DollarSign, FileCheck, ShieldCheck, ArrowLeft, Globe, MessageSquare } from 'lucide-react'
import { RFQForm } from '@/components/products/rfq-form'
import { createClient } from '@/lib/supabase/server'

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
        verification_status
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

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const supplier = {
    name: product.companies?.company_name || 'Unknown Supplier',
    country: product.companies?.country || 'Unknown',
    verified: product.companies?.verification_status === 'verified',
    id: product.companies?.id
  }

  const formattedProduct = {
    id: product.id,
    name: product.product_name,
    category: product.category,
    origin: product.origin_country,
    availableQuantity: product.available_quantity,
    unit: product.unit,
    priceRange: `$${product.price_per_unit}`,
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
                src={`/.jpg?key=zxeqa&height=600&width=600&query=${encodeURIComponent(product.product_name)}`}
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
                  <Badge variant="secondary" className="shrink-0">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{product.category}</p>
            </div>

            {/* Supplier Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Link 
                      href={`/companies/${supplier.id}`}
                      className="font-medium hover:underline"
                    >
                      {supplier.name}
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
                  <p className="font-medium">${product.price_per_unit} per {product.unit}</p>
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
