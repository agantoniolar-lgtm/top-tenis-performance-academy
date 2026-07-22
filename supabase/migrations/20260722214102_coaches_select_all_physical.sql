
-- Fix (T168): report_physical se quedó fuera cuando 20260624013019_coaches_cross_read_reports.sql
-- abrió lectura cross-coach a report_on_court/report_character/report_athlete_voice (T140).
-- Mismo patrón exacto, puramente aditivo — no toca coaches_all_physical (INSERT/UPDATE/DELETE
-- siguen restringidos al coach que abrió el reporte) ni la policy de atletas.
CREATE POLICY "coaches_select_all_physical"
  ON report_physical FOR SELECT
  USING (EXISTS (SELECT 1 FROM coaches WHERE coaches.user_id = auth.uid()));
