import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function NewRFQPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?redirectTo=/rfqs/new')
  }

  // Redirect to dashboard RFQs page where they can create new RFQs
  redirect('/dashboard/rfqs')
}
