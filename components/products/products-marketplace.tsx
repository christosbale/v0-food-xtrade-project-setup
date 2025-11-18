"use client"

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
import { Search, Filter, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { formatPrice, type Currency } from '@/lib/utils/currency'

const CATEGORIES = ['Nuts', 'Coffee', 'Cocoa', 'Dried Fruits', 'Spices', 'Grains', 'Seeds', 'Oils', 'Other']
const CUSTOMS_STATUS = ['EU customs cleared', 'US customs cleared', 'Bonded warehouse', 'Origin country only']
const CERTIFICATIONS = ['Organic', 'HACCP', 'ISO', 'Fairtrade', 'Rainforest Alliance']

interface Product {
  id: string
  product_name: string
  category: string
  origin_country: string
  available_quantity: number
  unit: string
  price_per_unit: number
  currency?: string
  incoterm: string
  customs_status: string
  crop_year: string | null
  packaging: string | null
  certifications: string[]
  created_at: string
  company?: {
    id: string
    company_name: string
    verification_status: string
  }
}

interface ProductsMarketplaceProps {
  products: Product[]
}

export function ProductsMarketplace({ products }: ProductsMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedOrigin, setSelectedOrigin] = useState<string | undefined>(undefined)
  const [selectedCustomsStatus, setSelectedCustomsStatus] = useState<string[]>([])
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const itemsPerPage = 6

  // Get unique origins from products
  const uniqueOrigins = useMemo(() => {
    const origins = new Set(products.map(p => p.origin_country))
    return Array.from(origins).sort()
  }, [products])

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || product.category === selectedCategory
      const matchesOrigin = !selectedOrigin || product.origin_country === selectedOrigin
      const matchesCustoms =
        selectedCustomsStatus.length === 0 ||
        selectedCustomsStatus.includes(product.customs_status)
      const matchesCertifications =
        selectedCertifications.length === 0 ||
        selectedCertifications.every((cert) => product.certifications?.includes(cert))
      const matchesMinPrice = !minPrice || product.price_per_unit >= parseFloat(minPrice)
      const matchesMaxPrice = !maxPrice || product.price_per_unit <= parseFloat(maxPrice)

      return (
        matchesSearch &&
        matchesCategory &&
        matchesOrigin &&
        matchesCustoms &&
        matchesCertifications &&
        matchesMinPrice &&
        matchesMaxPrice
      )
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price_per_unit - b.price_per_unit
        case 'price-high':
          return b.price_per_unit - a.price_per_unit
        case 'quantity':
          return b.available_quantity - a.available_quantity
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })
  }, [products, searchQuery, selectedCategory, selectedOrigin, selectedCustomsStatus, selectedCertifications, minPrice, maxPrice, sortBy])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleCustomsStatus = (status: string) => {
    setSelectedCustomsStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const toggleCertification = (cert: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    )
  }

  const FiltersPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value === 'all' ? undefined : value)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Origin */}
      <div className="space-y-2">
        <Label htmlFor="origin">Origin Country</Label>
        <Select value={selectedOrigin} onValueChange={(value) => setSelectedOrigin(value === 'all' ? undefined : value)}>
          <SelectTrigger id="origin">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {uniqueOrigins.map((origin) => (
              <SelectItem key={origin} value={origin}>
                {origin}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Customs Status */}
      <div className="space-y-3">
        <Label>Customs Status</Label>
        {CUSTOMS_STATUS.map((status) => (
          <div key={status} className="flex items-center space-x-2">
            <Checkbox
              id={`customs-${status}`}
              checked={selectedCustomsStatus.includes(status)}
              onCheckedChange={() => toggleCustomsStatus(status)}
            />
            <label
              htmlFor={`customs-${status}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {status}
            </label>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="space-y-3">
        <Label>Certifications</Label>
        {CERTIFICATIONS.map((cert) => (
          <div key={cert} className="flex items-center space-x-2">
            <Checkbox
              id={`cert-${cert}`}
              checked={selectedCertifications.includes(cert)}
              onCheckedChange={() => toggleCertification(cert)}
            />
            <label
              htmlFor={`cert-${cert}`}
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {cert}
            </label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Price Range (per unit)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            placeholder="Max"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {showMobileFilters && (
            <Card className="mt-4 p-4">
              <FiltersPanel />
            </Card>
          )}
        </div>

        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <Card className="p-4 sticky top-4">
            <FiltersPanel />
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm whitespace-nowrap">
                Sort by:
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="price-low">Price: low to high</SelectItem>
                  <SelectItem value="price-high">Price: high to low</SelectItem>
                  <SelectItem value="quantity">Available quantity: high to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Cards */}
          {paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <div className="relative h-48 bg-muted flex items-center justify-center">
                        <img
                          src="/placeholder.svg?height=200&width=400"
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
                          {product.incoterm}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{product.product_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {product.category} · Origin: {product.origin_country}
                          </p>
                          {product.company && (
                            <Link 
                              href={`/companies/${product.company.id}`}
                              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
                            >
                              <span>by {product.company.company_name}</span>
                              {product.company.verification_status === 'verified' && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#9FE870]" />
                              )}
                            </Link>
                          )}
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
                            {formatPrice(product.price_per_unit, (product.currency || 'EUR') as Currency)} / {product.unit}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <Badge variant="outline" className="text-xs">
                            {product.customs_status}
                          </Badge>
                          {product.certifications && product.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {product.certifications.map((cert) => (
                                <Badge key={cert} variant="secondary" className="text-xs">
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
                      <RequestQuoteModal product={{
                        id: product.id,
                        name: product.product_name,
                        unit: product.unit,
                        origin: product.origin_country,
                        supplier: {
                          name: product.company?.company_name || 'Supplier',
                          id: product.company?.id,
                        },
                      }}>
                        <Button className="flex-1 bg-[#9FE870] hover:bg-[#8DD760] text-black">Request Quote</Button>
                      </RequestQuoteModal>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            // Empty State
            <Card className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(undefined)
                  setSelectedOrigin(undefined)
                  setSelectedCustomsStatus([])
                  setSelectedCertifications([])
                  setMinPrice('')
                  setMaxPrice('')
                }}
              >
                Clear all filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
