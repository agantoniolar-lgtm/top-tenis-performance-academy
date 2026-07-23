#!/usr/bin/env node
// Barrida diaria de transcripciones pendientes/fallidas (T148 fase 2c).
//
// La Edge Function `transcribe-note` (2b) transcribe una nota de voz al momento de grabarla, con
// 1 reintento inmediato. Si eso también falla (o el cliente se desconectó antes de invocarla), la
// nota queda `pending`/`failed`. Esta barrida las recupera: busca las notas de voz que siguen sin
// transcribir y por debajo del tope de intentos (ver `notesNeedingTranscription` en athletics.js),
// y re-invoca `transcribe-note` para cada una.
//
// Uso:
//   node scripts/transcription_sweep.mjs --dry-run   # solo lista lo que reintentaría, sin invocar
//   node scripts/transcription_sweep.mjs             # reintenta de verdad
//
// Variables de entorno necesarias:
//   SUPABASE_URL          → URL del proyecto de Top Tennis
//   SUPABASE_SERVICE_KEY  → Service role key — bypassa RLS (necesita ver todas las notas) y sirve
//                           como bearer para invocar la Edge Function (que tiene verify_jwt).

import { createClient } from '@supabase/supabase-js';
import { notesNeedingTranscription, MAX_TRANSCRIPTION_ATTEMPTS } from '../src/lib/athletics.js';

const DRY_RUN = process.argv.includes('--dry-run');

function requireEnv(name) {
  const v = process.env[name];
  if (!v) { console.error(`Falta la variable de entorno ${name}`); process.exit(1); }
  return v;
}

const SUPABASE_URL = requireEnv('SUPABASE_URL');
const SERVICE_KEY = requireEnv('SUPABASE_SERVICE_KEY');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function main() {
  // Candidatas: voz, pending|failed, con audio, bajo el tope. El filtro de SQL usa el index parcial
  // idx_athlete_notes_transcription_pending; `notesNeedingTranscription` re-aplica el mismo predicado
  // (incluye el tope de intentos, que el index no cubre) como fuente de verdad testeable.
  const { data, error } = await supabase
    .from('athlete_notes')
    .select('id, kind, audio_path, transcription_status, transcription_attempts, athlete_id')
    .eq('kind', 'voice')
    .in('transcription_status', ['pending', 'failed'])
    .not('audio_path', 'is', null)
    .order('created_at', { ascending: true });
  if (error) { console.error('Error al leer las notas:', error.message); process.exit(1); }

  const pendientes = notesNeedingTranscription(data, MAX_TRANSCRIPTION_ATTEMPTS);
  console.log(`Notas de voz sin transcribir (bajo el tope de ${MAX_TRANSCRIPTION_ATTEMPTS} intentos): ${pendientes.length}`);

  if (pendientes.length === 0) { console.log('Nada que reintentar.'); return; }
  if (DRY_RUN) {
    pendientes.forEach(n => console.log(`  [dry-run] reintentaría ${n.id} (status=${n.transcription_status}, intentos=${n.transcription_attempts ?? 0})`));
    return;
  }

  let ok = 0, fail = 0;
  for (const n of pendientes) {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/transcribe-note`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ note_id: n.id }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out?.status === 'done') { ok++; console.log(`  ✓ ${n.id} transcrita`); }
      else { fail++; console.log(`  ✗ ${n.id} sigue fallando (${out?.error ?? res.status})`); }
    } catch (e) {
      fail++; console.log(`  ✗ ${n.id} error de red: ${e.message}`);
    }
  }
  console.log(`Barrida terminada: ${ok} transcritas, ${fail} siguen pendientes (se reintentarán mañana hasta el tope).`);
}

main().catch(e => { console.error(e); process.exit(1); });
