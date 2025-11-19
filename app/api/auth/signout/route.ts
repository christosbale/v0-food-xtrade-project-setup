import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Sign out the user
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('[v0] Logout error:', error)
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL!))
  }

  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL!))
}

export async function POST() {
  return GET()
}
