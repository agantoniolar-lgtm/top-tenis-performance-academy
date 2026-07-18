
-- ── 1. Historial de UTR ─────────────────────────────────────────────────────
-- Tabla dedicada que desacopla el UTR de los reportes del coach.
-- Se puede poblar desde report_on_court (fuente=report) o manualmente (fuente=manual).
CREATE TABLE IF NOT EXISTS athlete_utr_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id  uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  periodo     text NOT NULL,   -- YYYY-MM
  utr_value   numeric(5,2) NOT NULL,
  source      text NOT NULL DEFAULT 'report'
                   CHECK (source IN ('report','manual','api')),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS utr_hist_athlete_periodo_idx
  ON athlete_utr_history (athlete_id, periodo);

CREATE INDEX IF NOT EXISTS utr_hist_athlete_idx ON athlete_utr_history (athlete_id);

ALTER TABLE athlete_utr_history ENABLE ROW LEVEL SECURITY;

-- Coaches leen el historial de sus atletas; service role escribe
CREATE POLICY "coaches_read_utr_history" ON athlete_utr_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM athletes a
      JOIN coaches c ON c.id = a.coach_id
      WHERE a.id = athlete_utr_history.athlete_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "athletes_read_own_utr_history" ON athlete_utr_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM athletes WHERE id = athlete_utr_history.athlete_id AND user_id = auth.uid()
    )
  );

-- ── 2. Snapshots de perfil físico ───────────────────────────────────────────
-- Historial de métricas físicas tomadas periódicamente (al ingresar + cada reporte).
CREATE TABLE IF NOT EXISTS athlete_profile_snapshots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id      uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  periodo         text NOT NULL,   -- YYYY-MM del snapshot
  altura_cm       integer,
  peso_kg         numeric(5,2),
  imc             numeric(4,2) GENERATED ALWAYS AS (
                    CASE WHEN altura_cm > 0 AND peso_kg > 0
                    THEN ROUND((peso_kg / ((altura_cm::numeric / 100) ^ 2))::numeric, 2)
                    ELSE NULL END
                  ) STORED,
  notas           text,
  taken_at        timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS profile_snap_athlete_periodo_idx
  ON athlete_profile_snapshots (athlete_id, periodo);

CREATE INDEX IF NOT EXISTS profile_snap_athlete_idx ON athlete_profile_snapshots (athlete_id);

ALTER TABLE athlete_profile_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coaches_read_profile_snapshots" ON athlete_profile_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM athletes a
      JOIN coaches c ON c.id = a.coach_id
      WHERE a.id = athlete_profile_snapshots.athlete_id
        AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "athletes_read_own_profile_snapshots" ON athlete_profile_snapshots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM athletes WHERE id = athlete_profile_snapshots.athlete_id AND user_id = auth.uid()
    )
  );
