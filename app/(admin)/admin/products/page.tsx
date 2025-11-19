import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'
import { CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils/currency'

function getRiskCategory(riskScore: number | null): 'low' | 'medium' | 'high' | 'unknown' {
  if (riskScore === null) return 'unknown'
  if (riskScore < 40) return 'high'
  if (riskScore <= 70) return 'medium'
  return 'low'
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { 
    category?: string
    subcategory?: string
    customs_status?: string
    verification_status?: string
    risk?: string
    sort?: 'price_asc' | 'price_desc' | 'risk_asc' | 'risk_desc'
  }
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select(`
      id,
      product_name,
      category,
      origin_country,
      customs_status,
      price_per_unit,
      currency,
      company_id,
      companies (
        company_name,
        verification_status,
        risk_score
      )
    `)
    .eq('status', 'published')
  
  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('category', searchParams.category)
  }
  
  if (searchParams.customs_status && searchParams.customs_status !== 'all') {
    query = query.eq('customs_status', searchParams.customs_status)
  }
  
  const { data: productsRaw, error } = await query

  if (error) {
    console.error('[v0] Error fetching products:', error)
  }

  let products = productsRaw || []
  
  if (searchParams.verification_status && searchParams.verification_status !== 'all') {
    products = products.filter(p => 
      p.companies?.verification_status === searchParams.verification_status
    )
  }
  
  if (searchParams.risk && searchParams.risk !== 'all') {
    products = products.filter(p => 
      getRiskCategory(p.companies?.risk_score || null) === searchParams.risk
    )
  }

  if (searchParams.subcategory && searchParams.subcategory !== 'all') {
    products = products.filter(p => 
      p.product_name?.toLowerCase().includes(searchParams.subcategory?.toLowerCase() || '')
    )
  }
  
  if (searchParams.sort) {
    products = products.sort((a, b) => {
      switch (searchParams.sort) {
        case 'price_asc':
          return (a.price_per_unit || 0) - (b.price_per_unit || 0)
        case 'price_desc':
          return (b.price_per_unit || 0) - (a.price_per_unit || 0)
        case 'risk_asc':
          return (a.companies?.risk_score || 100) - (b.companies?.risk_score || 100)
        case 'risk_desc':
          return (b.companies?.risk_score || 0) - (a.companies?.risk_score || 0)
        default:
          return 0
      }
    })
  }

  // Get unique values for filters
  const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort()
  const uniqueCustomsStatus = Array.from(new Set(products.map(p => p.customs_status).filter(Boolean))).sort()
  
  // Get category label helper
  const getCategoryLabel = (categoryId: string | null) => {
    if (!categoryId) return '—'
    const category = PRODUCT_CATEGORIES.find(c => c.id === categoryId)
    return category?.label || categoryId
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          View and manage all published products
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Badge variant="default">{products.length}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Suppliers</CardTitle>
            <Badge variant="secondary">
              {products.filter(p => p.companies?.verification_status === 'verified').length}
            </Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EU Cleared</CardTitle>
            <Badge variant="outline">
              {products.filter(p => p.customs_status === 'eu_cleared').length}
            </Badge>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {uniqueCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={!searchParams.category || searchParams.category === 'all' ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/admin/products?category=all">All</Link>
                  </Button>
                  {uniqueCategories.slice(0, 4).map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={searchParams.category === cat ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href={`/admin/products?category=${cat}`}>
                        {getCategoryLabel(cat)}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {uniqueCustomsStatus.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Customs:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={!searchParams.customs_status || searchParams.customs_status === 'all' ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/admin/products?customs_status=all">All</Link>
                  </Button>
                  {uniqueCustomsStatus.map(status => (
                    <Button
                      key={status}
                      size="sm"
                      variant={searchParams.customs_status === status ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href={`/admin/products?customs_status=${status}`}>
                        {status?.replace('_', ' ')}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Verification:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!searchParams.verification_status || searchParams.verification_status === 'all' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?verification_status=all">All</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.verification_status === 'verified' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?verification_status=verified">Verified</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.verification_status === 'pending' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?verification_status=pending">Pending</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Risk:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!searchParams.risk || searchParams.risk === 'all' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?risk=all">All</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.risk === 'low' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?risk=low">Low</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.risk === 'medium' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?risk=medium">Medium</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.risk === 'high' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?risk=high">High</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={searchParams.sort === 'price_asc' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?sort=price_asc">Price ↑</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.sort === 'price_desc' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?sort=price_desc">Price ↓</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.sort === 'risk_asc' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?sort=risk_asc">Risk ↑</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.sort === 'risk_desc' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/products?sort=risk_desc">Risk ↓</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Origin</TableHead>
                      <TableHead>Customs</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const company = product.companies
                      const riskCategory = getRiskCategory(company?.risk_score || null)
                      
                      return (
                        <TableRow 
                          key={product.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => window.location.href = `/products/${product.id}`}
                        >
                          <TableCell className="font-medium max-w-[200px] truncate">
                            <Link href={`/products/${product.id}`} className="hover:underline">
                              {product.product_name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link 
                                href={`/admin/companies/${product.company_id}`}
                                className="hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {company?.company_name || '—'}
                              </Link>
                              {company?.verification_status === 'verified' && (
                                <Badge variant="verified" className="text-xs">
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{getCategoryLabel(product.category)}</span>
                          </TableCell>
                          <TableCell>{product.origin_country || '—'}</TableCell>
                          <TableCell>
                            {product.customs_status ? (
                              <Badge variant="customs" className="capitalize">
                                {product.customs_status.replace('_', ' ')}
                              </Badge>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {product.price_per_unit ? (
                              <span className="font-medium">
                                {formatPrice(product.price_per_unit, product.currency || 'EUR')}
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {company?.risk_score !== null ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{company.risk_score}</span>
                                <Badge 
                                  variant={
                                    riskCategory === 'low' ? 'risk-low' :
                                    riskCategory === 'medium' ? 'risk-medium' :
                                    riskCategory === 'high' ? 'risk-high' :
                                    'outline'
                                  }
                                  className="text-xs capitalize"
                                >
                                  {riskCategory}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link href={`/products/${product.id}`}>
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="lg:hidden space-y-3">
                {products.map((product) => {
                  const company = product.companies
                  const riskCategory = getRiskCategory(company?.risk_score || null)
                  
                  return (
                    <Card key={product.id} className="border border-[#E2E2E2]">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/products/${product.id}`}
                              className="font-semibold text-[#0D1117] hover:underline block"
                            >
                              {product.product_name}
                            </Link>
                            <Link 
                              href={`/admin/companies/${product.company_id}`}
                              className="text-sm text-[#7A7A7A] hover:underline flex items-center gap-1 mt-0.5"
                            >
                              {company?.company_name || '—'}
                              {company?.verification_status === 'verified' && (
                                <Badge variant="verified" className="text-xs ml-1">✓</Badge>
                              )}
                            </Link>
                          </div>
                          {product.customs_status && (
                            <Badge variant="customs" className="capitalize text-xs flex-shrink-0">
                              {product.customs_status.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Category</p>
                            <p className="text-[#0D1117]">{getCategoryLabel(product.category)}</p>
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Origin</p>
                            <p className="text-[#0D1117]">{product.origin_country || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Price</p>
                            {product.price_per_unit ? (
                              <p className="font-medium text-[#0D1117]">
                                {formatPrice(product.price_per_unit, product.currency || 'EUR')}
                              </p>
                            ) : (
                              <span className="text-[#7A7A7A]">—</span>
                            )}
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Risk Score</p>
                            {company?.risk_score !== null ? (
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#0D1117]">{company.risk_score}</span>
                                <Badge 
                                  variant={
                                    riskCategory === 'low' ? 'risk-low' :
                                    riskCategory === 'medium' ? 'risk-medium' :
                                    riskCategory === 'high' ? 'risk-high' :
                                    'outline'
                                  }
                                  className="text-xs capitalize"
                                >
                                  {riskCategory}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-[#7A7A7A]">—</span>
                            )}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          asChild
                        >
                          <Link href={`/products/${product.id}`}>
                            View Product
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No products found matching the selected filters
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
