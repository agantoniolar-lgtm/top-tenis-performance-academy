alter table quarterly_plan_objectives
  drop constraint quarterly_plan_objectives_outcome_check,
  add constraint quarterly_plan_objectives_outcome_check
    check (outcome = any (array['logrado'::text, 'parcial'::text, 'continua'::text, 'deprioritized'::text]));

alter table quarterly_plan_objectives
  add column deprioritized_at timestamptz;

comment on column quarterly_plan_objectives.deprioritized_at is 'Fecha en que el coach decidió no darle carryover a este foco al cerrar el periodo (outcome=deprioritized). No requiere final_assessment. Ref docs/scope-planning-measurement.md §21.';
