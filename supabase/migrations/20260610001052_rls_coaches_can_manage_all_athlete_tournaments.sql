
-- Cualquier coach puede ver todos los atletas (para el picker de torneos)
CREATE POLICY "coaches_select_all_athletes"
  ON public.athletes FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.coaches WHERE user_id = auth.uid())
  );

-- Cualquier coach puede ver todos los athlete_tournaments (no solo los de sus atletas)
DROP POLICY "athlete_tournaments_select" ON public.athlete_tournaments;
CREATE POLICY "athlete_tournaments_select"
  ON public.athlete_tournaments FOR SELECT
  TO authenticated USING (
    athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.coaches WHERE user_id = auth.uid())
  );

-- Cualquier coach puede insertar athlete_tournaments para cualquier atleta
DROP POLICY "athlete_tournaments_insert" ON public.athlete_tournaments;
CREATE POLICY "athlete_tournaments_insert"
  ON public.athlete_tournaments FOR INSERT
  TO authenticated WITH CHECK (
    athlete_id IN (SELECT id FROM public.athletes WHERE user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.coaches WHERE user_id = auth.uid())
  );
