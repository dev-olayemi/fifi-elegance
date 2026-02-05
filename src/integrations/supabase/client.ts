import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

const SUPABASE_URL = "https://lhkkbzajiucnpefgauoi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxoa2tiemFqaXVjbnBlZmdhdW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTU3MDIsImV4cCI6MjA4NTY5MTcwMn0.yHjnyDHuIL02w8xnc3gSiK44BE-sqDiEQ75Qf0Qbfzs";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
