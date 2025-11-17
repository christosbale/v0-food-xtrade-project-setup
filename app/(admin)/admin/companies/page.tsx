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
import Link from "next/link"

// Mock data for all companies
const allCompanies = [
  {
    id: "1",
    name: "Fresh Farms Ltd",
    country: "Spain",
    status: "pending",
    categories: ["Fresh Produce", "Vegetables"],
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Organic Grains Inc",
    country: "France",
    status: "verified",
    categories: ["Grains", "Organic"],
    submittedAt: "2024-01-10T09:15:00Z",
  },
  {
    id: "3",
    name: "Mediterranean Oils Co",
    country: "Italy",
    status: "verified",
    categories: ["Oils", "Mediterranean"],
    submittedAt: "2024-01-08T16:45:00Z",
  },
  {
    id: "4",
    name: "Rejected Supplier Co",
    country: "Unknown",
    status: "rejected",
    categories: ["Various"],
    submittedAt: "2024-01-05T14:20:00Z",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
    case "pending":
      return <Badge variant="secondary">Pending</Badge>
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function AllCompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">All Companies</h2>
        <p className="text-muted-foreground">
          View and manage all registered companies
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Directory</CardTitle>
          <CardDescription>
            {allCompanies.length} total companies registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.country}</TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
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
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/admin/companies/${company.id}`}>
                        View
                      </Link>
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
