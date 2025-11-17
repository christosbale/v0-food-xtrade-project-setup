'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types/database'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface EditProductDrawerProps {
  product: Product
  companyId: string
  onClose: () => void
  onSuccess: () => void
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

const units = ['kg', 'liter', 'piece', 'box', 'ton', 'MT']

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

export function EditProductDrawer({ product, companyId, onClose, onSuccess }: EditProductDrawerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    product_name: product.product_name,
    category: product.category,
    origin_country: product.origin_country,
    available_quantity: product.available_quantity.toString(),
    unit: product.unit,
    price_per_unit: product.price_per_unit.toString(),
    min_order_quantity: product.min_order_quantity.toString(),
    incoterm: product.incoterm,
    customs_status: product.customs_status,
    certifications: product.certifications || [],
    crop_year: product.crop_year || new Date().getFullYear().toString(),
    packaging: product.packaging || '',
    status: product.status,
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const updatedData = {
        product_name: formData.product_name,
        category: formData.category,
        origin_country: formData.origin_country,
        available_quantity: parseFloat(formData.available_quantity),
        unit: formData.unit,
        price_per_unit: parseFloat(formData.price_per_unit),
        min_order_quantity: parseFloat(formData.min_order_quantity),
        incoterm: formData.incoterm,
        customs_status: formData.customs_status,
        certifications: formData.certifications,
        crop_year: formData.crop_year,
        packaging: formData.packaging,
        status: formData.status,
        updated_at: new Date().toISOString(),
      }

      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', product.id)
        .eq('company_id', companyId)

      if (updateError) throw updateError

      onSuccess()
    } catch (err) {
      console.error('[v0] Error updating product:', err)
      setError(err instanceof Error ? err.message : 'Could not update product. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
          <SheetDescription>
            Update product information and availability
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="product_name">Product Name *</Label>
            <Input
              id="product_name"
              placeholder="e.g., Organic Apples"
              required
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue />
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
              <Label htmlFor="origin_country">Country of Origin *</Label>
              <Input
                id="origin_country"
                placeholder="e.g., United States"
                required
                value={formData.origin_country}
                onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price_per_unit">Price per Unit *</Label>
              <Input
                id="price_per_unit"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                value={formData.price_per_unit}
                onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min_order_quantity">Min. Order Quantity *</Label>
              <Input
                id="min_order_quantity"
                type="number"
                placeholder="100"
                required
                value={formData.min_order_quantity}
                onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="available_quantity">Available Stock *</Label>
              <Input
                id="available_quantity"
                type="number"
                placeholder="1000"
                required
                value={formData.available_quantity}
                onChange={(e) => setFormData({ ...formData, available_quantity: e.target.value })}
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
              <Label htmlFor="customs_status">Customs Status</Label>
              <Select
                value={formData.customs_status}
                onValueChange={(value) => setFormData({ ...formData, customs_status: value })}
              >
                <SelectTrigger id="customs_status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not cleared">Not Cleared</SelectItem>
                  <SelectItem value="EU customs cleared">EU Customs Cleared</SelectItem>
                  <SelectItem value="US customs cleared">US Customs Cleared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="crop_year">Crop Year</Label>
              <Input
                id="crop_year"
                type="number"
                placeholder={new Date().getFullYear().toString()}
                value={formData.crop_year}
                onChange={(e) => setFormData({ ...formData, crop_year: e.target.value })}
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
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'draft' | 'published') => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#9FE870] text-black hover:bg-[#8FD860]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
