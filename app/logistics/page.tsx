'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Package, TruckIcon, Ship, Thermometer } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import {
  CONTAINER_TYPES,
  calculateLoad,
  calculateContainerFill,
  recommendFreightMode,
  getContainerSpecs,
} from '@/lib/utils/container-calculations'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

interface Product {
  id: string
  product_name: string
  carton_weight: number | null
  cartons_per_pallet: number | null
  pallet_type: string | null
  category: string
}

export default function LogisticsPage() {
  const searchParams = useSearchParams()
  const productIdFromUrl = searchParams.get('product_id')

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [cartonWeight, setCartonWeight] = useState<string>('')
  const [cartonsPerPallet, setCartonsPerPallet] = useState<string>('')
  const [numPallets, setNumPallets] = useState<string>('')
  const [containerType, setContainerType] = useState<string>('40ft')
  const [fullContainer, setFullContainer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from('products')
        .select('id, product_name, carton_weight, cartons_per_pallet, pallet_type, category')
        .eq('status', 'published')
        .order('product_name')

      if (!error && data) {
        setProducts(data)
        
        if (productIdFromUrl) {
          const urlProduct = data.find((p) => p.id === productIdFromUrl)
          if (urlProduct) {
            setSelectedProductId(urlProduct.id)
            setCartonWeight(urlProduct.carton_weight?.toString() || '')
            setCartonsPerPallet(urlProduct.cartons_per_pallet?.toString() || '')
          }
        }
      }
      setLoading(false)
    }

    fetchProducts()
  }, [productIdFromUrl])

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find((p) => p.id === selectedProductId)
      if (product) {
        setCartonWeight(product.carton_weight?.toString() || '')
        setCartonsPerPallet(product.cartons_per_pallet?.toString() || '')
      }
    }
  }, [selectedProductId, products])

  useEffect(() => {
    if (fullContainer) {
      const specs = getContainerSpecs(containerType)
      if (specs) {
        setNumPallets(specs.maxPallets.toString())
      }
    }
  }, [fullContainer, containerType])

  const cartonWeightNum = parseFloat(cartonWeight) || 0
  const cartonsPerPalletNum = parseFloat(cartonsPerPallet) || 0
  const numPalletsNum = parseFloat(numPallets) || 0

  const { totalCartons, totalWeight } = calculateLoad(
    cartonWeightNum,
    cartonsPerPalletNum,
    numPalletsNum
  )

  const containerFill = calculateContainerFill(numPalletsNum, containerType)

  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const isPerishable = selectedProduct?.category === 'fresh-produce'

  const freightMode = recommendFreightMode(totalWeight, containerType, isPerishable)

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-display-large font-bold text-black mb-4">
            Logistics Optimizer
          </h1>
          <p className="text-title-large text-black/60 max-w-2xl mx-auto">
            Calculate pallets, container capacity and total load weight.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Card */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-headline-medium font-bold text-black">
                Load Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Selector */}
              <div className="space-y-2">
                <Label htmlFor="product" className="text-body-large font-medium text-black">
                  Select Product
                </Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product" className="border-2">
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>
                        Loading products...
                      </SelectItem>
                    ) : products.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No products available
                      </SelectItem>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.product_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Carton Weight */}
              <div className="space-y-2">
                <Label htmlFor="carton-weight" className="text-body-large font-medium text-black">
                  Carton Weight (kg)
                </Label>
                <Input
                  id="carton-weight"
                  type="number"
                  step="0.01"
                  value={cartonWeight}
                  onChange={(e) => setCartonWeight(e.target.value)}
                  placeholder="e.g., 10.5"
                  className="border-2"
                />
              </div>

              {/* Cartons per Pallet */}
              <div className="space-y-2">
                <Label htmlFor="cartons-per-pallet" className="text-body-large font-medium text-black">
                  Cartons per Pallet
                </Label>
                <Input
                  id="cartons-per-pallet"
                  type="number"
                  step="1"
                  value={cartonsPerPallet}
                  onChange={(e) => setCartonsPerPallet(e.target.value)}
                  placeholder="e.g., 80"
                  className="border-2"
                />
              </div>

              {/* Container Type */}
              <div className="space-y-2">
                <Label htmlFor="container-type" className="text-body-large font-medium text-black">
                  Container Type
                </Label>
                <Select value={containerType} onValueChange={setContainerType}>
                  <SelectTrigger id="container-type" className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTAINER_TYPES.map((type) => (
                      <SelectItem key={type.type} value={type.type}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Full Container Checkbox */}
              <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg border-2 border-border">
                <Checkbox
                  id="full-container"
                  checked={fullContainer}
                  onCheckedChange={(checked) => setFullContainer(checked as boolean)}
                />
                <Label
                  htmlFor="full-container"
                  className="text-body-large font-medium text-black cursor-pointer"
                >
                  Full Container Load (auto-fill max pallets)
                </Label>
              </div>

              {/* Number of Pallets */}
              <div className="space-y-2">
                <Label htmlFor="num-pallets" className="text-body-large font-medium text-black">
                  Number of Pallets
                </Label>
                <Input
                  id="num-pallets"
                  type="number"
                  step="1"
                  value={numPallets}
                  onChange={(e) => setNumPallets(e.target.value)}
                  placeholder="e.g., 20"
                  className="border-2"
                  disabled={fullContainer}
                />
                {fullContainer && (
                  <p className="text-body-small text-muted-foreground">
                    Auto-filled based on container capacity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="border-2 border-[#FFB84D] bg-gradient-to-br from-white to-[#FFB84D]/5">
            <CardHeader>
              <CardTitle className="text-headline-medium font-bold text-black">
                Load Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Pallets */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-border">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-[#FFB84D]" />
                  <div>
                    <p className="text-body-small text-muted-foreground">Total Pallets</p>
                    <p className="text-headline-medium font-bold text-black">
                      {numPalletsNum || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Cartons */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-border">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-[#FFB84D]" />
                  <div>
                    <p className="text-body-small text-muted-foreground">Total Cartons</p>
                    <p className="text-headline-medium font-bold text-black">
                      {totalCartons.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Weight */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-border">
                <div className="flex items-center gap-3">
                  <TruckIcon className="h-8 w-8 text-[#FFB84D]" />
                  <div>
                    <p className="text-body-small text-muted-foreground">Total Weight</p>
                    <p className="text-headline-medium font-bold text-black">
                      {totalWeight.toLocaleString()} kg
                    </p>
                    <p className="text-body-small text-muted-foreground">
                      ({(totalWeight / 1000).toFixed(2)} MT)
                    </p>
                  </div>
                </div>
              </div>

              {/* Container Fill */}
              <div className="p-4 bg-white rounded-lg border-2 border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-body-large font-medium text-black">Container Fill</p>
                  <Badge
                    variant={containerFill > 100 ? 'destructive' : 'default'}
                    className={containerFill > 100 ? '' : 'bg-[#FFB84D] text-black'}
                  >
                    {containerFill.toFixed(0)}%
                  </Badge>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      containerFill > 100 ? 'bg-red-500' : 'bg-[#FFB84D]'
                    }`}
                    style={{ width: `${Math.min(containerFill, 100)}%` }}
                  />
                </div>
                {containerFill > 100 && (
                  <p className="text-body-small text-red-600 mt-2">
                    Exceeds container capacity by {(containerFill - 100).toFixed(0)}%
                  </p>
                )}
              </div>

              {/* Recommended Freight Mode */}
              <div className="p-4 bg-[#FFB84D] rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  {freightMode.includes('Reefer') ? (
                    <Thermometer className="h-6 w-6 text-black" />
                  ) : freightMode.includes('Sea') ? (
                    <Ship className="h-6 w-6 text-black" />
                  ) : (
                    <TruckIcon className="h-6 w-6 text-black" />
                  )}
                  <p className="text-body-large font-medium text-black">
                    Recommended Freight
                  </p>
                </div>
                <p className="text-title-large font-bold text-black">{freightMode}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <p className="text-body-medium text-muted-foreground max-w-2xl mx-auto">
            Container capacities are estimates and may vary based on pallet configuration,
            product dimensions, and carrier regulations. Always confirm with your freight
            forwarder.
          </p>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  )
}
