
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Key missing!", { supabaseUrl, supabaseAnonKey });
    throw new Error("Configuração do Supabase ausente. Verifique as variáveis de ambiente (VITE_SUPABASE_URL).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
