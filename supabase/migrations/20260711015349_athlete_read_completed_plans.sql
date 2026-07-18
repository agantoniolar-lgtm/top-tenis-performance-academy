-- Amplía el SELECT del atleta en quarterly_plans / quarterly_plan_objectives
-- de status = 'active' a status IN ('active', 'completed').
-- Motivo: feature "Mi plan" en el portal del atleta (docs/scope-mis-planes-atleta.md §3) —
-- el atleta debe poder ver planes pasados que cumplieron su periodo (completed),
-- no solo el activo. draft y archived siguen sin acceso.

ALTER POLICY athletes_read_plans ON quarterly_plans
USING (
  athlete_id = (SELECT athletes.id FROM athletes WHERE athletes.user_id = auth.uid())
  AND status IN ('active', 'completed')
);

ALTER POLICY athletes_read_objectives ON quarterly_plan_objectives
USING (
  plan_id IN (
    SELECT quarterly_plans.id FROM quarterly_plans
    WHERE quarterly_plans.athlete_id = (SELECT athletes.id FROM athletes WHERE athletes.user_id = auth.uid())
    AND quarterly_plans.status IN ('active', 'completed')
  )
);
