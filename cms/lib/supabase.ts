import { createClient } from '@supabase/supabase-js'

export function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL as string
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !key) throw new Error('Missing Supabase server credentials')
  return createClient(url, key)
}

export function getSupabaseAnonClient() {
  const url = process.env.SUPABASE_URL as string
  const key = process.env.SUPABASE_ANON_KEY as string
  if (!url || !key) throw new Error('Missing Supabase anon credentials')
  return createClient(url, key)
}
