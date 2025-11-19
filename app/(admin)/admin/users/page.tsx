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
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function UsersPage() {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()
  
  const { data: users } = await supabase
    .from('user_profiles')
    .select(`
      id,
      role,
      created_at
    `)
    .order('created_at', { ascending: false })

  const usersWithDetails = await Promise.all(
    (users || []).map(async (user) => {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id)
      const { data: company } = await supabase
        .from('companies')
        .select('company_name, company_type')
        .eq('user_id', user.id)
        .maybeSingle()
      
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
            <>
              <div className="hidden md:block overflow-x-auto">
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
              </div>

              <div className="md:hidden space-y-3">
                {usersWithDetails.map((user) => (
                  <Card key={user.id} className="border border-[#E2E2E2]">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#0D1117] truncate">{user.email}</p>
                          <p className="text-sm text-[#7A7A7A] mt-0.5">{user.company_name}</p>
                        </div>
                        <Badge 
                          variant={user.role === 'admin' ? 'default' : 'outline'}
                          className="capitalize flex-shrink-0"
                        >
                          {user.role}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div>
                          <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Company Type</p>
                          {user.company_type ? (
                            <Badge variant="secondary" className="capitalize text-xs">
                              {user.company_type}
                            </Badge>
                          ) : (
                            <span className="text-[#7A7A7A]">—</span>
                          )}
                        </div>
                        <div>
                          <p className="text-[#7A7A7A] text-xs uppercase tracking-wide mb-0.5">Joined</p>
                          <p className="text-[#0D1117] text-sm">
                            {new Date(user.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 border-[#0D1117] text-[#0D1117]"
                        asChild
                      >
                        <Link href={`/admin/users/${user.id}`}>
                          Manage User
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
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
