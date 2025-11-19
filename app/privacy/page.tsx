import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container-boxed py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p>
                This Privacy Policy describes how foodXtrade collects, uses, and protects your personal information.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@foodxtrade.com" className="text-primary hover:underline">
                  privacy@foodxtrade.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
