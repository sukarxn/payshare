
import { createClient } from '@supabase/supabase-js';

// Use the actual values from the Supabase integration
const supabaseUrl = "https://zffzgytqzamacekpikpn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmZnpneXRxemFtYWNla3Bpa3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTMzNTgsImV4cCI6MjA2MjM4OTM1OH0.UjPU5px86LtAISffMJsihikaYsgmbWizOqStEY3_iT4"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
