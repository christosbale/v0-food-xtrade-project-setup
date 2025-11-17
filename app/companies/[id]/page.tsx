import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { RequestQuoteModal } from '@/components/products/request-quote-modal'
import { ExternalLink, MapPin, CheckCircle2, Building2, Globe } from 'lucide-react'
import Link from 'next/link'
import type { Company, Product } from '@/lib/types/database'

interface CompanyPageProps {
  params: Promise<{ id: string }>
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params
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

  return (
    <div className="min-h-screen bg-white">
      {/* Company Header */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-8 w-8 text-[#9FE870]" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                  {company.company_name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{company.country}</span>
                  </div>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-[#9FE870] transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Visit website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Status */}
            {company.verification_status === 'verified' && (
              <div className="inline-flex items-center gap-2 bg-[#9FE870]/20 text-[#9FE870] px-4 py-2 rounded-lg border border-[#9FE870]/30">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Verified Supplier</span>
              </div>
            )}

            {/* Categories */}
            {mainCategories.length > 0 && (
              <div className="mt-6">
                <p className="text-white/60 text-sm mb-2">Main Product Categories</p>
                <div className="flex flex-wrap gap-2">
                  {mainCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-white/10 text-white border-white/20"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <p className="text-white/60 text-sm mt-6">
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
