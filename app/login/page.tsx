import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="w-full max-w-md space-y-6 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to your foodXtrade account
            </p>
          </div>
          <LoginForm />
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="font-medium text-secondary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
