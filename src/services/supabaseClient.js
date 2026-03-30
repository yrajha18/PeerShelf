import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wbytrkhxehfzwwdxolnt.supabase.co";
const supabaseAnonKey = "sb_publishable_35xPJt91tAHjZQ0Q8Ul-_g_tQzsjoR0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);