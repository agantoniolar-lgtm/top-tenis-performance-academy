
ALTER TABLE report_on_court
  DROP CONSTRAINT report_on_court_serve_check,
  DROP CONSTRAINT report_on_court_forehand_check,
  DROP CONSTRAINT report_on_court_backhand_check,
  DROP CONSTRAINT report_on_court_volea_check,
  DROP CONSTRAINT report_on_court_return_check,
  DROP CONSTRAINT report_on_court_footwork_check,
  DROP CONSTRAINT report_on_court_seleccion_golpe_check,
  DROP CONSTRAINT report_on_court_manejo_riesgo_check,
  DROP CONSTRAINT report_on_court_puntos_clave_check,
  DROP CONSTRAINT report_on_court_adaptacion_tactica_check,
  DROP CONSTRAINT report_on_court_transferencia_partido_check;
