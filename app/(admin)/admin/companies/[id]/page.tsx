"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, ExternalLink, FileText } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'

// Mock company data
const companyData = {
  id: "1",
  name: "Fresh Farms Ltd",
  country: "Spain",
  vat: "ES-B12345678",
  eori: "ESB12345678",
  website: "https://freshfarms.example.com",
  email: "contact@freshfarms.example.com",
  phone: "+34 912 345 678",
  address: "Calle Principal 123, Madrid, Spain",
  categories: ["Fresh Produce", "Vegetables", "Organic"],
  description: "Leading supplier of fresh organic produce from Spain. We specialize in seasonal vegetables and work directly with local farmers to ensure the highest quality products.",
  documents: [
    { id: "1", name: "Business License", type: "PDF", uploadedAt: "2024-01-15T10:00:00Z" },
    { id: "2", name: "Food Safety Certificate", type: "PDF", uploadedAt: "2024-01-15T10:05:00Z" },
    { id: "3", name: "Tax Registration", type: "PDF", uploadedAt: "2024-01-15T10:10:00Z" },
    { id: "4", name: "Bank Statement", type: "PDF", uploadedAt: "2024-01-15T10:15:00Z" },
  ],
  submittedAt: "2024-01-15T10:30:00Z",
  status: "pending",
}

export default function CompanyReviewPage() {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    // TODO: Implement API call to approve company
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("[v0] Approving company:", companyData.id, "with notes:", notes)
    alert("Company approved successfully!")
    router.push("/admin/companies/pending")
  }

  const handleReject = async () => {
    setIsProcessing(true)
    // TODO: Implement API call to reject company
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("[v0] Rejecting company:", companyData.id, "with notes:", notes)
    alert("Company rejected. Request for more information sent.")
    router.push("/admin/companies/pending")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Review</h2>
          <p className="text-muted-foreground">
            Review and verify supplier application
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/companies/pending">Back to List</Link>
        </Button>
      </div>

      {/* Status Badge */}
      <div>
        <Badge variant="secondary" className="text-sm">
          Status: Pending Review
        </Badge>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Basic details about the supplier</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="text-lg font-medium">{companyData.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Country</Label>
              <p className="text-lg font-medium">{companyData.country}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">VAT Number</Label>
              <p className="text-lg font-medium">{companyData.vat}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">EORI Number</Label>
              <p className="text-lg font-medium">{companyData.eori}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{companyData.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <p className="font-medium">{companyData.phone}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Website</Label>
              <a
                href={companyData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                {companyData.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-muted-foreground">Address</Label>
            <p className="font-medium">{companyData.address}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Categories</Label>
            <div className="flex gap-2 flex-wrap mt-1">
              {companyData.categories.map((cat) => (
                <Badge key={cat} variant="outline">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Description</Label>
            <p className="text-sm mt-1">{companyData.description}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Submitted At</Label>
            <p className="text-sm mt-1">
              {new Date(companyData.submittedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Review compliance and verification documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companyData.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Internal Admin Notes</CardTitle>
          <CardDescription>
            Add notes about this company for internal reference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter internal notes, observations, or reasons for approval/rejection..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Review Actions</CardTitle>
          <CardDescription>
            Approve or reject this company registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Approve Company
            </Button>
            <Button
              onClick={handleReject}
              disabled={isProcessing}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Reject - Request More Info
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
