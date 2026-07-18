
-- Content manager puede ver todos los atletas (para el mosaico)
CREATE POLICY "content_manager_select_athletes"
  ON public.athletes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.content_managers WHERE user_id = auth.uid())
  );

-- Content manager puede actualizar foto_url de cualquier atleta
CREATE POLICY "content_manager_update_athletes"
  ON public.athletes FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.content_managers WHERE user_id = auth.uid())
  );

-- Content manager puede actualizar foto_url de cualquier coach
CREATE POLICY "content_manager_update_coaches"
  ON public.coaches FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.content_managers WHERE user_id = auth.uid())
  );
