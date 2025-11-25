import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with placeholder values if env vars are missing
// This allows the app to load, but auth won't work until env vars are set
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Check if we're using placeholder values and log a warning
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Missing Supabase environment variables!\n' +
    'Please create a .env.local file with:\n' +
    'VITE_SUPABASE_URL=your_supabase_project_url\n' +
    'VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n' +
    '\nAuthentication will not work until these are set.'
  )
}

/**
 * Get the site URL for redirects (email verification, password reset, etc.)
 * Uses VITE_SITE_URL if set, otherwise falls back to window.location.origin
 * This ensures production URLs work correctly instead of defaulting to localhost
 */
export function getSiteUrl(): string {
  // Check for explicit site URL in environment (for production)
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL
  }
  
  // Fall back to current origin (works in both dev and production)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side fallback (shouldn't happen in client-side code)
  return 'http://localhost:3000'
}

