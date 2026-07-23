-- T148 Fase 1 — Servicio de notas de voz/texto por atleta (context feed para reportes y planes).
-- Ver docs/prd-notas-voz-contexto-atleta.md §5. Esta migración es SOLO schema (DDL).
--
-- Fase 1 solo escribe notas de texto (kind='text'). Las columnas de voz (kind='voice',
-- audio_path, transcription_*, transcribed_at) se crean desde ahora para que la fase 2 no tenga
-- que hacer un ALTER — pero body se deja nullable a propósito: una nota de voz puede existir con
-- transcripción pendiente (body llega cuando el STT termina), mientras que una nota de texto
-- siempre trae body (ver CHECK chk_text_has_body).
--
-- Máquina de estados de transcripción (fase 2, garantía pedida por Marco 23 Jul 2026): la nota de
-- voz se guarda SIEMPRE aunque el STT falle. transcription_status distingue pending/done/failed
-- (transcribed_at solo no basta: null no diferencia "aún no corre" de "corrió y falló").
-- transcription_attempts cuenta intentos para el reintento automático (1 reintento inmediato; si
-- también falla, la barrida diaria de fase 2 la vuelve a intentar). transcription_error guarda el
-- último error para debugging. El index parcial de abajo es lo que esa barrida usa para no
-- escanear toda la tabla.

CREATE TABLE public.athlete_notes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id     uuid NOT NULL REFERENCES public.athletes(id),
  coach_id       uuid NOT NULL REFERENCES public.coaches(id),
  kind           text NOT NULL CHECK (kind IN ('voice', 'text')),
  segment        text NOT NULL CHECK (segment IN ('tournament', 'training', 'general')),
  tournament_id  uuid REFERENCES public.tournaments(id),
  body                   text,
  audio_path             text,
  transcription_status   text,
  transcription_attempts int NOT NULL DEFAULT 0,
  transcription_error    text,
  transcribed_at         timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),

  -- tournament_id solo tiene sentido (y es obligatorio) cuando el segmento es 'tournament'.
  CONSTRAINT chk_tournament_segment CHECK (
    (segment = 'tournament' AND tournament_id IS NOT NULL)
    OR (segment <> 'tournament' AND tournament_id IS NULL)
  ),
  -- Una nota de texto siempre trae body; una de voz puede estar pendiente de transcripción.
  CONSTRAINT chk_text_has_body CHECK (kind = 'voice' OR body IS NOT NULL),
  -- Estado de transcripción: N/A en notas de texto (null); máquina de estados en las de voz.
  CONSTRAINT chk_transcription_status CHECK (
    (kind = 'text' AND transcription_status IS NULL)
    OR (kind = 'voice' AND transcription_status IN ('pending', 'done', 'failed'))
  )
);

-- Timeline por atleta, más reciente primero: es el patrón de lectura principal (la vista de
-- notas del coach en AlumnoDetalle) — index dedicado para no escanear toda la tabla.
CREATE INDEX idx_athlete_notes_athlete_created
  ON public.athlete_notes (athlete_id, created_at DESC);

-- La barrida diaria de fase 2 (reintento de transcripciones pendientes/fallidas) filtra por
-- estado — index parcial para que ese cron encuentre solo lo que necesita reintentar, sin
-- escanear toda la tabla. Vacío en fase 1 (no hay notas de voz todavía).
CREATE INDEX idx_athlete_notes_transcription_pending
  ON public.athlete_notes (created_at)
  WHERE transcription_status IN ('pending', 'failed');

-- updated_at automático vía la función genérica ya existente (20260603040633_create_triggers.sql).
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.athlete_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────────────────
-- Mismo modelo cross-coach que reports desde T140: cualquier coach LEE cualquier nota
-- (no hay ownership de atletas), pero solo el coach que la escribió puede modificarla o
-- borrarla. El atleta NO tiene acceso (interno del coach, mismo criterio que report_character).
ALTER TABLE public.athlete_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY coaches_select_all_notes ON public.athlete_notes
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));

CREATE POLICY coaches_insert_own_notes ON public.athlete_notes
  FOR INSERT TO authenticated
  WITH CHECK (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

CREATE POLICY coaches_update_own_notes ON public.athlete_notes
  FOR UPDATE TO authenticated
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

CREATE POLICY coaches_delete_own_notes ON public.athlete_notes
  FOR DELETE TO authenticated
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));
