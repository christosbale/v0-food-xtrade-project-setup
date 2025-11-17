import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Shield, FileText, Search, Send, MessageSquare, Package, TrendingUp, Users, Building2, Factory, ShoppingCart, Coffee, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-black py-20 md:py-28">
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                How foodXtrade works
              </h1>
              <p className="mt-6 text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                A subscription-based B2B marketplace connecting verified food suppliers 
                and buyers through transparent offers, documentation and RFQs.
              </p>
              
              <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-sm px-4 py-2">
                  B2B only
                </Badge>
                <Badge variant="secondary" className="bg-[#9FE870]/10 text-[#9FE870] border-[#9FE870]/20 text-sm px-4 py-2">
                  Verified companies
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-sm px-4 py-2">
                  Global food ingredients
                </Badge>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-[#9FE870] text-black hover:bg-[#8DD65F] font-semibold text-lg px-8 py-6 h-auto transition-all hover:scale-105"
                >
                  <Link href="/suppliers">
                    I'm a supplier <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg"
                  className="bg-[#9FE870] text-black hover:bg-[#8DD65F] font-semibold text-lg px-8 py-6 h-auto transition-all hover:scale-105"
                >
                  <Link href="/buyers">
                    I'm a buyer <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6">
                <Link 
                  href="/products"
                  className="text-[#9FE870] hover:text-[#8DD65F] font-medium inline-flex items-center gap-2 transition-colors"
                >
                  Browse the market <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </section>

        {/* The Big Picture Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl font-bold md:text-5xl">The big picture</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Understanding the foodXtrade platform flow
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
              {/* Left: Narrative */}
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  <strong className="text-foreground">Suppliers</strong> create verified company profiles 
                  and list bulk products with detailed information including quantities, prices, customs 
                  status, and certifications.
                </p>
                <p>
                  <strong className="text-foreground">Buyers</strong> search through the marketplace, 
                  filter by origin, certifications, and customs status, then send targeted RFQs 
                  (Requests for Quote) to multiple suppliers at once.
                </p>
                <p className="text-muted-foreground">
                  foodXtrade provides the marketplace infrastructure, verification tools, and 
                  communication channels. We facilitate the connection, but suppliers and buyers 
                  maintain their own contracts, payments, and logistics arrangements.
                </p>
              </div>

              {/* Right: Simple Diagram */}
              <Card className="p-8 border-2">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#9FE870]/10 text-[#9FE870]">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Suppliers list products</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        With quantities, prices, and customs status
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#9FE870]/10 text-[#9FE870]">
                      <Search className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Buyers search & send RFQs</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Filter by criteria and request quotes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#9FE870]/10 text-[#9FE870]">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Deals move forward off-platform</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You maintain your own contracts & logistics
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Split Section: Suppliers vs Buyers */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left: For Suppliers */}
              <Card className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#9FE870]/10">
                    <Building2 className="h-6 w-6 text-[#9FE870]" />
                  </div>
                  <h2 className="text-3xl font-bold">For Suppliers</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Create your company account</h3>
                      <p className="text-muted-foreground">
                        Upload business documents, VAT/EORI and certifications.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Get verified</h3>
                      <p className="text-muted-foreground">
                        Our team reviews your company and marks you as Verified.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Publish your bulk products</h3>
                      <p className="text-muted-foreground">
                        Add quantities, price ranges, Incoterms and customs status 
                        (EU-cleared, US-cleared, bonded warehouse, etc.).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Receive RFQs</h3>
                      <p className="text-muted-foreground">
                        Buyers contact you with specific quantity and price requests.
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-8 bg-black text-white hover:bg-gray-900" size="lg">
                  <Link href="/suppliers">
                    Learn more for suppliers <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>

              {/* Right: For Buyers */}
              <Card className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#9FE870]/10">
                    <ShoppingCart className="h-6 w-6 text-[#9FE870]" />
                  </div>
                  <h2 className="text-3xl font-bold">For Buyers</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Sign up as a buyer</h3>
                      <p className="text-muted-foreground">
                        Create a business account with a company email.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Search the market</h3>
                      <p className="text-muted-foreground">
                        Filter by product category, origin, certifications, price range 
                        and customs status.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Send RFQs to multiple suppliers</h3>
                      <p className="text-muted-foreground">
                        Request quotes with quantity, target price and Incoterms.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Compare offers and move to contract</h3>
                      <p className="text-muted-foreground">
                        Negotiate directly with suppliers and close deals under your own contracts.
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full mt-8 bg-black text-white hover:bg-gray-900" size="lg">
                  <Link href="/buyers">
                    Learn more for buyers <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Verification & Trust Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <Card className="p-8 lg:p-12 border-2 border-[#9FE870]/20 bg-gradient-to-br from-white to-[#9FE870]/5">
                <div className="grid gap-8 lg:grid-cols-[1fr,auto] items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="h-10 w-10 text-[#9FE870]" />
                      <h2 className="text-3xl font-bold">Verified companies only</h2>
                    </div>

                    <div className="space-y-4 text-lg">
                      <p>
                        We check business registration, VAT/EORI and key documents to ensure 
                        all participants are legitimate, registered companies.
                      </p>
                      <p>
                        Suppliers can upload HACCP, ISO, Organic, Fair Trade, and other 
                        certifications to build trust and differentiate their offerings.
                      </p>
                      <p className="font-semibold text-foreground">
                        Verified suppliers receive a visible badge on their profile and listings, 
                        giving buyers confidence in their legitimacy.
                      </p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-white border">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9FE870]/10 text-[#9FE870] font-bold text-sm">
                          1
                        </div>
                        <span className="text-sm font-medium">Submit documents</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-white border">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9FE870]/10 text-[#9FE870] font-bold text-sm">
                          2
                        </div>
                        <span className="text-sm font-medium">Review</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-white border">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9FE870]/10 text-[#9FE870] font-bold text-sm">
                          3
                        </div>
                        <span className="text-sm font-medium">Verified / Info needed</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9FE870] text-black font-bold text-lg border-4 border-white shadow-xl">
                      <CheckCircle className="h-6 w-6" />
                      Verified Supplier
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Products and Offers Section */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl font-bold md:text-5xl">Products and offers</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                What gets listed and how offers work
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
              {/* Left: Text blocks */}
              <div className="space-y-6 text-lg">
                <div className="flex gap-4">
                  <Package className="h-6 w-6 text-[#9FE870] flex-shrink-0 mt-1" />
                  <p>
                    <strong className="text-foreground">Bulk product listings</strong> with 
                    quantities, crop year, origin country and packaging details.
                  </p>
                </div>
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-[#9FE870] flex-shrink-0 mt-1" />
                  <p>
                    <strong className="text-foreground">Customs & logistics fields:</strong> EU-cleared, 
                    US-cleared, bonded warehouse, or origin-only to help buyers understand import requirements.
                  </p>
                </div>
                <div className="flex gap-4">
                  <TrendingUp className="h-6 w-6 text-[#9FE870] flex-shrink-0 mt-1" />
                  <p>
                    <strong className="text-foreground">Price ranges and Incoterms</strong> to set 
                    expectations and facilitate transparent negotiations.
                  </p>
                </div>
                <div className="flex gap-4">
                  <FileText className="h-6 w-6 text-[#9FE870] flex-shrink-0 mt-1" />
                  <p>
                    <strong className="text-foreground">Certification tags</strong> like Organic, 
                    Fair Trade, HACCP, ISO to highlight quality standards.
                  </p>
                </div>
              </div>

              {/* Right: Product listing card */}
              <Card className="p-6 border-2">
                <div className="flex gap-4 mb-4">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src="/pile-of-coffee-beans.png"
                      alt="Coffee Beans"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Premium Coffee Beans</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Brazil (São Paulo)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available quantity</span>
                    <span className="font-semibold">500 MT</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price range</span>
                    <span className="font-semibold">$8.50 - $9.20/kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Incoterm</span>
                    <span className="font-semibold">FOB Santos</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-[#9FE870]/10 text-[#9FE870] border-[#9FE870]/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified Supplier
                  </Badge>
                  <Badge variant="outline">Organic</Badge>
                  <Badge variant="outline">Fair Trade</Badge>
                  <Badge className="bg-[#9FE870]/10 text-[#9FE870] border-[#9FE870]/20">
                    Origin-only
                  </Badge>
                </div>

                <Button className="w-full bg-black text-white hover:bg-gray-900">
                  Request quote
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* RFQs Workflow Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl font-bold md:text-5xl">From interest to RFQ in a few clicks</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The Request for Quote workflow
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#9FE870]/10">
                    <Search className="h-8 w-8 text-[#9FE870]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Step 1: Buyer finds a product</h3>
                <p className="text-muted-foreground">
                  From the Market Overview page, buyers browse and filter products 
                  by category, origin, and certifications.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#9FE870]/10">
                    <Send className="h-8 w-8 text-[#9FE870]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Step 2: Buyer sends RFQ</h3>
                <p className="text-muted-foreground">
                  Fills in desired quantity, target price, preferred Incoterm, 
                  and a message to the supplier.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#9FE870]/10">
                    <MessageSquare className="h-8 w-8 text-[#9FE870]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Step 3: Supplier responds</h3>
                <p className="text-muted-foreground">
                  Supplier sees RFQs in their dashboard and replies directly 
                  via email or integrated tools.
                </p>
              </Card>
            </div>

            <div className="mx-auto max-w-3xl">
              <Card className="p-6 bg-muted/30 border-2">
                <p className="text-center text-muted-foreground">
                  <strong className="text-foreground">Important:</strong> foodXtrade is the marketplace 
                  and communication bridge. You remain in control of contracts, payments and logistics.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Subscriptions & Access Section */}
        <section className="border-y bg-muted/30 py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl font-bold md:text-5xl">Subscriptions & access</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Transparent pricing for verified B2B participants
              </p>
            </div>

            <div className="mx-auto max-w-4xl space-y-8 mb-12">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                  <p className="text-lg">
                    <strong className="text-foreground">Access to foodXtrade is subscription-based for suppliers.</strong> Choose 
                    a plan that matches your business volume and visibility needs.
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-lg">
                    <strong className="text-foreground">Buyers may have free or premium access</strong> (configurable later). 
                    Browse products and send RFQs without commitment.
                  </p>
                </Card>
              </div>

              <Card className="p-6 bg-[#9FE870]/5 border-[#9FE870]/20">
                <p className="text-lg text-center">
                  <strong className="text-foreground">No random spam:</strong> only verified B2B 
                  participants can access the platform, ensuring quality interactions.
                </p>
              </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold mb-2">Basic</h3>
                  <p className="text-muted-foreground">Perfect for getting started</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Up to 10 products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Standard listing visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Basic RFQ management</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 border-[#9FE870] border-2 relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9FE870] text-black">
                  Most Popular
                </Badge>
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-muted-foreground">Higher visibility & more listings</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Up to 50 products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Enhanced visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Analytics dashboard</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-muted-foreground">Unlimited growth potential</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Unlimited listings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Sponsored placements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                    <span>API access</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-black text-white hover:bg-gray-900">
                <Link href="/pricing">
                  See full pricing <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Who Uses foodXtrade Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-4xl font-bold md:text-5xl">Who uses foodXtrade</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From exporters to manufacturers, we serve the entire food supply chain
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9FE870]/10">
                    <TrendingUp className="h-7 w-7 text-[#9FE870]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Exporters & Traders</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Expand global reach</li>
                  <li>• Connect with verified buyers</li>
                  <li>• Showcase certifications</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9FE870]/10">
                    <Factory className="h-7 w-7 text-[#9FE870]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Processors & Packers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• List processed products</li>
                  <li>• Highlight quality standards</li>
                  <li>• Build B2B relationships</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9FE870]/10">
                    <Users className="h-7 w-7 text-[#9FE870]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Importers & Distributors</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Source from multiple suppliers</li>
                  <li>• Compare prices instantly</li>
                  <li>• Verify customs status</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#9FE870]/10">
                    <Coffee className="h-7 w-7 text-[#9FE870]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Roasters & Manufacturers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Find quality ingredients</li>
                  <li>• Direct supplier contact</li>
                  <li>• Better sourcing deals</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Band */}
        <section className="relative overflow-hidden bg-black py-20 md:py-28">
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold text-white md:text-5xl">
                Ready to see foodXtrade in action?
              </h2>
              <p className="mt-4 text-xl text-white/80">
                Browse the live market or start your account as a buyer or supplier.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-[#9FE870] text-black hover:bg-[#8DD65F] font-semibold text-lg px-8 py-6 h-auto transition-all hover:scale-105"
                >
                  <Link href="/products">
                    Browse the market <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg"
                  variant="outline"
                  className="border-2 border-white bg-transparent text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 h-auto"
                >
                  <Link href="/suppliers">
                    Start as a supplier
                  </Link>
                </Button>
              </div>

              <div className="mt-6">
                <Link 
                  href="/buyers"
                  className="text-[#9FE870] hover:text-[#8DD65F] font-medium inline-flex items-center gap-2 transition-colors"
                >
                  For buyers <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
