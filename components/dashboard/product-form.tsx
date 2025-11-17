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
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { getCurrentCompanyClient } from '@/lib/auth/current-company-client'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface ProductFormProps {
  initialData?: {
    name: string
    category: string
    description: string
    price: string
    unit: string
    minOrder: string
    stock: string
    origin: string
    certifications: string[]
  }
  productId?: string
}

const categories = [
  'Fresh Fruits',
  'Vegetables',
  'Grains & Cereals',
  'Dairy Products',
  'Meat & Poultry',
  'Seafood',
  'Beverages',
  'Oils & Fats',
  'Spices & Seasonings',
  'Packaged Foods',
]

const units = ['kg', 'liter', 'piece', 'box', 'ton']

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
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    unit: initialData?.unit || 'kg',
    minOrder: initialData?.minOrder || '',
    stock: initialData?.stock || '',
    origin: initialData?.origin || '',
    certifications: initialData?.certifications || [],
    productType: 'bulk', // Default to bulk
    incoterm: 'EXW', // Default incoterm
    customsStatus: 'Not cleared', // Default customs status - matches database constraint
    cropYear: new Date().getFullYear().toString(),
    packaging: '',
    currency: 'USD', // Default currency
  })

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
        setIsLoadingCompany(false)
      } catch (err) {
        console.error('[v0] Error in fetchUserCompany:', err)
        setError('Authentication error. Please try logging in again.')
        setIsLoadingCompany(false)
      }
    }

    fetchUserCompany()
  }, []) // Empty dependency array - only run once on mount

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
      }

      console.log('[v0] Submitting product data:', productData)

      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([productData])
        .select()

      if (insertError) {
        throw insertError
      }

      console.log('[v0] Product inserted successfully:', data)
      router.push('/dashboard/products')
    } catch (err) {
      console.error('[v0] Error inserting product:', err)
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
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <Label htmlFor="customsStatus">Customs Status</Label>
              <Select
                value={formData.customsStatus}
                onValueChange={(value) => setFormData({ ...formData, customsStatus: value })}
              >
                <SelectTrigger id="customsStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not cleared">Not Cleared</SelectItem>
                  <SelectItem value="EU customs cleared">EU Customs Cleared</SelectItem>
                  <SelectItem value="US customs cleared">US Customs Cleared</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cropYear">Crop Year</Label>
              <Input
                id="cropYear"
                type="number"
                placeholder={new Date().getFullYear().toString()}
                value={formData.cropYear}
                onChange={(e) => setFormData({ ...formData, cropYear: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="packaging">Packaging</Label>
              <Input
                id="packaging"
                placeholder="e.g., Cartons, Pallets"
                value={formData.packaging}
                onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
              />
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
