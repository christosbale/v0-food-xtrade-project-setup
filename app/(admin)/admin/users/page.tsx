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

// Mock data for users
const users = [
  {
    id: "1",
    name: "John Smith",
    email: "john@freshfarms.example.com",
    role: "Supplier",
    company: "Fresh Farms Ltd",
    status: "Active",
    joinedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Marie Dubois",
    email: "marie@organicgrains.example.com",
    role: "Supplier",
    company: "Organic Grains Inc",
    status: "Active",
    joinedAt: "2024-01-10T09:15:00Z",
  },
  {
    id: "3",
    name: "Giuseppe Rossi",
    email: "giuseppe@medoils.example.com",
    role: "Supplier",
    company: "Mediterranean Oils Co",
    status: "Active",
    joinedAt: "2024-01-08T16:45:00Z",
  },
  {
    id: "4",
    name: "Anna Johnson",
    email: "anna@buyerco.example.com",
    role: "Buyer",
    company: "Global Food Distributors",
    status: "Active",
    joinedAt: "2024-01-12T14:20:00Z",
  },
]

export default function UsersPage() {
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
            {users.length} registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 hover:bg-green-600">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.joinedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
