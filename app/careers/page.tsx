import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container-boxed py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Careers</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Join our team and help revolutionize global food trade.
          </p>
          
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No open positions at the moment. Check back soon!</p>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
