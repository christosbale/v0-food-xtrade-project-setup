import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container-boxed py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About foodXtrade</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              foodXtrade is a leading B2B marketplace connecting food suppliers and buyers worldwide.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
            <p>
              To revolutionize global food trade by providing a transparent, efficient, and secure platform
              that connects quality suppliers with discerning buyers around the world.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">What We Do</h2>
            <p>
              We facilitate international food trade by providing tools for product discovery, price tracking,
              market insights, and secure transactions between verified suppliers and buyers.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
