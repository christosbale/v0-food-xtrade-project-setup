import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, Zap, Globe, TrendingUp, CheckCircle, Users, MapPin, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-white py-20 md:py-32">
          <div className="container relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left side: Text + CTAs */}
              <div>
                <h1 className="text-5xl font-bold text-balance text-black md:text-6xl lg:text-7xl leading-tight">
                  B2B Food Trading{' '}
                  <span className="relative inline-block">
                    <span className="text-[#FFB84D]">Built for Scale</span>
                    <span className="absolute bottom-1 left-0 h-1 w-full bg-[#FFB84D]"></span>
                  </span>
                </h1>
                <p className="mt-6 text-xl text-balance text-muted-foreground leading-relaxed max-w-xl">
                  Connect verified suppliers with qualified buyers. No consumers. No hobbyists. Professional companies only.
                </p>
                <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full sm:w-auto bg-[#FFB84D] text-black hover:bg-[#FFA62F] font-semibold text-lg px-8 py-6 h-auto transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#FFB84D]/20"
                  >
                    <Link href="/register">
                      Start Trading Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-[#FFB84D] bg-transparent text-[#FFB84D] hover:bg-[#FFB84D]/10 font-semibold text-lg px-8 py-6 h-auto transition-all"
                  >
                    <Link href="/products">
                      Browse Market
                    </Link>
                  </Button>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#FFB84D]" />
                    <span>Built for real businesses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#FFB84D]" />
                    <span>Verified companies only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#FFB84D]" />
                    <span>Direct supplier access</span>
                  </div>
                </div>
              </div>

              {/* Right side: Market Snapshot Card */}
              <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8 border-2">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Live Market</h3>
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-[#FFB84D] animate-pulse"></span>
                    Updated now
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Product 1 */}
                  <div className="flex gap-4 p-4 rounded-lg border hover:border-[#FFB84D]/30 hover:bg-gray-50/50 transition-all cursor-pointer">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src="/organic-apples.png"
                        alt="Organic Apples"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 truncate">Organic Apples</h4>
                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">$2.40/kg</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>Poland</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] text-xs font-medium border border-[#FFB84D]/20">
                          <CheckCircle className="h-3 w-3" />
                          EU Customs Cleared
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] text-xs font-medium border border-[#FFB84D]/20">
                          Verified Supplier
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product 2 */}
                  <div className="flex gap-4 p-4 rounded-lg border hover:border-[#FFB84D]/30 hover:bg-gray-50/50 transition-all cursor-pointer">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src="/pile-of-coffee-beans.png"
                        alt="Coffee Beans"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 truncate">Premium Coffee Beans</h4>
                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">$8.50/kg</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>Brazil</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] text-xs font-medium border border-[#FFB84D]/20">
                          <CheckCircle className="h-3 w-3" />
                          Verified Supplier
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product 3 */}
                  <div className="flex gap-4 p-4 rounded-lg border hover:border-[#FFB84D]/30 hover:bg-gray-50/50 transition-all cursor-pointer">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src="/olive-oil-still-life.png"
                        alt="Olive Oil"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 truncate">Extra Virgin Olive Oil</h4>
                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">$6.20/L</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>Spain</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] text-xs font-medium border border-[#FFB84D]/20">
                          <CheckCircle className="h-3 w-3" />
                          EU Customs Cleared
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] text-xs font-medium border border-[#FFB84D]/20">
                          Verified Supplier
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product 4 */}
                  <div className="flex gap-4 p-4 rounded-lg border hover:border-[#FFB84D]/30 hover:bg-gray-50/50 transition-all cursor-pointer">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src="/fresh-tomatoes.png"
                        alt="Tomatoes"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-gray-900 truncate">Fresh Tomatoes</h4>
                        <span className="font-bold text-gray-900 text-sm whitespace-nowrap">$1.80/kg</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span>Netherlands</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] text-xs font-medium border border-[#FFB84D]/20">
                          <CheckCircle className="h-3 w-3" />
                          EU Customs Cleared
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFB84D]/10 text-[#FFB84D] text-xs font-medium border border-[#FFB84D]/20">
                          Verified Supplier
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-6 bg-[#FFB84D] text-black hover:bg-[#FFA62F] font-semibold">
                  <Link href="/products">
                    View All Products <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </section>

        {/* Stats Section */}
        <section className="border-b bg-muted/30 py-12">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">5,000+</div>
                <div className="mt-2 text-sm text-muted-foreground">Verified Suppliers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">10,000+</div>
                <div className="mt-2 text-sm text-muted-foreground">Professional Buyers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">50+</div>
                <div className="mt-2 text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">$2M+</div>
                <div className="mt-2 text-sm text-muted-foreground">Monthly Volume</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Built for Serious Trade
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                Enterprise-grade infrastructure for professional food buyers and suppliers
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Verified Network</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Every company undergoes rigorous verification. Business registration, compliance documentation, and financial checks required.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Zap className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Instant RFQs</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Submit quote requests and receive competitive offers from multiple verified suppliers within hours.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Globe className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Global Reach</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Direct access to suppliers and buyers across 50+ countries. No middlemen. No gatekeepers.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Real-Time Analytics</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Track performance metrics, analyze market trends, and make data-driven sourcing decisions.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Dedicated Support</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Our team provides personalized support to help you succeed on the platform.
                </p>
              </div>
              <div className="flex flex-col items-start rounded-lg border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Secure Transactions</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Built-in payment protection and escrow services ensure safe, reliable transactions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-balance md:text-4xl">
                Start Trading in Minutes
              </h2>
              <p className="mt-4 text-lg text-balance text-muted-foreground leading-relaxed">
                No lengthy approvals. No complex onboarding. Get verified and start trading.
              </p>
            </div>
            <div className="mt-16 grid gap-12 md:grid-cols-3">
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold">Sign Up & Verify</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Create your account as a supplier or buyer. Complete our quick verification process to get started.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold">List or Browse</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Suppliers list products, buyers browse catalogs or submit RFQs to find what they need.
                </p>
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold">Connect & Trade</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Negotiate terms, finalize deals, and manage transactions securely through our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold text-balance text-primary-foreground md:text-4xl">
                Ready to Scale Your Food Trading Operation?
              </h2>
              <p className="mt-4 text-lg text-balance text-primary-foreground/90 leading-relaxed">
                Join enterprise suppliers and buyers already executing millions in trade volume
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register">
                    Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20">
                  <Link href="/contact">
                    Contact Sales
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
