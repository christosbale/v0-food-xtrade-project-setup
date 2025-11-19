'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Loader2, AlertCircle, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { COUNTRIES } from '@/lib/countries'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  companyName: string
  phone: string
  country: string
  city: string
  address: string
  businessType: string
  purchaseInterests: string[]
  wantToSell: boolean
  selectedPlan: 'free' | 'basic' | 'pro' | 'premium'
}

export function BuyerRegistrationForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    companyName: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    businessType: '',
    purchaseInterests: [],
    wantToSell: false,
    selectedPlan: 'free',
  })

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

      if (formData.wantToSell && !formData.selectedPlan) {
        setError('Please select a subscription plan')
        setIsLoading(false)
        return
      }

      console.log('[v0] Starting buyer registration for:', formData.email)

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/products`
            : process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/products`,
          data: {
            company_name: formData.companyName,
            company_type: formData.wantToSell ? 'both' : 'buyer',
            full_name: formData.fullName,
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

      await new Promise(resolve => setTimeout(resolve, 1000))

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert({
          user_id: authData.user.id,
          company_name: formData.companyName,
          company_type: formData.wantToSell ? 'both' : 'buyer',
          country: formData.country,
          city: formData.city,
          address: formData.address,
          phone: formData.phone,
          business_email: formData.email,
          verification_status: 'pending',
          subscription_tier: formData.selectedPlan,
          can_sell: formData.wantToSell,
          business_registration_number: null,
          website: null,
          tax_id: null,
          postal_code: null,
          verification_notes: null,
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
            userType: formData.wantToSell ? 'supplier' : 'buyer'
          })
        })
        console.log('[v0] Welcome email sent:', welcomeResponse.ok)
      } catch (emailError) {
        console.error('[v0] Failed to send welcome email:', emailError)
      }
      
      router.push('/register/success')
    } catch (error) {
      console.error('[v0] Buyer registration error:', error)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const handleInterestToggle = (interest: string) => {
    const interests = formData.purchaseInterests.includes(interest)
      ? formData.purchaseInterests.filter(i => i !== interest)
      : [...formData.purchaseInterests, interest]
    setFormData({ ...formData, purchaseInterests: interests })
  }

  const plans = [
    {
      name: 'Free',
      value: 'free' as const,
      price: '€0',
      description: 'Perfect for buyers only',
      features: [
        'Browse all products',
        'Send RFQs to suppliers',
        'Direct messaging',
        'Basic analytics',
      ],
    },
    {
      name: 'Basic',
      value: 'basic' as const,
      price: '€49',
      period: '/month',
      description: 'Start selling your products',
      features: [
        'Everything in Free',
        'List up to 50 products',
        'Respond to RFQs',
        'Basic supplier tools',
        'Email support',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      value: 'pro' as const,
      price: '€99',
      period: '/month',
      description: 'For growing suppliers',
      features: [
        'Everything in Basic',
        'Unlimited products',
        'Advanced analytics',
        'Priority support',
        'Featured listings',
        'Bulk upload tools',
      ],
      popular: true,
    },
    {
      name: 'Premium',
      value: 'premium' as const,
      price: '€199',
      period: '/month',
      description: 'For established businesses',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'API access',
        'Custom integrations',
        'White-label options',
        'Advanced reporting',
      ],
      popular: false,
    },
  ]

  const canProceedToStep2 = formData.email && formData.password && formData.confirmPassword && formData.fullName && formData.companyName
  const canProceedToStep3 = formData.country && formData.city && formData.address && formData.phone && formData.businessType

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Buyer Account</CardTitle>
        <CardDescription>
          {currentStep === 1 && 'Fill in your account details'}
          {currentStep === 2 && 'Tell us about your company'}
          {currentStep === 3 && 'Choose if you want to sell products too (optional)'}
        </CardDescription>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
              {step < 3 && <div className={`flex-1 h-1 mx-2 ${step < currentStep ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
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
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
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
              <Button type="button" className="w-full" onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
                Continue
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
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
                <Input
                  id="address"
                  placeholder="123 Business Street"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
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
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="retailer">Retailer</SelectItem>
                    <SelectItem value="distributor">Distributor</SelectItem>
                    <SelectItem value="processor">Food Processor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Purchase Interests</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {['Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Grains & Cereals', 'Beverages', 'Packaged Foods'].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.purchaseInterests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <label
                        htmlFor={interest}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button type="button" className="flex-1" onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
                  Continue
                </Button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="space-y-4">
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-lg font-semibold">Do you also want to sell products?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can upgrade to a supplier account now or later from your dashboard
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    type="button"
                    variant={formData.wantToSell ? 'outline' : 'default'}
                    onClick={() => setFormData({ ...formData, wantToSell: false, selectedPlan: 'free' })}
                    className="flex-1"
                  >
                    No, buyer only
                  </Button>
                  <Button
                    type="button"
                    variant={formData.wantToSell ? 'default' : 'outline'}
                    onClick={() => setFormData({ ...formData, wantToSell: true, selectedPlan: 'basic' })}
                    className="flex-1"
                  >
                    Yes, I want to sell
                  </Button>
                </div>

                {formData.wantToSell && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-center">Choose Your Supplier Plan</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      {plans.filter(p => p.value !== 'free').map((plan) => (
                        <Card
                          key={plan.value}
                          className={`cursor-pointer transition-all ${
                            formData.selectedPlan === plan.value
                              ? 'ring-2 ring-primary'
                              : 'hover:border-primary'
                          } ${plan.popular ? 'border-primary' : ''}`}
                          onClick={() => setFormData({ ...formData, selectedPlan: plan.value })}
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{plan.name}</CardTitle>
                              {plan.popular && (
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary text-primary-foreground">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-bold">{plan.price}</span>
                              {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

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
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={!agreedToTerms || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Login here
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
