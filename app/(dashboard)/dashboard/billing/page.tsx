import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard } from 'lucide-react'
import { getCurrentCompany } from '@/lib/auth/current-company'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChangePlanButton } from '@/components/billing/change-plan-button'
import { AddPaymentMethodDialog } from '@/components/billing/add-payment-method-dialog'

export default async function BillingPage() {
  const session = await getCurrentCompany()

  if (!session?.company) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch current subscription details
  const { data: currentSubscription } = await supabase
    .from('subscription_history')
    .select('*, plan:subscription_plans(*)')
    .eq('company_id', session.company.id)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Fetch all available plans
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  // Fetch products count
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', session.company.id)

  // Fetch active RFQs count
  const { count: rfqsCount } = await supabase
    .from('rfqs')
    .select('*', { count: 'exact', head: true })
    .eq('supplier_company_id', session.company.id)
    .eq('status', 'pending')

  // Fetch payment method
  const { data: paymentMethod } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('company_id', session.company.id)
    .eq('is_default', true)
    .maybeSingle()

  const currentPlan = currentSubscription?.plan || plans?.find(p => p.id === 'free')
  const currentPlanData = {
    name: currentPlan?.name || 'Free',
    price: currentPlan?.price || 0,
    status: currentSubscription?.status === 'active' ? 'Active' : 'Inactive',
    id: currentPlan?.id || 'free'
  }

  const usage = {
    activeProducts: productsCount || 0,
    productsLimit: currentPlan?.products_limit || 5,
    activeRfqs: rfqsCount || 0,
  }

  // Calculate next billing date (30 days from subscription start)
  const nextBillingDate = currentSubscription
    ? new Date(new Date(currentSubscription.started_at).getTime() + 30 * 24 * 60 * 60 * 1000)
    : new Date()

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
              <CardTitle className="text-2xl">Current Plan: {currentPlanData.name}</CardTitle>
              <CardDescription className="text-lg mt-1">
                €{currentPlanData.price} / month
              </CardDescription>
            </div>
            <Badge 
              variant={currentPlanData.status === 'Active' ? 'default' : 'destructive'}
              className="text-sm px-3 py-1"
            >
              {currentPlanData.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Products</p>
              <p className="text-2xl font-bold">
                {usage.activeProducts} 
                {usage.productsLimit && (
                  <span className="text-base font-normal text-muted-foreground"> / {usage.productsLimit}</span>
                )}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active RFQs</p>
              <p className="text-2xl font-bold">{usage.activeRfqs}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Plan Status</p>
              <p className="text-2xl font-bold">{currentPlanData.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid gap-6 lg:grid-cols-4">
          {plans?.map((plan) => {
            const isCurrentPlan = plan.id === currentPlanData.id
            const isPro = plan.id === 'pro'
            const features = Array.isArray(plan.features) ? plan.features : []
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${isPro ? 'border-secondary border-2' : ''} ${isCurrentPlan ? 'bg-muted/50' : ''}`}
              >
                {isPro && (
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
                    {features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <ChangePlanButton 
                    planId={plan.id}
                    planName={plan.name}
                    isCurrentPlan={isCurrentPlan}
                  />
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
              <p className="font-medium">
                {paymentMethod 
                  ? `${paymentMethod.card_brand} ending in ${paymentMethod.card_last_four}`
                  : 'No payment method added'
                }
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="font-medium">{nextBillingDate.toLocaleDateString()}</p>
            </div>
          </div>
          <AddPaymentMethodDialog />
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
