
-- Extensions
create extension if not exists "uuid-ossp";

-- coaches
create table public.coaches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  nombre text not null,
  apellido text not null,
  created_at timestamptz not null default now()
);

-- athletes
create table public.athletes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  coach_id uuid not null references public.coaches(id),
  nombre text not null,
  apellido text not null,
  fecha_nacimiento date not null,
  foto_url text,
  mano_dominante text not null check (mano_dominante in ('derecha', 'zurda')),
  fecha_ingreso date not null default current_date,
  utr_actual numeric(4,2),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- reports
create table public.reports (
  id uuid primary key default uuid_generate_v4(),
  athlete_id uuid not null references public.athletes(id),
  coach_id uuid not null references public.coaches(id),
  period date not null,
  athlete_voice_unlocked_at timestamptz,
  athlete_voice_unlocked_by uuid references public.coaches(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_athlete_period unique (athlete_id, period)
);

-- report_on_court
create table public.report_on_court (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid not null unique references public.reports(id) on delete cascade,
  -- técnica
  serve smallint check (serve between 1 and 5),
  forehand smallint check (forehand between 1 and 5),
  backhand smallint check (backhand between 1 and 5),
  volea smallint check (volea between 1 and 5),
  return smallint check (return between 1 and 5),
  footwork smallint check (footwork between 1 and 5),
  tecnica_nota text,
  -- táctica
  seleccion_golpe smallint check (seleccion_golpe between 1 and 5),
  manejo_riesgo smallint check (manejo_riesgo between 1 and 5),
  puntos_clave smallint check (puntos_clave between 1 and 5),
  adaptacion_tactica smallint check (adaptacion_tactica between 1 and 5),
  tactica_nota text,
  -- transferencia
  transferencia_partido smallint check (transferencia_partido between 1 and 5),
  -- comunes
  utr numeric(4,2),
  highlights text[],
  -- metadata
  completed_at timestamptz,
  completed_by uuid references public.coaches(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint highlights_max_3 check (array_length(highlights, 1) <= 3)
);

-- report_physical
create table public.report_physical (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid not null unique references public.reports(id) on delete cascade,
  sprint_20m numeric(4,2),
  beep_test_nivel smallint,
  beep_test_rep smallint,
  salto_vertical_cm numeric(4,1),
  spider_drill_seg numeric(4,2),
  fms_squat boolean,
  fms_lunge_izq boolean,
  fms_lunge_der boolean,
  fms_hombro_izq boolean,
  fms_hombro_der boolean,
  sentadillas_1min smallint,
  lagartijas_1min smallint,
  sv_potencia_prom_partido numeric(5,1),
  sv_potencia_prom_sesion numeric(5,1),
  completed_at timestamptz,
  completed_by uuid references public.coaches(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- report_character
create table public.report_character (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid not null unique references public.reports(id) on delete cascade,
  etica_trabajo smallint check (etica_trabajo between 1 and 5),
  etica_trabajo_nota text,
  coachabilidad smallint check (coachabilidad between 1 and 5),
  coachabilidad_nota text,
  liderazgo_nota text,
  conducta_log text,
  completed_at timestamptz,
  completed_by uuid references public.coaches(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- report_athlete_voice
create table public.report_athlete_voice (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid not null unique references public.reports(id) on delete cascade,
  -- on-court
  serve smallint check (serve between 1 and 5),
  forehand smallint check (forehand between 1 and 5),
  backhand smallint check (backhand between 1 and 5),
  volea smallint check (volea between 1 and 5),
  return smallint check (return between 1 and 5),
  footwork smallint check (footwork between 1 and 5),
  seleccion_golpe smallint check (seleccion_golpe between 1 and 5),
  manejo_riesgo smallint check (manejo_riesgo between 1 and 5),
  puntos_clave smallint check (puntos_clave between 1 and 5),
  adaptacion_tactica smallint check (adaptacion_tactica between 1 and 5),
  transferencia_partido smallint check (transferencia_partido between 1 and 5),
  -- physical
  velocidad smallint check (velocidad between 1 and 5),
  resistencia smallint check (resistencia between 1 and 5),
  potencia smallint check (potencia between 1 and 5),
  agilidad smallint check (agilidad between 1 and 5),
  movilidad smallint check (movilidad between 1 and 5),
  fuerza_tren_inferior smallint check (fuerza_tren_inferior between 1 and 5),
  fuerza_tren_superior smallint check (fuerza_tren_superior between 1 and 5),
  -- character
  etica_trabajo smallint check (etica_trabajo between 1 and 5),
  coachabilidad smallint check (coachabilidad between 1 and 5),
  liderazgo smallint check (liderazgo between 1 and 5),
  -- reflexión
  reflexion_mes text,
  -- metadata
  completed_at timestamptz,
  completed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
