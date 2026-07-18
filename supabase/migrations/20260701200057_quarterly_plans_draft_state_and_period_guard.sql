-- P&M v2: estado draft persistente
alter table public.quarterly_plans
  add column if not exists draft_state jsonb;

comment on column public.quarterly_plans.draft_state is
  'Estado efímero del wizard de creación (dump, focos seleccionados, objetivos generados, paso actual) para retomar sin perder trabajo. Se limpia al guardar el plan (status pasa a active).';

-- P&M v2: un plan por atleta por periodo (salvo que se archive/borre el existente)
create unique index if not exists quarterly_plans_one_active_per_athlete_period
  on public.quarterly_plans (athlete_id, period_start)
  where status <> 'archived';
