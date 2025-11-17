import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Intro Section */}
        <section className="border-b bg-muted/30 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-balance md:text-5xl">
                Transparent Pricing. No Commission Fees.
              </h1>
              <p className="mt-6 text-lg text-balance text-muted-foreground leading-relaxed">
                Professional subscription plans for serious B2B trade. All plans include company verification and direct RFQ access.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Enterprise companies only · Cancel anytime · No hidden fees · No commissions
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="flex flex-col rounded-lg border bg-card p-8">
                <div>
                  <h3 className="text-2xl font-bold">Basic</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€50</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                </div>
                <ul className="mt-8 space-y-4 flex-1">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Up to 10 active products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Access to RFQs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Company verification included</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                </ul>
                <Button className="mt-8 w-full" variant="outline">
                  Get started with Basic
                </Button>
              </div>

              {/* Pro Plan - Highlighted */}
              <div className="relative flex flex-col rounded-lg border-2 border-secondary bg-card p-8 shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-secondary-foreground">
                    Most popular
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€120</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                </div>
                <ul className="mt-8 space-y-4 flex-1">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Up to 50 active products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Higher visibility in search</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Priority in RFQs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Advanced analytics (views & leads)</span>
                  </li>
                </ul>
                <Button className="mt-8 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Choose Pro
                </Button>
              </div>

              {/* Premium Plan */}
              <div className="flex flex-col rounded-lg border bg-card p-8">
                <div>
                  <h3 className="text-2xl font-bold">Premium</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€250</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                </div>
                <ul className="mt-8 space-y-4 flex-1">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Unlimited products</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Sponsored / featured listings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Premium badge on profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-secondary" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                </ul>
                <div className="mt-8 flex flex-col gap-2">
                  <Button className="w-full" variant="outline">
                    Talk to sales
                  </Button>
                  <Button className="w-full" size="sm" variant="ghost">
                    Choose Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="border-y bg-muted/30 py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-center text-2xl font-bold md:text-3xl">
                Compare Plans
              </h2>
              <div className="mt-12 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-4 text-left text-sm font-semibold">Feature</th>
                      <th className="pb-4 text-center text-sm font-semibold">Basic</th>
                      <th className="pb-4 text-center text-sm font-semibold">Pro</th>
                      <th className="pb-4 text-center text-sm font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-4 text-sm">Active products limit</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">10</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">50</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-sm">Visibility boost</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Standard</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Enhanced</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Featured</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-sm">RFQ priority</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Standard</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Priority</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Top Priority</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-sm">Support level</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Email</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Email + Chat</td>
                      <td className="py-4 text-center text-sm text-muted-foreground">Dedicated</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-2xl font-bold md:text-3xl">
                Frequently Asked Questions
              </h2>
              <div className="mt-12 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold">Is foodXtrade only for companies?</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Yes. foodXtrade is exclusively for verified B2B companies. No consumers. No hobbyists. All participants must provide business registration and comply with our verification process.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Can I cancel my subscription?</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Absolutely. You can cancel your subscription at any time from your account settings. There are no cancellation fees, and you'll retain access until the end of your current billing period.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Do you charge commissions on trades?</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    No. We charge only the monthly subscription fee. Zero transaction fees. Zero commissions. Zero hidden charges. What you negotiate is what you execute.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">What payment methods do you accept?</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    We accept all major credit cards, debit cards, and bank transfers. Invoicing is available for Premium plan subscribers. All payments are processed securely through our payment partners.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t bg-primary py-16 md:py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance text-primary-foreground md:text-4xl">
                Ready to Execute Professional Trade?
              </h2>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register/supplier">
                    Create supplier account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                  <Link href="/login">
                    Login
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
