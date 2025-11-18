import { createBrowserClient as createBrowserClientSSR } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

// Singleton instance to prevent multiple client warnings
let client: SupabaseClient | undefined

export function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClientSSR(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

export const createBrowserClient = createClient
