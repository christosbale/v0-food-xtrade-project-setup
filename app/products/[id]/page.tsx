import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronRight, TrendingUp, Shield, MapPin, Package, FileCheck, Building2, MessageSquare, Edit } from 'lucide-react'
import { RFQForm } from '@/components/products/rfq-form'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { formatPrice, type Currency } from '@/lib/utils/currency'

async function getProduct(id: string) {
  const supabase = await createClient()
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      companies:company_id (
        id,
        company_name,
        country,
        verification_status,
        risk_score,
        subscription_plan
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

async function getRelatedProducts(category: string, subcategory: string, currentId: string) {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('products')
    .select(`
      *,
      companies:company_id (
        company_name,
        verification_status
      )
    `)
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', currentId)
    .limit(6)
  
  return data || []
}

async function getRelatedRFQs(category: string, subcategory: string | null, originCountry: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('rfqs')
    .select('*')
    .eq('target_category', category)
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (subcategory) {
    query = query.eq('target_subcategory', subcategory)
  }
  
  const { data } = await query
  
  return data || []
}

async function getMarketSignals(subcategory: string | null) {
  const supabase = await createClient()
  
  // Get price range for this subcategory
  let priceQuery = supabase
    .from('price_history')
    .select('price, currency')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  if (subcategory) {
    priceQuery = priceQuery.eq('subcategory', subcategory)
  }
  
  const { data: prices } = await priceQuery
  
  // Get demand signals
  let demandQuery = supabase
    .from('demand_events')
    .select('event_type')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  if (subcategory) {
    demandQuery = demandQuery.eq('subcategory', subcategory)
  }
  
  const { data: demands } = await demandQuery
  
  // Get top destination countries
  const { data: destinations } = await supabase
    .from('demand_events')
    .select('buyer_country')
    .not('buyer_country', 'is', null)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .limit(100)
  
  const destinationCounts = destinations?.reduce((acc: Record<string, number>, item) => {
    if (item.buyer_country) {
      acc[item.buyer_country] = (acc[item.buyer_country] || 0) + 1
    }
    return acc
  }, {}) || {}
  
  const topDestinations = Object.entries(destinationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([country]) => country)
  
  return {
    priceRange: prices && prices.length > 0 ? {
      min: Math.min(...prices.map(p => p.price)),
      max: Math.max(...prices.map(p => p.price)),
      currency: prices[0]?.currency || 'EUR'
    } : null,
    rfqCount: demands?.filter(d => d.event_type === 'rfq_created').length || 0,
    enquiryCount: demands?.filter(d => d.event_type === 'view').length || 0,
    topDestinations
  }
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

function getRiskLabel(score: number | null): { label: string; variant: 'risk-low' | 'risk-medium' | 'risk-high' } {
  if (!score) return { label: 'Low Risk', variant: 'risk-low' }
  if (score < 30) return { label: 'Low Risk', variant: 'risk-low' }
  if (score < 70) return { label: 'Medium Risk', variant: 'risk-medium' }
  return { label: 'High Risk', variant: 'risk-high' }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params // Await params for Next.js 16 compatibility
  const product = await getProduct(resolvedParams.id)

  if (!product) {
    notFound()
  }

  type ProductWithCompany = typeof product & {
    companies: {
      id: string
      company_name: string
      country: string
      verification_status: string
      risk_score: number
      subscription_plan: string
    } | null
  }

  const productWithCompany = {
    ...product,
    companies: Array.isArray(product.companies) ? product.companies[0] : product.companies
  } as ProductWithCompany

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if user owns this product
  let isOwner = false
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()
    
    isOwner = profile?.company_id === productWithCompany.company_id
  }

  const [relatedProducts, relatedRFQs, marketSignals] = await Promise.all([
    getRelatedProducts(productWithCompany.category, productWithCompany.product_type || '', productWithCompany.id),
    getRelatedRFQs(productWithCompany.category, productWithCompany.product_type, productWithCompany.origin_country),
    getMarketSignals(productWithCompany.product_type)
  ])

  const supplier = {
    name: productWithCompany.companies?.company_name || 'Unknown Supplier',
    country: productWithCompany.companies?.country || 'Unknown',
    verified: productWithCompany.companies?.verification_status === 'verified',
    riskScore: productWithCompany.companies?.risk_score || 0,
    subscriptionPlan: productWithCompany.companies?.subscription_plan,
    id: productWithCompany.companies?.id
  }

  const riskInfo = getRiskLabel(supplier.riskScore)

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      
      <main className="container-boxed py-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[12px] text-[#7A7A7A]">
            <Link href="/products" className="hover:text-[#0D1117] transition-colors">
              Marketplace
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>{productWithCompany.category}</span>
            {productWithCompany.product_type && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span>{productWithCompany.product_type}</span>
              </>
            )}
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#0D1117]">{productWithCompany.product_name}</span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-8 mb-6">
          <div className="flex-1">
            <h1 className="text-[32px] font-bold text-[#0D1117] leading-[1.2] tracking-tight mb-3">
              {productWithCompany.product_name}
            </h1>
            <p className="text-[16px] text-[#7A7A7A] mb-4">
              {productWithCompany.category} · {productWithCompany.product_type || 'General'}
            </p>
            
            {isOwner && (
              <p className="text-[14px] text-[#7A7A7A] mb-4">
                You are viewing your own listing
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            {isOwner ? (
              <Link href={`/dashboard/products?editing=${productWithCompany.id}`}>
                <Button className="bg-[#0D1117] text-white font-bold hover:bg-[#0D1117]/90 h-auto py-3 px-6">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit product
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="outline" className="border-[#0D1117] text-[#0D1117] font-bold hover:bg-[#F6F6F6] h-auto py-3 px-6">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact supplier
                </Button>
                <a href="#rfq-section">
                  <Button className="bg-[#0D1117] text-white font-bold hover:bg-[#0D1117]/90 h-auto py-3 px-6">
                    Start RFQ for this product
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-12">
          {productWithCompany.customs_status && (
            <Badge variant="customs">{productWithCompany.customs_status}</Badge>
          )}
          {supplier.verified && (
            <Badge variant="verified">✓ Verified Supplier</Badge>
          )}
          <Badge variant={riskInfo.variant}>
            <Shield className="h-3 w-3 mr-1" />
            {riskInfo.label}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-[1fr,400px] gap-8 mb-16">
          {/* Left column */}
          <div className="space-y-8">
            {/* Product Overview */}
            <div className="bg-white border border-[#E2E2E2] rounded-md p-8">
              <h2 className="text-[20px] font-bold text-[#0D1117] mb-4">Product overview</h2>
              <p className="text-[16px] text-[#0D1117] leading-relaxed mb-6">
                {productWithCompany.product_name} from {productWithCompany.origin_country}. High-quality {productWithCompany.category.toLowerCase()} 
                suitable for commercial use. {productWithCompany.product_type && `Product type: ${productWithCompany.product_type}.`}
              </p>
              
              {productWithCompany.certifications && productWithCompany.certifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {productWithCompany.certifications.map((cert: string) => (
                    <Badge key={cert} variant="outline" className="text-[12px]">
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-white border border-[#E2E2E2] rounded-md p-8">
              <h2 className="text-[20px] font-bold text-[#0D1117] mb-6">Specifications</h2>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <div className="text-[12px] uppercase text-[#7A7A7A] mb-1">Category</div>
                  <div className="text-[16px] text-[#0D1117] font-medium">{productWithCompany.category}</div>
                </div>
                
                {productWithCompany.product_type && (
                  <div>
                    <div className="text-[12px] uppercase text-[#7A7A7A] mb-1">Subcategory</div>
                    <div className="text-[16px] text-[#0D1117] font-medium">{productWithCompany.product_type}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-[12px] uppercase text-[#7A7A7A] mb-1">Origin</div>
                  <div className="text-[16px] text-[#0D1117] font-medium">{productWithCompany.origin_country}</div>
                </div>
                
                {productWithCompany.crop_year && (
                  <div>
                    <div className="text-[12px] uppercase text-[#7A7A7A] mb-1">Crop Year</div>
                    <div className="text-[16px] text-[#0D1117] font-medium">{productWithCompany.crop_year}</div>
                  </div>
                )}
                
                {productWithCompany.unit && (
                  <div>
                    <div className="text-[12px] uppercase text-[#7A7A7A] mb-1">Unit</div>
                    <div className="text-[16px] text-[#0D1117] font-medium">{productWithCompany.unit}</div>
                  </div>
                )}
                
                {productWithCompany.shelf_life && (
                  <div>
                    <div className="text-[12px] uppercase text-[#7A7A7A] mb-1">Shelf Life</div>
                    <div className="text-[16px] text-[#0D1117] font-medium">
                      {productWithCompany.shelf_life} days
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Packaging & MOQ */}
            <div className="bg-white border border-[#E2E2E2] rounded-md p-8">
              <h2 className="text-[20px] font-bold text-[#0D1117] mb-6">Packaging & quantity</h2>
              <div className="space-y-4">
                {productWithCompany.min_order_quantity && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-[#7A7A7A] mt-0.5" />
                    <div>
                      <div className="text-[14px] text-[#7A7A7A]">Minimum order</div>
                      <div className="text-[16px] text-[#0D1117] font-medium">
                        {productWithCompany.min_order_quantity} {productWithCompany.min_order_unit || productWithCompany.unit}
                      </div>
                    </div>
                  </div>
                )}
                
                {productWithCompany.available_quantity && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-[#7A7A7A] mt-0.5" />
                    <div>
                      <div className="text-[14px] text-[#7A7A7A]">Available quantity</div>
                      <div className="text-[16px] text-[#0D1117] font-medium">
                        {productWithCompany.available_quantity.toLocaleString()} {productWithCompany.unit}
                      </div>
                    </div>
                  </div>
                )}
                
                {productWithCompany.packaging && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-[#7A7A7A] mt-0.5" />
                    <div>
                      <div className="text-[14px] text-[#7A7A7A]">Packaging</div>
                      <div className="text-[16px] text-[#0D1117] font-medium">{productWithCompany.packaging}</div>
                    </div>
                  </div>
                )}
                
                {productWithCompany.pallet_type && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-[#7A7A7A] mt-0.5" />
                    <div>
                      <div className="text-[14px] text-[#7A7A7A]">Pallet type</div>
                      <div className="text-[16px] text-[#0D1117] font-medium">{productWithCompany.pallet_type}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Supplier Card */}
            <div className="bg-[#F6F6F6] border border-[#E2E2E2] rounded-md p-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="h-12 w-12 rounded-full bg-[#0D1117] flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <Link 
                    href={`/companies/${supplier.id}`}
                    className="text-[18px] font-bold text-[#0D1117] hover:underline block mb-1"
                  >
                    {supplier.name}
                  </Link>
                  <div className="flex items-center gap-1 text-[14px] text-[#7A7A7A]">
                    <MapPin className="h-3 w-3" />
                    {supplier.country}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#7A7A7A]">Verification</span>
                  {supplier.verified ? (
                    <Badge variant="verified">✓ Verified</Badge>
                  ) : (
                    <span className="text-[14px] text-[#7A7A7A]">Not verified</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#7A7A7A]">Risk level</span>
                  <Badge variant={riskInfo.variant}>{riskInfo.label}</Badge>
                </div>
                
                {supplier.subscriptionPlan && (
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#7A7A7A]">Plan</span>
                    <span className="text-[14px] text-[#0D1117] font-medium capitalize">{supplier.subscriptionPlan}</span>
                  </div>
                )}
              </div>
              
              <Link href={`/companies/${supplier.id}`}>
                <Button variant="outline" className="w-full border-[#0D1117] text-[#0D1117] font-medium">
                  View supplier profile
                </Button>
              </Link>
            </div>

            {/* Customs & Logistics */}
            <div className="bg-white border border-[#E2E2E2] rounded-md p-6">
              <h3 className="text-[18px] font-bold text-[#0D1117] mb-4">Customs & logistics</h3>
              <div className="space-y-3">
                {productWithCompany.customs_status && (
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#7A7A7A]">Customs status</span>
                    <Badge variant="customs">{productWithCompany.customs_status}</Badge>
                  </div>
                )}
                
                {productWithCompany.incoterm && (
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#7A7A7A]">Incoterms</span>
                    <span className="text-[14px] text-[#0D1117] font-medium">{productWithCompany.incoterm}</span>
                  </div>
                )}
                
                {productWithCompany.warehouse_country && (
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#7A7A7A]">Warehouse</span>
                    <span className="text-[14px] text-[#0D1117] font-medium">
                      {productWithCompany.warehouse_city ? `${productWithCompany.warehouse_city}, ` : ''}{productWithCompany.warehouse_country}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F6F6F6] -mx-8 px-8 py-16 mb-16">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-[24px] font-bold text-[#0D1117] mb-8">
              Market signals for this product category
            </h2>
            
            <div className="bg-white border border-[#E2E2E2] rounded-md p-8">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Price Range */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-[#3DA9FC]" />
                    <h3 className="text-[16px] font-bold text-[#0D1117]">Price range (last 30 days)</h3>
                  </div>
                  {marketSignals.priceRange ? (
                    <div className="space-y-1">
                      <div className="text-[24px] font-bold text-[#0D1117]">
                        {marketSignals.priceRange.currency} {marketSignals.priceRange.min.toFixed(2)} - {marketSignals.priceRange.max.toFixed(2)}
                      </div>
                      <div className="text-[14px] text-[#7A7A7A]">per unit</div>
                    </div>
                  ) : (
                    <div className="text-[14px] text-[#7A7A7A]">No price data available</div>
                  )}
                </div>

                {/* Recent Demand */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileCheck className="h-5 w-5 text-[#3DA9FC]" />
                    <h3 className="text-[16px] font-bold text-[#0D1117]">Recent demand</h3>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[24px] font-bold text-[#0D1117]">
                      {marketSignals.rfqCount} RFQs
                    </div>
                    <div className="text-[14px] text-[#7A7A7A]">
                      {marketSignals.enquiryCount} product views
                    </div>
                  </div>
                </div>

                {/* Top Destinations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-[#3DA9FC]" />
                    <h3 className="text-[16px] font-bold text-[#0D1117]">Top destinations</h3>
                  </div>
                  {marketSignals.topDestinations.length > 0 ? (
                    <div className="space-y-1">
                      {marketSignals.topDestinations.map((country, i) => (
                        <div key={i} className="text-[14px] text-[#0D1117]">
                          {i + 1}. {country}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[14px] text-[#7A7A7A]">No destination data</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedRFQs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-[24px] font-bold text-[#0D1117] mb-6">
              RFQs related to this product
            </h2>
            
            <div className="bg-white border border-[#E2E2E2] rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F6F6F6] border-b border-[#E2E2E2]">
                  <tr>
                    <th className="text-left text-[12px] uppercase text-[#7A7A7A] font-bold px-6 py-4">Destination</th>
                    <th className="text-left text-[12px] uppercase text-[#7A7A7A] font-bold px-6 py-4">Quantity</th>
                    <th className="text-left text-[12px] uppercase text-[#7A7A7A] font-bold px-6 py-4">Origin</th>
                    <th className="text-left text-[12px] uppercase text-[#7A7A7A] font-bold px-6 py-4">Created</th>
                    <th className="text-right text-[12px] uppercase text-[#7A7A7A] font-bold px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedRFQs.map((rfq) => (
                    <tr key={rfq.id} className="border-b border-[#E2E2E2] last:border-0">
                      <td className="px-6 py-4 text-[14px] text-[#0D1117]">{rfq.buyer_country || 'N/A'}</td>
                      <td className="px-6 py-4 text-[14px] text-[#0D1117]">
                        {rfq.desired_quantity} {rfq.unit}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#0D1117]">{rfq.target_country || 'Any'}</td>
                      <td className="px-6 py-4 text-[14px] text-[#7A7A7A]">
                        {new Date(rfq.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/dashboard/rfqs`}
                          className="text-[14px] text-[#0D1117] font-medium hover:underline"
                        >
                          View RFQ
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isOwner && (
          <div id="rfq-section" className="mb-16">
            <div className="bg-white border border-[#E2E2E2] rounded-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-[#0D1117] rounded-md flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-[24px] font-bold text-[#0D1117]">Request a quote for this product</h2>
                  <p className="text-[14px] text-[#7A7A7A]">
                    Connect directly with {supplier.name} to negotiate pricing and terms
                  </p>
                </div>
              </div>
              
              <RFQForm 
                product={{
                  id: productWithCompany.id,
                  name: productWithCompany.product_name,
                  category: productWithCompany.category,
                  origin: productWithCompany.origin_country,
                  availableQuantity: productWithCompany.available_quantity,
                  unit: productWithCompany.unit,
                  priceRange: productWithCompany.price_per_unit ? formatPrice(productWithCompany.price_per_unit, ((productWithCompany.currency || 'EUR') as Currency)) : 'Contact for price',
                  customsStatus: productWithCompany.customs_status || 'Not specified',
                  certifications: productWithCompany.certifications || [],
                  supplier: supplier
                }}
              />
            </div>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-[24px] font-bold text-[#0D1117] mb-6">Related products</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProd) => {
                type RelatedProductWithCompany = typeof relProd & {
                  companies: { company_name: string; verification_status: string } | null
                }
                const relatedProduct = {
                  ...relProd,
                  companies: Array.isArray(relProd.companies) ? relProd.companies[0] : relProd.companies
                } as RelatedProductWithCompany
                
                return (
                  <Link 
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="bg-white border border-[#E2E2E2] rounded-md p-6 hover:border-[#0D1117] transition-colors"
                  >
                    <h3 className="text-[18px] font-bold text-[#0D1117] mb-2 line-clamp-2">
                      {relatedProduct.product_name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3 text-[14px] text-[#7A7A7A]">
                      <MapPin className="h-3 w-3" />
                      {relatedProduct.origin_country}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {relatedProduct.customs_status && (
                        <Badge variant="customs" className="text-[10px]">{relatedProduct.customs_status}</Badge>
                      )}
                      {relatedProduct.companies?.verification_status === 'verified' && (
                        <Badge variant="verified" className="text-[10px]">✓</Badge>
                      )}
                    </div>
                    
                    <div className="text-[14px] text-[#7A7A7A]">
                      {relatedProduct.companies?.company_name || 'Unknown Supplier'}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
