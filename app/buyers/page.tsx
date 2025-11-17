import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Filter, FileText, CheckCircle, Building, Factory } from 'lucide-react'
import Link from 'next/link'

export default function BuyersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary py-20 md:py-32">
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold text-balance text-primary-foreground md:text-5xl lg:text-6xl">
                Source Smarter. Negotiate Better. Execute Faster.
              </h1>
              <p className="mt-6 text-lg text-balance text-primary-foreground/90 md:text-xl leading-relaxed">
                Direct access to verified bulk food suppliers. Real-time pricing. Transparent documentation. Built for professional procurement teams.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Link href="/products">
                    Browse Market Listings <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 sm:w-auto">
                  <Link href="/register/buyer">
                    Create Buyer Account
                  </Link>
                </Button>
              </div>
              <div className="mt-8 text-sm text-primary-foreground/70">
                Enterprise B2B only · Verified suppliers · Professional sourcing
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </section>

        {/* Why Buyers Use foodXtrade */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Built For Enterprise Procurement
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Infrastructure designed for serious sourcing operations
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Verified Suppliers Only</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Every supplier verified with business registration, compliance documentation, and financial checks. No exceptions.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Filter className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Advanced Filtering</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Filter products by origin country, certifications (Organic, Fair Trade, ISO), customs status, and crop year to find exactly what you need.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Direct RFQ Workflow</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Send targeted quote requests directly to suppliers. Specify volumes, Incoterms, and required documentation. Get responses fast.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Compare & Execute</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Review multiple offers side-by-side. Compare pricing, terms, and supplier credentials. Execute deals with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Can Find */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                What You Can Find on foodXtrade
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Premium bulk food ingredients from verified suppliers worldwide
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Nuts</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Walnuts, almonds, hazelnuts, cashews, pistachios in bulk. EU and US customs cleared stock available from Turkey, USA, Spain.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Coffee & Cocoa</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Green coffee beans, roasted specialty coffee, raw cocoa beans, cocoa powder. Origins: Ethiopia, Colombia, Brazil, Ghana, Ivory Coast.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Dried Fruits</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Raisins, apricots, figs, dates, prunes in conventional and organic quality. Suppliers from Turkey, Iran, California.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Spices</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Black pepper, turmeric, cumin, coriander, paprika, vanilla. Whole, ground, or custom blends from India, Vietnam, Madagascar.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Grains & Seeds</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Quinoa, chia seeds, sesame, sunflower seeds, wheat, rice. Conventional and certified organic from South America, Asia, Europe.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold">Oils & Other Ingredients</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Extra virgin olive oil, avocado oil, coconut oil, honey, sugar, starches. Premium quality with full traceability documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works for Buyers */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Professional Sourcing in Three Steps
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Fast onboarding, immediate supplier access
              </p>
            </div>
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold">Create Enterprise Account</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Business email required. Company verification for full platform access.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold">Search & Filter with Precision</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Filter by origin, certifications, customs status, and supplier verification level. Find exactly what you need.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold">Send RFQs & Close Deals</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Request quotes with your specifications. Compare offers from multiple suppliers. Finalize contracts on your terms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk & Compliance */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Professional Due Diligence
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Comprehensive supplier verification and documentation
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Company Verification</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Business registration and tax ID validation for all suppliers
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Uploaded Documents</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Access HACCP, ISO, Organic, Fair Trade certificates and lab test reports
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Full Traceability</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  See origin country, crop year, certifications and customs status for every product
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-2xl rounded-lg border-l-4 border-secondary bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Important:</strong> foodXtrade provides the marketplace infrastructure. You maintain full control over contracts, payment terms, and logistics. We facilitate connections—you execute trade on your terms.
              </p>
            </div>
          </div>
        </section>

        {/* For Whom Is foodXtrade Ideal */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Built For Enterprise Buyers
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Professional procurement teams and trading operations
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Building className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Import & Distribution Companies</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Source bulk volumes from verified origin suppliers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Access customs-cleared inventory for fast delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Verify compliance documentation before commitment</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Factory className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Manufacturing & Processing</h3>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Food manufacturers and ingredient processors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Source certified organic and specialty-grade materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Negotiate private label and processing arrangements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary" />
                    <span>Build reliable supply chains with verified suppliers</span>
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
                Ready to Optimize Your Sourcing?
              </h2>
              <p className="mt-4 text-lg text-balance text-primary-foreground/90 leading-relaxed">
                Join procurement teams executing smarter sourcing on foodXtrade
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/products">
                    Browse the Market <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                  <Link href="/register/buyer">
                    Create Buyer Account
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
