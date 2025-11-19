"use client"

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RequestQuoteModal } from '@/components/products/request-quote-modal'
import { Search, X, TrendingUp, Package, DollarSign, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'

interface Product {
  id: string
  product_name: string
  category: string
  product_type?: string
  origin_country: string
  available_quantity: number
  unit: string
  price_per_unit: number
  currency?: string
  incoterm: string
  customs_status: string
  packaging: string | null
  certifications: string[]
  created_at: string
  min_order_quantity?: number
  min_order_unit?: string
  warehouse_country?: string
  company?: {
    id: string
    company_name: string
    country: string
    verification_status: string
    risk_score: number
  }
}

interface ProductsMarketplaceProps {
  products: Product[]
}

export function ProductsMarketplace({ products }: ProductsMarketplaceProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined)
  const [selectedOrigin, setSelectedOrigin] = useState<string | undefined>(undefined)
  const [selectedCustomsStatus, setSelectedCustomsStatus] = useState<string[]>([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [lowRiskOnly, setLowRiskOnly] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minMOQ, setMinMOQ] = useState('')
  const [maxMOQ, setMaxMOQ] = useState('')
  const [sortBy, setSortBy] = useState('relevance')

  const uniqueOrigins = useMemo(() => {
    const origins = new Set(products.map(p => p.origin_country))
    return Array.from(origins).sort()
  }, [products])

  const availableCategories = useMemo(() => {
    return PRODUCT_CATEGORIES.filter(cat => 
      products.some(p => p.category === cat.id)
    )
  }, [products])

  const availableSubcategories = useMemo(() => {
    if (!selectedCategory) return []
    const category = PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)
    return category?.subcategories || []
  }, [selectedCategory])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = !searchQuery || 
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.company?.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin_country.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesSubcategory = !selectedSubcategory || product.product_type === selectedSubcategory
      const matchesOrigin = !selectedOrigin || product.origin_country === selectedOrigin
      const matchesCustoms = selectedCustomsStatus.length === 0 || 
        selectedCustomsStatus.includes(product.customs_status)
      const matchesVerified = !verifiedOnly || product.company?.verification_status === 'verified'
      const matchesRisk = !lowRiskOnly || (product.company?.risk_score && product.company.risk_score <= 3)
      
      const matchesMinPrice = !minPrice || product.price_per_unit >= parseFloat(minPrice)
      const matchesMaxPrice = !maxPrice || product.price_per_unit <= parseFloat(maxPrice)
      const matchesMinMOQ = !minMOQ || (product.min_order_quantity && product.min_order_quantity >= parseFloat(minMOQ))
      const matchesMaxMOQ = !maxMOQ || (product.min_order_quantity && product.min_order_quantity <= parseFloat(maxMOQ))

      return matchesSearch && matchesCategory && matchesSubcategory && matchesOrigin && 
             matchesCustoms && matchesVerified && matchesRisk && 
             matchesMinPrice && matchesMaxPrice && matchesMinMOQ && matchesMaxMOQ
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_per_unit - b.price_per_unit
        case 'price-high':
          return b.price_per_unit - a.price_per_unit
        case 'most-recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'most-viewed':
          return 0 // Placeholder for view tracking
        default: // relevance
          return 0
      }
    })
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedOrigin, 
      selectedCustomsStatus, verifiedOnly, lowRiskOnly, minPrice, maxPrice, minMOQ, maxMOQ, sortBy])

  const activeFilters = useMemo(() => {
    const filters: { key: string; label: string; onClear: () => void }[] = []
    
    if (searchQuery) {
      filters.push({ key: 'search', label: `Search: ${searchQuery}`, onClear: () => setSearchQuery('') })
    }
    if (selectedCategory) {
      const cat = PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)
      filters.push({ 
        key: 'category', 
        label: cat?.label || selectedCategory, 
        onClear: () => { setSelectedCategory(undefined); setSelectedSubcategory(undefined) }
      })
    }
    if (selectedSubcategory) {
      const cat = PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)
      const subcat = cat?.subcategories.find(s => s.id === selectedSubcategory)
      filters.push({ 
        key: 'subcategory', 
        label: subcat?.label || selectedSubcategory, 
        onClear: () => setSelectedSubcategory(undefined)
      })
    }
    if (selectedOrigin) {
      filters.push({ key: 'origin', label: `Origin: ${selectedOrigin}`, onClear: () => setSelectedOrigin(undefined) })
    }
    selectedCustomsStatus.forEach(status => {
      filters.push({
        key: `customs-${status}`,
        label: `Customs: ${status.replace('_', ' ')}`,
        onClear: () => setSelectedCustomsStatus(prev => prev.filter(s => s !== status))
      })
    })
    if (verifiedOnly) {
      filters.push({ key: 'verified', label: 'Verified only', onClear: () => setVerifiedOnly(false) })
    }
    if (lowRiskOnly) {
      filters.push({ key: 'lowrisk', label: 'Low risk only', onClear: () => setLowRiskOnly(false) })
    }
    
    return filters
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedOrigin, selectedCustomsStatus, verifiedOnly, lowRiskOnly])

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategory(undefined)
    setSelectedSubcategory(undefined)
    setSelectedOrigin(undefined)
    setSelectedCustomsStatus([])
    setVerifiedOnly(false)
    setLowRiskOnly(false)
    setMinPrice('')
    setMaxPrice('')
    setMinMOQ('')
    setMaxMOQ('')
  }

  const getCustomsBadgeLabel = (status: string) => {
    const labels: Record<string, string> = {
      'eu_cleared': 'EU-CLEARED',
      'non_eu': 'NON-EU',
      'bonded': 'BONDED',
      'free_zone': 'FREE ZONE',
      'local_only': 'LOCAL',
    }
    return labels[status] || status.toUpperCase()
  }

  const getRiskBadge = (riskScore?: number) => {
    if (!riskScore) return null
    if (riskScore <= 3) return <Badge variant="risk-low">LOW RISK</Badge>
    if (riskScore <= 6) return <Badge variant="risk-medium">MEDIUM RISK</Badge>
    return <Badge variant="risk-high">HIGH RISK</Badge>
  }

  return (
    <div className="bg-white">
      <div className="border-b border-[#E2E2E2]">
        <div className="container-boxed py-16">
          <h1 className="text-[32px] font-bold text-[#0D1117] mb-3 tracking-tight">
            Marketplace
          </h1>
          <p className="text-[16px] text-[#7A7A7A] max-w-3xl">
            Browse verified bulk products across food ingredients and fresh produce.
          </p>
        </div>
      </div>

      <div className="bg-[#F6F6F6] border-b border-[#E2E2E2]">
        <div className="container-boxed py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A7A7A]" />
              <Input
                placeholder="Search by product, origin or supplier…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#E2E2E2] h-11 text-[14px]"
              />
            </div>

            {/* Sorting */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white border-[#E2E2E2] h-11 text-[14px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: low to high</SelectItem>
                <SelectItem value="price-high">Price: high to low</SelectItem>
                <SelectItem value="most-recent">Most recent</SelectItem>
                <SelectItem value="most-viewed">Most viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 && (
        <div className="bg-[#F6F6F6] border-b border-[#E2E2E2]">
          <div className="container-boxed py-8">
            <Card className="border-[#E2E2E2] bg-white p-6">
              <h3 className="text-[16px] font-bold text-[#0D1117] mb-4 tracking-tight">
                Market signals for your filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px]">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-[#3DA9FC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#0D1117] mb-1">Top origins in demand</p>
                    <p className="text-[#7A7A7A]">{uniqueOrigins.slice(0, 3).join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-[#3DA9FC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#0D1117] mb-1">Average price range</p>
                    <p className="text-[#7A7A7A]">
                      €{Math.min(...filteredProducts.map(p => p.price_per_unit)).toFixed(2)} - 
                      €{Math.max(...filteredProducts.map(p => p.price_per_unit)).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-[#3DA9FC] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#0D1117] mb-1">Products available</p>
                    <p className="text-[#7A7A7A]">{filteredProducts.length} listings</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeFilters.length > 0 && (
        <div className="border-b border-[#E2E2E2]">
          <div className="container-boxed py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[14px] text-[#7A7A7A]">Active filters:</span>
              {activeFilters.map(filter => (
                <button
                  key={filter.key}
                  onClick={filter.onClear}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[#F6F6F6] text-[#0D1117] text-[13px] font-medium rounded-md hover:bg-[#E2E2E2] transition-colors"
                >
                  {filter.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-[13px] text-[#7A7A7A] hover:text-[#0D1117] underline ml-2"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container-boxed py-12">
        <div className="flex gap-8">
          <aside className="w-80 flex-shrink-0">
            <Card className="border-[#E2E2E2] p-6 sticky top-24">
              <h3 className="text-[14px] font-bold text-[#0D1117] mb-6 uppercase tracking-wider">
                Filters
              </h3>
              
              <div className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-[#0D1117] uppercase">Category</Label>
                  <Select value={selectedCategory || 'all'} onValueChange={(v) => {
                    setSelectedCategory(v === 'all' ? undefined : v)
                    setSelectedSubcategory(undefined)
                  }}>
                    <SelectTrigger className="border-[#E2E2E2] text-[14px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {availableCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subcategory */}
                {selectedCategory && availableSubcategories.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-[13px] font-bold text-[#0D1117] uppercase">Subcategory</Label>
                    <Select value={selectedSubcategory || 'all'} onValueChange={(v) => 
                      setSelectedSubcategory(v === 'all' ? undefined : v)
                    }>
                      <SelectTrigger className="border-[#E2E2E2] text-[14px]">
                        <SelectValue placeholder="All subcategories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All subcategories</SelectItem>
                        {availableSubcategories.map(sub => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Origin country */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-[#0D1117] uppercase">Origin Country</Label>
                  <Select value={selectedOrigin || 'all'} onValueChange={(v) => 
                    setSelectedOrigin(v === 'all' ? undefined : v)
                  }>
                    <SelectTrigger className="border-[#E2E2E2] text-[14px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All countries</SelectItem>
                      {uniqueOrigins.map(origin => (
                        <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customs Status */}
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold text-[#0D1117] uppercase">Customs Status</Label>
                  {['eu_cleared', 'non_eu', 'bonded', 'free_zone'].map(status => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox
                        id={`customs-${status}`}
                        checked={selectedCustomsStatus.includes(status)}
                        onCheckedChange={() => {
                          setSelectedCustomsStatus(prev =>
                            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                          )
                        }}
                      />
                      <label htmlFor={`customs-${status}`} className="text-[14px] text-[#0D1117] cursor-pointer flex-1">
                        <Badge variant="customs" className="text-[11px]">
                          {getCustomsBadgeLabel(status)}
                        </Badge>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-[#0D1117] uppercase">Price Range (€/unit)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="border-[#E2E2E2] text-[14px]"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="border-[#E2E2E2] text-[14px]"
                    />
                  </div>
                </div>

                {/* MOQ Range */}
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-[#0D1117] uppercase">MOQ Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minMOQ}
                      onChange={(e) => setMinMOQ(e.target.value)}
                      className="border-[#E2E2E2] text-[14px]"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxMOQ}
                      onChange={(e) => setMaxMOQ(e.target.value)}
                      className="border-[#E2E2E2] text-[14px]"
                    />
                  </div>
                </div>

                {/* Verification & Risk */}
                <div className="space-y-3 pt-3 border-t border-[#E2E2E2]">
                  <Label className="text-[13px] font-bold text-[#0D1117] uppercase">Supplier Quality</Label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="verified-only"
                      checked={verifiedOnly}
                      onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                    />
                    <label htmlFor="verified-only" className="text-[14px] text-[#0D1117] cursor-pointer">
                      Verified companies only
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="lowrisk-only"
                      checked={lowRiskOnly}
                      onCheckedChange={(checked) => setLowRiskOnly(checked as boolean)}
                    />
                    <label htmlFor="lowrisk-only" className="text-[14px] text-[#0D1117] cursor-pointer">
                      Low risk suppliers
                    </label>
                  </div>
                </div>

                {/* Clear/Apply buttons */}
                <div className="pt-4 border-t border-[#E2E2E2] space-y-2">
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="w-full border-[#0D1117] text-[#0D1117] font-bold text-[14px]"
                  >
                    Clear filters
                  </Button>
                </div>
              </div>
            </Card>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[14px] text-[#7A7A7A]">
                Showing <span className="text-[#0D1117] font-bold">{filteredProducts.length}</span> products
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="border-[#E2E2E2] overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6 space-y-4">
                      {/* Title + Category */}
                      <div>
                        <h3 className="text-[18px] font-bold text-[#0D1117] mb-1 leading-tight">
                          {product.product_name}
                        </h3>
                        <p className="text-[13px] text-[#7A7A7A]">
                          {PRODUCT_CATEGORIES.find(c => c.id === product.category)?.label || product.category}
                        </p>
                      </div>

                      {/* Origin + Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] text-[#7A7A7A]">Origin: {product.origin_country}</span>
                        {product.customs_status && (
                          <Badge variant="customs" className="text-[11px]">
                            {getCustomsBadgeLabel(product.customs_status)}
                          </Badge>
                        )}
                        {product.company?.verification_status === 'verified' && (
                          <Badge variant="verified" className="text-[11px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            VERIFIED
                          </Badge>
                        )}
                      </div>

                      {/* Key specs */}
                      <div className="space-y-2 text-[14px]">
                        {product.min_order_quantity && product.min_order_unit && (
                          <div className="flex justify-between">
                            <span className="text-[#7A7A7A]">MOQ:</span>
                            <span className="text-[#0D1117] font-medium">
                              {product.min_order_quantity} {product.min_order_unit}
                            </span>
                          </div>
                        )}
                        {product.packaging && (
                          <div className="flex justify-between">
                            <span className="text-[#7A7A7A]">Packaging:</span>
                            <span className="text-[#0D1117] font-medium">{product.packaging}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[#7A7A7A]">Incoterms:</span>
                          <span className="text-[#0D1117] font-medium">{product.incoterm}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="pt-3 border-t border-[#E2E2E2]">
                        <p className="text-[20px] font-bold text-[#0D1117]">
                          €{product.price_per_unit.toFixed(2)} <span className="text-[14px] font-normal text-[#7A7A7A]">/ {product.unit}</span>
                        </p>
                      </div>

                      {/* Supplier info */}
                      {product.company && (
                        <div className="pt-3 border-t border-[#E2E2E2] space-y-2">
                          <Link
                            href={`/companies/${product.company.id}`}
                            className="text-[14px] font-medium text-[#0D1117] hover:text-[#3DA9FC] transition-colors block"
                          >
                            {product.company.company_name}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] text-[#7A7A7A]">{product.company.country}</span>
                            {getRiskBadge(product.company.risk_score)}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-4 flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1 border-[#0D1117] text-[#0D1117] font-bold text-[14px]"
                        >
                          <Link href={`/products/${product.id}`}>View details</Link>
                        </Button>
                        <RequestQuoteModal
                          product={{
                            id: product.id,
                            name: product.product_name,
                            unit: product.unit,
                            origin: product.origin_country,
                            supplier: {
                              name: product.company?.company_name || 'Supplier',
                              id: product.company?.id,
                            },
                          }}
                        >
                          <Button className="flex-1 bg-[#0D1117] text-white font-bold text-[14px]">
                            Start RFQ
                          </Button>
                        </RequestQuoteModal>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-[#E2E2E2] p-12 text-center">
                <div className="w-16 h-16 bg-[#F6F6F6] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-[#7A7A7A]" />
                </div>
                <h3 className="text-[20px] font-bold text-[#0D1117] mb-2">No products found</h3>
                <p className="text-[14px] text-[#7A7A7A] mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="border-[#0D1117] text-[#0D1117] font-bold"
                >
                  Clear all filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
