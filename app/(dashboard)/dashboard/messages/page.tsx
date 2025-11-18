import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessagesView } from '@/components/messages/messages-view'

export default async function MessagesPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fetch conversations with latest message
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      messages (
        content,
        created_at,
        is_read,
        sender_id
      )
    `)
    .or(`participant_one_id.eq.${user.id},participant_two_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  console.log('[v0] Conversations fetch error:', error)
  console.log('[v0] Conversations data:', conversations)

  return <MessagesView initialConversations={conversations || []} userId={user.id} userCompany={company} />
}
