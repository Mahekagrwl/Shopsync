/**
 * ShopSync Supabase Client Configuration
 * Allows direct connection to Supabase PostgreSQL when using Supabase Auth or Realtime subscriptions.
 */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
