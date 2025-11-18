-- Create conversations table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  participant_one_id uuid not null references auth.users(id) on delete cascade,
  participant_two_id uuid not null references auth.users(id) on delete cascade,
  participant_one_company_id uuid references public.companies(id) on delete cascade,
  participant_two_company_id uuid references public.companies(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(participant_one_id, participant_two_id)
);

-- Create messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Conversations policies: users can only see conversations they're part of
create policy "conversations_select_own"
  on public.conversations for select
  using (
    auth.uid() = participant_one_id 
    or auth.uid() = participant_two_id
  );

create policy "conversations_insert_own"
  on public.conversations for insert
  with check (
    auth.uid() = participant_one_id 
    or auth.uid() = participant_two_id
  );

-- Messages policies: users can only see messages from their conversations
create policy "messages_select_own"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and (conversations.participant_one_id = auth.uid() 
           or conversations.participant_two_id = auth.uid())
    )
  );

create policy "messages_insert_own"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations
      where conversations.id = conversation_id
      and (conversations.participant_one_id = auth.uid() 
           or conversations.participant_two_id = auth.uid())
    )
  );

create policy "messages_update_own"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
      and (conversations.participant_one_id = auth.uid() 
           or conversations.participant_two_id = auth.uid())
    )
  );

-- Create indexes for better performance
create index if not exists conversations_participant_one_idx on public.conversations(participant_one_id);
create index if not exists conversations_participant_two_idx on public.conversations(participant_two_id);
create index if not exists messages_conversation_idx on public.messages(conversation_id);
create index if not exists messages_sender_idx on public.messages(sender_id);
create index if not exists messages_created_at_idx on public.messages(created_at desc);

-- Function to update conversation's updated_at timestamp when a new message is sent
create or replace function public.update_conversation_timestamp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

-- Trigger to auto-update conversation timestamp
drop trigger if exists on_message_created on public.messages;
create trigger on_message_created
  after insert on public.messages
  for each row
  execute function public.update_conversation_timestamp();
