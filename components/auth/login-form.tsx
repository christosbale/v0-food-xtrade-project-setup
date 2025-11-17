'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setNeedsEmailConfirmation(false)
    setResendSuccess(false)
    
    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        if (authError.message === 'Email not confirmed') {
          setNeedsEmailConfirmation(true)
          throw new Error('Please confirm your email before logging in. Check your inbox for the confirmation link.')
        }
        if (authError.message === 'Invalid login credentials') {
          throw new Error('Invalid email or password. If you don\'t have an account, please register first.')
        }
        throw authError
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setError('Please enter your email address first')
      return
    }

    setIsResending(true)
    setError(null)
    setResendSuccess(false)

    try {
      const supabase = createClient()
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      })

      if (resendError) throw resendError

      setResendSuccess(true)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to resend confirmation email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-xs text-secondary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded p-3">
              {error}
            </div>
          )}

          {needsEmailConfirmation && (
            <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-lime-600 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-lime-900">
                    Email Confirmation Required
                  </p>
                  <p className="text-sm text-lime-700">
                    Please check your inbox and click the confirmation link we sent to{' '}
                    <strong>{formData.email}</strong>
                  </p>
                  <p className="text-xs text-lime-600">
                    Can't find the email? Check your spam folder.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendConfirmation}
                disabled={isResending}
                className="w-full border-lime-300 text-lime-700 hover:bg-lime-100"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Confirmation Email'
                )}
              </Button>
            </div>
          )}

          {resendSuccess && (
            <div className="text-sm text-lime-700 bg-lime-50 border border-lime-200 rounded p-3">
              Confirmation email sent! Please check your inbox.
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline font-medium">
              Register here
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
