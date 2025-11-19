import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function SuppliersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="section-white py-24 md:py-32">
          <div className="container-boxed">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-display-small font-bold text-foreground">
                Sell smarter with verified buyers and real-time demand insights.
              </h1>
              <p className="mt-8 text-body-large text-muted-foreground">
                Showcase your products, get AI-matched RFQs, and reach global buyers across food ingredients and fresh produce.
              </p>
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/onboarding/supplier?plan=basic">
                    Start as a supplier
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-foreground text-foreground">
                  <Link href="/pricing">
                    See pricing
                  </Link>
                </Button>
              </div>
              <p className="mt-8 text-body-small text-muted-foreground">
                Supplier accounts include verification, product listings, analytics, and RFQ matching.
              </p>
            </div>
          </div>
        </section>

        <section className="section-grey py-24 md:py-32">
          <div className="container-boxed">
            <h2 className="text-headline-medium font-bold text-foreground text-center mb-20">
              Why suppliers choose foodXtrade.
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-background border border-border rounded-md p-8">
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  Verified buyers only
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Work with pre-verified, serious buyers from Europe, Middle East, US and Asia.
                </p>
              </div>
              <div className="bg-background border border-border rounded-md p-8">
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  AI RFQ Matching
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Get matched with RFQs that suit your products, origins, and export readiness.
                </p>
              </div>
              <div className="bg-background border border-border rounded-md p-8">
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  Market-intelligent exposure
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Your listings gain visibility through demand data, category trends, and buyer activity.
                </p>
              </div>
              <div className="bg-background border border-border rounded-md p-8">
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  Fresh produce + ingredients
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Sell in bulk across nuts, dried fruits, grains, pulses, cocoa, coffee, oils, spices, and fresh produce.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white py-24 md:py-32">
          <div className="container-boxed">
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <h3 className="text-headline-small font-bold text-foreground mb-6">
                  Stand out with verified business credentials.
                </h3>
                <Badge variant="verified" className="mb-6">
                  ✓ Verified Company
                </Badge>
                <p className="text-body-medium text-muted-foreground">
                  We verify your company identity, documents and compliance to build trust with global buyers.
                </p>
              </div>
              <div>
                <h3 className="text-headline-small font-bold text-foreground mb-6">
                  Customs & export readiness made visible.
                </h3>
                <div className="flex gap-2 mb-6">
                  <Badge variant="customs">EU-CLEARED</Badge>
                  <Badge variant="customs">NON-EU</Badge>
                  <Badge variant="customs">BONDED</Badge>
                </div>
                <p className="text-body-medium text-muted-foreground">
                  Buyers see your customs status, warehouse type, and export conditions at a glance.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-grey py-24 md:py-32">
          <div className="container-boxed">
            <h2 className="text-headline-medium font-bold text-foreground text-center mb-20">
              Sell with the power of market intelligence.
            </h2>
            <div className="grid gap-16 lg:grid-cols-2">
              <div>
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground mt-1 flex-shrink-0" />
                    <span className="text-body-medium text-foreground">
                      Know what buyers search for most in your category.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground mt-1 flex-shrink-0" />
                    <span className="text-body-medium text-foreground">
                      Understand demand signals based on RFQs and activity.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground mt-1 flex-shrink-0" />
                    <span className="text-body-medium text-foreground">
                      Position your products better using origin comparisons and price trends.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-foreground mt-1 flex-shrink-0" />
                    <span className="text-body-medium text-foreground">
                      Use analytics to decide which SKUs to promote.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#DDE9F8] border border-border rounded-md p-8">
                <h4 className="text-title-large font-bold text-foreground mb-4">
                  Supplier Dashboard
                </h4>
                <p className="text-body-small text-foreground">
                  See your views, clicks, RFQ matches and product performance in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white py-24 md:py-32">
          <div className="container-boxed">
            <h2 className="text-headline-medium font-bold text-foreground text-center mb-20">
              How selling works on foodXtrade.
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-background border border-border rounded-md p-8">
                <div className="text-title-small font-bold text-muted-foreground mb-4">STEP 1</div>
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  Create your supplier profile
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Company details, verification, customs information.
                </p>
              </div>
              <div className="bg-background border border-border rounded-md p-8">
                <div className="text-title-small font-bold text-muted-foreground mb-4">STEP 2</div>
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  Upload your products
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Bulk SKUs across food ingredients and fresh produce.
                </p>
              </div>
              <div className="bg-background border border-border rounded-md p-8">
                <div className="text-title-small font-bold text-muted-foreground mb-4">STEP 3</div>
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  Get matched with buyers
                </h3>
                <p className="text-body-small text-muted-foreground">
                  AI matches your listings with relevant RFQs.
                </p>
              </div>
              <div className="bg-background border border-border rounded-md p-8">
                <div className="text-title-small font-bold text-muted-foreground mb-4">STEP 4</div>
                <h3 className="text-title-large font-bold text-foreground mb-4">
                  Connect and close deals
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Discuss details directly, on or off-platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-grey py-24 md:py-32">
          <div className="container-boxed">
            <h2 className="text-headline-medium font-bold text-foreground text-center mb-20">
              Choose the plan that fits your business.
            </h2>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Basic */}
              <div className="bg-background border border-border rounded-md p-8 flex flex-col">
                <h3 className="text-title-large font-bold text-foreground">Basic</h3>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">€49</span>
                  <span className="text-body-small text-muted-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">10 product listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">Basic RFQ access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">Verified badge</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/onboarding/supplier?plan=basic">Get started</Link>
                </Button>
              </div>

              {/* Pro */}
              <div className="bg-background border border-border rounded-md p-8 flex flex-col">
                <h3 className="text-title-large font-bold text-foreground">Pro</h3>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">€99</span>
                  <span className="text-body-small text-muted-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">50 product listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">AI RFQ matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">Analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">Priority support</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/onboarding/supplier?plan=pro">Get started</Link>
                </Button>
              </div>

              {/* Premium - highlighted with SoftBlueGrey */}
              <div className="bg-[#DDE9F8] border border-border rounded-md p-8 flex flex-col">
                <h3 className="text-title-large font-bold text-foreground">Premium</h3>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">€199</span>
                  <span className="text-body-small text-foreground">/month</span>
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">Unlimited listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">AI insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">Market intelligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-foreground mt-0.5" />
                    <span className="text-body-small text-foreground">Dedicated support</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/onboarding/supplier?plan=premium">Get started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white py-24 md:py-32">
          <div className="container-boxed">
            <h2 className="text-headline-medium font-bold text-foreground text-center mb-20">
              Categories you can sell in.
            </h2>
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  Nuts & Kernels
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Walnuts, almonds, hazelnuts, cashews, pistachios
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  Dried Fruits
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Raisins, apricots, figs, dates, prunes
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  Grains & Pulses
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Quinoa, chia, lentils, chickpeas, wheat
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  Coffee & Cocoa
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Green beans, roasted, cocoa powder, nibs
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  Oils & Fats
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Olive oil, avocado oil, coconut oil
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  Herbs & Spices
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Pepper, turmeric, cumin, cinnamon
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  Fresh Produce
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Bulk only: citrus, tropical, vegetables
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-medium font-bold text-foreground pb-3 border-b border-border">
                  And more…
                </h3>
                <p className="text-body-small text-muted-foreground">
                  Seafood, dairy, meat, packaged foods
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white py-24 md:py-32">
          <div className="container-boxed">
            <div className="max-w-3xl mx-auto text-center bg-background border border-border rounded-md p-12">
              <h2 className="text-headline-small font-bold text-foreground mb-6">
                Ready to reach verified buyers worldwide?
              </h2>
              <p className="text-body-medium text-muted-foreground mb-12">
                Create your supplier account and showcase your products today.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                  <Link href="/onboarding/supplier?plan=basic">
                    Become a supplier
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-foreground text-foreground">
                  <Link href="/pricing">
                    View pricing
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
