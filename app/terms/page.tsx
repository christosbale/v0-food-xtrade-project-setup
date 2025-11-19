import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container-boxed py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p>
                Welcome to foodXtrade. By using our platform, you agree to these Terms of Service.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">1. Acceptance of Terms</h2>
              <p>
                By accessing and using foodXtrade, you accept and agree to be bound by these Terms of Service.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">2. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">3. Acceptable Use</h2>
              <p>
                You agree to use the platform only for lawful purposes and in accordance with these Terms.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">4. Contact</h2>
              <p>
                For questions about these Terms, contact us at{' '}
                <a href="mailto:legal@foodxtrade.com" className="text-primary hover:underline">
                  legal@foodxtrade.com
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
