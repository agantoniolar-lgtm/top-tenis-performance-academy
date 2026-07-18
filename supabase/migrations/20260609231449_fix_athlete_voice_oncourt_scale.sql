
-- Drop 1-5 check constraints on on-court fields and replace with -2 to +2
-- Técnica
ALTER TABLE report_athlete_voice
  DROP CONSTRAINT report_athlete_voice_serve_check,
  DROP CONSTRAINT report_athlete_voice_forehand_check,
  DROP CONSTRAINT report_athlete_voice_backhand_check,
  DROP CONSTRAINT report_athlete_voice_volea_check,
  DROP CONSTRAINT report_athlete_voice_return_check,
  DROP CONSTRAINT report_athlete_voice_footwork_check,
  -- Táctica
  DROP CONSTRAINT report_athlete_voice_seleccion_golpe_check,
  DROP CONSTRAINT report_athlete_voice_manejo_riesgo_check,
  DROP CONSTRAINT report_athlete_voice_puntos_clave_check,
  DROP CONSTRAINT report_athlete_voice_adaptacion_tactica_check,
  DROP CONSTRAINT report_athlete_voice_transferencia_partido_check,
  -- Add -2 to +2 for on-court fields
  ADD CONSTRAINT report_athlete_voice_serve_check CHECK (serve >= -2 AND serve <= 2),
  ADD CONSTRAINT report_athlete_voice_forehand_check CHECK (forehand >= -2 AND forehand <= 2),
  ADD CONSTRAINT report_athlete_voice_backhand_check CHECK (backhand >= -2 AND backhand <= 2),
  ADD CONSTRAINT report_athlete_voice_volea_check CHECK (volea >= -2 AND volea <= 2),
  ADD CONSTRAINT report_athlete_voice_return_check CHECK (devolucion >= -2 AND devolucion <= 2),
  ADD CONSTRAINT report_athlete_voice_footwork_check CHECK (footwork >= -2 AND footwork <= 2),
  ADD CONSTRAINT report_athlete_voice_seleccion_golpe_check CHECK (seleccion_golpe >= -2 AND seleccion_golpe <= 2),
  ADD CONSTRAINT report_athlete_voice_manejo_riesgo_check CHECK (manejo_riesgo >= -2 AND manejo_riesgo <= 2),
  ADD CONSTRAINT report_athlete_voice_puntos_clave_check CHECK (puntos_clave >= -2 AND puntos_clave <= 2),
  ADD CONSTRAINT report_athlete_voice_adaptacion_tactica_check CHECK (adaptacion_tactica >= -2 AND adaptacion_tactica <= 2),
  ADD CONSTRAINT report_athlete_voice_transferencia_partido_check CHECK (transferencia_partido >= -2 AND transferencia_partido <= 2);
