import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
    'En local: cópialas al .env.local desde .env.example (por default deben apuntar al proyecto sandbox, nunca a producción). ' +
    'En Vercel: configúralas en Settings → Environment Variables con las credenciales de producción.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
