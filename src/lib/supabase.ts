import { createClient } from '@supabase/supabase-js';

// Fallback error checking to ensure the app doesn't silently fail if the .env is missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);