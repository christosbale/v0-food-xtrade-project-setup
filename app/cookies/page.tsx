import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container-boxed py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p>
                This Cookie Policy explains how foodXtrade uses cookies and similar technologies.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">What Are Cookies</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit our website.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">How We Use Cookies</h2>
              <p>
                We use cookies to improve your experience, analyze site usage, and personalize content.
              </p>
              
              <h2 className="text-2xl font-bold mt-8">Managing Cookies</h2>
              <p>
                You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
