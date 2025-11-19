'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Step = 1 | 2 | 3 | 4

interface FormData {
  // Step 1: Account
  email: string
  password: string
  confirmPassword: string
  
  // Step 2: Company
  companyName: string
  registrationNumber: string
  country: string
  city: string
  address: string
  phone: string
  website: string
  
  // Step 3: Business
  businessType: string
  yearsInBusiness: string
  productCategories: string[]
  certifications: string
  
  // Step 4: Documents
  businessLicense: File | null
  taxCertificate: File | null
  qualityCertificates: File | null
}

export function SupplierRegistrationForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    registrationNumber: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    website: '',
    businessType: '',
    yearsInBusiness: '',
    productCategories: [],
    certifications: '',
    businessLicense: null,
    taxCertificate: null,
    qualityCertificates: null,
  })

  const progress = (currentStep / 4) * 100

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient()

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setIsLoading(false)
        return
      }

      console.log('[v0] Starting registration for:', formData.email)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            company_name: formData.companyName,
            company_type: 'supplier',
          }
        }
      })

      if (authError) {
        console.error('[v0] Auth error:', authError)
        if (authError.message.includes('User already registered')) {
          setError('This email is already registered. Please log in instead.')
        } else if (authError.message.includes('For security purposes')) {
          setError('Too many registration attempts. Please wait a minute and try again.')
        } else {
          setError(`Registration error: ${authError.message}`)
        }
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setError('Registration failed. Please try again.')
        setIsLoading(false)
        return
      }

      console.log('[v0] Auth user created:', authData.user.id)
      console.log('[v0] Session established:', !!authData.session)

      await new Promise(resolve => setTimeout(resolve, 1000))

      const { data: sessionData } = await supabase.auth.getSession()
      console.log('[v0] Session after delay:', !!sessionData.session)

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          user_id: authData.user.id,
          company_name: formData.companyName,
          company_type: 'supplier',
          business_registration_number: formData.registrationNumber,
          country: formData.country,
          city: formData.city,
          address: formData.address,
          phone: formData.phone,
          website: formData.website || null,
          business_email: formData.email,
          verification_status: 'pending',
          subscription_tier: 'basic',
        })
        .select()
        .single()

      if (companyError) {
        console.error('[v0] Company creation error:', companyError)
        
        if (companyError.message.includes('row-level security')) {
          setError('Registration requires email confirmation. Please check your email and click the confirmation link, then try logging in.')
          setIsLoading(false)
          return
        } else if (companyError.code === '23505') {
          setError('A company is already registered with this information.')
        } else {
          setError(`Company setup failed: ${companyError.message}. Please contact support with user ID: ${authData.user.id}`)
        }
        setIsLoading(false)
        return
      }

      console.log('[v0] Company created successfully:', companyData)
      
      try {
        const welcomeResponse = await fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            userType: 'supplier'
          })
        })
        console.log('[v0] Welcome email sent:', welcomeResponse.ok)
      } catch (emailError) {
        console.error('[v0] Failed to send welcome email:', emailError)
        // Don't fail registration if email fails
      }
      
      router.push('/register/success')
    } catch (error) {
      console.error('[v0] Unexpected registration error:', error)
      setError('An unexpected error occurred. Please try again or contact support.')
      setIsLoading(false)
    }
  }

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData({ ...formData, [field]: file })
  }

  const handleCategoryToggle = (category: string) => {
    const categories = formData.productCategories.includes(category)
      ? formData.productCategories.filter(c => c !== category)
      : [...formData.productCategories, category]
    setFormData({ ...formData, productCategories: categories })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Step {currentStep} of 4</span>
          <span className="text-muted-foreground">{progress.toFixed(0)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Create your login credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@yourcompany.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>
                Tell us about your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Your Company Ltd."
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Business Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  placeholder="123456789"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="cn">China</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address *</Label>
                <Textarea
                  id="address"
                  placeholder="123 Business Street, Suite 100"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Help buyers understand your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="wholesaler">Wholesaler</SelectItem>
                    <SelectItem value="trader">Trader</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                <Select value={formData.yearsInBusiness} onValueChange={(value) => setFormData({ ...formData, yearsInBusiness: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product Categories *</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {['Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Grains & Cereals', 'Beverages', 'Packaged Foods'].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={formData.productCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Standards</Label>
                <Textarea
                  id="certifications"
                  placeholder="List any food safety certifications (e.g., ISO 22000, HACCP, FDA, etc.)"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload required documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessLicense">Business License *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="businessLicense"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {formData.businessLicense && (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, or PNG (max 5MB)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxCertificate">Tax Registration Certificate *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="taxCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('taxCertificate', e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {formData.taxCertificate && (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG, or PNG (max 5MB)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualityCertificates">Quality/Safety Certificates</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="qualityCertificates"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('qualityCertificates', e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {formData.qualityCertificates && (
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Optional: ISO, HACCP, FDA, etc. (max 5MB)
                </p>
              </div>
              <div className="flex items-start space-x-2 rounded-lg border p-4">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </label>
                  <p className="text-sm text-muted-foreground">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {currentStep < 4 ? (
            <Button type="button" onClick={handleNext}>
              Next Step
            </Button>
          ) : (
            <Button type="submit" disabled={!agreedToTerms || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
