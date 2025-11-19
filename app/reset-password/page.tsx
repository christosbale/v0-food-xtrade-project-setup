import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container-boxed w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Set New Password</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your new password below
            </p>
          </div>
          <ResetPasswordForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
