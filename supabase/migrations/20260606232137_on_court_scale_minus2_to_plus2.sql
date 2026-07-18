
-- Clear dummy data from score tables first
TRUNCATE report_on_court, report_character CASCADE;

-- On-court: strokes and tactics now use -2 to +2 (relative to quarterly objective)
ALTER TABLE report_on_court
  ADD CONSTRAINT chk_serve          CHECK (serve          BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_forehand       CHECK (forehand       BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_backhand       CHECK (backhand       BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_volea          CHECK (volea          BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_devolucion     CHECK (devolucion     BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_footwork       CHECK (footwork       BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_seleccion_golpe     CHECK (seleccion_golpe     BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_manejo_riesgo       CHECK (manejo_riesgo       BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_puntos_clave        CHECK (puntos_clave        BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_adaptacion_tactica  CHECK (adaptacion_tactica  BETWEEN -2 AND 2),
  ADD CONSTRAINT chk_transferencia_partido CHECK (transferencia_partido BETWEEN -2 AND 2);

-- Character: stays 1-5 (behavioral consistency scale)
ALTER TABLE report_character
  ADD CONSTRAINT chk_etica_trabajo  CHECK (etica_trabajo  BETWEEN 1 AND 5),
  ADD CONSTRAINT chk_coachabilidad  CHECK (coachabilidad  BETWEEN 1 AND 5);
