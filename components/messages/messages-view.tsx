'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, Plus } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { NewConversationDialog } from './new-conversation-dialog'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

interface Conversation {
  id: string
  participant_one_id: string
  participant_two_id: string
  participant_one_company_id: string | null
  participant_two_company_id: string | null
  created_at: string
  updated_at: string
  messages?: Message[]
}

interface MessagesViewProps {
  initialConversations: Conversation[]
  userId: string
  userCompany: any
}

export function MessagesView({ initialConversations, userId, userCompany }: MessagesViewProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNewConversation, setShowNewConversation] = useState(false)
  const supabase = createClient()

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
      
      // Subscribe to new messages
      const channel = supabase
        .channel(`messages:${selectedConversation}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation}`,
          },
          (payload) => {
            console.log('[v0] New message received:', payload)
            setMessages((current) => [...current, payload.new as Message])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedConversation])

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    console.log('[v0] Messages loaded:', data, error)
    if (data) {
      setMessages(data)
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: selectedConversation,
        sender_id: userId,
        content: newMessage.trim(),
      })

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('[v0] Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getOtherParticipantId = (conversation: Conversation) => {
    return conversation.participant_one_id === userId
      ? conversation.participant_two_id
      : conversation.participant_one_id
  }

  const getLatestMessage = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'No messages yet'
    }
    return conversation.messages[0].content
  }

  const getUnreadCount = (conversation: Conversation) => {
    if (!conversation.messages) return 0
    return conversation.messages.filter(
      (m) => !m.is_read && m.sender_id !== userId
    ).length
  }

  if (conversations.length === 0 && !showNewConversation) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
        <p className="text-muted-foreground mb-4">Start a new conversation to get started</p>
        <Button onClick={() => setShowNewConversation(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Start Conversation
        </Button>
        <NewConversationDialog
          open={showNewConversation}
          onOpenChange={setShowNewConversation}
          userId={userId}
          userCompany={userCompany}
          onConversationCreated={(conv) => {
            setConversations([conv, ...conversations])
            setSelectedConversation(conv.id)
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button onClick={() => setShowNewConversation(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {conversations.map((conversation) => {
                  const unreadCount = getUnreadCount(conversation)
                  const isSelected = selectedConversation === conversation.id

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-secondary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Avatar>
                        <AvatarFallback>
                          {getOtherParticipantId(conversation).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">
                            Conversation {conversation.id.slice(0, 8)}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {getLatestMessage(conversation)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.updated_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isSender = message.sender_id === userId

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isSender
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isSender
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {formatDistanceToNow(new Date(message.created_at), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[600px]">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a conversation to view messages
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        userId={userId}
        userCompany={userCompany}
        onConversationCreated={(conv) => {
          setConversations([conv, ...conversations])
          setSelectedConversation(conv.id)
        }}
      />
    </div>
  )
}
