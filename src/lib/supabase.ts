import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or ANON key not found in env. Public reads may fail.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
