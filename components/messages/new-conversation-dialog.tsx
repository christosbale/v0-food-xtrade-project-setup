'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface NewConversationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userCompany: any
  onConversationCreated: (conversation: any) => void
}

export function NewConversationDialog({
  open,
  onOpenChange,
  userId,
  userCompany,
  onConversationCreated,
}: NewConversationDialogProps) {
  const [otherUserEmail, setOtherUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const createConversation = async () => {
    if (!otherUserEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      // Find the other user by email
      const { data: otherUser, error: userError } = await supabase
        .from('companies')
        .select('user_id, id')
        .eq('business_email', otherUserEmail.trim())
        .single()

      if (userError || !otherUser) {
        toast({
          title: 'Error',
          description: 'User not found with this email',
          variant: 'destructive',
        })
        return
      }

      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .or(
          `and(participant_one_id.eq.${userId},participant_two_id.eq.${otherUser.user_id}),and(participant_one_id.eq.${otherUser.user_id},participant_two_id.eq.${userId})`
        )
        .single()

      if (existingConv) {
        onConversationCreated(existingConv)
        onOpenChange(false)
        toast({
          title: 'Success',
          description: 'Conversation already exists',
        })
        return
      }

      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          participant_one_id: userId,
          participant_two_id: otherUser.user_id,
          participant_one_company_id: userCompany?.id || null,
          participant_two_company_id: otherUser.id || null,
        })
        .select()
        .single()

      if (convError) throw convError

      onConversationCreated(newConv)
      onOpenChange(false)
      setOtherUserEmail('')
      toast({
        title: 'Success',
        description: 'Conversation created successfully',
      })
    } catch (error) {
      console.error('[v0] Error creating conversation:', error)
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Enter the email address of the company you want to message
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Company Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="company@example.com"
              value={otherUserEmail}
              onChange={(e) => setOtherUserEmail(e.target.value)}
            />
          </div>
          <Button onClick={createConversation} disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Start Conversation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
