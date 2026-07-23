import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// T148 fase 2b — Transcribe una nota de voz (athlete_notes.kind='voice') con OpenAI Whisper.
// Recibe { note_id }, baja el audio del bucket privado con service role, transcribe, y actualiza
// la fila. Idempotente y auto-contenida: 2c (barrida diaria) la invoca con solo el note_id.
//
// Estados de athlete_notes.transcription_status: pending → done | failed.
// Garantía de durabilidad (T148): la nota + audio ya existen antes de llamar acá; si la
// transcripción falla, la nota NO se pierde — queda 'failed' y la recupera la barrida diaria.

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const BUCKET = "athlete-notes-audio";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

// Una pasada de transcripción: baja el audio y lo manda a Whisper. Lanza si algo falla.
async function transcribeOnce(admin: ReturnType<typeof createClient>, audioPath: string): Promise<string> {
  const { data: blob, error: dlErr } = await admin.storage.from(BUCKET).download(audioPath);
  if (dlErr || !blob) throw new Error(`No se pudo bajar el audio: ${dlErr?.message ?? "sin datos"}`);

  const form = new FormData();
  // Whisper usa la extensión del nombre para inferir el formato — audioPath ya la trae (.webm/.m4a).
  form.append("file", blob, audioPath);
  form.append("model", "whisper-1");
  form.append("language", "es");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Whisper ${res.status}: ${await res.text()}`);
  const out = await res.json();
  const text = (out?.text ?? "").trim();
  if (!text) throw new Error("Whisper devolvió una transcripción vacía");
  return text;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (!OPENAI_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    return json({ error: "Configuración incompleta en el servidor" }, 500);
  }

  let noteId: string | null = null;
  try {
    const body = await req.json();
    noteId = body?.note_id ?? null;
  } catch {
    return json({ error: "Body inválido" }, 400);
  }
  if (!noteId) return json({ error: "note_id es requerido" }, 400);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: note, error: noteErr } = await admin
    .from("athlete_notes")
    .select("id, kind, audio_path, transcription_status, transcription_attempts")
    .eq("id", noteId)
    .single();
  if (noteErr || !note) return json({ error: "Nota no encontrada" }, 404);
  if (note.kind !== "voice" || !note.audio_path) return json({ error: "La nota no es de voz o no tiene audio" }, 400);
  if (note.transcription_status === "done") return json({ status: "done", note_id: noteId }); // ya transcrita, idempotente

  const priorAttempts = note.transcription_attempts ?? 0;

  // 1 reintento inmediato: dos intentos en total antes de marcar 'failed' (T148 — el resto lo
  // recupera la barrida diaria de 2c).
  let transcript: string | null = null;
  let lastErr = "";
  for (let i = 0; i < 2 && transcript === null; i++) {
    try {
      transcript = await transcribeOnce(admin, note.audio_path);
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
  }

  if (transcript === null) {
    await admin.from("athlete_notes").update({
      transcription_status: "failed",
      transcription_error: lastErr.slice(0, 500),
      transcription_attempts: priorAttempts + 1,
    }).eq("id", noteId);
    return json({ status: "failed", note_id: noteId, error: lastErr }, 502);
  }

  await admin.from("athlete_notes").update({
    body: transcript,
    transcription_status: "done",
    transcription_error: null,
    transcribed_at: new Date().toISOString(),
    transcription_attempts: priorAttempts + 1,
  }).eq("id", noteId);

  return json({ status: "done", note_id: noteId, transcript });
});
