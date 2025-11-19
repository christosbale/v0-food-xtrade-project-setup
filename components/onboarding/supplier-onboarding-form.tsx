'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { submitSupplierOnboarding } from '@/app/onboarding/supplier/actions'
import { Check } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/config/product-categories'

interface SupplierOnboardingFormProps {
  initialPlan: 'basic' | 'pro' | 'premium'
  existingCompany?: {
    company_name: string
    country: string
    city: string
    website?: string | null
  } | null
  userEmail: string
}

const PLAN_DETAILS = {
  basic: {
    name: 'Basic',
    price: '€49',
    description: 'Essential marketplace access with basic product listings and buyer connections.',
  },
  pro: {
    name: 'Pro',
    price: '€99',
    description: 'Advanced features including market insights, demand analytics, and priority placement.',
  },
  premium: {
    name: 'Premium',
    price: '€199',
    description: 'Complete market intelligence with AI-powered matching, price analytics, and full insights.',
  },
}

export function SupplierOnboardingForm({
  initialPlan,
  existingCompany,
  userEmail,
}: SupplierOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState(initialPlan)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    companyName: existingCompany?.company_name || '',
    tradeName: '',
    country: existingCompany?.country || '',
    city: existingCompany?.city || '',
    website: existingCompany?.website || '',
    productCategories: [] as string[],
    exportMarkets: '',
    comments: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter((c) => c !== category)
        : [...prev.productCategories, category],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitSupplierOnboarding(selectedPlan, formData)
      
      if (!result.success) {
        setError(result.error || 'Failed to complete onboarding')
        setIsSubmitting(false)
        return
      }

      window.location.href = '/dashboard/products'
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  const isStep1Valid = true // Plan is always valid
  const isStep2Valid =
    formData.companyName.trim() !== '' &&
    formData.country.trim() !== '' &&
    formData.city.trim() !== ''

  return (
    <div className="space-y-12 rounded-lg border border-[#E2E2E2] bg-white p-12">
      <div className="flex items-center justify-center gap-3">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border ${
                currentStep >= step
                  ? 'border-[#0D1117] bg-[#0D1117] text-white'
                  : 'border-[#E2E2E2] bg-white text-[#7A7A7A]'
              }`}
            >
              {currentStep > step ? <Check className="h-5 w-5" /> : <span className="font-bold">{step}</span>}
            </div>
            <span className={`text-sm font-medium ${currentStep >= step ? 'text-[#0D1117]' : 'text-[#7A7A7A]'}`}>
              {step === 1 ? 'Plan' : step === 2 ? 'Company' : 'Finish'}
            </span>
            {step < 3 && <div className="h-px w-16 bg-[#E2E2E2]" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          {error}
        </div>
      )}

      {/* Step 1: Plan Selection */}
      {currentStep === 1 && (
        <div className="space-y-10">
          <div>
            <h2 className="mb-8 text-headline-medium text-[#0D1117]">Select Your Plan</h2>

            <div className="space-y-4">
              {(['basic', 'pro', 'premium'] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full rounded-md border p-8 text-left transition-all ${
                    selectedPlan === plan
                      ? 'border-[#0D1117] bg-white shadow-sm'
                      : 'border-[#E2E2E2] bg-white hover:border-[#7A7A7A]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex items-baseline gap-4">
                        <h3 className="text-title-large text-[#0D1117]">
                          {PLAN_DETAILS[plan].name}
                        </h3>
                        <span className="text-headline-small text-[#0D1117]">
                          {PLAN_DETAILS[plan].price}
                          <span className="text-sm font-normal text-[#7A7A7A]">/month</span>
                        </span>
                      </div>
                      <p className="text-body-medium text-[#7A7A7A]">{PLAN_DETAILS[plan].description}</p>
                    </div>
                    {selectedPlan === plan && (
                      <div className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#0D1117]">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-6 text-body-small text-[#7A7A7A]">
              Plans can be upgraded or changed anytime from your dashboard.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!isStep1Valid}
              size="lg"
              className="bg-[#0D1117] px-8 font-bold text-white hover:bg-[#0D1117]/90"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Company Information */}
      {currentStep === 2 && (
        <div className="space-y-10">
          <div>
            <h2 className="mb-8 text-headline-medium text-[#0D1117]">Company Information</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="companyName" className="mb-2 block text-sm font-medium text-[#0D1117]">
                  Company Legal Name *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="ABC Trading Ltd."
                  required
                  className="border-[#E2E2E2] focus:border-[#0D1117] focus:ring-[#0D1117]"
                />
              </div>

              <div>
                <Label htmlFor="tradeName" className="mb-2 block text-sm font-medium text-[#0D1117]">
                  Brand / Trade Name
                </Label>
                <Input
                  id="tradeName"
                  value={formData.tradeName}
                  onChange={(e) => handleInputChange('tradeName', e.target.value)}
                  placeholder="Quality Foods (optional)"
                  className="border-[#E2E2E2] focus:border-[#0D1117] focus:ring-[#0D1117]"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="country" className="mb-2 block text-sm font-medium text-[#0D1117]">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Netherlands"
                    required
                    className="border-[#E2E2E2] focus:border-[#0D1117] focus:ring-[#0D1117]"
                  />
                </div>

                <div>
                  <Label htmlFor="city" className="mb-2 block text-sm font-medium text-[#0D1117]">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Amsterdam"
                    required
                    className="border-[#E2E2E2] focus:border-[#0D1117] focus:ring-[#0D1117]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website" className="mb-2 block text-sm font-medium text-[#0D1117]">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="border-[#E2E2E2] focus:border-[#0D1117] focus:ring-[#0D1117]"
                />
              </div>

              <div>
                <Label className="mb-3 block text-sm font-medium text-[#0D1117]">Main Product Categories</Label>
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.label)}
                      className={`rounded-md border p-4 text-left text-sm transition-all ${
                        formData.productCategories.includes(category.label)
                          ? 'border-[#0D1117] bg-white text-[#0D1117] shadow-sm'
                          : 'border-[#E2E2E2] text-[#7A7A7A] hover:border-[#7A7A7A]'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="exportMarkets" className="mb-2 block text-sm font-medium text-[#0D1117]">
                  Export Markets
                </Label>
                <Input
                  id="exportMarkets"
                  value={formData.exportMarkets}
                  onChange={(e) => handleInputChange('exportMarkets', e.target.value)}
                  placeholder="EU, Middle East, Asia"
                  className="border-[#E2E2E2] focus:border-[#0D1117] focus:ring-[#0D1117]"
                />
              </div>

              <div>
                <Label htmlFor="comments" className="mb-2 block text-sm font-medium text-[#0D1117]">
                  Additional Information
                </Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Any additional details about your business..."
                  rows={4}
                  className="border-[#E2E2E2] focus:border-[#0D1117] focus:ring-[#0D1117]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              size="lg"
              className="border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6]"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={!isStep2Valid}
              size="lg"
              className="bg-[#0D1117] px-8 font-bold text-white hover:bg-[#0D1117]/90"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Summary & Finish */}
      {currentStep === 3 && (
        <div className="space-y-10">
          <div>
            <h2 className="mb-8 text-headline-medium text-[#0D1117]">Review & Confirm</h2>

            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-title-large text-[#0D1117]">Selected Plan</h3>
                <div className="rounded-md border border-[#E2E2E2] bg-[#F6F6F6] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-title-large text-[#0D1117]">
                      {PLAN_DETAILS[selectedPlan].name}
                    </span>
                    <span className="text-headline-small text-[#0D1117]">
                      {PLAN_DETAILS[selectedPlan].price}
                      <span className="text-sm font-normal text-[#7A7A7A]">/month</span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-title-large text-[#0D1117]">Company Details</h3>
                <div className="space-y-3 rounded-md border border-[#E2E2E2] bg-[#F6F6F6] p-6 text-body-medium">
                  <div className="flex justify-between">
                    <span className="text-[#7A7A7A]">Company Name:</span>
                    <span className="font-medium text-[#0D1117]">{formData.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A7A7A]">Location:</span>
                    <span className="font-medium text-[#0D1117]">
                      {formData.city}, {formData.country}
                    </span>
                  </div>
                  {formData.website && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7A7A]">Website:</span>
                      <span className="font-medium text-[#0D1117]">{formData.website}</span>
                    </div>
                  )}
                  {formData.productCategories.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#7A7A7A]">Categories:</span>
                      <span className="font-medium text-[#0D1117]">
                        {formData.productCategories.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-[#E2E2E2] bg-[#DDE9F8] p-6">
                <p className="mb-3 text-title-medium text-[#0D1117]">What happens next</p>
                <ul className="space-y-2 text-body-medium text-[#0D1117]">
                  <li>• Your supplier account activates immediately</li>
                  <li>• Begin adding products to your catalog</li>
                  <li>• Our team reviews verification documents within 48 hours</li>
                  <li>• Payment setup follows — no billing required now</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(2)}
              disabled={isSubmitting}
              size="lg"
              className="border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6]"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="bg-[#0D1117] px-8 font-bold text-white hover:bg-[#0D1117]/90"
            >
              {isSubmitting ? 'Activating...' : 'Complete Setup'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
