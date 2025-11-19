'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, PackageOpen, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { Product } from '@/lib/types/database'
import { useState, useEffect } from 'react'
import { getCurrentCompanyClient } from '@/lib/auth/current-company-client'
import { createClient } from '@/lib/supabase/client'
import { EditProductDrawer } from '@/components/dashboard/edit-product-drawer'
import { DeleteProductDialog } from '@/components/dashboard/delete-product-dialog'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        const session = await getCurrentCompanyClient()
        
        if (!session || !session.company) {
          setError('no_company')
          setIsLoading(false)
          return
        }

        setCompanyId(session.company.id)

        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('company_id', session.company.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setProducts(data || [])
        setFilteredProducts(data || [])
        setIsLoading(false)
      } catch (err) {
        console.error('[v0] Error loading products:', err)
        setError(err instanceof Error ? err.message : 'Could not load products')
        setIsLoading(false)
      }
    }

    loadProducts()
  }, []) // Fixed infinite loop - removed router from dependency array

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = products.filter(
      (p) =>
        p.product_name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.origin_country.toLowerCase().includes(query)
    )
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  const refreshProducts = async () => {
    if (!companyId) return

    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (err) {
      console.error('[v0] Error refreshing products:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground mt-4">Loading products...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error === 'no_company') {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Company Profile Not Found</AlertTitle>
          <AlertDescription>
            Your company profile hasn't been set up yet. Please contact support or complete your registration.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button asChild className="bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            View and manage your listed products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {error && error !== 'no_company' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <PackageOpen className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Could not load products</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please try again later.
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Error: {error}
              </p>
            </div>
          )}

          {!error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <PackageOpen className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Add your first bulk product to get started.'}
              </p>
              {!searchQuery && (
                <Button asChild className="bg-[#0D1117] text-white hover:bg-[#1a1f2b]">
                  <Link href="/dashboard/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </Button>
              )}
            </div>
          )}

          {!error && filteredProducts.length > 0 && (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <PackageOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{product.product_name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Origin: {product.origin_country}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Available: {product.available_quantity} {product.unit}
                      </span>
                      <Badge
                        variant={product.status === 'published' ? 'default' : 'secondary'}
                      >
                        {product.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingProduct(product)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingProduct && (
        <EditProductDrawer
          product={editingProduct}
          companyId={companyId!}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => {
            setEditingProduct(null)
            refreshProducts()
          }}
        />
      )}

      {deletingProduct && (
        <DeleteProductDialog
          product={deletingProduct}
          companyId={companyId!}
          onClose={() => setDeletingProduct(null)}
          onSuccess={() => {
            setDeletingProduct(null)
            refreshProducts()
          }}
        />
      )}
    </div>
  )
}
