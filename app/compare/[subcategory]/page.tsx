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
        <main className="min-h-screen bg-white">
          <div className="container-boxed py-16">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#0D1117] transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <div className="border border-[#E2E2E2] p-12 text-center">
              <h2 className="text-headline-small font-bold text-[#0D1117] mb-3">
                No Data Available
              </h2>
              <p className="text-body-medium text-[#7A7A7A]">
                No products found for {subcategoryLabel}. Check back later as suppliers add inventory.
              </p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-[#F6F6F6] border-b border-[#E2E2E2] py-16">
          <div className="container-boxed">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#0D1117] transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <h1 className="text-display-small font-bold text-[#0D1117] mb-6">
              Compare Origins
            </h1>
            <p className="text-body-large text-[#7A7A7A] max-w-3xl">
              Price, availability, seasonality and supplier quality by origin country for{' '}
              <span className="font-semibold text-[#0D1117]">{subcategoryLabel}</span>.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="container-boxed py-16">
          <div className="border border-[#E2E2E2] bg-white">
            <div className="p-8 border-b border-[#E2E2E2]">
              <h2 className="text-headline-small font-bold text-[#0D1117] mb-2">
                Origin Comparison for {subcategoryLabel}
              </h2>
              <p className="text-body-medium text-[#7A7A7A]">
                Compare {comparisonData.length} origins based on price, supplier verification, and customs status
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E2E2E2] bg-[#F6F6F6]">
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide">Origin</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide">Avg Price (EUR)</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide">Price Range</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide">Trend</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide">Verified Suppliers</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide">EU-Cleared Stock</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide">In Season</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-[#0D1117] uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((data, index) => (
                    <tr 
                      key={data.origin} 
                      className="border-b border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors"
                    >
                      {/* Origin */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-[#7A7A7A]" />
                          <span className="text-sm font-medium text-[#0D1117]">{data.origin}</span>
                        </div>
                      </td>

                      {/* Average Price */}
                      <td className="py-5 px-6">
                        <span className="text-base font-bold text-[#0D1117]">
                          {data.avgPrice.toFixed(2)} €
                        </span>
                      </td>

                      {/* Price Range */}
                      <td className="py-5 px-6 text-sm text-[#7A7A7A]">
                        {data.minPrice.toFixed(2)} – {data.maxPrice.toFixed(2)} €
                      </td>

                      {/* Trend */}
                      <td className="py-5 px-6">
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
                                <Minus className="h-4 w-4 text-[#7A7A7A]" />
                                <span className="text-sm text-[#7A7A7A]">
                                  0%
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-[#7A7A7A]">–</span>
                        )}
                      </td>

                      {/* Verified Suppliers */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          {data.verifiedSupplierCount > 0 && (
                            <CheckCircle2 className="h-4 w-4 text-[#3DA9FC]" />
                          )}
                          <span className="text-sm text-[#0D1117]">
                            {data.verifiedSupplierCount} of {data.supplierCount}
                          </span>
                        </div>
                      </td>

                      {/* EU-Cleared Stock */}
                      <td className="py-5 px-6">
                        {data.euClearedCount > 0 ? (
                          <Badge variant="customs" className="text-xs">
                            {data.euClearedCount}
                          </Badge>
                        ) : (
                          <span className="text-sm text-[#7A7A7A]">–</span>
                        )}
                      </td>

                      {/* In Season */}
                      <td className="py-5 px-6">
                        {data.inSeason ? (
                          <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                            Yes
                          </Badge>
                        ) : (
                          <span className="text-sm text-[#7A7A7A]">–</span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-5 px-6">
                        <Link
                          href={`/products?subcategory=${params.subcategory}&origin_country=${encodeURIComponent(data.origin)}`}
                        >
                          <Button 
                            size="sm" 
                            className="bg-[#0D1117] text-white hover:bg-[#0D1117]/90 text-xs font-bold"
                            style={{ borderRadius: '6px' }}
                          >
                            View Suppliers
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Cards - SoftGrey background section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-[#F6F6F6] border border-[#E2E2E2] p-6">
              <h3 className="text-base font-bold text-[#0D1117] mb-2">Price Trends</h3>
              <p className="text-sm text-[#7A7A7A]">
                30-day price movements compared to previous period
              </p>
            </div>

            <div className="bg-[#F6F6F6] border border-[#E2E2E2] p-6">
              <h3 className="text-base font-bold text-[#0D1117] mb-2">Verified Suppliers</h3>
              <p className="text-sm text-[#7A7A7A]">
                Suppliers verified by foodXtrade with documentation and compliance checks
              </p>
            </div>

            <div className="bg-[#F6F6F6] border border-[#E2E2E2] p-6">
              <h3 className="text-base font-bold text-[#0D1117] mb-2">EU-Cleared Stock</h3>
              <p className="text-sm text-[#7A7A7A]">
                Products already cleared through EU customs, ready for quick delivery
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
