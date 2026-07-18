
-- ── Coaches reales (sin user_id hasta que se registren) ─────────────────────
INSERT INTO coaches (nombre, apellido) VALUES
  ('Armando', 'Tlacaelel'),
  ('Miguel',  'Gamborino'),
  ('Lalo',    'Martínez'),
  ('Jesús',   'Ángeles');

-- ── coaches: cualquiera puede leer la lista (para el dropdown de signup) ────
CREATE POLICY "coaches_public_select" ON coaches
  FOR SELECT USING (true);

-- ── athletes: INSERT para signup (el atleta crea su propio row) ─────────────
CREATE POLICY "athletes_insert_own" ON athletes
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ── athletes: UPDATE para que el atleta edite su propio perfil ──────────────
CREATE POLICY "athletes_update_own" ON athletes
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── athlete_recruitment_profile: atleta gestiona el suyo ────────────────────
CREATE POLICY "recruitment_athlete_all" ON athlete_recruitment_profile
  FOR ALL
  USING   (athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid()))
  WITH CHECK (athlete_id IN (SELECT id FROM athletes WHERE user_id = auth.uid()));

-- ── athlete_recruitment_profile: coach puede leer el de sus atletas ─────────
CREATE POLICY "recruitment_coach_select" ON athlete_recruitment_profile
  FOR SELECT
  USING (athlete_id IN (
    SELECT a.id FROM athletes a
    JOIN coaches c ON c.id = a.coach_id
    WHERE c.user_id = auth.uid()
  ));

-- ── report_athlete_voice: remover condición de unlock ───────────────────────
DROP POLICY IF EXISTS "athletes_all_own_voice_if_unlocked" ON report_athlete_voice;

CREATE POLICY "athletes_all_own_voice" ON report_athlete_voice
  FOR ALL
  USING (report_id IN (
    SELECT r.id FROM reports r
    JOIN athletes a ON a.id = r.athlete_id
    WHERE a.user_id = auth.uid()
  ))
  WITH CHECK (report_id IN (
    SELECT r.id FROM reports r
    JOIN athletes a ON a.id = r.athlete_id
    WHERE a.user_id = auth.uid()
  ));
