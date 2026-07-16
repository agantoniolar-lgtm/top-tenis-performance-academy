import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rrrwhwciggohwxslqlho.supabase.co';
const SUPABASE_ANON = 'sb_publishable_PQfvyL6FD8-ok-cS2NLG2Q_l_GaCdUL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
