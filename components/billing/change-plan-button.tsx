'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { changePlan } from '@/app/(dashboard)/dashboard/billing/actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface ChangePlanButtonProps {
  planId: string
  planName: string
  isCurrentPlan: boolean
}

export function ChangePlanButton({ planId, planName, isCurrentPlan }: ChangePlanButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChangePlan = async () => {
    setLoading(true)
    
    const result = await changePlan(planId)
    
    if (result.success) {
      toast({
        title: 'Plan Changed',
        description: `Successfully changed to ${planName} plan`,
      })
      setOpen(false)
      router.refresh()
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to change plan',
        variant: 'destructive',
      })
    }
    
    setLoading(false)
  }

  if (isCurrentPlan) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Current Plan
      </Button>
    )
  }

  return (
    <>
      <Button 
        className="w-full" 
        onClick={() => setOpen(true)}
      >
        Change to {planName}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change to {planName} Plan?</DialogTitle>
            <DialogDescription>
              Your plan will be changed immediately and your next billing cycle will reflect the new pricing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleChangePlan} disabled={loading}>
              {loading ? 'Changing...' : 'Confirm Change'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
