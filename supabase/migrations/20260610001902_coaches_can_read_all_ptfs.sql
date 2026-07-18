
-- Cualquier coach puede leer todos los PTFs (para ver estado en sección torneos)
DROP POLICY "ptf_coach_select" ON public.post_tournament_forms;
CREATE POLICY "ptf_coach_select"
  ON public.post_tournament_forms FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.coaches WHERE user_id = auth.uid())
  );
