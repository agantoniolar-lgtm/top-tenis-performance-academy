
-- Tabla de PTFs (Formularios Post-Torneo) llenados por el atleta
CREATE TABLE public.post_tournament_forms (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id      uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,

  -- Metadata del partido
  match_date      date NOT NULL DEFAULT CURRENT_DATE,
  tournament_name text,

  -- A – Técnica (escalas 1-5 + textos)
  tecnica_derecha          smallint CHECK (tecnica_derecha  BETWEEN 1 AND 5),
  tecnica_reves            smallint CHECK (tecnica_reves    BETWEEN 1 AND 5),
  tecnica_servicio         smallint CHECK (tecnica_servicio BETWEEN 1 AND 5),
  tecnica_volea            smallint CHECK (tecnica_volea    BETWEEN 1 AND 5),
  tecnica_comentario       text,
  tecnica_mejora           text,

  -- B – Táctica
  tactica_comentario_plan  text,
  tactica_funciono         text,
  tactica_cambiar          text,

  -- C – Mental
  mental_presion           smallint CHECK (mental_presion  BETWEEN 1 AND 5),
  mental_concentracion     text,
  mental_confianza         smallint CHECK (mental_confianza BETWEEN 1 AND 5),
  mental_reaccion_error    text,

  -- D – Físico
  fisico_nivel             smallint CHECK (fisico_nivel BETWEEN 1 AND 5),
  fisico_dolor             boolean,
  fisico_dolor_zonas       text[],
  fisico_nutricion         text,

  -- E – Reflexión
  reflexion_hice_bien      text,
  reflexion_mejorar        text,
  reflexion_aprendizaje    text,
  reflexion_proximo_torneo text,
  reflexion_satisfaccion   smallint CHECK (reflexion_satisfaccion BETWEEN 1 AND 10),

  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.post_tournament_forms ENABLE ROW LEVEL SECURITY;

-- Atletas: insertar solo sus propios PTFs
CREATE POLICY "ptf_athlete_insert" ON public.post_tournament_forms
  FOR INSERT WITH CHECK (
    athlete_id = (SELECT id FROM public.athletes WHERE user_id = auth.uid())
  );

-- Atletas: leer solo sus propios PTFs
CREATE POLICY "ptf_athlete_select" ON public.post_tournament_forms
  FOR SELECT USING (
    athlete_id = (SELECT id FROM public.athletes WHERE user_id = auth.uid())
  );

-- Coaches: leer PTFs de sus atletas asignados
CREATE POLICY "ptf_coach_select" ON public.post_tournament_forms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.athletes a
      JOIN public.coaches c ON c.id = a.coach_id
      WHERE a.id = post_tournament_forms.athlete_id
        AND c.user_id = auth.uid()
    )
  );
