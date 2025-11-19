'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      const supabase = createClient()
      
      // Determine the correct redirect URL based on environment
      const getRedirectUrl = () => {
        // If NEXT_PUBLIC_SITE_URL is set (production), use it
        if (process.env.NEXT_PUBLIC_SITE_URL) {
          return `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
        }
        // If in development with dev redirect URL, use it
        if (process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL) {
          return `${process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL}/reset-password`
        }
        // Fallback to current origin
        return `${window.location.origin}/reset-password`
      }
      
      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getRedirectUrl(),
      })

      if (resetError) throw resetError

      try {
        await fetch('/api/email/password-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
      } catch (emailError) {
        console.error('Failed to send custom reset email:', emailError)
        // Supabase already sent their email, so this is just a bonus
      }

      setSuccess(true)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-[#DDE9F8] p-3">
              <CheckCircle className="h-8 w-8 text-[#0D1117]" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to your email address. 
                Click the link in the email to reset your password.
              </p>
              <p className="text-xs text-muted-foreground pt-2">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            <Button 
              onClick={() => setSuccess(false)} 
              variant="outline"
              className="w-full"
            >
              Send Another Link
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
