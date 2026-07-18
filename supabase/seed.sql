-- ============================================================================
-- Seed de datos falsos — Top Tennis Performance Academy (SOLO SANDBOX)
-- ============================================================================
-- Este archivo NUNCA se corre contra producción (rrrwhwciggohwxslqlho).
-- Está pensado para aplicarse contra el proyecto sandbox
-- (top-tennis-performance-academy-sandbox, ref xchdawwajmnnhkncikig) después
-- de las 55 migraciones en supabase/migrations/.
--
-- Cubre 5 atletas en distintas etapas del ciclo de vida del producto:
--   1. Valentina Cruz Ibarra   — recién ingresada: solo perfil + reclutamiento
--   2. Diego Fernández Molina  — primer mes: 2 torneos + PTFs
--   3. Fernanda López Rivera   — segundo mes: varios torneos, 1 reporte mensual,
--                                un plan trimestral archivado + uno nuevo activo
--   4. Santiago Herrera Duarte — tercer mes: varios torneos, 3 reportes mensuales
--   5. Camila Ortiz Vega       — cuarto mes: varios torneos, un ciclo de plan
--                                cerrado (con outcomes/carryover) + plan nuevo
--                                que hereda los carryovers
--
-- Coaches usados (ya existen desde las migraciones, IDs reales del sandbox):
--   Armando Tlacaelel   506b77ca-907d-4a4f-b22b-13f088ae4009
--   Jesús Ángeles       2f6a28d5-7d58-4f89-ac29-91a1f76693dd
--   Lalo Martínez       3237b0d5-3cbe-46d5-a05c-71a34573cd01
--   Miguel Gamborino    e1b60db3-cd2f-4337-8f48-aa2e956ea79d
--
-- Re-ejecutable: borra primero cualquier fila propia (por los IDs fijos de
-- atleta usados abajo) antes de insertar, así se puede correr más de una vez
-- sin duplicar.
-- ============================================================================

-- ── Limpieza previa (idempotente) ───────────────────────────────────────────
delete from quarterly_plan_objectives where plan_id in (
  select id from quarterly_plans where athlete_id in (
    '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000005'
  )
);
delete from quarterly_plans where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);
delete from report_on_court where report_id in (select id from reports where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
));
delete from report_physical where report_id in (select id from reports where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
));
delete from report_character where report_id in (select id from reports where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
));
delete from report_athlete_voice where report_id in (select id from reports where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
));
delete from reports where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);
delete from post_tournament_forms where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);
delete from athlete_tournaments where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);
delete from tournaments where id in (
  '20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000004',
  '20000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000006',
  '20000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000008',
  '20000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000010',
  '20000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000012',
  '20000000-0000-4000-8000-000000000013','20000000-0000-4000-8000-000000000014'
);
delete from athlete_recruitment_profile where athlete_id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);
delete from athletes where id in (
  '10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005'
);

-- ============================================================================
-- ATLETA 1 — Valentina Cruz Ibarra — recién ingresada (solo perfil + reclutamiento)
-- ============================================================================
insert into athletes (id, coach_id, nombre, apellido, segundo_apellido, fecha_nacimiento, mano_dominante, fecha_ingreso, activo)
values (
  '10000000-0000-4000-8000-000000000001',
  '3237b0d5-3cbe-46d5-a05c-71a34573cd01', -- Lalo Martínez
  'Valentina', 'Cruz', 'Ibarra',
  '2012-03-14', 'diestro', '2026-07-10', true
);

insert into athlete_recruitment_profile (athlete_id, division_objetivo, grad_year, gpa, english_level, study_area)
values (
  '10000000-0000-4000-8000-000000000001',
  'NCAA Division I', '2030', 3.80, 'Avanzado (C1)', 'Ingeniería o Negocios'
);

-- ============================================================================
-- ATLETA 2 — Diego Fernández Molina — primer mes: 2 torneos + PTFs
-- ============================================================================
insert into athletes (id, coach_id, nombre, apellido, segundo_apellido, fecha_nacimiento, mano_dominante, fecha_ingreso, activo)
values (
  '10000000-0000-4000-8000-000000000002',
  'e1b60db3-cd2f-4337-8f48-aa2e956ea79d', -- Miguel Gamborino
  'Diego', 'Fernández', 'Molina',
  '2010-08-22', 'zurdo', '2026-06-17', true
);

insert into athlete_recruitment_profile (athlete_id, division_objetivo, grad_year, gpa, english_level, study_area)
values (
  '10000000-0000-4000-8000-000000000002',
  'NCAA Division II', '2028', 3.40, 'Intermedio (B2)', 'Kinesiología'
);

insert into tournaments (id, nombre, tipo, categoria, fecha, sede)
values
  ('20000000-0000-4000-8000-000000000001', 'Copa AMTP León', 'AMTP', 'U18', '2026-06-28', 'León, Guanajuato'),
  ('20000000-0000-4000-8000-000000000002', 'ITF Junior Series Querétaro', 'ITF Junior', 'U18', '2026-07-12', 'Querétaro, Qro.');

insert into athlete_tournaments (id, athlete_id, tournament_id, modalidad, ronda, resultado, victoria, partidos_jugados, notas)
values
  ('21000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'Individual', 'Cuartos de final', 'Perdió en cuartos', false, 3, 'Primer torneo con la academia, buen nivel de saque'),
  ('21000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'Individual', 'Semifinal', 'Perdió en semis', false, 4, 'Mejoró manejo de riesgo en puntos clave respecto al torneo anterior');

insert into post_tournament_forms (
  athlete_id, athlete_tournament_id, match_date, tournament_name,
  tecnica_derecha, tecnica_reves, tecnica_servicio, tecnica_volea, tecnica_comentario, tecnica_mejora,
  tactica_comentario_plan, tactica_funciono, tactica_cambiar,
  mental_presion, mental_concentracion, mental_confianza, mental_reaccion_error,
  fisico_nivel, fisico_dolor, fisico_nutricion,
  reflexion_hice_bien, reflexion_mejorar, reflexion_aprendizaje, reflexion_proximo_torneo, reflexion_satisfaccion
) values (
  '10000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000001', '2026-06-28', 'Copa AMTP León',
  4, 3, 4, 2, 'Saque sólido todo el torneo, revés se rompe con bola alta', 'Trabajar revés a dos manos con bola por arriba del hombro',
  'Plan era jugar profundo y esperar el error', 'Funcionó en el primer set', 'Necesito variar más el ritmo en el segundo set',
  3, 'Se dispersó en el tercer set', 3, 'Tardó en resetear después de errores no forzados',
  4, false, 'Buena hidratación, faltó comer algo sólido entre partidos',
  'El saque y la actitud en puntos importantes', 'Consistencia del revés bajo presión', 'Que el nivel sube mucho en cuartos de final',
  'Trabajar el revés dos semanas antes del próximo torneo', 7
),
(
  '10000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000002', '2026-07-12', 'ITF Junior Series Querétaro',
  4, 3, 4, 3, 'Volea mejoró notablemente tras las semanas de trabajo', 'Seguir afinando el timing en la red',
  'Buscar la red más seguido con el zurdo cruzado', 'Funcionó muy bien en el primer set', 'Ajustar cuándo subir vs. cuándo quedarse atrás',
  4, 'Concentración sólida todo el partido', 4, 'Mejor manejo de errores que en el torneo pasado',
  4, false, 'Sin cambios, se sintió bien físicamente',
  'Manejo de riesgo en puntos clave, mucho mejor que en León', 'Cerrar el partido cuando iba arriba', 'Que jugar más torneos seguidos ayuda a la regularidad',
  'Meter un torneo más antes del corte de agosto', 8
);

-- ============================================================================
-- ATLETA 3 — Fernanda López Rivera — segundo mes: varios torneos, 1 reporte
-- mensual, un plan archivado + un plan nuevo activo
-- ============================================================================
insert into athletes (id, coach_id, nombre, apellido, segundo_apellido, fecha_nacimiento, mano_dominante, fecha_ingreso, utr_actual, activo)
values (
  '10000000-0000-4000-8000-000000000003',
  '506b77ca-907d-4a4f-b22b-13f088ae4009', -- Armando Tlacaelel
  'Fernanda', 'López', 'Rivera',
  '2011-11-05', 'diestro', '2026-05-17', 6.20, true
);

insert into athlete_recruitment_profile (athlete_id, division_objetivo, grad_year, gpa, english_level, study_area)
values (
  '10000000-0000-4000-8000-000000000003',
  'NCAA Division I', '2029', 3.95, 'Avanzado (C1)', 'Medicina'
);

insert into tournaments (id, nombre, tipo, categoria, fecha, sede)
values
  ('20000000-0000-4000-8000-000000000003', 'Torneo Nacional UTR CDMX', 'UTR', 'U16', '2026-05-30', 'Ciudad de México'),
  ('20000000-0000-4000-8000-000000000004', 'Copa AMTP Puebla', 'AMTP', 'U16', '2026-06-14', 'Puebla, Pue.'),
  ('20000000-0000-4000-8000-000000000005', 'ITF Junior Series Monterrey', 'ITF Junior', 'U16', '2026-07-05', 'Monterrey, N.L.');

insert into athlete_tournaments (id, athlete_id, tournament_id, modalidad, ronda, resultado, victoria, partidos_jugados, notas)
values
  ('21000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', 'Individual', 'Final', 'Subcampeona', false, 5, 'Muy buen torneo de entrada, cayó en la final en tres sets'),
  ('21000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000004', 'Ambas', 'Campeona (individual)', 'Campeona individual, semifinal en dobles', true, 6, 'Primer título con la academia'),
  ('21000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000005', 'Individual', 'Cuartos de final', 'Perdió en cuartos', false, 3, 'Bajón físico notorio en el tercer set del torneo');

insert into post_tournament_forms (
  athlete_id, athlete_tournament_id, match_date, tournament_name,
  tecnica_derecha, tecnica_reves, tecnica_servicio, tecnica_volea, tecnica_comentario, tecnica_mejora,
  tactica_comentario_plan, tactica_funciono, tactica_cambiar,
  mental_presion, mental_concentracion, mental_confianza, mental_reaccion_error,
  fisico_nivel, fisico_dolor, fisico_nutricion,
  reflexion_hice_bien, reflexion_mejorar, reflexion_aprendizaje, reflexion_proximo_torneo, reflexion_satisfaccion
) values
(
  '10000000-0000-4000-8000-000000000003', '21000000-0000-4000-8000-000000000003', '2026-05-30', 'Torneo Nacional UTR CDMX',
  4, 4, 3, 3, 'Derecha muy consistente, saque todavía sin suficiente variación', 'Meter segundo saque con más spin',
  'Jugar cruzado y esperar el error en fondo de cancha', 'Funcionó en semis', 'En la final necesitaba arriesgar más en momentos clave',
  3, 'Se puso nerviosa en el tercer set de la final', 3, 'Tardó en recuperar el ritmo tras perder el segundo set',
  4, false, 'Bien, sin incidentes',
  'Constancia desde el fondo', 'Manejo de riesgo cuando el partido se pone cerrado', 'Que en finales el margen de error es mínimo',
  'Trabajar variantes de segundo saque', 6
),
(
  '10000000-0000-4000-8000-000000000003', '21000000-0000-4000-8000-000000000004', '2026-06-14', 'Copa AMTP Puebla',
  5, 4, 4, 3, 'Mejor torneo técnico hasta ahora, saque con más variación', 'Seguir afinando la volea baja',
  'Buscar puntos cortos con el saque nuevo', 'Funcionó muy bien todo el torneo', 'Nada grave, seguir por este camino',
  4, 'Muy enfocada todo el torneo', 4, 'Excelente manejo de errores, no se vino abajo en ningún set',
  4, false, 'Bien',
  'Todo — el mejor torneo desde que llegó', 'Nada puntual, seguir el mismo plan de trabajo', 'Que la constancia en los entrenamientos se refleja en competencia',
  'Repetir la misma rutina de pre-torneo', 9
),
(
  '10000000-0000-4000-8000-000000000003', '21000000-0000-4000-8000-000000000005', '2026-07-05', 'ITF Junior Series Monterrey',
  4, 3, 3, 3, 'Bajó el nivel técnico conforme avanzó el partido por fatiga', 'Trabajar resistencia específica',
  'Mismo plan que en Puebla', 'Funcionó en el primer set', 'El plan se cayó cuando bajó físicamente',
  3, 'Perdió concentración cuando empezó a sentir cansancio', 2, 'Le costó reponerse anímicamente del bajón físico',
  2, true, 'Calor fuerte, hidratación insuficiente durante el partido',
  'El primer set, ahí jugó su mejor tenis del torneo', 'Resistencia física en el tercer set con calor', 'Que necesita trabajar más el aspecto físico de cara al calor de verano',
  'Ajustar la hidratación y meter más trabajo aeróbico', 5
);

insert into reports (id, athlete_id, coach_id, period)
values ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '506b77ca-907d-4a4f-b22b-13f088ae4009', '2026-06-01');

insert into report_on_court (report_id, serve, forehand, backhand, volea, devolucion, footwork, tecnica_nota, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, tactica_nota, transferencia_partido, utr, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000001', 1, 1, 0, 0, 0, 1, 'Saque y derecha son las armas más consistentes del mes, volea sigue en desarrollo.', 0, -1, 0, 1, 'Todavía se pone conservadora en puntos clave, mejoró la lectura del rival.', 1, 6.20, now() - interval '5 days', '506b77ca-907d-4a4f-b22b-13f088ae4009');

insert into report_physical (report_id, sprint_20m, beep_test_nivel, beep_test_rep, salto_vertical_cm, spider_drill_seg, fms_squat, fms_lunge_izq, fms_lunge_der, fms_hombro_izq, fms_hombro_der, sentadillas_1min, lagartijas_1min, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000001', 3.35, 8, 4, 38.5, 13.2, true, true, true, true, false, 42, 22, now() - interval '5 days', '506b77ca-907d-4a4f-b22b-13f088ae4009');

insert into report_character (report_id, etica_trabajo, etica_trabajo_nota, coachabilidad, coachabilidad_nota, liderazgo_nota, conducta_log, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000001', 1, 'Nunca falta a entrenamientos, siempre llega temprano', 2, 'Aplica de inmediato las correcciones en cancha', 'Empieza a ayudar a compañeras más nuevas', 'Mes sólido, sin incidentes de conducta.', now() - interval '5 days', '506b77ca-907d-4a4f-b22b-13f088ae4009');

-- Plan A: ciclo corto inicial que se archivó (se decidió empezar de nuevo con un trimestre bien delimitado)
insert into quarterly_plans (id, athlete_id, coach_id, period_start, period_end, raw_input, status, created_at, updated_at)
values (
  '40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '506b77ca-907d-4a4f-b22b-13f088ae4009',
  '2026-05-01', '2026-05-31', 'Primer intento de plan, mes suelto en lo que definíamos el ciclo trimestral real.',
  'archived', '2026-05-18', '2026-07-01'
);

insert into quarterly_plan_objectives (plan_id, dimension, sub_dimension, tipo, diagnostico, objetivo, estandar_usado, baseline, target, unit, sort_order)
values
  ('40000000-0000-4000-8000-000000000001', 'tecnica', 'backhand', 'foco', 'Revés se cierra con bola alta', 'Sostener revés a dos manos con bola por arriba del hombro', 'de forma consistente', 2, 4, 'escala 1-5', 1),
  ('40000000-0000-4000-8000-000000000001', 'physical', 'fuerza_inferior', 'mantenimiento', 'Base física aceptable al ingresar', 'Mantener fuerza de tren inferior con la carga actual', 'sin recordatorio', 40, 45, 'sentadillas en 1 min', 2);

-- Plan B: plan trimestral nuevo, ya con el formato correcto, activo
insert into quarterly_plans (id, athlete_id, coach_id, period_start, period_end, raw_input, status, created_at, updated_at)
values (
  '40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000003', '506b77ca-907d-4a4f-b22b-13f088ae4009',
  '2026-07-01', '2026-09-30',
  'Fernanda viene de un gran mes en Puebla pero se le cae el físico en el tercer set con calor, y en momentos de presión sigue jugando conservador en vez de arriesgar cuando toca.',
  'active', '2026-07-02', '2026-07-02'
);

insert into quarterly_plan_objectives (plan_id, dimension, sub_dimension, tipo, diagnostico, objetivo, estandar_usado, anchors, baseline, target, unit, sort_order)
values
  ('40000000-0000-4000-8000-000000000002', 'tactica', 'manejo_riesgo', 'foco',
   'Juega conservador (busca solo profundidad, sin variar dirección) en puntos clave del tercer set',
   'Arriesgar con cambios de dirección en puntos clave, no solo jugar profundo',
   'bajo presión',
   '{"1": "solo busca profundidad, nunca cambia de dirección", "3": "cambia de dirección en peloteo neutral", "5": "cambia de dirección incluso en puntos clave bajo presión"}'::jsonb,
   2, 4, 'escala 1-5', 1),
  ('40000000-0000-4000-8000-000000000002', 'physical', 'beep_test', 'foco',
   'Nivel físico baja notoriamente en el tercer set con calor, afecta la ejecución técnica',
   'Sostener el nivel de beep test alcanzado en el segundo set también en el tercero',
   'bajo presión',
   '{"1": "cae más de 2 niveles hacia el tercer set", "3": "cae 1 nivel", "5": "sostiene el mismo nivel todo el partido"}'::jsonb,
   8, 9, 'nivel beep test', 2),
  ('40000000-0000-4000-8000-000000000002', 'tecnica', 'volea', 'mantenimiento',
   'Volea baja mejoró mucho en el último mes, mantenerla',
   'Mantener la consistencia de volea baja lograda en junio',
   'de forma consistente', null, 4, 4, 'escala 1-5', 3);

-- ============================================================================
-- ATLETA 4 — Santiago Herrera Duarte — tercer mes: varios torneos, 3 reportes
-- mensuales
-- ============================================================================
insert into athletes (id, coach_id, nombre, apellido, segundo_apellido, fecha_nacimiento, mano_dominante, fecha_ingreso, utr_actual, activo)
values (
  '10000000-0000-4000-8000-000000000004',
  '2f6a28d5-7d58-4f89-ac29-91a1f76693dd', -- Jesús Ángeles
  'Santiago', 'Herrera', 'Duarte',
  '2009-05-30', 'diestro', '2026-04-17', 8.10, true
);

insert into athlete_recruitment_profile (athlete_id, division_objetivo, grad_year, gpa, english_level, study_area)
values (
  '10000000-0000-4000-8000-000000000004',
  'NCAA Division I', '2027', 3.60, 'Avanzado (C1)', 'Administración de Empresas'
);

insert into tournaments (id, nombre, tipo, categoria, fecha, sede)
values
  ('20000000-0000-4000-8000-000000000006', 'Copa AMTP Guadalajara', 'AMTP', 'U18', '2026-04-26', 'Guadalajara, Jal.'),
  ('20000000-0000-4000-8000-000000000007', 'Torneo Nacional UTR Monterrey', 'UTR', 'U18', '2026-05-17', 'Monterrey, N.L.'),
  ('20000000-0000-4000-8000-000000000008', 'ITF Junior Series CDMX', 'ITF Junior', 'U18', '2026-06-07', 'Ciudad de México'),
  ('20000000-0000-4000-8000-000000000009', 'Copa AMTP Querétaro', 'AMTP', 'U18', '2026-07-11', 'Querétaro, Qro.');

insert into athlete_tournaments (id, athlete_id, tournament_id, modalidad, ronda, resultado, victoria, partidos_jugados, notas)
values
  ('21000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000006', 'Individual', 'Semifinal', 'Perdió en semis', false, 4, 'Buen nivel general, saque como principal arma'),
  ('21000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000007', 'Individual', 'Final', 'Campeón', true, 5, 'Mejor torneo del trimestre'),
  ('21000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000008', 'Ambas', 'Cuartos (individual)', 'Cuartos individual, campeón en dobles', false, 4, 'Bajó el nivel en individual pero brilló en dobles'),
  ('21000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000009', 'Individual', 'Final', 'Subcampeón', false, 5, 'Cerró el trimestre con un nivel muy consistente');

insert into post_tournament_forms (
  athlete_id, athlete_tournament_id, match_date, tournament_name,
  tecnica_derecha, tecnica_reves, tecnica_servicio, tecnica_volea, tecnica_comentario, tecnica_mejora,
  tactica_comentario_plan, tactica_funciono, tactica_cambiar,
  mental_presion, mental_concentracion, mental_confianza, mental_reaccion_error,
  fisico_nivel, fisico_dolor, fisico_nutricion,
  reflexion_hice_bien, reflexion_mejorar, reflexion_aprendizaje, reflexion_proximo_torneo, reflexion_satisfaccion
) values
(
  '10000000-0000-4000-8000-000000000004', '21000000-0000-4000-8000-000000000006', '2026-04-26', 'Copa AMTP Guadalajara',
  4, 4, 5, 3, 'Saque domina el partido, revés estable', 'Definir mejor los puntos cuando domina con el saque',
  'Jugar agresivo desde el primer golpe', 'Funcionó casi todo el torneo', 'En semis le faltó variar el patrón de saque',
  4, 'Buena concentración', 4, 'Buen manejo del error en general',
  4, false, 'Bien',
  'El saque estuvo espectacular todo el torneo', 'Cerrar puntos cuando ya domina el intercambio', 'Que necesita un plan B cuando el rival le lee el saque',
  'Trabajar variantes de colocación de saque', 7
),
(
  '10000000-0000-4000-8000-000000000004', '21000000-0000-4000-8000-000000000007', '2026-05-17', 'Torneo Nacional UTR Monterrey',
  5, 4, 5, 4, 'El mejor nivel técnico visto hasta ahora, todo fluyó', 'Nada urgente, seguir el mismo plan de trabajo',
  'Jugar agresivo y buscar la red cuando el rival se abre', 'Funcionó a la perfección', 'Nada que cambiar',
  5, 'Concentración total todo el torneo', 5, 'Excelente manejo de momentos difíciles',
  5, false, 'Excelente',
  'Todo — el mejor torneo desde que llegó a la academia', 'Nada puntual', 'Que cuando todo está alineado (técnica, táctica, mental) el resultado llega solo',
  'Mantener la misma rutina de preparación', 10
),
(
  '10000000-0000-4000-8000-000000000004', '21000000-0000-4000-8000-000000000008', '2026-06-07', 'ITF Junior Series CDMX',
  3, 3, 4, 4, 'Bajó el nivel de derecha y revés respecto a Monterrey', 'Recuperar la consistencia de fondo de cancha',
  'Mismo plan de Monterrey', 'Funcionó parcialmente', 'El rival de cuartos le quitó tiempo y no ajustó',
  3, 'Se distrajo tras perder el primer set', 3, 'Le costó reponerse anímicamente',
  3, false, 'Normal',
  'El dobles, jugó su mejor tenis ahí', 'Ajustar cuando el rival cambia el ritmo del intercambio', 'Que en individual todavía le cuesta adaptarse a un plan B',
  'Trabajar variantes tácticas para cuando el plan A no funciona', 6
),
(
  '10000000-0000-4000-8000-000000000004', '21000000-0000-4000-8000-000000000009', '2026-07-11', 'Copa AMTP Querétaro',
  4, 4, 5, 4, 'Recuperó el nivel de Monterrey, muy sólido en todos los golpes', 'Seguir afinando el cierre de puntos en la red',
  'Jugar agresivo con variantes de saque trabajadas en abril', 'Funcionó muy bien todo el torneo', 'En la final le faltó un cierre más decisivo',
  4, 'Buena concentración toda la final', 4, 'Buen manejo del error, no se descontroló',
  4, false, 'Bien',
  'Consistencia técnica en todo el torneo', 'Cerrar la final cuando tuvo oportunidad', 'Que ya asimiló el trabajo de saque de estos tres meses',
  'Trabajar el cierre de puntos en la red de cara al siguiente trimestre', 8
);

insert into reports (id, athlete_id, coach_id, period, athlete_voice_unlocked_at, athlete_voice_unlocked_by)
values
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd', '2026-05-01', null, null),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd', '2026-06-01', null, null),
  ('30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd', '2026-07-01', now() - interval '2 days', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

-- Mes 1 (mayo) — reporte completo, incluye evaluación física de ingreso
insert into report_on_court (report_id, serve, forehand, backhand, volea, devolucion, footwork, tecnica_nota, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, tactica_nota, transferencia_partido, utr, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000002', 1, 1, 0, 0, 1, 1, 'Saque es un arma clara desde el ingreso, volea todavía por desarrollar.', 1, 0, 0, 0, 'Juega bien su plan A, todavía sin plan B claro.', 1, 7.60, '2026-05-28', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

insert into report_physical (report_id, sprint_20m, beep_test_nivel, beep_test_rep, salto_vertical_cm, spider_drill_seg, fms_squat, fms_lunge_izq, fms_lunge_der, fms_hombro_izq, fms_hombro_der, sentadillas_1min, lagartijas_1min, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000002', 3.05, 10, 3, 48.0, 12.1, true, true, true, true, true, 50, 32, '2026-05-28', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

insert into report_character (report_id, etica_trabajo, coachabilidad, liderazgo_nota, conducta_log, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000002', 1, 1, 'Natural liderando el grupo de mayores en cancha', 'Buen inicio, sin incidentes.', '2026-05-28', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

-- Mes 2 (junio) — físico queda sin llenar ese mes (cadencia trimestral), resto sí
insert into report_on_court (report_id, serve, forehand, backhand, volea, devolucion, footwork, tecnica_nota, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, tactica_nota, transferencia_partido, utr, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000003', 1, 0, 0, 1, 0, 1, 'Bajó un poco el nivel de derecha y revés en el mes de CDMX.', 0, -1, -1, -1, 'Le sigue costando adaptarse cuando el plan A no funciona.', 0, 7.80, '2026-06-25', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

insert into report_physical (report_id, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000003', null, null);

insert into report_character (report_id, etica_trabajo, coachabilidad, conducta_log, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000003', 1, 2, 'Mes normal, aplica bien las correcciones.', '2026-06-25', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

-- Mes 3 (julio) — reporte completo, incluye Athlete Voice ya desbloqueada y llenada
insert into report_on_court (report_id, serve, forehand, backhand, volea, devolucion, footwork, tecnica_nota, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, tactica_nota, transferencia_partido, utr, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000004', 1, 1, 1, 1, 1, 1, 'Recuperó el nivel de mayo, mes muy sólido en general.', 1, 0, 1, 1, 'Empezó a mostrar plan B en Querétaro, buena señal.', 1, 8.10, '2026-07-16', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

insert into report_physical (report_id, sprint_20m, beep_test_nivel, beep_test_rep, salto_vertical_cm, spider_drill_seg, fms_squat, fms_lunge_izq, fms_lunge_der, fms_hombro_izq, fms_hombro_der, sentadillas_1min, lagartijas_1min, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000004', 2.95, 10, 5, 50.0, 11.8, true, true, true, true, true, 52, 34, '2026-07-16', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

insert into report_character (report_id, etica_trabajo, coachabilidad, liderazgo_nota, conducta_log, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000004', 1, 1, 'Sigue siendo referencia para los atletas más nuevos del grupo', 'Trimestre muy sólido, sin incidentes.', '2026-07-16', '2f6a28d5-7d58-4f89-ac29-91a1f76693dd');

insert into report_athlete_voice (report_id, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido, velocidad, resistencia, potencia, agilidad, movilidad, fuerza_tren_inferior, fuerza_tren_superior, etica_trabajo, coachabilidad, liderazgo, reflexion_mes, completed_at)
values ('30000000-0000-4000-8000-000000000004', 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 'Siento que este mes recuperé el nivel de mayo, sobre todo en Querétaro. Todavía me falta confiar más en un plan B cuando el saque no está funcionando tan bien.', '2026-07-16');

-- ============================================================================
-- ATLETA 5 — Camila Ortiz Vega — cuarto mes: varios torneos, ciclo de plan
-- cerrado (con outcomes/carryover) + plan nuevo que hereda carryovers
-- ============================================================================
insert into athletes (id, coach_id, nombre, apellido, segundo_apellido, fecha_nacimiento, mano_dominante, fecha_ingreso, utr_actual, activo)
values (
  '10000000-0000-4000-8000-000000000005',
  '3237b0d5-3cbe-46d5-a05c-71a34573cd01', -- Lalo Martínez
  'Camila', 'Ortiz', 'Vega',
  '2012-01-19', 'zurdo', '2026-03-17', 5.90, true
);

insert into athlete_recruitment_profile (athlete_id, division_objetivo, grad_year, gpa, english_level, study_area)
values (
  '10000000-0000-4000-8000-000000000005',
  'NCAA Division I', '2030', 3.70, 'Intermedio (B2)', 'Psicología'
);

insert into tournaments (id, nombre, tipo, categoria, fecha, sede)
values
  ('20000000-0000-4000-8000-000000000010', 'Copa AMTP CDMX', 'AMTP', 'U14', '2026-03-29', 'Ciudad de México'),
  ('20000000-0000-4000-8000-000000000011', 'Torneo Nacional UTR Toluca', 'UTR', 'U14', '2026-04-19', 'Toluca, Edo. Méx.'),
  ('20000000-0000-4000-8000-000000000012', 'ITF Junior Series Guadalajara', 'ITF Junior', 'U14', '2026-05-24', 'Guadalajara, Jal.'),
  ('20000000-0000-4000-8000-000000000013', 'Copa AMTP León', 'AMTP', 'U14', '2026-06-21', 'León, Guanajuato'),
  ('20000000-0000-4000-8000-000000000014', 'Torneo Nacional UTR Querétaro', 'UTR', 'U14', '2026-07-13', 'Querétaro, Qro.');

insert into athlete_tournaments (id, athlete_id, tournament_id, modalidad, ronda, resultado, victoria, partidos_jugados, notas)
values
  ('21000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000010', 'Individual', 'Cuartos de final', 'Perdió en cuartos', false, 3, 'Primer torneo con la academia'),
  ('21000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000011', 'Individual', 'Semifinal', 'Perdió en semis', false, 4, 'Buena mejora respecto al torneo anterior'),
  ('21000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000012', 'Individual', 'Final', 'Campeona', true, 5, 'Primer título, gran manejo emocional en la final'),
  ('21000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000013', 'Individual', 'Semifinal', 'Perdió en semis', false, 4, 'Bajón físico en el tercer set, tema recurrente'),
  ('21000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000014', 'Individual', 'Final', 'Campeona', true, 5, 'Cerró el ciclo con su segundo título');

insert into post_tournament_forms (
  athlete_id, athlete_tournament_id, match_date, tournament_name,
  tecnica_derecha, tecnica_reves, tecnica_servicio, tecnica_volea, tecnica_comentario, tecnica_mejora,
  tactica_comentario_plan, tactica_funciono, tactica_cambiar,
  mental_presion, mental_concentracion, mental_confianza, mental_reaccion_error,
  fisico_nivel, fisico_dolor, fisico_nutricion,
  reflexion_hice_bien, reflexion_mejorar, reflexion_aprendizaje, reflexion_proximo_torneo, reflexion_satisfaccion
) values
(
  '10000000-0000-4000-8000-000000000005', '21000000-0000-4000-8000-000000000010', '2026-03-29', 'Copa AMTP CDMX',
  3, 3, 3, 2, 'Nivel parejo pero todavía muy básico en todos los golpes', 'Trabajar consistencia general',
  'Jugar seguro y esperar el error', 'Funcionó en el primer set', 'Necesita un plan más agresivo',
  2, 'Se puso nerviosa en momentos clave', 2, 'Le costó mucho reponerse de errores',
  3, false, 'Normal',
  'Competir con nervios y no rendirse', 'Todo, apenas empieza', 'Que le falta mucho rodaje de torneos',
  'Jugar el siguiente torneo con más soltura', 5
),
(
  '10000000-0000-4000-8000-000000000005', '21000000-0000-4000-8000-000000000011', '2026-04-19', 'Torneo Nacional UTR Toluca',
  3, 3, 3, 2, 'Ligera mejora en consistencia de derecha', 'Seguir trabajando revés',
  'Jugar seguro con paciencia', 'Funcionó bien en semis', 'Le faltó variar más contra la zurda rival',
  3, 'Mejoró la concentración respecto a CDMX', 3, 'Mejor manejo del error que en el torneo anterior',
  3, false, 'Normal',
  'Paciencia en los intercambios largos', 'Variar más el plan según el rival', 'Que va agarrando ritmo de competencia',
  'Seguir compitiendo seguido', 6
),
(
  '10000000-0000-4000-8000-000000000005', '21000000-0000-4000-8000-000000000012', '2026-05-24', 'ITF Junior Series Guadalajara',
  4, 3, 4, 3, 'Mejor torneo técnico hasta ahora, sobre todo el saque', 'Seguir afinando el revés',
  'Jugar agresivo con el saque nuevo trabajo', 'Funcionó a la perfección', 'Nada que cambiar, seguir así',
  4, 'Concentración total en la final', 4, 'Manejo emocional excelente en el momento más difícil',
  4, false, 'Bien',
  'Todo — su mejor torneo con la academia', 'Nada puntual', 'Que puede ganar torneos importantes cuando confía en su juego',
  'Mantener la misma preparación mental', 9
),
(
  '10000000-0000-4000-8000-000000000005', '21000000-0000-4000-8000-000000000013', '2026-06-21', 'Copa AMTP León',
  4, 3, 4, 3, 'Buen nivel técnico, pero se le nota cansancio hacia el final de los partidos', 'Nada técnico urgente',
  'Mismo plan que en Guadalajara', 'Funcionó en los primeros dos sets', 'El plan se cae cuando baja físicamente',
  3, 'Perdió foco cuando empezó a sentir cansancio', 3, 'Le cuesta cuando el cansancio se suma a la presión',
  2, true, 'Hidratación insuficiente, calor fuerte',
  'Los primeros dos sets, ahí jugó su mejor tenis', 'Resistencia física en el tercer set', 'Que el físico se volvió el límite real de su progreso, no la técnica',
  'Enfocar el siguiente ciclo en trabajo físico', 6
),
(
  '10000000-0000-4000-8000-000000000005', '21000000-0000-4000-8000-000000000014', '2026-07-13', 'Torneo Nacional UTR Querétaro',
  4, 4, 4, 3, 'Nivel técnico sostenido, ya no bajó como en León', 'Seguir el mismo trabajo de las últimas semanas',
  'Jugar agresivo y cuidar la hidratación desde el calentamiento', 'Funcionó todo el torneo', 'Nada que cambiar',
  4, 'Buena concentración todo el torneo', 4, 'Manejo de error consistente',
  4, false, 'Mucho mejor, ajustó hidratación desde el inicio',
  'Sostener el nivel físico todo el torneo, algo que no lograba antes', 'Nada puntual', 'Que el trabajo físico específico sí está rindiendo fruto',
  'Seguir el mismo plan de hidratación y trabajo físico', 9
);

-- Reportes mensuales (mes 1 y mes 3 del ciclo, no se llenó cada mes)
insert into reports (id, athlete_id, coach_id, period)
values
  ('30000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', '3237b0d5-3cbe-46d5-a05c-71a34573cd01', '2026-04-01'),
  ('30000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000005', '3237b0d5-3cbe-46d5-a05c-71a34573cd01', '2026-06-01');

insert into report_on_court (report_id, serve, forehand, backhand, volea, devolucion, footwork, tecnica_nota, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, tactica_nota, transferencia_partido, utr, completed_at, completed_by)
values
  ('30000000-0000-4000-8000-000000000005', 0, 0, -1, -1, 0, 0, 'Nivel básico parejo en todos los golpes al ingresar.', -1, -1, -1, -1, 'Todavía sin plan de juego claro, muy reactiva.', -1, 5.10, '2026-04-27', '3237b0d5-3cbe-46d5-a05c-71a34573cd01'),
  ('30000000-0000-4000-8000-000000000006', 1, 0, 0, 0, 0, 0, 'Mejoró el saque de forma notoria, resto de golpes estable.', 0, 0, 0, 0, 'Ya sostiene un plan de juego simple con consistencia.', 0, 5.70, '2026-06-24', '3237b0d5-3cbe-46d5-a05c-71a34573cd01');

insert into report_physical (report_id, sprint_20m, beep_test_nivel, beep_test_rep, salto_vertical_cm, spider_drill_seg, fms_squat, fms_lunge_izq, fms_lunge_der, fms_hombro_izq, fms_hombro_der, sentadillas_1min, lagartijas_1min, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000005', 3.60, 6, 2, 30.0, 14.5, true, false, true, true, true, 30, 15, '2026-04-27', '3237b0d5-3cbe-46d5-a05c-71a34573cd01');

insert into report_physical (report_id, completed_at, completed_by)
values ('30000000-0000-4000-8000-000000000006', null, null);

insert into report_character (report_id, etica_trabajo, coachabilidad, conducta_log, completed_at, completed_by)
values
  ('30000000-0000-4000-8000-000000000005', 1, 1, 'Buen inicio, algo tímida en grupo pero muy aplicada.', '2026-04-27', '3237b0d5-3cbe-46d5-a05c-71a34573cd01'),
  ('30000000-0000-4000-8000-000000000006', 1, 2, 'Empieza a soltarse más con el grupo.', '2026-06-24', '3237b0d5-3cbe-46d5-a05c-71a34573cd01');

-- Plan cerrado (ciclo completo, con outcomes mixtos y decisiones de carryover)
insert into quarterly_plans (id, athlete_id, coach_id, period_start, period_end, raw_input, status, coach_retrospective, athlete_retrospective, closed_at, created_at, updated_at)
values (
  '40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000005', '3237b0d5-3cbe-46d5-a05c-71a34573cd01',
  '2026-04-01', '2026-06-30',
  'Camila llega con nivel técnico básico parejo, muy reactiva táctimente, y se nota que el físico se le cae en el tercer set de partidos exigentes.',
  'completed',
  'Cerramos el trimestre con un salto enorme en confianza y en saque — el título de Guadalajara fue un parteaguas. El límite real hoy es físico: se repite el bajón en el tercer set en calor. La táctica sigue detrás porque todavía no hay margen físico para sostenerla en el momento en que más importa.',
  'Sentí que gané mucha confianza este trimestre, sobre todo después de ganar en Guadalajara. Lo que más me frustra es cansarme en el tercer set justo cuando el partido está más apretado.',
  '2026-07-14',
  '2026-04-02', '2026-07-14'
);

insert into quarterly_plan_objectives (id, plan_id, dimension, sub_dimension, tipo, diagnostico, objetivo, estandar_usado, baseline, target, unit, outcome, final_assessment, carryover, deprioritized_at, sort_order)
values
  -- Logrado, no se lleva (ya está consolidado)
  ('41000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', 'tecnica', 'serve', 'foco',
   'Saque muy plano y predecible al ingresar', 'Sumar variación de colocación y spin al saque',
   'de forma consistente', 2, 4, 'escala 1-5',
   'logrado', 'Saque pasó a ser un arma real — se notó claramente en Guadalajara y Querétaro. Objetivo consolidado, pasa a mantenimiento en el siguiente ciclo.',
   false, null, 1),
  -- Parcial, continúa (todavía no consolidado, se lleva al siguiente plan)
  ('41000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000003', 'tactica', 'manejo_riesgo', 'foco',
   'Muy reactiva, sin plan de juego propio', 'Sostener un plan de juego simple durante todo el partido',
   'de forma consistente', -1, 2, 'escala -2 a 2',
   'parcial', 'Ya sostiene el plan en peloteo neutral, pero se le cae en momentos de presión o cansancio — mismo patrón que el físico.',
   true, null, 2),
  -- Fallido, continúa (el límite real fue físico, se prioriza en el siguiente ciclo)
  ('41000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000003', 'physical', 'beep_test', 'foco',
   'Nivel aeróbico bajo, se nota fatiga marcada desde el segundo set en partidos exigentes',
   'Sostener el nivel físico del segundo set también en el tercero',
   'bajo presión', 6, 8, 'nivel beep test',
   'fallido', 'No se logró — el bajón en León y el patrón repetido en varios torneos muestran que sigue siendo el límite real de su tenis. Es la prioridad número uno del siguiente ciclo.',
   true, null, 3),
  -- Depriorizado (no se evalúa como logrado/parcial/fallido, se decide no darle carryover)
  ('41000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000003', 'character', 'liderazgo', 'mantenimiento',
   'Algo tímida en grupo al ingresar', 'Participar más activamente en dinámicas grupales',
   'sin recordatorio', null, null, 'cualitativo',
   null, null,
   false, '2026-07-14', 4);

-- Plan nuevo, activo, que hereda los dos focos con carryover=true del plan anterior
insert into quarterly_plans (id, athlete_id, coach_id, period_start, period_end, raw_input, status, created_at, updated_at)
values (
  '40000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000005', '3237b0d5-3cbe-46d5-a05c-71a34573cd01',
  '2026-07-01', '2026-09-30',
  'Cerramos el ciclo anterior con el saque consolidado. Los dos temas que se llevan son manejo de riesgo bajo presión y, sobre todo, el físico — es el límite real hoy.',
  'active', '2026-07-15', '2026-07-15'
);

insert into quarterly_plan_objectives (plan_id, dimension, sub_dimension, tipo, diagnostico, objetivo, estandar_usado, anchors, baseline, target, unit, carryover_of, sort_order)
values
  ('40000000-0000-4000-8000-000000000004', 'physical', 'beep_test', 'foco',
   'Sigue cayendo el nivel físico en el tercer set de partidos exigentes, ya es el límite claro de su tenis',
   'Sostener el nivel físico del segundo set también en el tercero',
   'bajo presión',
   '{"1": "cae más de 2 niveles hacia el tercer set", "3": "cae 1 nivel", "5": "sostiene el mismo nivel todo el partido"}'::jsonb,
   6, 8, 'nivel beep test',
   '41000000-0000-4000-8000-000000000003', 1),
  ('40000000-0000-4000-8000-000000000004', 'tactica', 'manejo_riesgo', 'foco',
   'Sostiene el plan en peloteo neutral pero se le cae bajo presión o cansancio',
   'Sostener el plan de juego también en momentos de presión, no solo en peloteo neutral',
   'bajo presión',
   '{"1": "abandona el plan ante cualquier presión", "3": "sostiene el plan en peloteo neutral", "5": "sostiene el plan incluso bajo presión"}'::jsonb,
   -1, 2, 'escala -2 a 2',
   '41000000-0000-4000-8000-000000000002', 2),
  ('40000000-0000-4000-8000-000000000004', 'tecnica', 'serve', 'mantenimiento',
   'Saque quedó consolidado el ciclo pasado',
   'Mantener la variación de saque lograda en el ciclo anterior',
   'de forma consistente', null, 4, 4, 'escala 1-5', null, 3);
