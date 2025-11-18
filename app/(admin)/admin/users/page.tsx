import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function UsersPage() {
  const supabase = await createClient()
  
  const { data: users } = await supabase
    .from('user_profiles')
    .select(`
      id,
      role,
      created_at
    `)
    .order('created_at', { ascending: false })

  // For each user, get their company and auth data
  const usersWithDetails = await Promise.all(
    (users || []).map(async (user) => {
      const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
      const { data: company } = await supabase
        .from('companies')
        .select('company_name, company_type')
        .eq('user_id', user.id)
        .single()
      
      return {
        ...user,
        email: authUser?.user?.email || 'N/A',
        company_name: company?.company_name || 'No company',
        company_type: company?.company_type || null,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage platform users and accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {usersWithDetails.length} registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersWithDetails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Company Type</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersWithDetails.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.company_name}</TableCell>
                    <TableCell>
                      {user.company_type && (
                        <Badge variant="secondary" className="capitalize">
                          {user.company_type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/users/${user.id}`}>
                          Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No users found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
