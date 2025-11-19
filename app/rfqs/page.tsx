'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface RFQ {
  id: string
  target_category: string
  target_subcategory: string
  buyer_country: string
  target_moq: number
  target_moq_unit: string
  target_customs_status: string
  target_packaging: string
  desired_quantity: number
  unit: string
  created_at: string
}

export default function PublicRFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isVerifiedSupplier, setIsVerifiedSupplier] = useState(false)

  useEffect(() => {
    async function fetchRFQs() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()

        // Check authentication
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          setIsAuthenticated(false)
          setLoading(false)
          return
        }

        setIsAuthenticated(true)

        // Check if user is a verified supplier
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('company_type, verification_status')
          .eq('user_id', user.id)
          .maybeSingle()

        if (companyError || !company) {
          setError('Could not load company profile.')
          setLoading(false)
          return
        }

        const isVerified = company.company_type === 'supplier' && company.verification_status === 'verified'
        setIsVerifiedSupplier(isVerified)

        if (!isVerified) {
          setLoading(false)
          return
        }

        // Fetch public RFQs
        const { data: rfqData, error: rfqError } = await supabase
          .from('rfqs')
          .select('*')
          .not('target_category', 'is', null)
          .order('created_at', { ascending: false })
          .limit(50)

        if (rfqError) {
          console.error('[v0] Error fetching RFQs:', rfqError)
          setError('Could not load RFQs. Please try again later.')
          setLoading(false)
          return
        }

        setRfqs(rfqData || [])
      } catch (err) {
        console.error('[v0] Unexpected error:', err)
        setError('An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchRFQs()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FFB84D]" />
          <p className="mt-4 text-sm text-muted-foreground">Loading RFQs...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Lock className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Login Required</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              You need to be logged in to view RFQs.
            </p>
            <Button className="mt-6 bg-[#FFB84D] hover:bg-[#FFA62F] text-black font-semibold" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isVerifiedSupplier) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access to the public RFQ feed is limited to verified suppliers only. Please ensure your company is verified.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Public RFQ Feed</h1>
        <p className="mt-2 text-muted-foreground">
          Browse buyer requests and find new business opportunities
        </p>
      </div>

      {rfqs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="mt-4 text-lg font-semibold">No RFQs Available</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              There are no public RFQs at the moment. Check back later for new opportunities.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {rfqs.map((rfq) => (
            <Card key={rfq.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-[#FFB84D]/10 text-[#FFB84D] border-[#FFB84D]/30">
                        {rfq.target_category}
                      </Badge>
                      {rfq.target_subcategory && (
                        <Badge variant="outline">{rfq.target_subcategory}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">
                      {rfq.desired_quantity} {rfq.unit} Required
                    </CardTitle>
                    <CardDescription>
                      Posted {new Date(rfq.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Buyer Country:</span>
                    <p className="font-medium">{rfq.buyer_country}</p>
                  </div>
                  {rfq.target_moq && (
                    <div>
                      <span className="text-muted-foreground">Required MOQ:</span>
                      <p className="font-medium">
                        {rfq.target_moq} {rfq.target_moq_unit}
                      </p>
                    </div>
                  )}
                  {rfq.target_customs_status && (
                    <div>
                      <span className="text-muted-foreground">Customs Status:</span>
                      <p className="font-medium">{rfq.target_customs_status}</p>
                    </div>
                  )}
                  {rfq.target_packaging && (
                    <div>
                      <span className="text-muted-foreground">Packaging:</span>
                      <p className="font-medium">{rfq.target_packaging}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button className="bg-[#FFB84D] hover:bg-[#FFA62F] text-black font-semibold" asChild>
                    <Link href="/dashboard/rfqs">View in Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
