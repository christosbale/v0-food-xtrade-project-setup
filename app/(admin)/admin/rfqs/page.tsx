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

export default async function AdminRFQsPage({
  searchParams,
}: {
  searchParams: { 
    category?: string
    subcategory?: string
    country?: string
    status?: string
  }
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('rfqs')
    .select('*')
  
  // Apply filters from query params
  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('target_category', searchParams.category)
  }
  
  if (searchParams.subcategory && searchParams.subcategory !== 'all') {
    query = query.eq('target_subcategory', searchParams.subcategory)
  }
  
  if (searchParams.country && searchParams.country !== 'all') {
    query = query.eq('buyer_country', searchParams.country)
  }
  
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }
  
  const { data: rfqs, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching RFQs:', error)
  }

  const allRfqs = rfqs || []
  
  // Get unique values for filters
  const uniqueCountries = Array.from(new Set(allRfqs.map(r => r.buyer_country).filter(Boolean))).sort()
  const uniqueCategories = Array.from(new Set(allRfqs.map(r => r.target_category).filter(Boolean))).sort()
  
  const openCount = allRfqs.filter(r => r.status === 'open' || !r.status).length
  const closedCount = allRfqs.filter(r => r.status === 'closed').length

  // Get category label
  const getCategoryLabel = (categoryId: string | null) => {
    if (!categoryId) return '—'
    const category = PRODUCT_CATEGORIES.find(c => c.id === categoryId)
    return category?.label || categoryId
  }

  // Get subcategory label
  const getSubcategoryLabel = (categoryId: string | null, subcategoryId: string | null) => {
    if (!categoryId || !subcategoryId) return '—'
    const category = PRODUCT_CATEGORIES.find(c => c.id === categoryId)
    const subcategory = category?.subcategories.find(s => s.id === subcategoryId)
    return subcategory?.label || subcategoryId
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">RFQs</h2>
        <p className="text-muted-foreground">
          View and manage all request for quotes
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
            <Badge variant="default">{allRfqs.length}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <Badge variant="secondary">{openCount}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <Badge variant="outline">{closedCount}</Badge>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={!searchParams.status || searchParams.status === 'all' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/rfqs?status=all">All</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.status === 'open' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/rfqs?status=open">Open</Link>
                </Button>
                <Button
                  size="sm"
                  variant={searchParams.status === 'closed' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/admin/rfqs?status=closed">Closed</Link>
                </Button>
              </div>
            </div>

            {uniqueCategories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Category:</span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={!searchParams.category || searchParams.category === 'all' ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/admin/rfqs?category=all">All</Link>
                  </Button>
                  {uniqueCategories.slice(0, 4).map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={searchParams.category === cat ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href={`/admin/rfqs?category=${cat}`}>
                        {getCategoryLabel(cat)}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {uniqueCountries.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Country:</span>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={!searchParams.country || searchParams.country === 'all' ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href="/admin/rfqs?country=all">All</Link>
                  </Button>
                  {uniqueCountries.slice(0, 4).map(country => (
                    <Button
                      key={country}
                      size="sm"
                      variant={searchParams.country === country ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href={`/admin/rfqs?country=${country}`}>
                        {country}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All RFQs</CardTitle>
          <CardDescription>
            {allRfqs.length} {allRfqs.length === 1 ? 'RFQ' : 'RFQs'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allRfqs.length > 0 ? (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category / Subcategory</TableHead>
                      <TableHead>Buyer Country</TableHead>
                      <TableHead>MOQ</TableHead>
                      <TableHead>Customs Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allRfqs.map((rfq) => {
                      const displayTitle = rfq.message?.substring(0, 50) || rfq.target_subcategory || `RFQ #${rfq.id.substring(0, 8)}`
                      
                      return (
                        <TableRow 
                          key={rfq.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => window.location.href = `/dashboard/rfqs`}
                        >
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {displayTitle}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm">{getCategoryLabel(rfq.target_category)}</span>
                              {rfq.target_subcategory && (
                                <span className="text-xs text-muted-foreground">
                                  {getSubcategoryLabel(rfq.target_category, rfq.target_subcategory)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{rfq.buyer_country || '—'}</TableCell>
                          <TableCell>
                            {rfq.target_moq ? (
                              <span>{rfq.target_moq} {rfq.target_moq_unit || ''}</span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {rfq.target_customs_status ? (
                              <Badge 
                                variant="customs"
                                className="capitalize"
                              >
                                {rfq.target_customs_status}
                              </Badge>
                            ) : '—'}
                          </TableCell>
                          <TableCell>
                            {new Date(rfq.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                rfq.status === 'closed' ? 'outline' : 'default'
                              }
                              className="capitalize"
                            >
                              {rfq.status || 'open'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                            >
                              <Link href="/dashboard/rfqs">
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
                {allRfqs.map((rfq) => {
                  const displayTitle = rfq.message?.substring(0, 50) || rfq.target_subcategory || `RFQ #${rfq.id.substring(0, 8)}`
                  
                  return (
                    <Card key={rfq.id} className="border border-[#E2E2E2]">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#0D1117]">{displayTitle}</p>
                            <div className="flex flex-col gap-1 mt-1">
                              <p className="text-sm text-[#7A7A7A]">{getCategoryLabel(rfq.target_category)}</p>
                              {rfq.target_subcategory && (
                                <p className="text-xs text-[#7A7A7A]">
                                  {getSubcategoryLabel(rfq.target_category, rfq.target_subcategory)}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={rfq.status === 'closed' ? 'outline' : 'default'}
                            className="capitalize flex-shrink-0"
                          >
                            {rfq.status || 'open'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Country</p>
                            <p className="text-[#0D1117]">{rfq.buyer_country || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">MOQ</p>
                            {rfq.target_moq ? (
                              <p className="text-[#0D1117]">{rfq.target_moq} {rfq.target_moq_unit || ''}</p>
                            ) : (
                              <span className="text-[#7A7A7A]">—</span>
                            )}
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Customs</p>
                            {rfq.target_customs_status ? (
                              <Badge variant="customs" className="capitalize text-xs">
                                {rfq.target_customs_status}
                              </Badge>
                            ) : (
                              <span className="text-[#7A7A7A]">—</span>
                            )}
                          </div>
                          <div>
                            <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Created</p>
                            <p className="text-[#0D1117] text-sm">
                              {new Date(rfq.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          asChild
                        >
                          <Link href="/dashboard/rfqs">
                            View Details
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
              No RFQs found matching the selected filters
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
