
-- Allow any coach to SELECT reports of all athletes (read-only, for Equipo view)
CREATE POLICY "coaches_select_all_reports"
  ON reports FOR SELECT
  USING (EXISTS (SELECT 1 FROM coaches WHERE coaches.user_id = auth.uid()));

-- Allow any coach to SELECT report_on_court of all athletes
CREATE POLICY "coaches_select_all_on_court"
  ON report_on_court FOR SELECT
  USING (EXISTS (SELECT 1 FROM coaches WHERE coaches.user_id = auth.uid()));

-- Allow any coach to SELECT report_character of all athletes
CREATE POLICY "coaches_select_all_character"
  ON report_character FOR SELECT
  USING (EXISTS (SELECT 1 FROM coaches WHERE coaches.user_id = auth.uid()));

-- Allow any coach to SELECT report_athlete_voice of all athletes
CREATE POLICY "coaches_select_all_voice"
  ON report_athlete_voice FOR SELECT
  USING (EXISTS (SELECT 1 FROM coaches WHERE coaches.user_id = auth.uid()));
