-- 1. Limpiar planes dummy
delete from quarterly_plan_objectives;
delete from quarterly_plans;

-- 2. quarterly_plan_objectives -> estructura v2
alter table quarterly_plan_objectives
  add column tipo text not null default 'foco' check (tipo in ('foco','mantenimiento')),
  add column diagnostico text,
  add column objetivo text,
  add column estandar_usado text,
  add column anchors jsonb,
  add column carryover_of uuid references quarterly_plan_objectives(id),
  add column outcome text check (outcome in ('logrado','parcial','continua')),
  add column final_assessment text,
  add column baseline numeric,
  add column target numeric,
  add column unit text;
alter table quarterly_plan_objectives alter column objective_text drop not null;

-- 3. quarterly_plans -> cierre + status 'completed'
alter table quarterly_plans drop constraint quarterly_plans_status_check;
alter table quarterly_plans add constraint quarterly_plans_status_check
  check (status in ('draft','active','completed','archived'));
alter table quarterly_plans
  add column coach_retrospective text,
  add column athlete_retrospective text,
  add column closed_at timestamptz;

-- 4. tabla de feedback con linaje
create table objective_generation_log (
  id uuid primary key default gen_random_uuid(),
  root_id uuid,
  parent_id uuid references objective_generation_log(id),
  plan_id uuid references quarterly_plans(id) on delete cascade,
  objective_id uuid references quarterly_plan_objectives(id) on delete set null,
  athlete_id uuid references athletes(id),
  coach_id uuid references coaches(id),
  period_start date,
  mode text not null check (mode in ('identify','generate','regenerate')),
  prompt_version text,
  model text,
  input_observations text,
  input_bundle jsonb,
  coach_feedback text,
  validator_result jsonb,
  output jsonb,
  created_at timestamptz not null default now()
);
alter table objective_generation_log enable row level security;
create policy "coach manages own gen logs" on objective_generation_log
  for all using (coach_id in (select id from coaches where user_id = auth.uid()))
  with check (coach_id in (select id from coaches where user_id = auth.uid()));
create index idx_objgenlog_root on objective_generation_log(root_id);
create index idx_objgenlog_plan on objective_generation_log(plan_id);
