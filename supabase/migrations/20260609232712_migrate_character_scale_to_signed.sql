
-- Mapear 1-5 → -2/+2: (valor - 3) da: 1→-2, 2→-1, 3→0, 4→+1, 5→+2
UPDATE report_character
SET
  etica_trabajo = etica_trabajo - 3,
  coachabilidad = coachabilidad - 3
WHERE etica_trabajo BETWEEN 1 AND 5 OR coachabilidad BETWEEN 1 AND 5;

-- Ahora sí cambiar constraints
ALTER TABLE report_character
  DROP CONSTRAINT chk_coachabilidad,
  DROP CONSTRAINT chk_etica_trabajo,
  DROP CONSTRAINT report_character_coachabilidad_check,
  DROP CONSTRAINT report_character_etica_trabajo_check,
  ADD CONSTRAINT chk_etica_trabajo CHECK (etica_trabajo >= -2 AND etica_trabajo <= 2),
  ADD CONSTRAINT chk_coachabilidad  CHECK (coachabilidad >= -2 AND coachabilidad <= 2);

-- report_athlete_voice: physical + character a -2/+2 (sin datos existentes que migrar)
ALTER TABLE report_athlete_voice
  DROP CONSTRAINT report_athlete_voice_velocidad_check,
  DROP CONSTRAINT report_athlete_voice_resistencia_check,
  DROP CONSTRAINT report_athlete_voice_potencia_check,
  DROP CONSTRAINT report_athlete_voice_agilidad_check,
  DROP CONSTRAINT report_athlete_voice_movilidad_check,
  DROP CONSTRAINT report_athlete_voice_fuerza_tren_inferior_check,
  DROP CONSTRAINT report_athlete_voice_fuerza_tren_superior_check,
  DROP CONSTRAINT report_athlete_voice_etica_trabajo_check,
  DROP CONSTRAINT report_athlete_voice_coachabilidad_check,
  DROP CONSTRAINT report_athlete_voice_liderazgo_check,
  ADD CONSTRAINT report_athlete_voice_velocidad_check            CHECK (velocidad            >= -2 AND velocidad            <= 2),
  ADD CONSTRAINT report_athlete_voice_resistencia_check          CHECK (resistencia          >= -2 AND resistencia          <= 2),
  ADD CONSTRAINT report_athlete_voice_potencia_check             CHECK (potencia             >= -2 AND potencia             <= 2),
  ADD CONSTRAINT report_athlete_voice_agilidad_check             CHECK (agilidad             >= -2 AND agilidad             <= 2),
  ADD CONSTRAINT report_athlete_voice_movilidad_check            CHECK (movilidad            >= -2 AND movilidad            <= 2),
  ADD CONSTRAINT report_athlete_voice_fuerza_tren_inferior_check CHECK (fuerza_tren_inferior >= -2 AND fuerza_tren_inferior <= 2),
  ADD CONSTRAINT report_athlete_voice_fuerza_tren_superior_check CHECK (fuerza_tren_superior >= -2 AND fuerza_tren_superior <= 2),
  ADD CONSTRAINT report_athlete_voice_etica_trabajo_check        CHECK (etica_trabajo        >= -2 AND etica_trabajo        <= 2),
  ADD CONSTRAINT report_athlete_voice_coachabilidad_check        CHECK (coachabilidad        >= -2 AND coachabilidad        <= 2),
  ADD CONSTRAINT report_athlete_voice_liderazgo_check            CHECK (liderazgo            >= -2 AND liderazgo            <= 2);
