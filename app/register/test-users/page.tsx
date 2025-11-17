import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function TestUsersPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Test User Credentials</CardTitle>
            <CardDescription>
              Use these credentials to test the platform. In production, users will register through the sign-up flow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold text-sm mb-2 text-foreground">Supplier Account #1</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Email:</span>
                    <code className="bg-background px-2 py-0.5 rounded text-primary">supplier1@foodxtrade.com</code>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Password:</span>
                    <code className="bg-background px-2 py-0.5 rounded text-primary">Test123!@#</code>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Company:</span>
                    <span>Mediterranean Exports Ltd</span>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold text-sm mb-2 text-foreground">Supplier Account #2</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Email:</span>
                    <code className="bg-background px-2 py-0.5 rounded text-primary">supplier2@foodxtrade.com</code>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Password:</span>
                    <code className="bg-background px-2 py-0.5 rounded text-primary">Test123!@#</code>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Company:</span>
                    <span>Global Coffee Traders</span>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold text-sm mb-2 text-foreground">Buyer Account</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Email:</span>
                    <code className="bg-background px-2 py-0.5 rounded text-primary">buyer1@foodxtrade.com</code>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Password:</span>
                    <code className="bg-background px-2 py-0.5 rounded text-primary">Test123!@#</code>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24">Company:</span>
                    <span>European Food Importers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These test users must be created in Supabase Auth first. You can create them by running the seed script or manually in the Supabase dashboard.
              </p>
            </div>

            <Button asChild className="w-full">
              <Link href="/login">
                Go to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
