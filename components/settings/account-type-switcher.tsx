'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, TrendingUp, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AccountTypeSwitcherProps {
  currentType: string
  canSell: boolean
  currentTier: string
}

export function AccountTypeSwitcher({ currentType, canSell, currentTier }: AccountTypeSwitcherProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'premium'>('basic')
  const [error, setError] = useState<string | null>(null)

  // If already can sell, don't show this component
  if (canSell) {
    return null
  }

  const plans = [
    {
      name: 'Basic',
      value: 'basic' as const,
      price: '€49',
      period: '/month',
      features: [
        'List up to 50 products',
        'Respond to RFQs',
        'Basic analytics',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      value: 'pro' as const,
      price: '€99',
      period: '/month',
      popular: true,
      features: [
        'Unlimited products',
        'Advanced analytics',
        'Priority support',
        'Featured listings',
      ],
    },
    {
      name: 'Premium',
      value: 'premium' as const,
      price: '€199',
      period: '/month',
      features: [
        'Dedicated manager',
        'API access',
        'Custom integrations',
        'Advanced reporting',
      ],
    },
  ]

  const handleUpgrade = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/account/upgrade-to-supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upgrade account')
      }

      router.push('/dashboard/upgrade/success')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Become a Supplier
        </CardTitle>
        <CardDescription>
          Start selling your products to buyers worldwide
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h4 className="font-semibold">Why become a supplier?</h4>
          <div className="grid gap-3">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Expand Your Market Reach</p>
                <p className="text-xs text-muted-foreground">
                  Connect with verified buyers from around the world
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">List Your Products</p>
                <p className="text-xs text-muted-foreground">
                  Showcase your catalog with detailed specs and pricing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Keep Buying Capabilities</p>
                <p className="text-xs text-muted-foreground">
                  You can still purchase products as a buyer
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Choose Your Plan</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.value}
                className={`cursor-pointer transition-all ${
                  selectedPlan === plan.value
                    ? 'ring-2 ring-primary'
                    : 'hover:border-primary'
                } ${plan.popular ? 'border-primary' : ''}`}
                onClick={() => setSelectedPlan(plan.value)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge variant="default" className="text-xs">Popular</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs">
                        <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button onClick={handleUpgrade} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Upgrading Account...
            </>
          ) : (
            `Upgrade to ${plans.find(p => p.value === selectedPlan)?.name} Plan`
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You can change or cancel your plan anytime from billing settings
        </p>
      </CardContent>
    </Card>
  )
}
