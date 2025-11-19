import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="container-boxed">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-display-medium font-bold text-foreground mb-6 sm:mb-7 md:mb-8">
                Supplier Plans
              </h1>
              <p className="text-body-large text-secondary max-w-2xl mx-auto leading-relaxed">
                Access market intelligence, AI tools, and verified buyer demand. Choose how deep you want to go.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 md:py-24 bg-muted">
          <div className="container-boxed">
            <div className="grid gap-6 sm:gap-7 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {/* Basic Plan */}
              <div className="flex flex-col bg-white border border-border p-6 sm:p-8 md:p-10 rounded-lg">
                <h3 className="text-headline-small font-bold text-foreground mb-2">
                  Basic
                </h3>
                <p className="text-body-small text-secondary mb-6 sm:mb-7 md:mb-8">
                  Starter Supplier
                </p>
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-[48px] sm:text-[56px] md:text-[60px] lg:text-6xl font-bold text-foreground">€49</span>
                    <span className="text-body-medium text-secondary">/ month</span>
                  </div>
                  <p className="text-body-small text-secondary">
                    For small exporters & first-time suppliers
                  </p>
                </div>
                
                <ul className="space-y-3 sm:space-y-4 flex-1 mb-8 sm:mb-10 md:mb-12">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Company profile & product listings</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Access to RFQs (receive & respond)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Verified badge after manual review</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Basic market overview (top commodities)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Price Index by main category</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Logistics Optimizer access</span>
                  </li>
                </ul>

                <Link href="/onboarding/supplier?plan=basic">
                  <Button className="w-full h-11 sm:h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-[15px]">
                    Get started
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col bg-white border border-border p-6 sm:p-8 md:p-10 rounded-lg">
                <h3 className="text-headline-small font-bold text-foreground mb-2">
                  Pro
                </h3>
                <p className="text-body-small text-secondary mb-6 sm:mb-7 md:mb-8">
                  Growth Supplier
                </p>
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-[48px] sm:text-[56px] md:text-[60px] lg:text-6xl font-bold text-foreground">€99</span>
                    <span className="text-body-medium text-secondary">/ month</span>
                  </div>
                  <p className="text-body-small text-secondary">
                    For active exporters & mid-size processors
                  </p>
                </div>

                <p className="text-body-small font-bold text-foreground mb-6">Everything in Basic, plus:</p>
                
                <ul className="space-y-3 sm:space-y-4 flex-1 mb-8 sm:mb-10 md:mb-12">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Full Market Insights (tables & charts)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Rising demand insights (trending commodities)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Demand by destination country</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Origin preference breakdown</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Full Price Index by subcategory</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">AI RFQ matching with brief explanation</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Higher priority in RFQ matches</span>
                  </li>
                </ul>

                <Link href="/onboarding/supplier?plan=pro">
                  <Button className="w-full h-11 sm:h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-[15px]">
                    Choose Pro
                  </Button>
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="flex flex-col bg-[#DDE9F8] border border-border p-6 sm:p-8 md:p-10 rounded-lg">
                <h3 className="text-headline-small font-bold text-foreground mb-2">
                  Premium
                </h3>
                <p className="text-body-small text-secondary mb-6 sm:mb-7 md:mb-8">
                  Intelligence Supplier
                </p>
                <div className="mb-8 sm:mb-10 md:mb-12">
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-[48px] sm:text-[56px] md:text-[60px] lg:text-6xl font-bold text-foreground">€199</span>
                    <span className="text-body-medium text-secondary">/ month</span>
                  </div>
                  <p className="text-body-small text-secondary">
                    For large exporters, traders & brokers
                  </p>
                </div>

                <p className="text-body-small font-bold text-foreground mb-6">Everything in Pro, plus:</p>
                
                <ul className="space-y-3 sm:space-y-4 flex-1 mb-8 sm:mb-10 md:mb-12">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Full AI Market Summary (AI-written report)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Deep origin & fresh produce insights</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Extended time filters (7 / 30 / 90 days)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Detailed RFQ AI explanations</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Highest priority in AI matching</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 shrink-0 text-secondary mt-0.5 sm:mt-1" />
                    <span className="text-body-small text-foreground leading-relaxed">Maximum visibility across platform</span>
                  </li>
                </ul>

                <Link href="/onboarding/supplier?plan=premium">
                  <Button className="w-full h-11 sm:h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-[15px]">
                    Get Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="container-boxed">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-display-small font-bold text-foreground mb-8">
                Join a verified, market-intelligent B2B ecosystem
              </h2>
              <p className="text-body-large text-secondary leading-relaxed mb-12">
                Your products meet global demand. Let buyers find you smarter.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register/supplier">
                  <Button size="lg" className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 h-14 px-10 text-base">
                    Create supplier account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-border bg-white text-foreground hover:bg-muted h-14 px-10 text-base font-bold">
                    Log in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted">
          <div className="container-boxed">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-headline-large font-bold text-foreground mb-16 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white border border-border p-8 rounded-lg">
                  <h3 className="text-title-large font-bold text-foreground mb-4">Who is BASIC for?</h3>
                  <p className="text-body-medium text-secondary leading-relaxed">
                    Basic is perfect for small exporters and first-time suppliers who want to list their products, access RFQs, and get a high-level view of market demand.
                  </p>
                </div>
                <div className="bg-white border border-border p-8 rounded-lg">
                  <h3 className="text-title-large font-bold text-foreground mb-4">Who is PRO for?</h3>
                  <p className="text-body-medium text-secondary leading-relaxed">
                    Pro is designed for active exporters and mid-size processors who need detailed market intelligence to make informed decisions.
                  </p>
                </div>
                <div className="bg-white border border-border p-8 rounded-lg">
                  <h3 className="text-title-large font-bold text-foreground mb-4">Who is PREMIUM for?</h3>
                  <p className="text-body-medium text-secondary leading-relaxed">
                    Premium is built for large exporters, traders, and brokers who want the deepest market intelligence available.
                  </p>
                </div>
                <div className="bg-white border border-border p-8 rounded-lg">
                  <h3 className="text-title-large font-bold text-foreground mb-4">Are buyers paying anything?</h3>
                  <p className="text-body-medium text-secondary leading-relaxed">
                    No. Buyers use foodXtrade completely free—always. They can search products, request quotes, and connect with verified suppliers at no cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
