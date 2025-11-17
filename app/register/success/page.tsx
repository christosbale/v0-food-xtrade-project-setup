import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, Mail } from 'lucide-react'
import Link from 'next/link'

export default function RegistrationSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container max-w-2xl px-4">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="mt-4 text-2xl">Registration Submitted!</CardTitle>
              <CardDescription className="text-base">
                Your account has been created successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div className="space-y-1">
                    <h3 className="font-medium text-blue-900">Check Your Email</h3>
                    <p className="text-sm text-blue-700">
                      We've sent a confirmation link to your email address. Please click the link to activate your account and complete setup.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="space-y-1">
                    <h3 className="font-medium">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Confirm your email address by clicking the link we sent</li>
                      <li>• Your company profile will be automatically created</li>
                      <li>• Our team will review and verify your account within 24-48 hours</li>
                      <li>• You'll receive an email once your account is verified</li>
                      <li>• Once approved, you can start listing products or browsing suppliers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-900">
                  <strong>Didn't receive the email?</strong> Check your spam folder or wait a few minutes. 
                  If you still don't see it, contact our support team.
                </p>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/login">
                    Go to Login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
