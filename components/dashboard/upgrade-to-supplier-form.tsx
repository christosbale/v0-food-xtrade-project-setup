'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { upgradeToSupplier } from '@/app/(dashboard)/dashboard/upgrade/actions'

interface UpgradeToSupplierFormProps {
  company: any
}

export function UpgradeToSupplierForm({ company }: UpgradeToSupplierFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessDescription: '',
    productCategories: '',
    exportExperience: '',
    certifications: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await upgradeToSupplier(company.id, formData)
      toast({
        title: 'Upgrade requested',
        description: 'Your supplier application has been submitted for review',
      })
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit application',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessDescription">Business Description</Label>
        <Textarea
          id="businessDescription"
          value={formData.businessDescription}
          onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
          placeholder="Describe your business, what products you offer, and your target markets..."
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground">
          Help buyers understand your business and offerings
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productCategories">Product Categories</Label>
        <Input
          id="productCategories"
          value={formData.productCategories}
          onChange={(e) => setFormData({ ...formData, productCategories: e.target.value })}
          placeholder="e.g., Fresh Produce, Coffee, Grains, Oils"
          required
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple categories with commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="exportExperience">Export Experience</Label>
        <Textarea
          id="exportExperience"
          value={formData.exportExperience}
          onChange={(e) => setFormData({ ...formData, exportExperience: e.target.value })}
          placeholder="Describe your experience with international trade and export..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications (Optional)</Label>
        <Input
          id="certifications"
          value={formData.certifications}
          onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
          placeholder="e.g., ISO 9001, Organic, HACCP, Fair Trade"
        />
        <p className="text-xs text-muted-foreground">
          List any relevant certifications separated by commas
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg space-y-2">
        <p className="text-sm font-medium">Current Company Information</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Company Name:</p>
            <p className="font-medium">{company.company_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Country:</p>
            <p className="font-medium">{company.country}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email:</p>
            <p className="font-medium">{company.business_email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone:</p>
            <p className="font-medium">{company.phone}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Need to update? Go to Company Profile first
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Supplier Application'}
      </Button>
    </form>
  )
}
