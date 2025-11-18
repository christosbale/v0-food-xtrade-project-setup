'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Gift, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { changeCompanyPlan, grantFreeMonths } from '@/app/(admin)/admin/billing/[id]/actions'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AdminBillingActionsProps {
  companyId: string
  currentTier: string
}

export function AdminBillingActions({
  companyId,
  currentTier,
}: AdminBillingActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(currentTier)
  const [freeMonths, setFreeMonths] = useState('1')
  const [promoReason, setPromoReason] = useState('')

  const handleChangePlan = async () => {
    if (selectedPlan === currentTier) {
      toast({
        title: 'No change',
        description: 'Selected plan is the same as current plan',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    try {
      await changeCompanyPlan(companyId, selectedPlan as any)
      toast({
        title: 'Plan changed',
        description: `Successfully changed plan to ${selectedPlan}`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change plan',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGrantFreeMonths = async () => {
    if (!promoReason.trim()) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for granting free months',
        variant: 'destructive',
      })
      return
    }

    const months = parseInt(freeMonths)
    if (isNaN(months) || months < 1) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a valid number of months',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    try {
      await grantFreeMonths(companyId, months, promoReason)
      toast({
        title: 'Free months granted',
        description: `Successfully granted ${months} free month(s)`,
      })
      router.refresh()
      setPromoReason('')
      setFreeMonths('1')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to grant free months',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Change Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Change Subscription Plan</CardTitle>
          <CardDescription>
            Upgrade or downgrade this company's plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select New Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (Free)</SelectItem>
                <SelectItem value="pro">Pro ($99/month)</SelectItem>
                <SelectItem value="premium">Premium ($299/month)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleChangePlan}
            disabled={isProcessing || selectedPlan === currentTier}
            className="w-full"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            Change Plan
          </Button>
        </CardContent>
      </Card>

      {/* Grant Free Months */}
      <Card>
        <CardHeader>
          <CardTitle>Grant Free Months</CardTitle>
          <CardDescription>
            Provide promotional free months for marketing or customer retention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Number of Free Months</Label>
            <Input
              type="number"
              min="1"
              value={freeMonths}
              onChange={(e) => setFreeMonths(e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <Label>Reason for Promotion</Label>
            <Textarea
              value={promoReason}
              onChange={(e) => setPromoReason(e.target.value)}
              placeholder="e.g., New customer promotion, Retention offer, Partnership deal..."
              rows={3}
              className="resize-none"
            />
          </div>
          <Button
            onClick={handleGrantFreeMonths}
            disabled={isProcessing}
            variant="outline"
            className="w-full"
          >
            <Gift className="h-5 w-5 mr-2" />
            Grant Free Months
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
