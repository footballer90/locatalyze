import { createClient } from '@supabase/supabase-js'

// These values come from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This is what we import in other files to talk to the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)