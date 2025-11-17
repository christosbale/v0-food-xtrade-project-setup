import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, Award, Package, BarChart3, Shield, CheckCircle, Factory, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export default function SuppliersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold text-balance text-primary-foreground md:text-5xl lg:text-6xl">
                Reach Enterprise Buyers. Drive Revenue. Scale Fast.
              </h1>
              <p className="mt-6 text-lg text-balance text-primary-foreground/90 md:text-xl leading-relaxed">
                Access importers, distributors, and manufacturers actively sourcing bulk food products. No consumers. No retail. B2B only.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Link href="/register/supplier">
                    Start as a Supplier <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 sm:w-auto">
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
              <div className="mt-8 text-sm text-primary-foreground/70">
                B2B marketplace only · Company verification required · Professional trade
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </section>

        {/* Why Enterprise Suppliers Choose foodXtrade */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Why Enterprise Suppliers Choose foodXtrade
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Infrastructure built for scale, security, and serious trade
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Direct Access to Enterprise Buyers</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Connect directly with importers, distributors, and manufacturers. No middlemen. No commission fees.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Verified Credentials & Certifications</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Display ISO certifications, organic credentials, and compliance documentation. Build trust through transparency.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Package className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Highlight Customs-Cleared Stock</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Promote products already cleared through EU, US customs or stored in bonded warehouses for faster delivery and competitive advantage.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Manage Products, Offers & RFQs from One Dashboard</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Professional supplier dashboard to upload products, update inventory, respond to buyer RFQs and track all your trade opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Onboarding in Four Steps */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Enterprise Onboarding in Four Steps
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Fast verification, immediate market access
              </p>
            </div>
            <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold">Create Your Company Account</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Register with company details and upload your business registration, VAT/EORI number, HACCP or ISO certificates.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold">Submit Company Documentation</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Business registration, VAT/EORI, ISO certifications. Standard compliance requirements.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold">Compliance Review</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Professional review within 48 hours. Verified suppliers receive priority placement and trust badge.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  4
                </div>
                <h3 className="mt-6 text-xl font-semibold">List Products with Full Specifications</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Detailed specifications, volume capacity, pricing structures, customs status. Professional product listings.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  5
                </div>
                <h3 className="mt-6 text-xl font-semibold">Execute Trade</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Receive qualified RFQs from verified buyers. Respond with offers. Close deals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Can You List */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                What Can You List on foodXtrade?
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                All bulk food categories for B2B trade
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Nuts & Seeds</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Walnuts, almonds, hazelnuts, cashews, pistachios, sunflower seeds, pumpkin seeds. Raw, roasted, blanched, in-shell or shelled.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Coffee & Cocoa</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Green coffee beans (Arabica, Robusta), roasted specialty coffee, raw cocoa beans, cocoa powder, cocoa butter, cocoa nibs.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Dried Fruits</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Raisins, dried apricots, figs, dates, prunes, dried cranberries, dried mango. Conventional and certified organic quality.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Spices & Herbs</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Black pepper, turmeric, cumin, coriander, paprika, cinnamon, vanilla beans, cloves, cardamom. Whole, ground or custom blends.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Grains & Pulses</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Quinoa, chia seeds, sesame, lentils, chickpeas, wheat, rice, oats, barley. Bulk volumes for food manufacturers and packers.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Oils & Other Food Ingredients</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Extra virgin olive oil, avocado oil, coconut oil, argan oil, honey, sugar, natural sweeteners, starches, food additives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparent Subscription Pricing */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Transparent Subscription Pricing
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                No hidden fees. No commissions. Predictable monthly costs.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="flex flex-col rounded-lg border bg-card p-8">
                <div>
                  <h3 className="text-2xl font-bold">Basic</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€50</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Up to 10 products
                  </p>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Up to 10 product listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Verified supplier badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Basic RFQ management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Standard email support</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 w-full" variant="outline">
                  <Link href="/pricing">Choose Plan</Link>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="relative flex flex-col rounded-lg border-2 border-secondary bg-card p-8">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-secondary px-4 py-1 text-sm font-semibold text-secondary-foreground">
                    Most Popular
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€120</span>
                    <span className="text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Up to 50 products
                  </p>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Up to 50 product listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Premium verified badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Advanced RFQ workflow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Higher visibility in search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Analytics dashboard</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 w-full">
                  <Link href="/pricing">Choose Plan</Link>
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
                  <p className="mt-2 text-sm text-muted-foreground">
                    Unlimited products
                  </p>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Unlimited product listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Elite verified supplier badge</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Sponsored product placements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Featured supplier profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>API access (coming soon)</span>
                  </li>
                </ul>
                <Button asChild className="mt-8 w-full" variant="outline">
                  <Link href="/pricing">Choose Plan</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Verification & Trust */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Verification & Trust
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Build buyer confidence through our comprehensive verification process
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Company Validation Process</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed mb-4">
                  Our compliance team verifies every supplier before activation:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>Business registration and legal entity verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>VAT number, EORI number or tax ID validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>HACCP, ISO 22000, or equivalent food safety certificates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>Organic, Fair Trade, and other quality certifications</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Award className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Benefits of Being Verified</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed mb-4">
                  Verified suppliers stand out and win more business:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>Display a prominent "Verified Supplier" badge on all listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>Gain higher trust and credibility with international buyers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>Improve conversion rates on RFQs and quote requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary" />
                    <span>Get priority placement in search results</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-2xl text-center">
              <div className="inline-flex items-center justify-center rounded-full border-2 border-secondary bg-secondary/10 px-6 py-3">
                <Shield className="mr-3 h-8 w-8 text-secondary" />
                <span className="text-xl font-bold text-secondary">Verified Supplier</span>
              </div>
            </div>
          </div>
        </section>

        {/* Built For Professional Suppliers */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Built For Professional Suppliers
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Enterprise exporters, processors, and producers
              </p>
            </div>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Export Companies & Trading Houses</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Expand market reach to verified enterprise buyers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Execute larger volume deals with qualified counterparties</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Factory className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Processors & Packers</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Roasters, dryers, hulling facilities, and food processors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Showcase value-added products with certifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Offer private label and co-packing services</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Producers & Cooperatives</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Farmer cooperatives and origin producers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Promote direct-from-origin quality and traceability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Build long-term relationships with ethical buyers</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold text-balance text-primary-foreground md:text-4xl">
                Ready to Scale Your Export Business?
              </h2>
              <p className="mt-4 text-lg text-balance text-primary-foreground/90 leading-relaxed">
                Join verified suppliers executing enterprise-level trade on foodXtrade
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register/supplier">
                    Create Supplier Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                  <Link href="/pricing">
                    Talk to Us
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
