'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, X, Loader2, AlertCircle, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { getCurrentCompanyClient } from '@/lib/auth/current-company-client'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'
import { Currency, CURRENCY_LABELS } from '@/lib/utils/currency'
import { getMonthOptions } from '@/lib/utils/seasonality'
import { createProduct, updateProduct } from '@/app/(dashboard)/dashboard/products/actions'

interface ProductFormProps {
  initialData?: {
    name: string
    category: string
    productType: string
    description: string
    price: string
    unit: string
    minOrder: string
    stock: string
    origin: string
    certifications: string[]
    harvestDate: string
    shelfLife: string
    customsStatus: string
    warehouseCountry: string
    warehouseCity: string
    warehouseType: string
    minOrderQuantity: string
    minOrderUnit: string
    logisticsNotes: string
    harvestStartMonth: string
    harvestEndMonth: string
    cartonWeight: string
    cartonUnits: string
    cartonsPerPallet: string
    palletHeight: string
    palletType: string
  }
  productId?: string
}

const units = ['kg', 'liter', 'piece', 'box', 'ton']

const minOrderUnits = ['kg', 'MT', 'pallet', 'container']

const warehouseTypes = ['Standard warehouse', 'Bonded warehouse', 'Free zone']

const availableCertifications = [
  'Organic',
  'FDA Approved',
  'HACCP',
  'ISO 22000',
  'Halal',
  'Kosher',
  'Fair Trade',
  'Non-GMO',
]

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [isLoadingCompany, setIsLoadingCompany] = useState(true)
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    productType: initialData?.productType || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    unit: initialData?.unit || 'kg',
    minOrder: initialData?.minOrder || '',
    stock: initialData?.stock || '',
    origin: initialData?.origin || '',
    certifications: initialData?.certifications || [],
    incoterm: 'EXW',
    customsStatus: initialData?.customsStatus || '',
    cropYear: new Date().getFullYear().toString(),
    packaging: '',
    currency: 'EUR' as Currency,
    harvestDate: initialData?.harvestDate || '',
    shelfLife: initialData?.shelfLife || '',
    warehouseCountry: initialData?.warehouseCountry || '',
    warehouseCity: initialData?.warehouseCity || '',
    warehouseType: initialData?.warehouseType || '',
    minOrderQuantity: initialData?.minOrderQuantity || '',
    minOrderUnit: initialData?.minOrderUnit || 'kg',
    logisticsNotes: initialData?.logisticsNotes || '',
    harvestStartMonth: initialData?.harvestStartMonth || '',
    harvestEndMonth: initialData?.harvestEndMonth || '',
    cartonWeight: initialData?.cartonWeight || '',
    cartonUnits: initialData?.cartonUnits || '',
    cartonsPerPallet: initialData?.cartonsPerPallet || '',
    palletHeight: initialData?.palletHeight || '',
    palletType: initialData?.palletType || '',
  })

  const selectedCategory = PRODUCT_CATEGORIES.find(cat => cat.id === formData.category)
  const availableSubcategories = selectedCategory?.subcategories || []
  const isFreshProduce = formData.category === 'fresh_produce'
  const monthOptions = getMonthOptions()

  useEffect(() => {
    async function fetchUserCompany() {
      try {
        setIsLoadingCompany(true)
        const session = await getCurrentCompanyClient()
        
        if (!session) {
          router.push('/login')
          return
        }

        if (!session.company) {
          setError('no_company')
          setIsLoadingCompany(false)
          return
        }

        setCompanyId(session.company.id)
        
        if (initialData?.price) {
          setOriginalPrice(parseFloat(initialData.price))
        }
        
        setIsLoadingCompany(false)
      } catch (err) {
        console.error('[v0] Error in fetchUserCompany:', err)
        setError('Authentication error. Please try logging in again.')
        setIsLoadingCompany(false)
      }
    }

    fetchUserCompany()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages].slice(0, 5))
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const toggleCertification = (cert: string) => {
    if (formData.certifications.includes(cert)) {
      setFormData({
        ...formData,
        certifications: formData.certifications.filter((c) => c !== cert),
      })
    } else {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, cert],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!formData.category) {
      setError('Please select a category.')
      setIsLoading(false)
      return
    }

    if (!formData.productType) {
      setError('Please select a product type.')
      setIsLoading(false)
      return
    }

    if (isFreshProduce) {
      if (!formData.harvestDate) {
        setError('Harvest date is required for fresh produce.')
        setIsLoading(false)
        return
      }
      if (!formData.shelfLife) {
        setError('Shelf life is required for fresh produce.')
        setIsLoading(false)
        return
      }
      if (!formData.harvestStartMonth) {
        setError('Harvest start month is required for fresh produce.')
        setIsLoading(false)
        return
      }
      if (!formData.harvestEndMonth) {
        setError('Harvest end month is required for fresh produce.')
        setIsLoading(false)
        return
      }
      if (!formData.cartonWeight) {
        setError('Carton weight is required for fresh produce.')
        setIsLoading(false)
        return
      }
      if (!formData.cartonsPerPallet) {
        setError('Cartons per pallet is required for fresh produce.')
        setIsLoading(false)
        return
      }
    }

    if (!isFreshProduce && !formData.customsStatus) {
      setError('Customs status is required for non-fresh products.')
      setIsLoading(false)
      return
    }

    if (!formData.palletType) {
      setError('Pallet type is required.')
      setIsLoading(false)
      return
    }

    if (!companyId) {
      setError('Company information not loaded. Please refresh the page.')
      setIsLoading(false)
      return
    }

    try {
      const productData = {
        company_id: companyId,
        product_name: formData.name,
        category: formData.category,
        product_type: formData.productType,
        origin_country: formData.origin,
        available_quantity: parseFloat(formData.stock),
        unit: formData.unit,
        price_per_unit: parseFloat(formData.price),
        min_order_quantity: parseFloat(formData.minOrder),
        incoterm: formData.incoterm,
        customs_status: formData.customsStatus,
        certifications: formData.certifications,
        crop_year: formData.cropYear,
        packaging: formData.packaging,
        status: status,
        currency: formData.currency,
        warehouse_country: formData.warehouseCountry,
        warehouse_city: formData.warehouseCity,
        warehouse_type: formData.warehouseType,
        min_order_unit: formData.minOrderUnit,
        logistics_notes: formData.logisticsNotes,
        carton_weight: formData.cartonWeight ? parseFloat(formData.cartonWeight) : null,
        carton_units: formData.cartonUnits ? parseFloat(formData.cartonUnits) : null,
        cartons_per_pallet: formData.cartonsPerPallet ? parseFloat(formData.cartonsPerPallet) : null,
        pallet_height: formData.palletHeight ? parseFloat(formData.palletHeight) : null,
        pallet_type: formData.palletType,
        ...(isFreshProduce && {
          harvest_date: formData.harvestDate,
          shelf_life: formData.shelfLife,
          harvest_start_month: formData.harvestStartMonth ? parseInt(formData.harvestStartMonth) : null,
          harvest_end_month: formData.harvestEndMonth ? parseInt(formData.harvestEndMonth) : null,
        }),
      }

      console.log('[v0] Submitting product data:', productData)

      let result
      if (productId) {
        result = await updateProduct(productId, productData, originalPrice)
      } else {
        result = await createProduct(productData)
      }

      if (!result.success) {
        throw new Error(result.error)
      }

      console.log('[v0] Product saved successfully:', result.data)
      router.push('/dashboard/products')
    } catch (err) {
      console.error('[v0] Error saving product:', err)
      setError(err instanceof Error ? err.message : 'Could not save product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingCompany) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error === 'no_company') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-destructive">Company Profile Not Found</h3>
                <p className="text-sm text-muted-foreground">
                  Your account exists but there's no company profile associated with it. This typically happens when registration didn't complete successfully.
                </p>
                <div className="pt-2 space-y-2">
                  <p className="text-sm font-medium">To fix this issue:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Contact support at support@foodxtrade.com</li>
                    <li>Or try registering again with a different email</li>
                  </ol>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    Back to Dashboard
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="mailto:support@foodxtrade.com">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, 'draft')}>
      <Card>
        <CardContent className="pt-6 space-y-6">
          {error && error !== 'no_company' && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">B2B Bulk Orders Only</p>
              <p className="text-xs text-blue-700">
                This marketplace is for wholesale and bulk orders. Please ensure your product meets minimum order quantity requirements suitable for B2B trade.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="mt-2 text-xs text-muted-foreground">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload up to 5 images. First image will be the cover.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Organic Apples"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value, productType: '' })}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type *</Label>
              <Select
                value={formData.productType}
                onValueChange={(value) => setFormData({ ...formData, productType: value })}
                required
                disabled={!formData.category}
              >
                <SelectTrigger id="productType">
                  <SelectValue placeholder={formData.category ? "Select product type" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.label}>
                      {subcat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isFreshProduce && (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <div className="rounded-lg bg-green-50 border border-green-200 p-3 flex items-start gap-2">
                    <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-700">
                      Fresh produce requires additional information for quality assurance and logistics planning.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    required
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Expected or actual harvest date
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shelfLife">Shelf Life (days) *</Label>
                  <Input
                    id="shelfLife"
                    type="number"
                    min="1"
                    placeholder="e.g., 14"
                    required
                    value={formData.shelfLife}
                    onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Expected shelf life from harvest date
                  </p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-base font-semibold">Seasonality *</Label>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Specify the harvest season for this product. Buyers can filter by in-season products.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestStartMonth">Harvest Start Month *</Label>
                  <Select
                    value={formData.harvestStartMonth}
                    onValueChange={(value) => setFormData({ ...formData, harvestStartMonth: value })}
                    required
                  >
                    <SelectTrigger id="harvestStartMonth">
                      <SelectValue placeholder="Select start month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    When harvest season begins
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestEndMonth">Harvest End Month *</Label>
                  <Select
                    value={formData.harvestEndMonth}
                    onValueChange={(value) => setFormData({ ...formData, harvestEndMonth: value })}
                    required
                  >
                    <SelectTrigger id="harvestEndMonth">
                      <SelectValue placeholder="Select end month" />
                    </SelectTrigger>
                    <SelectContent>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    When harvest season ends
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="origin">Country of Origin *</Label>
              <Input
                id="origin"
                placeholder="e.g., United States"
                required
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product..."
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value: Currency) => setFormData({ ...formData, currency: value })}
                required
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">{CURRENCY_LABELS.EUR}</SelectItem>
                  <SelectItem value="USD">{CURRENCY_LABELS.USD}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                EUR recommended for European markets
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
                required
              >
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrder">Min. Order Quantity *</Label>
              <Input
                id="minOrder"
                type="number"
                placeholder="100"
                required
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
              />
            </div>

            <div className="space-y-2 sm:col-span-3">
              <Label htmlFor="stock">Available Stock *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="1000"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="incoterm">Incoterm</Label>
              <Select
                value={formData.incoterm}
                onValueChange={(value) => setFormData({ ...formData, incoterm: value })}
              >
                <SelectTrigger id="incoterm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXW">EXW</SelectItem>
                  <SelectItem value="FOB">FOB</SelectItem>
                  <SelectItem value="CIF">CIF</SelectItem>
                  <SelectItem value="DDP">DDP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customsStatus">
                Customs Status {!isFreshProduce && <span className="text-destructive">*</span>}
              </Label>
              <Select
                value={formData.customsStatus}
                onValueChange={(value) => setFormData({ ...formData, customsStatus: value })}
                required={!isFreshProduce}
              >
                <SelectTrigger id="customsStatus">
                  <SelectValue placeholder="Select customs status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eu_cleared">EU customs cleared</SelectItem>
                  <SelectItem value="non_eu">Non-EU stock (origin warehouse)</SelectItem>
                  <SelectItem value="bonded">Stored in bonded warehouse</SelectItem>
                  <SelectItem value="free_zone">Free zone / customs-free area</SelectItem>
                  <SelectItem value="local_only">Local market only (no export)</SelectItem>
                </SelectContent>
              </Select>
              {isFreshProduce && (
                <p className="text-xs text-muted-foreground">
                  Recommended for fresh produce
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouseType">Warehouse Type</Label>
              <Select
                value={formData.warehouseType}
                onValueChange={(value) => setFormData({ ...formData, warehouseType: value })}
              >
                <SelectTrigger id="warehouseType">
                  <SelectValue placeholder="Select warehouse type" />
                </SelectTrigger>
                <SelectContent>
                  {warehouseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouseCountry">Warehouse Country</Label>
              <Input
                id="warehouseCountry"
                placeholder="e.g., Germany"
                value={formData.warehouseCountry}
                onChange={(e) => setFormData({ ...formData, warehouseCountry: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouseCity">Warehouse City</Label>
              <Input
                id="warehouseCity"
                placeholder="e.g., Hamburg"
                value={formData.warehouseCity}
                onChange={(e) => setFormData({ ...formData, warehouseCity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
              <Input
                id="minOrderQuantity"
                type="number"
                placeholder="e.g., 1"
                value={formData.minOrderQuantity}
                onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderUnit">Minimum Order Unit</Label>
              <Select
                value={formData.minOrderUnit}
                onValueChange={(value) => setFormData({ ...formData, minOrderUnit: value })}
              >
                <SelectTrigger id="minOrderUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {minOrderUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="logisticsNotes">Logistics Notes</Label>
              <Textarea
                id="logisticsNotes"
                placeholder="Short notes about loading, packaging on pallets, reefer requirements, etc."
                rows={3}
                value={formData.logisticsNotes}
                onChange={(e) => setFormData({ ...formData, logisticsNotes: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add any specific logistics requirements or notes
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Logistics Data</h3>
              <p className="text-sm text-muted-foreground">
                Provide pallet and carton specifications for accurate shipping calculations.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cartonWeight">
                  Carton Weight (kg per carton) {isFreshProduce && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="cartonWeight"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 10.5"
                  required={isFreshProduce}
                  value={formData.cartonWeight}
                  onChange={(e) => setFormData({ ...formData, cartonWeight: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Weight of one carton including product
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cartonUnits">Carton Units (optional)</Label>
                <Input
                  id="cartonUnits"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.cartonUnits}
                  onChange={(e) => setFormData({ ...formData, cartonUnits: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Number of units per carton
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cartonsPerPallet">
                  Cartons per Pallet {isFreshProduce && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="cartonsPerPallet"
                  type="number"
                  placeholder="e.g., 80"
                  required={isFreshProduce}
                  value={formData.cartonsPerPallet}
                  onChange={(e) => setFormData({ ...formData, cartonsPerPallet: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  How many cartons fit on one pallet
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="palletHeight">Pallet Height (cm)</Label>
                <Input
                  id="palletHeight"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.palletHeight}
                  onChange={(e) => setFormData({ ...formData, palletHeight: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Total height of loaded pallet
                </p>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="palletType">
                  Pallet Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.palletType}
                  onValueChange={(value) => setFormData({ ...formData, palletType: value })}
                  required
                >
                  <SelectTrigger id="palletType">
                    <SelectValue placeholder="Select pallet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="euro">Euro Pallet (120×80 cm)</SelectItem>
                    <SelectItem value="industrial">Industrial Pallet (120×100 cm)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Standard pallet size for shipping
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Certifications</Label>
            <div className="flex flex-wrap gap-2">
              {availableCertifications.map((cert) => (
                <Badge
                  key={cert}
                  variant={formData.certifications.includes(cert) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleCertification(cert)}
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{productId ? 'Update Product' : 'Add Product'}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
