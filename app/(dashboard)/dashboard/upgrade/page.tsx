import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UpgradeToSupplierForm } from '@/components/dashboard/upgrade-to-supplier-form'

export default async function UpgradeToSupplierPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get company info
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!company) {
    redirect('/dashboard')
  }

  // Check if already a supplier
  if (company.can_sell) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Already a Supplier</CardTitle>
            <CardDescription>
              Your account already has supplier capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You can already list products and connect with buyers on the platform.
            </p>
            <Button asChild>
              <a href="/dashboard/products">Go to Products</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Upgrade to Supplier</h1>
        <p className="text-xl text-muted-foreground">
          Start selling your products to buyers worldwide
        </p>
      </div>

      {/* Benefits */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Expand Your Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connect with verified buyers from around the world looking for quality products.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle>List Unlimited Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Showcase your entire product catalog with detailed specifications and pricing.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Direct Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Respond to buyer inquiries and negotiate deals directly through our platform.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What You Get */}
      <Card>
        <CardHeader>
          <CardTitle>What You Get as a Supplier</CardTitle>
          <CardDescription>
            Everything you need to succeed in the global marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Product Management</p>
                <p className="text-sm text-muted-foreground">
                  Create and manage your product listings with photos and details
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">RFQ System</p>
                <p className="text-sm text-muted-foreground">
                  Receive and respond to buyer requests for quotations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Analytics Dashboard</p>
                <p className="text-sm text-muted-foreground">
                  Track views, inquiries, and performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Buyer Network</p>
                <p className="text-sm text-muted-foreground">
                  Access to our verified buyer network worldwide
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Keep Buying Capabilities</p>
                <p className="text-sm text-muted-foreground">
                  You can still purchase products as a buyer
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Support Team</p>
                <p className="text-sm text-muted-foreground">
                  Dedicated support to help you succeed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Form */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Supplier Profile</CardTitle>
          <CardDescription>
            Provide additional information required for supplier verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpgradeToSupplierForm company={company} />
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="text-blue-600 text-sm">
              <p className="font-medium mb-1">Note:</p>
              <p>
                Your application will be reviewed by our team within 24-48 hours. 
                We'll verify your business documents and contact information before approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
