'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { updateVerificationSettings, updateSubscriptionSettings } from "@/app/(admin)/admin/companies/[id]/actions"
import { useRouter } from 'next/navigation'
import { Shield, CreditCard } from 'lucide-react'

interface AdminCompanyControlsProps {
  company: any
}

export function AdminCompanyControls({ company }: AdminCompanyControlsProps) {
  const router = useRouter()
  const [isVerificationLoading, setIsVerificationLoading] = useState(false)
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState('')
  const [subscriptionMessage, setSubscriptionMessage] = useState('')

  // Verification state
  const [verificationStatus, setVerificationStatus] = useState(company.verification_status || 'pending')
  const [verificationLevel, setVerificationLevel] = useState(company.verification_level || 'basic')
  const [riskScore, setRiskScore] = useState(company.risk_score?.toString() || '50')
  const [riskNotes, setRiskNotes] = useState(company.risk_notes || '')

  // Subscription state
  const [subscriptionPlan, setSubscriptionPlan] = useState(company.subscription_plan || 'basic')
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState(
    company.subscription_expires_at 
      ? new Date(company.subscription_expires_at).toISOString().split('T')[0]
      : ''
  )

  const handleSaveVerification = async () => {
    setIsVerificationLoading(true)
    setVerificationMessage('')
    try {
      await updateVerificationSettings(company.id, {
        verification_status: verificationStatus,
        verification_level: verificationLevel,
        risk_score: parseFloat(riskScore),
        risk_notes: riskNotes,
      })
      setVerificationMessage('Verification settings saved successfully')
      router.refresh()
    } catch (error: any) {
      setVerificationMessage('Error: ' + error.message)
    } finally {
      setIsVerificationLoading(false)
    }
  }

  const handleSaveSubscription = async () => {
    setIsSubscriptionLoading(true)
    setSubscriptionMessage('')
    try {
      await updateSubscriptionSettings(company.id, {
        subscription_plan: subscriptionPlan,
        subscription_expires_at: subscriptionExpiresAt || null,
      })
      setSubscriptionMessage('Subscription settings saved successfully')
      router.refresh()
    } catch (error: any) {
      setSubscriptionMessage('Error: ' + error.message)
    } finally {
      setIsSubscriptionLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Verification & Risk Panel */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Verification & Risk</CardTitle>
          </div>
          <CardDescription>
            Manage verification status and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-status">Verification Status</Label>
            <Select value={verificationStatus} onValueChange={setVerificationStatus}>
              <SelectTrigger id="verification-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verification-level">Verification Level</Label>
            <Select value={verificationLevel} onValueChange={setVerificationLevel}>
              <SelectTrigger id="verification-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="trusted">Trusted</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-score">Risk Score (0-100)</Label>
            <Input
              id="risk-score"
              type="number"
              min="0"
              max="100"
              value={riskScore}
              onChange={(e) => setRiskScore(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk-notes">Risk Notes</Label>
            <Textarea
              id="risk-notes"
              rows={3}
              value={riskNotes}
              onChange={(e) => setRiskNotes(e.target.value)}
              placeholder="Internal notes about risk assessment..."
            />
          </div>

          <Button 
            onClick={handleSaveVerification}
            disabled={isVerificationLoading}
            className="w-full"
            style={{ backgroundColor: '#FFB84D', color: '#000' }}
          >
            {isVerificationLoading ? 'Saving...' : 'Save Verification Settings'}
          </Button>

          {verificationMessage && (
            <p className={`text-sm ${verificationMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {verificationMessage}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Subscription Panel */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>
            Manage subscription plan and expiry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subscription-plan">Subscription Plan</Label>
            <Select value={subscriptionPlan} onValueChange={setSubscriptionPlan}>
              <SelectTrigger id="subscription-plan">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscription-expires">Expiry Date (leave empty for no expiry)</Label>
            <Input
              id="subscription-expires"
              type="date"
              value={subscriptionExpiresAt}
              onChange={(e) => setSubscriptionExpiresAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Empty expiry = active subscription. Set a date for trial/limited access.
            </p>
          </div>

          <Button 
            onClick={handleSaveSubscription}
            disabled={isSubscriptionLoading}
            className="w-full"
            style={{ backgroundColor: '#FFB84D', color: '#000' }}
          >
            {isSubscriptionLoading ? 'Saving...' : 'Save Subscription'}
          </Button>

          {subscriptionMessage && (
            <p className={`text-sm ${subscriptionMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {subscriptionMessage}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
