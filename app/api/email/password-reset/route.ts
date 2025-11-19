import { NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email, resetToken } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await sendPasswordResetEmail(email, resetToken || '')

    if (result.error) {
      console.error('[v0] Password reset email failed:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Password reset email route error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send password reset email' },
      { status: 500 }
    )
  }
}
