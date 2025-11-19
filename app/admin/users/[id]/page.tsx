import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params // Await params for Next.js 16 compatibility
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  
  if (!currentUser) {
    redirect('/login')
  }

  // Check if admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get user details using admin client
  const adminClient = createAdminClient()
  
  const { data: authUser, error: authError } = await adminClient.auth.admin.getUserById(resolvedParams.id)
  
  if (authError || !authUser) {
    notFound()
  }

  type UserProfileWithCompany = {
    id: string
    role: string
    companies: {
      id: string
      company_name: string
      company_type: string
    } | null
  }

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*, companies(*)')
    .eq('id', resolvedParams.id)
    .single()

  const profileWithCompany = userProfile ? {
    ...userProfile,
    companies: Array.isArray(userProfile.companies) ? userProfile.companies[0] : userProfile.companies
  } as UserProfileWithCompany : null

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">User Details</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{authUser.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-base">{profileWithCompany?.role || 'user'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-base">{new Date(authUser.user.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Sign In</p>
              <p className="text-base">
                {authUser.user.last_sign_in_at 
                  ? new Date(authUser.user.last_sign_in_at).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
          </CardContent>
        </Card>

        {profileWithCompany?.companies && (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                <p className="text-base">{profileWithCompany.companies.company_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company Type</p>
                <p className="text-base">{profileWithCompany.companies.company_type}</p>
              </div>
              <div>
                <Link href={`/admin/companies/${profileWithCompany.companies.id}`}>
                  <Button variant="outline">View Company Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
