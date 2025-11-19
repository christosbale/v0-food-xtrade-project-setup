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
    <div className="container-boxed py-16 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-[2.5rem] font-bold tracking-tight text-[#0D1117] leading-[1.2]">Users</h2>
        <p className="text-lg text-[#7A7A7A] leading-relaxed">
          Manage platform users and accounts
        </p>
      </div>

      <Card className="bg-white border border-[#E2E2E2] shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold text-[#0D1117] tracking-tight">All Users</CardTitle>
          <CardDescription className="text-[#7A7A7A]">
            {usersWithDetails.length} registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersWithDetails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-[#E2E2E2]">
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Email</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Role</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Company</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Company Type</TableHead>
                  <TableHead className="font-bold text-[#0D1117] uppercase text-xs tracking-wide">Joined</TableHead>
                  <TableHead className="text-right font-bold text-[#0D1117] uppercase text-xs tracking-wide">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersWithDetails.map((user) => (
                  <TableRow key={user.id} className="border-[#E2E2E2] hover:bg-[#F6F6F6] transition-colors">
                    <TableCell className="font-medium text-[#0D1117] py-4">{user.email}</TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        variant={user.role === 'admin' ? 'default' : 'outline'}
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#7A7A7A] py-4">{user.company_name}</TableCell>
                    <TableCell className="py-4">
                      {user.company_type && (
                        <Badge variant="secondary" className="capitalize">
                          {user.company_type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-[#7A7A7A] py-4">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Button size="sm" variant="outline" asChild className="border-[#0D1117] text-[#0D1117] hover:bg-[#0D1117] hover:text-white">
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
            <p className="text-center text-[#7A7A7A] py-12">
              No users found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
