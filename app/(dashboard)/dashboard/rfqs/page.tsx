'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mail, ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

type RFQStatus = 'new' | 'in_discussion' | 'closed'

interface RFQ {
  id: string
  product_id: string
  supplier_company_id: string
  buyer_company_name: string
  buyer_email: string
  buyer_country: string
  desired_quantity: number
  unit: string
  target_price: number | null
  preferred_incoterm: string
  message: string
  status: RFQStatus
  created_at: string
  updated_at: string
  // Joined data
  product_name?: string
}

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchRFQs() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          setError('Authentication required. Please log in.')
          setLoading(false)
          return
        }

        // Get user's company
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (companyError) {
          console.error('[v0] Error fetching company:', companyError)
          setError('Could not load company profile.')
          setLoading(false)
          return
        }

        if (!company) {
          setError('No company profile found. Please complete your registration.')
          setLoading(false)
          return
        }

        setCompanyId(company.id)

        // Fetch RFQs for this supplier with product information
        const { data: rfqData, error: rfqError } = await supabase
          .from('rfqs')
          .select(`
            *,
            products!inner (
              product_name
            )
          `)
          .eq('supplier_company_id', company.id)
          .order('created_at', { ascending: false })

        if (rfqError) {
          console.error('[v0] Error fetching RFQs:', rfqError)
          setError('Could not load RFQs. Please try again later.')
          setLoading(false)
          return
        }

        // Transform data to include product_name
        const transformedRFQs = (rfqData || []).map(rfq => ({
          ...rfq,
          product_name: (rfq.products as any)?.product_name || 'Unknown Product'
        }))

        setRfqs(transformedRFQs)
      } catch (err) {
        console.error('[v0] Unexpected error:', err)
        setError('An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQs()
  }, [])

  const handleStatusChange = async (rfqId: string, newStatus: RFQStatus) => {
    if (!companyId) return

    setIsUpdatingStatus(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('rfqs')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', rfqId)
        .eq('supplier_company_id', companyId) // Security check

      if (error) {
        console.error('[v0] Error updating RFQ status:', error)
        toast({
          title: 'Error',
          description: 'Could not update status. Please try again.',
          variant: 'destructive',
        })
        return
      }

      // Update local state
      setRfqs(prev => prev.map(rfq => 
        rfq.id === rfqId ? { ...rfq, status: newStatus } : rfq
      ))
      if (selectedRFQ && selectedRFQ.id === rfqId) {
        setSelectedRFQ({ ...selectedRFQ, status: newStatus })
      }

      // Show success toast
      toast({
        title: 'Status updated',
        description: 'RFQ status has been updated successfully.',
      })
    } catch (err) {
      console.error('[v0] Unexpected error updating status:', err)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const openDetail = (rfq: RFQ) => {
    setSelectedRFQ(rfq)
    setIsDetailOpen(true)
  }

  const getStatusColor = (status: RFQStatus) => {
    switch (status) {
      case 'new':
        return 'bg-lime-500/10 text-lime-600 border-lime-500/20'
      case 'in_discussion':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'closed':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
      default:
        // Fallback for unexpected values
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  const getStatusLabel = (status: RFQStatus) => {
    switch (status) {
      case 'new':
        return 'New'
      case 'in_discussion':
        return 'In discussion'
      case 'closed':
        return 'Closed'
      default:
        // Fallback for unexpected values
        return 'Unknown'
    }
  }

  const createMailtoLink = (rfq: RFQ) => {
    const subject = encodeURIComponent(`RFQ response – ${rfq.product_name || 'Product'}`)
    const body = encodeURIComponent(`Dear ${rfq.buyer_company_name},\n\nThank you for your interest in our ${rfq.product_name}.\n\nRegarding your request:\n- Quantity: ${rfq.desired_quantity} ${rfq.unit}\n- Incoterm: ${rfq.preferred_incoterm}\n\n[Please add your quote and response here]\n\nBest regards`)
    return `mailto:${rfq.buyer_email}?subject=${subject}&body=${body}`
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-lime-500" />
          <p className="mt-4 text-sm text-muted-foreground">Loading RFQs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">RFQs</h1>
          <p className="mt-2 text-muted-foreground">
            Requests for quote from buyers for your products
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RFQs</h1>
        <p className="mt-2 text-muted-foreground">
          Requests for quote from buyers for your products
        </p>
      </div>

      {rfqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No RFQs yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              You have not received any RFQs yet. When buyers request quotes for your products, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Received Quote Requests</CardTitle>
            <CardDescription>
              View and respond to RFQs from potential buyers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Buyer Company</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Country</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rfqs.map((rfq) => (
                    <tr key={rfq.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-4 text-sm">
                        {new Date(rfq.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 text-sm font-medium">{rfq.buyer_company_name}</td>
                      <td className="py-4 text-sm">{rfq.product_name}</td>
                      <td className="py-4 text-sm">
                        {rfq.desired_quantity} {rfq.unit}
                      </td>
                      <td className="py-4 text-sm">{rfq.buyer_country}</td>
                      <td className="py-4">
                        <Badge variant="outline" className={getStatusColor(rfq.status)}>
                          {getStatusLabel(rfq.status)}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetail(rfq)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* RFQ Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedRFQ && (
            <>
              <SheetHeader>
                <SheetTitle>RFQ Details</SheetTitle>
                <SheetDescription>
                  Request received on {new Date(selectedRFQ.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">Status</label>
                  <Select
                    value={selectedRFQ.status}
                    onValueChange={(value) => handleStatusChange(selectedRFQ.id, value as RFQStatus)}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_discussion">In discussion</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Use this status to track the progress of each RFQ.
                  </p>
                </div>

                {/* Buyer Information */}
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold">Buyer Information</h3>
                  <div className="grid gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Company:</span>
                      <p className="font-medium">{selectedRFQ.buyer_company_name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{selectedRFQ.buyer_email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Country:</span>
                      <p className="font-medium">{selectedRFQ.buyer_country}</p>
                    </div>
                  </div>
                </div>

                {/* Product & Quote Details */}
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="font-semibold">Quote Request Details</h3>
                  <div className="grid gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Product:</span>
                      <p className="font-medium">{selectedRFQ.product_name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Requested Quantity:</span>
                      <p className="font-medium">
                        {selectedRFQ.desired_quantity} {selectedRFQ.unit}
                      </p>
                    </div>
                    {selectedRFQ.target_price && (
                      <div>
                        <span className="text-muted-foreground">Target Price:</span>
                        <p className="font-medium">
                          ${selectedRFQ.target_price} per {selectedRFQ.unit}
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Preferred Incoterm:</span>
                      <p className="font-medium">{selectedRFQ.preferred_incoterm}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2 rounded-lg border p-4">
                  <h3 className="font-semibold">Message from Buyer</h3>
                  <p className="text-sm text-muted-foreground">{selectedRFQ.message}</p>
                </div>

                {/* Reply Button */}
                <Button
                  className="w-full bg-lime-500 text-black hover:bg-lime-600"
                  size="lg"
                  asChild
                >
                  <a href={createMailtoLink(selectedRFQ)} target="_blank" rel="noopener noreferrer">
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
