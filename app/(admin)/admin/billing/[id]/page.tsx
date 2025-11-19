import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { AdminBillingActions } from '@/components/admin/admin-billing-actions'

export const dynamic = 'force-dynamic'

export default async function AdminCompanyBillingPage({ 
  params 
}: { 
  params: Promise<{ id: string }> // Changed to Promise for Next.js 16 compatibility
}) {
  const { id } = await params
  
  const supabase = await createClient()
  
  // Fetch company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id) // Use awaited id
    .single()

  if (!company) {
    notFound()
  }

  // Fetch subscription history
  const { data: subscriptionHistory } = await supabase
    .from('subscription_history')
    .select('*')
    .eq('company_id', id) // Use awaited id
    .order('created_at', { ascending: false })

  // Fetch current active subscription
  const activeSubscription = subscriptionHistory?.find((sub: any) => sub.status === 'active')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Billing Management</h2>
          <p className="text-muted-foreground">
            Manage subscription for {company.company_name}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/billing">Back to Billing</Link>
        </Button>
      </div>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Company Name</Label>
              <p className="font-medium">{company.company_name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Current Plan</Label>
              <Badge 
                variant={
                  company.subscription_tier === 'premium' ? 'default' :
                  company.subscription_tier === 'pro' ? 'secondary' :
                  'outline'
                }
                className="capitalize"
              >
                {company.subscription_tier}
              </Badge>
            </div>
            <div>
              <Label className="text-muted-foreground">Country</Label>
              <p className="font-medium">{company.country}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Member Since</Label>
              <p className="font-medium">
                {new Date(company.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Subscription Details */}
      {activeSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Active Subscription</CardTitle>
            <CardDescription>Current subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Plan</Label>
                <p className="font-medium capitalize">{activeSubscription.plan_id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge variant="default">{activeSubscription.status}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Started</Label>
                <p className="font-medium">
                  {new Date(activeSubscription.started_at).toLocaleDateString()}
                </p>
              </div>
              {activeSubscription.promotional_months > 0 && (
                <div>
                  <Label className="text-muted-foreground">Promotional Months</Label>
                  <Badge className="bg-green-500">
                    {activeSubscription.promotional_months} months free
                  </Badge>
                </div>
              )}
            </div>
            {activeSubscription.promotion_reason && (
              <>
                <Separator />
                <div>
                  <Label className="text-muted-foreground">Promotion Reason</Label>
                  <p className="text-sm mt-1">{activeSubscription.promotion_reason}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      <AdminBillingActions
        companyId={company.id}
        currentTier={company.subscription_tier}
      />

      {/* Subscription History */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
          <CardDescription>
            All subscription changes for this company
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptionHistory && subscriptionHistory.length > 0 ? (
            <div className="space-y-4">
              {subscriptionHistory.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {sub.plan_id}
                      </Badge>
                      <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                        {sub.status}
                      </Badge>
                      {sub.promotional_months > 0 && (
                        <Badge className="bg-green-500">
                          {sub.promotional_months} free months
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Started: {new Date(sub.started_at).toLocaleDateString()}
                      {sub.ended_at && ` • Ended: ${new Date(sub.ended_at).toLocaleDateString()}`}
                    </p>
                    {sub.promotion_reason && (
                      <p className="text-sm italic text-muted-foreground">
                        {sub.promotion_reason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No subscription history
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
