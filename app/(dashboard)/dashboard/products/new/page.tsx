import { ProductForm } from '@/components/dashboard/product-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NewProductPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: company } = await supabase
    .from('companies')
    .select('id, company_name, company_type, verification_status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (company?.company_type === 'supplier' && company.verification_status !== 'verified') {
    return (
      <div className="max-w-2xl mx-auto py-12 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Verification Required</AlertTitle>
          <AlertDescription className="mt-2">
            Your supplier account is currently under review by our team. You'll be able to add products 
            once your company has been verified. This process typically takes 1-2 business days.
          </AlertDescription>
        </Alert>

        <div className="bg-card rounded-lg border p-8">
          <h2 className="text-2xl font-bold mb-4">What happens next?</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Our admin team will review your company information and documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>We'll verify your VAT number and business registration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Once approved, you'll receive an email notification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>You can then start listing products on the platform</span>
            </li>
          </ul>

          <div className="mt-8 flex gap-4">
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/company">View Company Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-1">
          List a new product in your catalog
        </p>
      </div>
      <ProductForm />
    </div>
  )
}
