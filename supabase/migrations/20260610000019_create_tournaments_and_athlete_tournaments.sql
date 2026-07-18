
-- ─── tournaments ─────────────────────────────────────────────────────────────
CREATE TABLE public.tournaments (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      text NOT NULL,
  tipo        text CHECK (tipo IN ('AMTP', 'ITF Junior', 'UTR', 'Otro')),
  categoria   text CHECK (categoria IN ('U12', 'U14', 'U16', 'U18', 'Open')),
  fecha       date NOT NULL,
  sede        text,
  created_by  uuid REFERENCES auth.users(id),
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Todos los autenticados pueden leer torneos
CREATE POLICY "tournaments_select"
  ON public.tournaments FOR SELECT
  TO authenticated USING (true);

-- Solo el creador puede insertar
CREATE POLICY "tournaments_insert"
  ON public.tournaments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = created_by);

-- ─── athlete_tournaments ─────────────────────────────────────────────────────
CREATE TABLE public.athlete_tournaments (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id   uuid NOT NULL REFERENCES public.athletes(id),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id),
  modalidad    text DEFAULT 'Individual' CHECK (modalidad IN ('Individual', 'Dobles', 'Ambas')),
  ronda        text,
  resultado    text,
  victoria     boolean,
  notas        text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.athlete_tournaments ENABLE ROW LEVEL SECURITY;

-- Atleta ve sus propios; coach ve los de sus atletas
CREATE POLICY "athlete_tournaments_select"
  ON public.athlete_tournaments FOR SELECT
  TO authenticated USING (
    athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
    OR
    athlete_id IN (
      SELECT a.id FROM public.athletes a
      JOIN public.coaches c ON a.coach_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

-- Atleta solo inserta sus propios
CREATE POLICY "athlete_tournaments_insert"
  ON public.athlete_tournaments FOR INSERT
  TO authenticated WITH CHECK (
    athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
  );

-- Atleta solo edita sus propios
CREATE POLICY "athlete_tournaments_update"
  ON public.athlete_tournaments FOR UPDATE
  TO authenticated USING (
    athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
  );

-- ─── Vincular PTF al registro de torneo ──────────────────────────────────────
ALTER TABLE public.post_tournament_forms
  ADD COLUMN athlete_tournament_id uuid REFERENCES public.athlete_tournaments(id);
