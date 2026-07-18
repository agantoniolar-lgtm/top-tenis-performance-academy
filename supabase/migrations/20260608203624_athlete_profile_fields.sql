
-- Ampliar tabla athletes
ALTER TABLE athletes
  ADD COLUMN IF NOT EXISTS tipo_reves      text,
  ADD COLUMN IF NOT EXISTS altura_cm       integer,
  ADD COLUMN IF NOT EXISTS peso_kg         numeric(5,1),
  ADD COLUMN IF NOT EXISTS email           text,
  ADD COLUMN IF NOT EXISTS telefono        text,
  ADD COLUMN IF NOT EXISTS nombre_padre    text,
  ADD COLUMN IF NOT EXISTS email_padre     text,
  ADD COLUMN IF NOT EXISTS telefono_padre  text,
  ADD COLUMN IF NOT EXISTS escuela         text,
  ADD COLUMN IF NOT EXISTS grado_escolar   text;

-- Tabla de perfil de reclutamiento (solo editable por el atleta)
CREATE TABLE IF NOT EXISTS athlete_recruitment_profile (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id       uuid REFERENCES athletes(id) ON DELETE CASCADE UNIQUE NOT NULL,
  division_objetivo text,
  grad_year        text,
  gpa              numeric(4,2),
  english_level    text,
  study_area       text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- RLS: el atleta solo puede ver y editar su propio perfil
ALTER TABLE athlete_recruitment_profile ENABLE ROW LEVEL SECURITY;
