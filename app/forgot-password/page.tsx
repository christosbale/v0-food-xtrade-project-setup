import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container-boxed w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </div>
          <ForgotPasswordForm />
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Remember your password? </span>
            <Link href="/login" className="font-medium text-secondary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
