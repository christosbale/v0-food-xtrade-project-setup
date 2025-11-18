'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, XCircle, Shield, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { approveCompany, rejectCompany, validateCompanyVAT } from '@/app/(admin)/admin/companies/[id]/actions'
import { useToast } from '@/hooks/use-toast'

interface CompanyApprovalActionsProps {
  companyId: string
  currentStatus: string
  hasVAT: boolean
  vatValidated: boolean
}

export function CompanyApprovalActions({
  companyId,
  currentStatus,
  hasVAT,
  vatValidated,
}: CompanyApprovalActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async () => {
    console.log('[v0] Approve button clicked for company:', companyId)
    
    if (!notes.trim()) {
      toast({
        title: 'Notes required',
        description: 'Please add notes before approving',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    console.log('[v0] Starting approval process...')
    
    try {
      const result = await approveCompany(companyId, notes)
      console.log('[v0] Approval successful:', result)
      
      toast({
        title: 'Company Approved Successfully',
        description: `The company has been verified and can now access the platform. ${result.vatMessage}`,
      })
      
      // Wait a moment for the toast to show, then navigate
      setTimeout(() => {
        router.push('/admin/companies/(list)/pending')
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('[v0] Approval error:', error)
      toast({
        title: 'Approval Failed',
        description: error instanceof Error ? error.message : 'Failed to approve company. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    console.log('[v0] Reject button clicked for company:', companyId)
    
    if (!notes.trim()) {
      toast({
        title: 'Reason required',
        description: 'Please add a reason for rejection',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    console.log('[v0] Starting rejection process...')
    
    try {
      await rejectCompany(companyId, notes)
      console.log('[v0] Rejection successful')
      
      toast({
        title: 'Company Rejected',
        description: 'The company has been notified and asked to provide more information.',
      })
      
      // Wait a moment for the toast to show, then navigate
      setTimeout(() => {
        router.push('/admin/companies/(list)/pending')
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('[v0] Rejection error:', error)
      toast({
        title: 'Rejection Failed',
        description: error instanceof Error ? error.message : 'Failed to reject company. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleValidateVAT = async () => {
    console.log('[v0] VAT validation clicked for company:', companyId)
    
    setIsProcessing(true)
    try {
      const result = await validateCompanyVAT(companyId)
      console.log('[v0] VAT validation result:', result)
      
      toast({
        title: result.valid ? 'VAT Validated Successfully' : 'VAT Validation Failed',
        description: result.message,
        variant: result.valid ? 'default' : 'destructive',
      })
      router.refresh()
    } catch (error) {
      console.error('[v0] VAT validation error:', error)
      toast({
        title: 'Validation Error',
        description: error instanceof Error ? error.message : 'Failed to validate VAT',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* VAT Validation Card */}
      {hasVAT && !vatValidated && currentStatus === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>VAT Validation</CardTitle>
            <CardDescription>
              Validate the company's VAT number before approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleValidateVAT}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Validate VAT Number
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Admin Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Internal Admin Notes</CardTitle>
          <CardDescription>
            Add notes about this company for internal reference (required for approval/rejection)
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
      {currentStatus === 'pending' && (
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
                disabled={isProcessing || !notes.trim()}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Approve Company
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isProcessing || !notes.trim()}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject - Request More Info
                  </>
                )}
              </Button>
            </div>
            {!notes.trim() && (
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Please add notes above before approving or rejecting
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {currentStatus === 'verified' && (
        <Card className="bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-medium">This company has been approved and verified</p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStatus === 'rejected' && (
        <Card className="bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-300">
              <XCircle className="h-5 w-5" />
              <p className="font-medium">This company has been rejected</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
