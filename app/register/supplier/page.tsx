import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { SupplierRegistrationForm } from '@/components/auth/supplier-registration-form'

export default function SupplierRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Supplier Registration</h1>
            <p className="mt-2 text-muted-foreground">
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
