
import { createClient } from '@supabase/supabase-js';

// We'll replace these with actual values when connecting to Supabase
const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseAnonKey = "your-anon-key"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
