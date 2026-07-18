
ALTER TABLE amtp_rankings
  ADD COLUMN IF NOT EXISTS athlete_id uuid REFERENCES athletes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS amtp_rankings_athlete_id_idx ON amtp_rankings (athlete_id);
