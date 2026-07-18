-- athletes: quita el ALL scoped (incluía DELETE). SELECT ya estaba abierto (coaches_select_all_athletes).
-- INSERT no se repone: el único flujo que insertaba como coach (NuevoAtleta.jsx) se elimina del producto.
DROP POLICY IF EXISTS coaches_all_their_athletes ON public.athletes;
CREATE POLICY coaches_update_athletes ON public.athletes
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));

-- athlete_utr_history: lectura abierta a cualquier coach (antes solo el coach_id asignado del atleta)
DROP POLICY IF EXISTS coaches_read_utr_history ON public.athlete_utr_history;
CREATE POLICY coaches_select_all_utr_history ON public.athlete_utr_history
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));

-- athlete_profile_snapshots: mismo cambio
DROP POLICY IF EXISTS coaches_read_profile_snapshots ON public.athlete_profile_snapshots;
CREATE POLICY coaches_select_all_profile_snapshots ON public.athlete_profile_snapshots
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));

-- athlete_recruitment_profile: mismo cambio
DROP POLICY IF EXISTS recruitment_coach_select ON public.athlete_recruitment_profile;
CREATE POLICY coaches_select_all_recruitment_profile ON public.athlete_recruitment_profile
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));

-- quarterly_plans: cualquier coach puede ver/crear/editar cualquier plan. Sin DELETE (mismo criterio que athletes).
DROP POLICY IF EXISTS coaches_own_plans ON public.quarterly_plans;
CREATE POLICY coaches_select_all_plans ON public.quarterly_plans
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));
CREATE POLICY coaches_insert_plans ON public.quarterly_plans
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));
CREATE POLICY coaches_update_plans ON public.quarterly_plans
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));

-- quarterly_plan_objectives: sigue al mismo criterio que su plan (ahora abierto)
DROP POLICY IF EXISTS coaches_own_objectives ON public.quarterly_plan_objectives;
CREATE POLICY coaches_select_all_objectives ON public.quarterly_plan_objectives
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));
CREATE POLICY coaches_insert_objectives ON public.quarterly_plan_objectives
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));
CREATE POLICY coaches_update_objectives ON public.quarterly_plan_objectives
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.coaches WHERE coaches.user_id = auth.uid()));
