-- T152: migrar report_physical al protocolo real de 7 pruebas físicas
-- (Protocolo Pruebas Físicas Academia de Tenis RAC) y agregar score de
-- liderazgo -2..+2 en report_character.
--
-- Los 4 campos de sentadillas/lagartijas/beep_test y los 5 campos FMS no
-- forman parte de este protocolo y se eliminan (datos actuales en
-- producción son dummy, confirmado por Marco — ver T165 en BACKLOG.md).

-- Renombrar campos existentes para reflejar el protocolo real
ALTER TABLE report_physical RENAME COLUMN sprint_20m TO velocidad_2377m;
ALTER TABLE report_physical RENAME COLUMN spider_drill_seg TO agilidad_5_lineas_seg;

-- Pruebas nuevas del protocolo (salto_vertical_cm ya existía y no cambia)
ALTER TABLE report_physical ADD COLUMN abdominales_30s smallint;
ALTER TABLE report_physical ADD COLUMN lanzamiento_balon_mts numeric;
ALTER TABLE report_physical ADD COLUMN flexibilidad_banco_pass boolean;
ALTER TABLE report_physical ADD COLUMN tiempo_1km_seg numeric;

-- Campos fuera del protocolo de 7 pruebas
ALTER TABLE report_physical DROP COLUMN sentadillas_1min;
ALTER TABLE report_physical DROP COLUMN lagartijas_1min;
ALTER TABLE report_physical DROP COLUMN beep_test_nivel;
ALTER TABLE report_physical DROP COLUMN beep_test_rep;
ALTER TABLE report_physical DROP COLUMN fms_squat;
ALTER TABLE report_physical DROP COLUMN fms_lunge_izq;
ALTER TABLE report_physical DROP COLUMN fms_lunge_der;
ALTER TABLE report_physical DROP COLUMN fms_hombro_izq;
ALTER TABLE report_physical DROP COLUMN fms_hombro_der;

-- Score de liderazgo, análogo a etica_trabajo/coachabilidad
-- (liderazgo_nota se mantiene como narrativa aparte)
ALTER TABLE report_character ADD COLUMN liderazgo smallint CHECK (liderazgo >= -2 AND liderazgo <= 2);
