-- docs/scope-close-quarterly-plan.md §16.3 — separar el "outcome" de cierre en dos ejes
-- independientes: estado final del objetivo (logrado/parcial/fallido) y decisión de
-- carryover (continua/depriorizado). Antes eran 4 valores mutuamente excluyentes de un
-- solo campo `outcome`, lo que impedía marcar un foco como "parcial" Y "continúa" a la vez.

alter table quarterly_plan_objectives
  add column carryover boolean;

comment on column quarterly_plan_objectives.carryover is
  'Decisión de carryover al cerrar el plan: true = continúa (aparece como candidato en el draft del periodo siguiente), false = depriorizado (deprioritized_at marca cuándo se decidió). Independiente del outcome (estado final del objetivo). Null = sin decidir todavía.';

-- Backfill de datos existentes (solo data de prueba en este momento del proyecto, sin
-- coaches reales usando el flujo todavía): 'continua' y 'deprioritized' no traían
-- información de estado, así que no hay forma de reconstruirla — se migran a carryover,
-- con outcome vuelto a null (queda pendiente de que el coach lo re-clasifique como
-- logrado/parcial/fallido si hace falta).
update quarterly_plan_objectives
  set carryover = true, outcome = null
  where outcome = 'continua';

update quarterly_plan_objectives
  set carryover = false, outcome = null
  where outcome = 'deprioritized';

alter table quarterly_plan_objectives
  drop constraint quarterly_plan_objectives_outcome_check,
  add constraint quarterly_plan_objectives_outcome_check
    check (outcome = any (array['logrado','parcial','fallido']));
