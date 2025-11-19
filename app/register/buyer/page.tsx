import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { BuyerRegistrationForm } from '@/components/auth/buyer-registration-form'

export default function BuyerRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12 md:py-16">
        <div className="container-boxed w-full max-w-2xl space-y-6 md:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Buyer Registration</h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
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
