import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function CompliancePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container-boxed py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Compliance</h1>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p>
                foodXtrade is committed to maintaining the highest standards of compliance and regulatory adherence.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">Food Safety Standards</h2>
              <p>
                We ensure all suppliers meet international food safety and quality standards.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">Data Protection</h2>
              <p>
                We comply with GDPR and other data protection regulations to safeguard user information.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">Trade Compliance</h2>
              <p>
                Our platform adheres to international trade laws and customs regulations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
