import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_DIGITAL_TWIN || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DIGITAL_TWIN || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
