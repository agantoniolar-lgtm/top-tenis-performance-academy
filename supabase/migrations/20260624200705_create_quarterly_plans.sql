
-- ──────────────────────────────────────────────────────────────────
-- quarterly_plans  — container por atleta × período trimestral
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE quarterly_plans (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id   uuid        NOT NULL REFERENCES athletes(id)  ON DELETE CASCADE,
  coach_id     uuid        NOT NULL REFERENCES coaches(id),
  period_start date        NOT NULL,
  period_end   date        NOT NULL,
  raw_input    text,
  status       text        NOT NULL DEFAULT 'active'
                           CHECK (status IN ('draft', 'active', 'archived')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (athlete_id, period_start)
);

-- ──────────────────────────────────────────────────────────────────
-- quarterly_plan_objectives  — un objetivo por sub-dimensión
-- ──────────────────────────────────────────────────────────────────
CREATE TABLE quarterly_plan_objectives (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id         uuid        NOT NULL REFERENCES quarterly_plans(id) ON DELETE CASCADE,
  dimension       text        NOT NULL
                              CHECK (dimension IN ('tecnica','tactica','physical','character')),
  sub_dimension   text        NOT NULL,
  objective_text  text        NOT NULL,
  sort_order      smallint    NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────────────────────────
ALTER TABLE quarterly_plans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarterly_plan_objectives ENABLE ROW LEVEL SECURITY;

-- Coaches: CRUD sobre sus propios planes
CREATE POLICY "coaches_own_plans" ON quarterly_plans
  FOR ALL USING (
    coach_id = (SELECT id FROM coaches WHERE user_id = auth.uid())
  );

-- Atletas: solo lectura de sus planes activos
CREATE POLICY "athletes_read_plans" ON quarterly_plans
  FOR SELECT USING (
    athlete_id = (SELECT id FROM athletes WHERE user_id = auth.uid())
    AND status = 'active'
  );

-- Objetivos — coaches
CREATE POLICY "coaches_own_objectives" ON quarterly_plan_objectives
  FOR ALL USING (
    plan_id IN (
      SELECT id FROM quarterly_plans
      WHERE coach_id = (SELECT id FROM coaches WHERE user_id = auth.uid())
    )
  );

-- Objetivos — atletas (solo lectura, planes activos)
CREATE POLICY "athletes_read_objectives" ON quarterly_plan_objectives
  FOR SELECT USING (
    plan_id IN (
      SELECT id FROM quarterly_plans
      WHERE athlete_id = (SELECT id FROM athletes WHERE user_id = auth.uid())
        AND status = 'active'
    )
  );

-- updated_at trigger
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_qp_updated
  BEFORE UPDATE ON quarterly_plans
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER trg_qpo_updated
  BEFORE UPDATE ON quarterly_plan_objectives
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
