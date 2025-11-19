"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'
import { findMatchingSuppliers } from '@/lib/utils/rfq-matching'
import { logDemandEvent } from '@/lib/demand/logDemandEvent'

interface Product {
  id: string
  name: string
  unit: string
  supplier: {
    name: string
    id?: string
  }
  origin?: string
}

interface RFQFormProps {
  product: Product
  onSuccess?: () => void
  onCancel?: () => void
  showCancelButton?: boolean
}

interface RFQFormData {
  companyName: string
  businessEmail: string
  country: string
  quantity: string
  targetPrice: string
  incoterm: string
  message: string
  targetCategory: string
  targetSubcategory: string
  targetCountry: string
  targetCustomsStatus: string
  targetPackaging: string
  targetMoq: string
  targetMoqUnit: string
}

const INCOTERMS = [
  'EXW (Ex Works)',
  'FCA (Free Carrier)',
  'CPT (Carriage Paid To)',
  'CIP (Carriage and Insurance Paid To)',
  'DAP (Delivered At Place)',
  'DPU (Delivered at Place Unloaded)',
  'DDP (Delivered Duty Paid)',
  'FAS (Free Alongside Ship)',
  'FOB (Free On Board)',
  'CFR (Cost and Freight)',
  'CIF (Cost, Insurance and Freight)',
]

const CUSTOMS_STATUS_OPTIONS = [
  'EU-cleared',
  'Non-EU',
  'Bonded',
  'Free zone',
  'Local only'
]

const MOQ_UNITS = ['kg', 'MT', 'pallet', 'container', 'box', 'unit']

export function RFQForm({ product, onSuccess, onCancel, showCancelButton = false }: RFQFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<RFQFormData>({
    companyName: '',
    businessEmail: '',
    country: '',
    quantity: '',
    targetPrice: '',
    incoterm: '',
    message: '',
    targetCategory: '',
    targetSubcategory: '',
    targetCountry: '',
    targetCustomsStatus: '',
    targetPackaging: '',
    targetMoq: '',
    targetMoqUnit: 'kg',
  })
  
  const [matchedSuppliers, setMatchedSuppliers] = useState<any[]>([])
  const [showMatches, setShowMatches] = useState(false)
  const [loadingMatches, setLoadingMatches] = useState(false)

  const selectedCategory = PRODUCT_CATEGORIES.find(cat => cat.id === formData.targetCategory)
  const subcategories = selectedCategory?.subcategories || []

  const handleInputChange = (
    field: keyof RFQFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const supplierCompanyId = product.supplier.id

      if (!supplierCompanyId) {
        throw new Error('Supplier company ID is missing')
      }

      const targetPriceValue = formData.targetPrice 
        ? parseFloat(formData.targetPrice.replace(/[^0-9.]/g, ''))
        : null
      
      const targetMoqValue = formData.targetMoq 
        ? parseFloat(formData.targetMoq) 
        : null

      const { data, error: insertError } = await supabase
        .from('rfqs')
        .insert([{
          product_id: product.id,
          supplier_company_id: supplierCompanyId,
          buyer_company_name: formData.companyName,
          buyer_email: formData.businessEmail,
          buyer_country: formData.country,
          desired_quantity: parseFloat(formData.quantity),
          unit: product.unit,
          target_price: targetPriceValue,
          preferred_incoterm: formData.incoterm,
          message: formData.message,
          status: 'new',
          target_category: formData.targetCategory || null,
          target_subcategory: formData.targetSubcategory || null,
          target_country: formData.targetCountry || null,
          target_customs_status: formData.targetCustomsStatus || null,
          target_packaging: formData.targetPackaging || null,
          target_moq: targetMoqValue,
          target_moq_unit: formData.targetMoqUnit || null,
        }])
        .select()

      if (insertError) {
        throw insertError
      }

      if (data && data[0]) {
        await logDemandEvent({
          event_type: 'rfq',
          buyer_id: null, // RFQs can be submitted anonymously
          buyer_country: formData.country,
          category: formData.targetCategory || null,
          subcategory: formData.targetSubcategory || null,
          origin_country: formData.targetCountry || null,
          customs_status: formData.targetCustomsStatus || null,
          quantity: targetMoqValue,
          quantity_unit: formData.targetMoqUnit || null,
          rfq_id: data[0].id,
          metadata: {
            product_id: product.id,
            target_price: targetPriceValue,
            incoterm: formData.incoterm,
            packaging: formData.targetPackaging,
            full_rfq: data[0],
          },
        })
      }

      if (formData.targetCategory) {
        setLoadingMatches(true)
        const matches = await findMatchingSuppliers(
          formData.targetCategory,
          formData.targetSubcategory,
          formData.targetCountry,
          formData.targetCustomsStatus,
          targetMoqValue || undefined,
          formData.targetMoqUnit
        )
        setMatchedSuppliers(matches)
        setShowMatches(true)
        setLoadingMatches(false)
      }

      setIsSubmitting(false)
      setIsSuccess(true)

      toast({
        title: 'Quote Request Sent',
        description: `Your request has been sent to ${product.supplier.name}. They will contact you directly.`,
      })

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      console.error('[v0] Error submitting RFQ:', err)
      setIsSubmitting(false)
      setError('Could not send RFQ. Please try again or contact support.')
      
      toast({
        title: 'Error',
        description: 'Could not send RFQ. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isSuccess) {
    return (
      <div className="py-12 px-6">
        {showMatches && matchedSuppliers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Matched Suppliers</h3>
            <p className="text-muted-foreground mb-6">
              We found {matchedSuppliers.length} suppliers that match your requirements:
            </p>
            <div className="space-y-3 mb-6">
              {matchedSuppliers.slice(0, 5).map((supplier) => (
                <div key={supplier.productId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{supplier.supplierName}</span>
                        {supplier.verified && (
                          <span className="text-[#FFB84D]">Verified</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{supplier.productName}</p>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span>Customs: {supplier.customsStatus}</span>
                        {supplier.moq && (
                          <span>MOQ: {supplier.moq} {supplier.moqUnit}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#FFB84D]/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#FFB84D]" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Request Sent Successfully!</h3>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            Your request for quote has been sent to {product.supplier.name}. They will review your request and contact you directly at <span className="font-medium text-foreground">{formData.businessEmail}</span>.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            The supplier can view and respond to your request from their dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Product Requirements (Optional)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Help us match you with the best suppliers by specifying your requirements
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetCategory">Product Category</Label>
            <Select
              value={formData.targetCategory}
              onValueChange={(value) => {
                handleInputChange('targetCategory', value)
                handleInputChange('targetSubcategory', '') // Reset subcategory
              }}
            >
              <SelectTrigger id="targetCategory">
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

          {formData.targetCategory && (
            <div className="space-y-2">
              <Label htmlFor="targetSubcategory">Product Type</Label>
              <Select
                value={formData.targetSubcategory}
                onValueChange={(value) => handleInputChange('targetSubcategory', value)}
              >
                <SelectTrigger id="targetSubcategory">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="targetCountry">Delivery Country</Label>
            <Input
              id="targetCountry"
              placeholder="e.g., Germany, France"
              value={formData.targetCountry}
              onChange={(e) => handleInputChange('targetCountry', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetCustomsStatus">Preferred Customs Status</Label>
            <Select
              value={formData.targetCustomsStatus}
              onValueChange={(value) => handleInputChange('targetCustomsStatus', value)}
            >
              <SelectTrigger id="targetCustomsStatus">
                <SelectValue placeholder="Select customs status" />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMS_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetPackaging">Packaging Type</Label>
            <Input
              id="targetPackaging"
              placeholder="e.g., Palletized, bulk bags, containers"
              value={formData.targetPackaging}
              onChange={(e) => handleInputChange('targetPackaging', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetMoq">Minimum Order Quantity</Label>
              <Input
                id="targetMoq"
                type="number"
                placeholder="e.g., 1000"
                value={formData.targetMoq}
                onChange={(e) => handleInputChange('targetMoq', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetMoqUnit">Unit</Label>
              <Select
                value={formData.targetMoqUnit}
                onValueChange={(value) => handleInputChange('targetMoqUnit', value)}
              >
                <SelectTrigger id="targetMoqUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOQ_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">
          Company Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="companyName"
          placeholder="Your company name"
          value={formData.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessEmail">
          Business Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="businessEmail"
          type="email"
          placeholder="your.email@company.com"
          value={formData.businessEmail}
          onChange={(e) => handleInputChange('businessEmail', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">
          Country <span className="text-destructive">*</span>
        </Label>
        <Input
          id="country"
          placeholder="Your country"
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">
          Desired Quantity ({product.unit}) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="quantity"
          type="number"
          placeholder={`e.g., 1000 ${product.unit}`}
          value={formData.quantity}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
          required
          min="1"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetPrice">
          Target Price per {product.unit} (Optional)
        </Label>
        <Input
          id="targetPrice"
          type="text"
          placeholder="e.g., €3.00"
          value={formData.targetPrice}
          onChange={(e) => handleInputChange('targetPrice', e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Your budget or target price for negotiation
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="incoterm">
          Preferred Incoterm <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.incoterm}
          onValueChange={(value) => handleInputChange('incoterm', value)}
          required
        >
          <SelectTrigger id="incoterm">
            <SelectValue placeholder="Select an Incoterm" />
          </SelectTrigger>
          <SelectContent>
            {INCOTERMS.map((term) => (
              <SelectItem key={term} value={term}>
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          International trade term for shipping and responsibility
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message to Supplier <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Please provide any additional details about your requirements, preferred delivery timeline, or specific questions for the supplier..."
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          required
          rows={5}
          className="resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        {showCancelButton && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`${showCancelButton ? 'flex-1' : 'w-full'} bg-[#FFB84D] hover:bg-[#FFA62F] text-black font-semibold`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending RFQ...
            </>
          ) : (
            'Send RFQ'
          )}
        </Button>
      </div>
    </form>
  )
}
