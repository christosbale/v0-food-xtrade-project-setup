import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import Link from "next/link"

// Mock data for latest pending companies
const latestPendingCompanies = [
  {
    id: "1",
    name: "Fresh Farms Ltd",
    country: "Spain",
    categories: ["Fresh Produce", "Vegetables"],
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Organic Grains Inc",
    country: "France",
    categories: ["Grains", "Organic"],
    submittedAt: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    name: "Mediterranean Oils Co",
    country: "Italy",
    categories: ["Oils", "Mediterranean"],
    submittedAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "4",
    name: "Coffee Traders LLC",
    country: "Brazil",
    categories: ["Coffee", "Beverages"],
    submittedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "5",
    name: "Seafood Direct",
    country: "Norway",
    categories: ["Seafood", "Frozen"],
    submittedAt: "2024-01-14T11:00:00Z",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of company verifications and platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verifications
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Companies awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Companies
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">347</div>
            <p className="text-xs text-muted-foreground">
              Active verified suppliers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Companies
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">
              Requiring more information
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Pending Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Pending Companies</CardTitle>
          <CardDescription>
            Most recent supplier registrations awaiting verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestPendingCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.country}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {company.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(company.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/admin/companies/${company.id}`}>
                        Review
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/admin/companies/pending">
                View All Pending Companies
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
