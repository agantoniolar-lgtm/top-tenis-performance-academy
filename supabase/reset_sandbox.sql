-- ============================================================================
-- Reset del sandbox — Top Tennis Performance Academy
-- ============================================================================
-- SOLO para el proyecto sandbox (top-tennis-performance-academy-sandbox,
-- ref xchdawwajmnnhkncikig). NUNCA correr esto contra producción
-- (rrrwhwciggohwxslqlho) — borra todo el contenido de las tablas de la app.
--
-- Qué hace:
--   1. Vacía todas las tablas de la app (TRUNCATE ... CASCADE, respeta FKs
--      automáticamente sin importar el orden de la lista).
--   2. Re-siembra los 4 coaches base (mismos datos que la migración
--      auth_rls_coaches_signup + el perfil de Armando de add_coach_profile_fields).
--   3. Corre el contenido de supabase/seed.sql (los 5 atletas de ejemplo).
--
-- Cuándo correrlo: cuando el sandbox acumule datos de prueba desordenados de
-- varias sesiones de desarrollo y se quiera volver a un punto limpio y
-- representativo, sin tener que borrar y recrear el proyecto completo.
--
-- Cómo correrlo: pedirle al asistente "resetea el sandbox" (usa el MCP de
-- Supabase, `execute_sql` contra project_id xchdawwajmnnhkncikig, con el
-- contenido de este archivo). No requiere Supabase CLI instalado localmente.
-- ============================================================================

-- ── 1. Vaciar todas las tablas de la app ────────────────────────────────────
truncate table
  quarterly_plan_objectives,
  quarterly_plans,
  objective_generation_log,
  report_athlete_voice,
  report_character,
  report_physical,
  report_on_court,
  reports,
  post_tournament_forms,
  athlete_tournaments,
  tournaments,
  athlete_recruitment_profile,
  athlete_profile_snapshots,
  athlete_utr_history,
  athlete_media,
  athletes,
  content_blocks,
  media_assets,
  amtp_rankings,
  content_managers,
  coaches
cascade;

-- ── 2. Re-sembrar los 4 coaches base (igual que auth_rls_coaches_signup) ────
-- IDs fijos a propósito (los mismos que ya existen en este sandbox) — así
-- supabase/seed.sql, que referencia estos IDs como coach_id, sigue siendo
-- válido después de un reset sin tener que tocar nada más.
insert into coaches (id, nombre, apellido) values
  ('506b77ca-907d-4a4f-b22b-13f088ae4009', 'Armando', 'Tlacaelel'),
  ('e1b60db3-cd2f-4337-8f48-aa2e956ea79d', 'Miguel',  'Gamborino'),
  ('3237b0d5-3cbe-46d5-a05c-71a34573cd01', 'Lalo',    'Martínez'),
  ('2f6a28d5-7d58-4f89-ac29-91a1f76693dd', 'Jesús',   'Ángeles');

-- Perfil extendido de Armando (igual que add_coach_profile_fields)
update coaches
set rol = 'Director General',
    credencial = 'UTR 12.07 · División I',
    bio = 'Fundador de TTPA. Llegó al #1 del Estado de México y al #4 nacional. Cuatro años en Marian University (Indianapolis) como capitán del equipo, invicto en la Crossroads League 2019.',
    orden = 10
where nombre = 'Armando' and apellido = 'Tlacaelel';

-- ── 3. Sembrar los 5 atletas de ejemplo ─────────────────────────────────────
-- A partir de aquí, pegar/correr el contenido completo de supabase/seed.sql
-- tal cual — los IDs de coach que usa (506b77ca…, e1b60db3…, 3237b0d5…,
-- 2f6a28d5…) son los mismos que se acaban de reinsertar arriba, así que no
-- hace falta ningún ajuste manual.
