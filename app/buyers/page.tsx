import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, TrendingUp, BarChart3, Users } from 'lucide-react'
import Link from 'next/link'

export default function BuyersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-white py-24 md:py-32">
          <div className="container-boxed">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-display-small font-bold text-[#0D1117] text-balance">
                Find verified food suppliers with real-time market intelligence.
              </h1>
              <p className="mt-6 text-body-large text-[#7A7A7A] text-balance">
                Discover suppliers, compare origins, and source smarter using AI-powered RFQs and live demand signals.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-[#0D1117] text-white font-bold hover:bg-[#0D1117]/90">
                  <Link href="/products">
                    Browse marketplace <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#0D1117] text-[#0D1117] font-bold hover:bg-[#F6F6F6]">
                  <Link href="/rfqs/new">
                    Post an RFQ
                  </Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-[#7A7A7A]">
                Buyers use foodXtrade for free — always.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#F6F6F6] py-20 md:py-28">
          <div className="container-boxed">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-headline-medium font-bold text-[#0D1117] text-balance">
                Why Buyers Use foodXtrade
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Verified suppliers only
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Company verification, customs checks and risk scoring built-in.
                </p>
              </div>
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  AI RFQ matching
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Your RFQs are matched to the most relevant suppliers based on product, origin, customs and risk.
                </p>
              </div>
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Market-intelligent sourcing
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Use demand signals, price index and origin comparison to negotiate from a position of strength.
                </p>
              </div>
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  From bulk ingredients to fresh produce
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Source nuts, dried fruits, coffee, grains, pulses and fresh produce – all in bulk.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container-boxed">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-headline-medium font-bold text-[#0D1117] mb-6">
                  Turn market data into better purchasing decisions.
                </h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#0D1117] mt-0.5 flex-shrink-0" />
                    <span className="text-body-medium text-[#7A7A7A]">
                      See which commodities are trending in demand.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#0D1117] mt-0.5 flex-shrink-0" />
                    <span className="text-body-medium text-[#7A7A7A]">
                      Understand price ranges and origin differences.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#0D1117] mt-0.5 flex-shrink-0" />
                    <span className="text-body-medium text-[#7A7A7A]">
                      Anticipate supply shifts with demand signals and RFQs.
                    </span>
                  </li>
                </ul>
                <div className="bg-[#DDE9F8] border border-[#E2E2E2] p-6 rounded-md">
                  <h4 className="text-title-medium font-bold text-[#0D1117] mb-2">
                    Price Index & Origin Comparison
                  </h4>
                  <p className="text-body-small text-[#7A7A7A]">
                    Compare prices, origins and seasonality before you commit to a deal.
                  </p>
                </div>
              </div>
              <div className="bg-[#F6F6F6] border border-[#E2E2E2] p-8 rounded-md h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-[#7A7A7A] mx-auto mb-4" />
                  <p className="text-body-small text-[#7A7A7A]">
                    Market intelligence dashboard preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F6F6F6] py-20 md:py-28">
          <div className="container-boxed">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-headline-medium font-bold text-[#0D1117] text-balance">
                How RFQs work on foodXtrade.
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#0D1117] text-white font-bold text-lg mb-6">
                  1
                </div>
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Describe your need
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Select commodity, origin preferences, customs status and delivery country.
                </p>
              </div>
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#0D1117] text-white font-bold text-lg mb-6">
                  2
                </div>
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  AI matches you to suppliers
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  We use supplier data, products and risk scoring to recommend the best matches.
                </p>
              </div>
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#0D1117] text-white font-bold text-lg mb-6">
                  3
                </div>
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Connect and negotiate
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Contact verified suppliers directly and move your negotiation off-platform if you wish.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container-boxed">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-headline-medium font-bold text-[#0D1117] text-balance">
                Trust & Verification
              </h2>
            </div>
            <div className="grid gap-12 md:grid-cols-2">
              <div className="text-center">
                <Badge variant="verified" className="mb-4">
                  ✓ Verified Company
                </Badge>
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Verified companies
                </h3>
                <p className="text-body-medium text-[#7A7A7A] leading-relaxed">
                  We verify supplier companies, documentation and risk signals so you don't start from zero trust.
                </p>
              </div>
              <div className="text-center">
                <Badge variant="customs" className="mb-4">
                  CUSTOMS-CLEARED
                </Badge>
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Customs & compliance
                </h3>
                <p className="text-body-medium text-[#7A7A7A] leading-relaxed">
                  See customs status, warehouse location and export readiness for each product.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F6F6F6] py-20 md:py-28">
          <div className="container-boxed">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-headline-medium font-bold text-[#0D1117] text-balance">
                Built for professional buyers.
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <TrendingUp className="h-10 w-10 text-[#0D1117] mb-4" />
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Importers & distributors
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Secure consistent volume with verified suppliers and clear logistics.
                </p>
              </div>
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <Users className="h-10 w-10 text-[#0D1117] mb-4" />
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Food manufacturers
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Source ingredients and commodities with clear quality and origin data.
                </p>
              </div>
              <div className="bg-white border border-[#E2E2E2] p-8 rounded-md">
                <BarChart3 className="h-10 w-10 text-[#0D1117] mb-4" />
                <h3 className="text-title-large font-bold text-[#0D1117] mb-3">
                  Traders & brokers
                </h3>
                <p className="text-body-small text-[#7A7A7A] leading-relaxed">
                  Spot market opportunities using demand, price and origin data.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="container-boxed">
            <div className="mx-auto max-w-3xl bg-white border border-[#E2E2E2] p-12 rounded-md text-center">
              <h2 className="text-headline-medium font-bold text-[#0D1117] text-balance mb-4">
                Ready to source smarter?
              </h2>
              <p className="text-body-large text-[#7A7A7A] text-balance mb-8">
                Create a free buyer account, post your first RFQ and let the platform do the heavy lifting.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-[#0D1117] text-white font-bold hover:bg-[#0D1117]/90">
                  <Link href="/register/buyer">
                    Create buyer account
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#0D1117] text-[#0D1117] font-bold hover:bg-[#F6F6F6]">
                  <Link href="/products">
                    Browse products
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
