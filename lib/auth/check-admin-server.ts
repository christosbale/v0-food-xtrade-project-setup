import { createClient } from '@/lib/supabase/server'

export async function checkAdminServer() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('[v0] Admin check (server): No user found')
      return false
    }

    // Query user_profiles directly without RLS recursion
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.log('[v0] Admin check (server): Profile error:', profileError.message)
      return false
    }

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin'
    console.log('[v0] Admin check (server): User', user.email, 'is admin:', isAdmin)
    
    return isAdmin
  } catch (error) {
    console.error('[v0] Admin check (server): Error:', error)
    return false
  }
}
