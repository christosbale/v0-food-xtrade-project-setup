import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SupplierOnboardingForm } from '@/components/onboarding/supplier-onboarding-form'

interface PageProps {
  searchParams: Promise<{ plan?: string }>
}

export default async function SupplierOnboardingPage({ searchParams }: PageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in?redirect=/onboarding/supplier')
  }

  const params = await searchParams
  const planParam = params.plan
  const validPlans = ['basic', 'pro', 'premium']
  const plan = validPlans.includes(planParam || '') ? (planParam as 'basic' | 'pro' | 'premium') : 'basic'

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, id')
    .eq('id', user.id)
    .maybeSingle()

  const { data: existingCompany } = await supabase
    .from('companies')
    .select('company_name, country, city, website')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <div className="border-b border-[#E2E2E2] bg-[#DDE9F8] py-8">
        <div className="container-boxed">
          <p className="text-center text-headline-medium tracking-tight text-[#0D1117]">
            foodXtrade • Market-Intelligent B2B Marketplace
          </p>
        </div>
      </div>

      <div className="container-boxed py-16">
        <div className="mb-16 max-w-3xl">
          <h1 className="mb-6 text-display-medium text-[#0D1117]">
            Join a verified, market-intelligent B2B ecosystem.
          </h1>
          <p className="text-title-large text-[#7A7A7A]">
            Your products meet global demand. Let buyers find you smarter.
          </p>
        </div>

        <SupplierOnboardingForm 
          initialPlan={plan} 
          existingCompany={existingCompany}
          userEmail={user.email || ''}
        />
      </div>
    </div>
  )
}
