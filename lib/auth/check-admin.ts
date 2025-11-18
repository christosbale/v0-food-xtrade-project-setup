import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkAdmin() {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/login')
  }
  
  // Check if user has admin role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }
  
  return { user, profile }
}

export async function getUserRole(userId: string) {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return profile?.role || 'buyer'
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'admin'
}
