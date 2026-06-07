import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://rrrwhwciggohwxslqlho.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJycndod2NpZ2dvaHd4c2xxbGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDY3ODQsImV4cCI6MjA5NjAyMjc4NH0.vc3YgoyggVw09lqgVDMT-R6-M27VCvEPpuel4-jcA2g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
