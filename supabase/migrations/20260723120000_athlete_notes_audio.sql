-- T148 Fase 2a — captura de voz: columna de duración + RLS del bucket de audio.
-- SOLO schema (DDL). El bucket privado `athlete-notes-audio` se crea aparte vía la API de
-- Storage / MCP (mismo patrón que `public-media` del CMS, cuyo bucket tampoco vive en una
-- migración — solo sus policies) para no meter un INSERT INTO storage.buckets (DML) acá.

-- Duración de la grabación en segundos, guardada desde la captura (client). Marco (23 Jul 2026):
-- no hay tope de duración por ahora; se guarda para poder analizar la distribución después y
-- elegir un decil donde cortar. Solo aplica a notas de voz.
ALTER TABLE public.athlete_notes ADD COLUMN audio_duration_seconds numeric;
ALTER TABLE public.athlete_notes ADD CONSTRAINT chk_duration_voice_only
  CHECK (audio_duration_seconds IS NULL OR kind = 'voice');

-- ── RLS del bucket de audio (storage.objects) ────────────────────────────────
-- Mismo modelo que la tabla athlete_notes: cualquier coach sube y lee (cross-coach); solo el
-- dueño del objeto (quien lo subió, `owner = auth.uid()`) lo actualiza o borra. El atleta no
-- tiene ninguna policy sobre este bucket → sin acceso por default (RLS ya activo en storage.objects).

CREATE POLICY "athlete-notes-audio coach read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'athlete-notes-audio'
    AND EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid())
  );

CREATE POLICY "athlete-notes-audio coach insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'athlete-notes-audio'
    AND EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid())
  );

CREATE POLICY "athlete-notes-audio owner update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'athlete-notes-audio' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'athlete-notes-audio' AND owner = auth.uid());

CREATE POLICY "athlete-notes-audio owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'athlete-notes-audio' AND owner = auth.uid());
