
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Key missing!", { supabaseUrl, supabaseAnonKey });
    // Do not throw here to avoid white screen on load.
    // The UI will handle the null client.
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
