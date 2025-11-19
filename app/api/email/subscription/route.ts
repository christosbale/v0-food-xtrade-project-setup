import { NextResponse } from 'next/server'
import { sendSubscriptionConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email, companyName, plan, price } = await request.json()

    if (!email || !companyName || !plan || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await sendSubscriptionConfirmationEmail(
      email,
      companyName,
      plan,
      price
    )

    if (!result.success) {
      console.error('[v0] Subscription confirmation email failed:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Subscription email route error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send subscription confirmation email' },
      { status: 500 }
    )
  }
}
