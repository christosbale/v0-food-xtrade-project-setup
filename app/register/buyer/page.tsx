import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BuyerRegistrationForm } from '@/components/auth/buyer-registration-form'

export default function BuyerRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Buyer Registration</h1>
            <p className="mt-2 text-muted-foreground">
              Create your account to start sourcing products
            </p>
          </div>
          <BuyerRegistrationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
