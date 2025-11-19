import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Shield, FileCheck, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-white py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="mx-auto max-w-[900px] text-center">
              <h1 className="font-bold text-foreground text-[32px] sm:text-[40px] md:text-[52px] lg:text-[64px] leading-[1.2] tracking-tight text-balance">
                The Market-Intelligent B2B Marketplace for Food Ingredients & Fresh Produce
              </h1>
              <p className="mt-4 sm:mt-5 md:mt-6 text-[16px] sm:text-[17px] md:text-[19px] lg:text-[20px] text-muted-foreground leading-[1.6] text-balance">
                Verified suppliers. AI-powered matching. Real-time market insights.
              </p>
              <div className="mt-8 sm:mt-9 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto bg-[#0D1117] text-white hover:bg-[#0D1117]/90 font-bold h-12 sm:h-14 px-6 sm:px-8 rounded-md shadow-sm text-[15px] sm:text-[16px]"
                >
                  <Link href="/products">
                    Explore Marketplace <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto bg-white border-2 border-[#0D1117] text-[#0D1117] hover:bg-[#F6F6F6] font-bold h-12 sm:h-14 px-6 sm:px-8 rounded-md text-[15px] sm:text-[16px]"
                >
                  <Link href="/suppliers">
                    For Suppliers
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="text-center mb-12 sm:mb-14 md:mb-16">
              <h2 className="font-bold text-foreground text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.2] tracking-tight">
                Real-time global demand insights
              </h2>
              <p className="mt-3 sm:mt-4 text-[16px] sm:text-[17px] md:text-[18px] text-muted-foreground leading-[1.6] max-w-[700px] mx-auto">
                Stay ahead with commodity trends, origin comparisons, and pricing signals.
              </p>
            </div>
            
            <div className="grid gap-6 sm:gap-7 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-[1100px] mx-auto">
              <div className="bg-white rounded-lg p-6 sm:p-7 md:p-8 border border-border">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-foreground flex-shrink-0" />
                  <h3 className="font-bold text-foreground text-[18px] sm:text-[19px] md:text-[20px]">Price Trends</h3>
                </div>
                <p className="text-muted-foreground text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6]">
                  Track 30-day price movements across all commodities and origins
                </p>
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border">
                  <Link href="/price-index" className="text-foreground font-semibold text-[14px] hover:underline inline-flex items-center">
                    View Price Index →
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 sm:p-7 md:p-8 border border-border">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-foreground flex-shrink-0" />
                  <h3 className="font-bold text-foreground text-[18px] sm:text-[19px] md:text-[20px]">Origin Compare</h3>
                </div>
                <p className="text-muted-foreground text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6]">
                  Compare pricing, quality, and availability across different origins
                </p>
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border">
                  <Link href="/products" className="text-foreground font-semibold text-[14px] hover:underline inline-flex items-center">
                    Compare Now →
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 sm:p-7 md:p-8 border border-border">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-foreground flex-shrink-0" />
                  <h3 className="font-bold text-foreground text-[18px] sm:text-[19px] md:text-[20px]">Demand Signals</h3>
                </div>
                <p className="text-muted-foreground text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6]">
                  Real buyer searches, RFQs, and trending commodities by region
                </p>
                <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border">
                  <Link href="/insights" className="text-foreground font-semibold text-[14px] hover:underline inline-flex items-center">
                    View Insights →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-bold text-foreground text-[40px] md:text-[48px] leading-[1.2] tracking-tight">
                Verified Ecosystem
              </h2>
              <p className="mt-4 text-[18px] text-muted-foreground leading-[1.6] max-w-[700px] mx-auto">
                Every supplier undergoes rigorous verification for trust and compliance
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-[1100px] mx-auto">
              <div className="bg-white rounded-lg p-10 border-2 border-border">
                <Shield className="h-8 w-8 text-foreground mb-6" />
                <h3 className="font-bold text-foreground text-[24px] mb-3">ID Verification</h3>
                <p className="text-muted-foreground text-[16px] leading-[1.6]">
                  Company registration, VAT numbers, and legal entity confirmation required for all suppliers
                </p>
              </div>

              <div className="bg-white rounded-lg p-10 border-2 border-border">
                <FileCheck className="h-8 w-8 text-foreground mb-6" />
                <h3 className="font-bold text-foreground text-[24px] mb-3 flex items-center gap-2">
                  Customs Verification
                  <Badge variant="customs" className="text-[12px] px-2 py-0.5">
                    EU Cleared
                  </Badge>
                </h3>
                <p className="text-muted-foreground text-[16px] leading-[1.6]">
                  Track customs status, warehouse locations, and cross-border compliance for seamless trade
                </p>
              </div>

              <div className="bg-white rounded-lg p-10 border-2 border-border">
                <CheckCircle className="h-8 w-8 text-foreground mb-6" />
                <h3 className="font-bold text-foreground text-[24px] mb-3 flex items-center gap-2">
                  Risk & Trust Score
                  <Badge variant="verified" className="text-[12px] px-2 py-0.5">
                    Low Risk
                  </Badge>
                </h3>
                <p className="text-muted-foreground text-[16px] leading-[1.6]">
                  Automated risk scoring based on documentation, history, and compliance checks
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary py-24 md:py-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="text-center">
              <h2 className="font-bold text-primary-foreground text-[40px] md:text-[56px] leading-[1.2] tracking-tight max-w-[900px] mx-auto text-balance">
                A verified, data-driven marketplace built for global suppliers.
              </h2>
              <p className="mt-6 text-[18px] md:text-[20px] text-primary-foreground/70 leading-[1.6] max-w-[700px] mx-auto">
                Join verified suppliers using AI-powered matching and market intelligence to win more business
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-bold h-[56px] px-8 rounded-md"
                >
                  <Link href="/pricing">
                    View Supplier Plans <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold h-[56px] px-8 rounded-md"
                >
                  <Link href="/suppliers">
                    Learn More
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
