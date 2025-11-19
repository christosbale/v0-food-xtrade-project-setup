import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SupplierRegistrationForm } from '@/components/auth/supplier-registration-form'

export default function SupplierRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12 md:py-16">
        <div className="container-boxed w-full max-w-4xl space-y-6 md:space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Supplier Registration</h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Complete the steps below to join as a verified supplier
            </p>
          </div>
          <SupplierRegistrationForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
