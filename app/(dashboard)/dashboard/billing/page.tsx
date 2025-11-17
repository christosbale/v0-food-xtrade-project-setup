import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard } from 'lucide-react'

export default function BillingPage() {
  // TODO: Fetch actual data from API/database
  const currentPlan = {
    name: 'Pro',
    price: 150,
    status: 'Active' as 'Active' | 'Trial' | 'Expired',
  }

  const usage = {
    activeProducts: 42,
    productsLimit: 100,
    activeOffers: 18,
    rfqsThisMonth: 34,
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 50,
      features: [
        'Up to 20 products',
        'Basic RFQ responses',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 150,
      features: [
        'Up to 100 products',
        'Unlimited RFQ responses',
        'Priority email support',
        'Advanced analytics',
        'Custom branding',
        'API access',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 300,
      features: [
        'Unlimited products',
        'Unlimited RFQ responses',
        '24/7 phone support',
        'Enterprise analytics',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
      ],
    },
  ]

  const paymentDetails = {
    method: 'Visa ending in 1234',
    nextBillingDate: '01/12/2025',
  }

  return (
    <div className="container max-w-7xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Plan</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and billing details
        </p>
      </div>

      {/* Current Plan Summary */}
      <Card className="border-2 border-secondary">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Current Plan: {currentPlan.name}</CardTitle>
              <CardDescription className="text-lg mt-1">
                €{currentPlan.price} / month
              </CardDescription>
            </div>
            <Badge 
              variant={currentPlan.status === 'Active' ? 'default' : currentPlan.status === 'Trial' ? 'secondary' : 'destructive'}
              className="text-sm px-3 py-1"
            >
              {currentPlan.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Products</p>
              <p className="text-2xl font-bold">
                {usage.activeProducts} <span className="text-base font-normal text-muted-foreground">/ {usage.productsLimit}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Offers</p>
              <p className="text-2xl font-bold">{usage.activeOffers}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">RFQs This Month</p>
              <p className="text-2xl font-bold">{usage.rfqsThisMonth}</p>
            </div>
          </div>
          <Button size="lg" className="w-full md:w-auto">
            Change Plan
          </Button>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrentPlan = plan.name === currentPlan.name
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-secondary border-2' : ''} ${isCurrentPlan ? 'bg-muted/50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-secondary text-secondary-foreground">Most Popular</Badge>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-background">Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-4xl font-bold">€{plan.price}</span>
                    <span className="text-muted-foreground"> / month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={isCurrentPlan ? 'outline' : 'default'}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Manage your payment method and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-medium">{paymentDetails.method}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="font-medium">{paymentDetails.nextBillingDate}</p>
            </div>
          </div>
          <Button variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            Update Payment Method
          </Button>
        </CardContent>
      </Card>

      {/* Billing Information Notice */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            All plans are billed monthly. You can upgrade, downgrade, or cancel your subscription at any time. 
            Changes to your plan will be reflected in your next billing cycle.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
