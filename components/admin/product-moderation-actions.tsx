'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { markProductAsReviewed, updateProductStatus } from '@/app/(admin)/admin/products/[id]/actions'
import { useToast } from '@/hooks/use-toast'

interface ProductModerationActionsProps {
  productId: string
  isReviewed: boolean
  currentStatus: string
}

export function ProductModerationActions({
  productId,
  isReviewed,
  currentStatus,
}: ProductModerationActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMarkReviewed = async () => {
    setIsProcessing(true)
    try {
      await markProductAsReviewed(productId, notes)
      toast({
        title: 'Product reviewed',
        description: 'Product has been marked as reviewed',
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to review product',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePublish = async () => {
    setIsProcessing(true)
    try {
      await updateProductStatus(productId, 'published', notes)
      toast({
        title: 'Product published',
        description: 'Product is now visible to buyers',
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to publish product',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnpublish = async () => {
    if (!notes.trim()) {
      toast({
        title: 'Notes required',
        description: 'Please add reason for unpublishing',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    try {
      await updateProductStatus(productId, 'draft', notes)
      toast({
        title: 'Product unpublished',
        description: 'Product has been hidden from buyers',
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to unpublish product',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Admin Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Notes</CardTitle>
          <CardDescription>
            Add internal notes about this product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter moderation notes, quality concerns, or observations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Actions</CardTitle>
          <CardDescription>
            Review and manage product visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {!isReviewed && (
              <Button
                onClick={handleMarkReviewed}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Mark as Reviewed
              </Button>
            )}

            {currentStatus === 'draft' && (
              <Button
                onClick={handlePublish}
                disabled={isProcessing}
                className="w-full"
              >
                <Eye className="h-5 w-5 mr-2" />
                Publish Product
              </Button>
            )}

            {currentStatus === 'published' && (
              <Button
                onClick={handleUnpublish}
                disabled={isProcessing}
                variant="destructive"
                className="w-full"
              >
                <EyeOff className="h-5 w-5 mr-2" />
                Unpublish Product
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
