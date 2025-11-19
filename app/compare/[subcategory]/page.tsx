import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, CheckCircle2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getOriginComparisonData } from '@/lib/utils/origin-comparison'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const dynamic = 'force-dynamic'

function getSubcategoryLabel(subcategoryId: string): string {
  for (const category of PRODUCT_CATEGORIES) {
    const subcategory = category.subcategories.find(s => s.id === subcategoryId)
    if (subcategory) {
      return subcategory.label
    }
  }
  return subcategoryId
}

export async function generateMetadata({ 
  params 
}: { 
  params: { subcategory: string } 
}): Promise<Metadata> {
  const subcategoryLabel = getSubcategoryLabel(params.subcategory)
  
  return {
    title: `Compare Origins - ${subcategoryLabel} | foodXtrade`,
    description: `Compare ${subcategoryLabel} prices, availability, and suppliers by origin country`,
  }
}

export default async function OriginComparisonPage({ 
  params 
}: { 
  params: { subcategory: string } 
}) {
  const subcategoryLabel = getSubcategoryLabel(params.subcategory)
  const comparisonData = await getOriginComparisonData(params.subcategory)

  if (!comparisonData || comparisonData.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-16">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <Card>
              <CardHeader>
                <CardTitle>No Data Available</CardTitle>
                <CardDescription>
                  No products found for {subcategoryLabel}. Check back later as suppliers add inventory.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-card border-b py-16">
          <div className="container mx-auto px-4">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <h1 className="text-5xl font-bold mb-4 text-balance">Compare Origins</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Price, availability, seasonality and supplier quality by origin country for{' '}
              <span className="font-semibold text-foreground">{subcategoryLabel}</span>.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Origin Comparison for {subcategoryLabel}</CardTitle>
              <CardDescription>
                Compare {comparisonData.length} origins based on price, supplier verification, and customs status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold">Origin</th>
                      <th className="text-left py-4 px-4 font-semibold">Avg Price (EUR)</th>
                      <th className="text-left py-4 px-4 font-semibold">Price Range</th>
                      <th className="text-left py-4 px-4 font-semibold">Trend</th>
                      <th className="text-left py-4 px-4 font-semibold">Verified Suppliers</th>
                      <th className="text-left py-4 px-4 font-semibold">EU-Cleared Stock</th>
                      <th className="text-left py-4 px-4 font-semibold">In Season</th>
                      <th className="text-left py-4 px-4 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((data, index) => (
                      <tr 
                        key={data.origin} 
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        {/* Origin */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{data.origin}</span>
                          </div>
                        </td>

                        {/* Average Price */}
                        <td className="py-4 px-4">
                          <span className="font-mono font-semibold">
                            {data.avgPrice.toFixed(2)} €
                          </span>
                        </td>

                        {/* Price Range */}
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {data.minPrice.toFixed(2)} – {data.maxPrice.toFixed(2)} €
                        </td>

                        {/* Trend */}
                        <td className="py-4 px-4">
                          {data.trend !== null ? (
                            <div className="flex items-center gap-1">
                              {data.trend > 0 ? (
                                <>
                                  <TrendingUp className="h-4 w-4 text-red-500" />
                                  <span className="text-sm text-red-500 font-medium">
                                    +{data.trend.toFixed(1)}%
                                  </span>
                                </>
                              ) : data.trend < 0 ? (
                                <>
                                  <TrendingDown className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-500 font-medium">
                                    {data.trend.toFixed(1)}%
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Minus className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    0%
                                  </span>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">–</span>
                          )}
                        </td>

                        {/* Verified Suppliers */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {data.verifiedSupplierCount > 0 && (
                              <CheckCircle2 className="h-4 w-4 text-[#FFB84D]" />
                            )}
                            <span className="text-sm">
                              {data.verifiedSupplierCount} of {data.supplierCount}
                            </span>
                          </div>
                        </td>

                        {/* EU-Cleared Stock */}
                        <td className="py-4 px-4">
                          {data.euClearedCount > 0 ? (
                            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                              {data.euClearedCount} product{data.euClearedCount > 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">–</span>
                          )}
                        </td>

                        {/* In Season */}
                        <td className="py-4 px-4">
                          {data.inSeason ? (
                            <Badge variant="secondary" className="bg-[#FFB84D]/10 text-[#FFB84D] border-[#FFB84D]/30">
                              Yes
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">–</span>
                          )}
                        </td>

                        {/* Action Button */}
                        <td className="py-4 px-4">
                          <Link
                            href={`/products?subcategory=${params.subcategory}&origin_country=${encodeURIComponent(data.origin)}`}
                          >
                            <Button size="sm" variant="outline">
                              View Suppliers
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Trends</CardTitle>
                <CardDescription>
                  30-day price movements compared to previous period
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Verified Suppliers</CardTitle>
                <CardDescription>
                  Suppliers verified by foodXtrade with documentation and compliance checks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EU-Cleared Stock</CardTitle>
                <CardDescription>
                  Products already cleared through EU customs, ready for quick delivery
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
