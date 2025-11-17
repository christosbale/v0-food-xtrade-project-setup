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

// Mock data for pending companies
const pendingCompanies = [
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
  {
    id: "6",
    name: "Spice Merchants Global",
    country: "India",
    categories: ["Spices", "Dry Goods"],
    submittedAt: "2024-01-13T15:30:00Z",
  },
  {
    id: "7",
    name: "Dairy Excellence AB",
    country: "Sweden",
    categories: ["Dairy", "Cheese"],
    submittedAt: "2024-01-13T12:00:00Z",
  },
  {
    id: "8",
    name: "Tropical Fruits Export",
    country: "Costa Rica",
    categories: ["Fruits", "Tropical"],
    submittedAt: "2024-01-12T18:45:00Z",
  },
  {
    id: "9",
    name: "Premium Meat Suppliers",
    country: "Argentina",
    categories: ["Meat", "Frozen"],
    submittedAt: "2024-01-12T10:15:00Z",
  },
  {
    id: "10",
    name: "Green Tea Wholesalers",
    country: "Japan",
    categories: ["Tea", "Beverages"],
    submittedAt: "2024-01-11T14:30:00Z",
  },
  {
    id: "11",
    name: "Bakery Ingredients Pro",
    country: "Germany",
    categories: ["Bakery", "Ingredients"],
    submittedAt: "2024-01-11T09:00:00Z",
  },
  {
    id: "12",
    name: "Wine & Spirits International",
    country: "Portugal",
    categories: ["Wine", "Beverages"],
    submittedAt: "2024-01-10T16:20:00Z",
  },
]

export default function PendingCompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pending Companies</h2>
        <p className="text-muted-foreground">
          Review and verify supplier registrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Companies Awaiting Verification</CardTitle>
          <CardDescription>
            {pendingCompanies.length} companies pending review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Main Categories</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingCompanies.map((company) => (
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
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
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
        </CardContent>
      </Card>
    </div>
  )
}
