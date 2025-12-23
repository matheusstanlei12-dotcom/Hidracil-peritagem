
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://krxgmbgbizhxtglmenti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeGdtYmdiaXpoeHRnbG1lbnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc2NjUsImV4cCI6MjA4MjA5MzY2NX0.e0DcyrjZ3DDuG56F9HIl_ZwmD6EBsHqGIzLfq8aH9Qk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
