import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { plan } = await request.json()
    
    if (!plan || !['basic', 'pro', 'premium'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Update company to enable selling with selected plan
    const { error: updateError } = await supabase
      .from('companies')
      .update({
        can_sell: true,
        company_type: company.company_type === 'buyer' ? 'both' : company.company_type,
        subscription_tier: plan,
      })
      .eq('id', company.id)

    if (updateError) {
      console.error('[v0] Error upgrading to supplier:', updateError)
      return NextResponse.json(
        { error: 'Failed to upgrade account' },
        { status: 500 }
      )
    }

    // Send notification email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/upgrade-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          plan: plan,
          companyName: company.company_name,
        }),
      })
    } catch (emailError) {
      console.error('[v0] Failed to send upgrade email:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Upgrade to supplier error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
