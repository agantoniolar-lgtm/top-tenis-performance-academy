/**
 * athletics.js — helpers y constantes compartidas entre componentes del portal.
 * Solo funciones puras sin side effects.
 */

// ─── Constantes ───────────────────────────────────────────────────────────────

export const STROKE_KEYS  = ['serve','forehand','backhand','volea','devolucion','footwork'];
export const TACTIC_KEYS  = ['seleccion_golpe','manejo_riesgo','puntos_clave','adaptacion_tactica','transferencia_partido'];

export const STROKE_LABELS = {
  serve: 'Saque', forehand: 'Derecha', backhand: 'Revés',
  volea: 'Volea', devolucion: 'Devolución', footwork: 'Movimiento',
};
export const TACTIC_LABELS = {
  seleccion_golpe: 'Selección', manejo_riesgo: 'Riesgo', puntos_clave: 'Pts. clave',
  adaptacion_tactica: 'Adaptación', transferencia_partido: 'Transferencia',
};

/** Descripción corta de cada dimensión táctica — para tooltips y ayudas inline. */
export const TACTIC_DESCS = {
  seleccion_golpe:       'Elegir el golpe correcto según la situación del punto.',
  manejo_riesgo:         'Balance entre agresividad y margen de error.',
  puntos_clave:          'Ejecución en momentos decisivos: break points, 30-30, tiebreaks.',
  adaptacion_tactica:    'Ajustar el plan de juego según el rival y el marcador.',
  transferencia_partido: 'Aplicar en torneo lo trabajado en entrenamiento.',
};

/** Escala on-court: -2..+2 */
export const OC_LABEL = {
  '-2': 'Estancado', '-1': 'Rezagado', '0': 'Por buen camino',
  '1': 'Adelantado', '2': 'Superado',
};
/** Escala score 1..5 (on-court normalizado) */
export const SCORE5_LABEL = {
  1: 'Estancado', 2: 'Rezagado', 3: 'Por buen camino',
  4: 'Adelantado', 5: 'Superado',
};
/**
 * Escala carácter — ahora -2..+2 igual que on-court.
 * @deprecated usar SCORE5_LABEL después de ocTo5(), o OC_LABEL directo.
 */
export const CHAR_LABEL = {
  1: 'Estancado', 2: 'Rezagado', 3: 'Por buen camino',
  4: 'Adelantado', 5: 'Superado',
};

// ─── Funciones de identidad ───────────────────────────────────────────────────

/**
 * Devuelve la categoría de edad (12U, 14U, 16U, 18U) a partir de fecha de nacimiento.
 * @param {string|null} fechaNac — ISO date string (YYYY-MM-DD)
 */
export function calcCat(fechaNac) {
  if (!fechaNac) return '—';
  const edad = new Date().getFullYear() - new Date(fechaNac).getFullYear();
  if (edad <= 12) return '12U';
  if (edad <= 14) return '14U';
  if (edad <= 16) return '16U';
  return '18U';
}

/**
 * Devuelve la edad en años enteros, o null si no hay fecha.
 * @param {string|null} fechaNac
 */
export function calcEdad(fechaNac) {
  if (!fechaNac) return null;
  return new Date().getFullYear() - new Date(fechaNac).getFullYear();
}

/**
 * Categorías de edad donde el perfil de reclutamiento universitario ya es
 * relevante. Atletas más chicos (12U/14U) no necesitan llenarlo — no debe
 * bloquearlos ni pedírselo como requisito.
 */
export const RECRUITMENT_CATEGORIES = ['16U', '18U'];

/**
 * Indica si el perfil de reclutamiento aplica para este atleta según su edad.
 * Sin fecha de nacimiento, se asume que no aplica (mejor no pedir de más).
 * @param {string|null} fechaNac
 */
export function isRecruitmentRelevant(fechaNac) {
  return RECRUITMENT_CATEGORIES.includes(calcCat(fechaNac));
}

// ─── Funciones de score ───────────────────────────────────────────────────────

/**
 * Promedio de las claves numéricas de un objeto.
 * Ignora null / undefined / non-numeric.
 * @param {object|null} obj
 * @param {string[]} keys
 * @returns {number|null}
 */
export function avg(obj, keys) {
  if (!obj) return null;
  const vals = keys.map(k => obj[k]).filter(n => n != null && typeof n === 'number');
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

/**
 * Convierte un promedio on-court (-2..+2) a escala 1..5.
 * -2 → 1, 0 → 3, +2 → 5
 * @param {number|null} a
 * @returns {number|null}
 */
export function ocTo5(a) {
  if (a == null) return null;
  return Math.max(1, Math.min(5, Math.round(a + 3)));
}

/**
 * Promedio on-court de un reporte con label de texto.
 * @param {number|null} a — resultado de avg() sobre on-court keys
 */
export function ocAvgLabel(a) {
  if (a == null) return null;
  if (a <= -1.5) return 'Estancado';
  if (a <= -0.5) return 'Rezagado';
  if (a <=  0.5) return 'Por buen camino';
  if (a <=  1.5) return 'Adelantado';
  return 'Superado';
}

/**
 * Color CSS según score 1..5.
 * ≤2 → bad, 3 → mute, ≥4 → good
 * @param {number|null} v
 * @returns {string}
 */
export function score5Color(v) {
  if (v == null) return 'var(--ink-mute)';
  return v <= 2 ? 'var(--bad)' : v === 3 ? 'var(--ink-mute)' : 'var(--good)';
}

/**
 * Formatea +n / -n con signo.
 * @param {number} n
 */
export function fmtSign(n) {
  return n > 0 ? `+${n}` : `${n}`;
}

// ─── Funciones de fecha ───────────────────────────────────────────────────────

/**
 * Formatea un string de período (YYYY-MM-DD) como "jun 2026".
 * @param {string|null} p
 */
export function fmtPeriod(p) {
  if (!p) return '—';
  // Parse date parts manually to avoid UTC-vs-local timezone offset
  // new Date('2026-06-01') parses as UTC midnight = May 31 in UTC-6
  const [y, m] = p.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' });
}

/**
 * Como fmtPeriod pero con el mes completo ("junio de 2026").
 * @param {string|null} p — YYYY-MM-DD
 */
export function fmtPeriodLong(p) {
  if (!p) return '—';
  const [y, m] = p.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' });
}

/**
 * Formatea un rango de período trimestral (period_start, period_end) como "jul – sep 2026".
 * Usado por quarterly_plans (coach y atleta). Antes vivía duplicado en PlanesCoach.jsx.
 * @param {string|null} start — YYYY-MM-DD
 * @param {string|null} end — YYYY-MM-DD
 */
export function fmtPeriodRange(start, end) {
  if (!start || !end) return '—';
  const [ys, ms, ds] = start.split('-').map(Number);
  const [ye, me, de] = end.split('-').map(Number);
  const s = new Date(ys, ms - 1, ds);
  const e = new Date(ye, me - 1, de);
  const sMon = s.toLocaleDateString('es-MX', { month: 'short' });
  const eMon = e.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
  return `${sMon} – ${eMon}`;
}

/**
 * Primer período (YYYY-MM) en el que se puede crear un reporte para un atleta:
 * el mes de su fecha de ingreso. null si no hay fecha.
 * @param {string|null} fechaIngreso — YYYY-MM-DD
 * @returns {string|null} — YYYY-MM
 */
export function minPeriodFor(fechaIngreso) {
  if (!fechaIngreso) return null;
  return fechaIngreso.slice(0, 7);
}

/**
 * ¿Se permite un período de reporte para un atleta con esa fecha de ingreso?
 * Compara solo año-mes; sin fecha de ingreso, todo período es válido.
 * @param {string|null} period — YYYY-MM-DD (o YYYY-MM)
 * @param {string|null} fechaIngreso — YYYY-MM-DD
 */
export function isPeriodAllowed(period, fechaIngreso) {
  if (!period) return false;
  if (!fechaIngreso) return true;
  return period.slice(0, 7) >= fechaIngreso.slice(0, 7);
}

// ─── Funciones de series y torneos ───────────────────────────────────────────

/**
 * Normaliza una serie numérica a la escala 1..5 según su propio min/max,
 * para graficarla en sparklines cuyo dominio es 1..5 (ej. UTR).
 * Si todos los valores son iguales devuelve 3 para cada uno. Conserva nulls.
 * @param {(number|null)[]} values
 * @returns {(number|null)[]}
 */
export function normalizeSeries(values) {
  const nums = (values ?? []).filter(v => v != null && typeof v === 'number');
  if (nums.length === 0) return (values ?? []).map(() => null);
  const min = Math.min(...nums), max = Math.max(...nums);
  return values.map(v => {
    if (v == null || typeof v !== 'number') return null;
    if (max === min) return 3;
    return 1 + ((v - min) / (max - min)) * 4;
  });
}

/**
 * Record W/L **por partido** a partir de participaciones en torneos.
 * En eliminación directa: si ganó el último partido, ganó todos los que jugó;
 * si lo perdió, ganó todos menos el último.
 * - Cuenta solo filas con resultado capturado (victoria !== null).
 * - Sin partidos_jugados (filas viejas), asume 1 partido (el registrado).
 * - `total` = número de torneos con resultado, para el subtítulo "x torneos".
 * @param {{victoria: boolean|null, partidos_jugados?: number|null}[]|null} rows
 * @returns {{w: number, l: number, total: number}}
 */
export function winLossRecord(rows) {
  const played = (rows ?? []).filter(r => r && r.victoria != null);
  let w = 0, l = 0;
  for (const r of played) {
    const n = r.partidos_jugados != null && r.partidos_jugados >= 1 ? r.partidos_jugados : 1;
    if (r.victoria === true) { w += n; }
    else { w += n - 1; l += 1; }
  }
  return { w, l, total: played.length };
}

/**
 * Días transcurridos entre dos fechas ISO (YYYY-MM-DD). Positivo si `today` es posterior a `dateISO`.
 * @param {string} dateISO
 * @param {string} todayISO
 * @returns {number}
 */
export function daysSince(dateISO, todayISO) {
  const a = new Date(dateISO + 'T00:00:00');
  const b = new Date(todayISO + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}

/**
 * Días de gracia antes de considerar "pendiente" un PTF sin llenar (T161 Parte 2, digest por
 * email) — le da tiempo al atleta de llenarlo solo tras el torneo antes de generar ruido.
 * Los flags en-app (Equipo.jsx/AlumnoDetalle.jsx, Parte 1) NO usan gracia — muestran el estado
 * real ahora mismo, igual que el badge "Reclutamiento pendiente" ya existente.
 */
export const PTF_GRACE_DAYS = 3;
/** Días de gracia post-alta antes de incluir reclutamiento/papás/baseline físico en el digest (T161 Parte 2). */
export const ONBOARDING_GRACE_DAYS = 5;

/**
 * ¿Tiene el atleta al menos un torneo con PTF sin llenar? Un torneo cuenta si ya pasó su
 * `fecha` (+ `graceDays` opcional) y no tiene un PTF ligado (`post_tournament_forms.athlete_tournament_id`).
 * Sin `graceDays` (default 0) refleja el estado real ahora — usado por los flags en-app (T161 Parte 1).
 * Con `graceDays=PTF_GRACE_DAYS` es la regla que usará el digest semanal (T161 Parte 2).
 * @param {{fecha: string|null, hasForm: boolean}[]|null} tournaments
 * @param {string} today ISO date (YYYY-MM-DD)
 * @param {number} [graceDays]
 * @returns {boolean}
 */
export function hasPendingPTF(tournaments, today, graceDays = 0) {
  return (tournaments ?? []).some(t => {
    if (!t?.fecha || t.hasForm) return false;
    return daysSince(t.fecha, today) >= graceDays;
  });
}

/**
 * Gaps de onboarding pendientes de un atleta — usado por los flags del coach (`Equipo.jsx`,
 * `AlumnoDetalle.jsx`, T161 Parte 1) y por el propio dashboard del atleta (`Inicio.jsx`), para no
 * duplicar la misma lógica de "¿está completo esto?" en dos lugares. No aplica períodos de gracia
 * (eso es del digest semanal, T161 Parte 2, vía `hasPendingPTF`/`ONBOARDING_GRACE_DAYS`) — cada gap
 * acá refleja el estado real en este momento. El orden de salida ya es el de prioridad (más urgente
 * primero): perfil → PTF → baseline físico → papás/tutor → reclutamiento.
 * @param {object} params
 * @param {{altura_cm?: number, peso_kg?: number, escuela?: string, fecha_nacimiento?: string|null, nombre_padre?: string, telefono_padre?: string, email_padre?: string}|null} params.athlete
 * @param {{division_objetivo?: string, grad_year?: string, english_level?: string}|null} [params.recruitment]
 * @param {boolean} [params.pendingPTF] — true si tiene ≥1 torneo con PTF sin llenar (ver `hasPendingPTF`)
 * @param {boolean} [params.hasPhysicalBaseline] — true si ya tiene al menos un `report_physical` con `completed_at`
 * @returns {{key: string, label: string}[]}
 */
export function onboardingGaps({ athlete, recruitment = null, pendingPTF = false, hasPhysicalBaseline = true } = {}) {
  const gaps = [];
  const edad = calcEdad(athlete?.fecha_nacimiento);

  const profileComplete = !!(athlete?.altura_cm && athlete?.peso_kg && athlete?.escuela);
  if (!profileComplete) gaps.push({ key: 'perfil', label: 'Perfil incompleto' });

  if (pendingPTF) gaps.push({ key: 'ptf', label: 'PTF pendiente' });

  if (!hasPhysicalBaseline) gaps.push({ key: 'baseline_fisico', label: 'Baseline físico pendiente' });

  const esMenor = edad !== null && edad < 18;
  const tutorComplete = !!(athlete?.nombre_padre || athlete?.telefono_padre || athlete?.email_padre);
  if (esMenor && !tutorComplete) gaps.push({ key: 'papas', label: 'Papás/tutor pendiente' });

  const showAdvancedRec = edad == null || edad >= 17;
  const recruitmentApplies  = isRecruitmentRelevant(athlete?.fecha_nacimiento);
  const recruitmentComplete = !!(recruitment?.division_objetivo && recruitment?.grad_year &&
    (!showAdvancedRec || recruitment?.english_level));
  if (recruitmentApplies && !recruitmentComplete) gaps.push({ key: 'reclutamiento', label: 'Reclutamiento pendiente' });

  return gaps;
}

/**
 * Filtra los gaps de `onboardingGaps()` para el digest semanal por email (T161 Parte 2) — a
 * diferencia de los flags en-app (inmediatos), el digest le da tiempo al atleta antes de generar
 * ruido: "perfil" y "ptf" ya vienen resueltos en el momento en que se arma `gaps` (perfil no tiene
 * gracia; "ptf" debe calcularse con `hasPendingPTF(..., PTF_GRACE_DAYS)` antes de llamar acá).
 * Esta función solo aplica la gracia de `ONBOARDING_GRACE_DAYS` (post-alta) a los 3 gaps restantes:
 * baseline físico, papás/tutor y reclutamiento.
 * @param {{key: string, label: string}[]} gaps salida de `onboardingGaps()`
 * @param {string|null} fechaIngreso `athletes.fecha_ingreso`
 * @param {string} today ISO date (YYYY-MM-DD)
 * @param {number} [graceDays]
 * @returns {{key: string, label: string}[]}
 */
const DIGEST_GRACE_KEYS = new Set(['baseline_fisico', 'papas', 'reclutamiento']);
export function filterGapsForDigest(gaps, fechaIngreso, today, graceDays = ONBOARDING_GRACE_DAYS) {
  const pastGrace = !fechaIngreso || daysSince(fechaIngreso, today) >= graceDays;
  return (gaps ?? []).filter(g => !DIGEST_GRACE_KEYS.has(g.key) || pastGrace);
}

/**
 * Inicio del periodo siguiente a partir del `period_end` de un plan — el día después. Usado al
 * confirmar el cierre de un plan para prellenar el atleta+periodo del plan siguiente
 * (docs/scope-close-quarterly-plan.md §13, "post-cierre").
 * @param {string|null} periodEnd fecha 'YYYY-MM-DD'
 * @returns {string|null}
 */
export function nextPeriodStartFor(periodEnd) {
  if (!periodEnd) return null;
  const d = new Date(periodEnd + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// ─── P&M — cierre de plan trimestral (docs/scope-close-quarterly-plan.md) ──────

/** Las 3 preguntas de la retrospectiva del coach, ya decididas en scope-planning-measurement.md §21. */
export const COACH_RETRO_QUESTIONS = [
  '¿Qué del plan funcionó mejor este trimestre?',
  '¿Qué no funcionó o quedó incompleto?',
  '¿Qué debería priorizarse el siguiente trimestre?',
];

/**
 * Combina las 3 respuestas de la retrospectiva del coach en el único campo de texto
 * `coach_retrospective`. Respuestas vacías/solo-espacios se omiten. Devuelve null si no
 * queda ninguna respuesta (equivalente a "no hay retrospectiva capturada todavía").
 * @param {string[]|null} answers
 * @returns {string|null}
 */
export function formatCoachRetrospective(answers) {
  const parts = COACH_RETRO_QUESTIONS
    .map((q, i) => ({ q, a: (answers?.[i] ?? '').trim() }))
    .filter(({ a }) => a.length > 0)
    .map(({ q, a }) => `${q}\n${a}`);
  return parts.length ? parts.join('\n\n') : null;
}

/**
 * Focos (`tipo: 'foco'`, no mantenimiento) de un plan que todavía no tienen `outcome`
 * asignado. Usado como aviso no-bloqueante al confirmar el cierre — el cierre parcial está
 * permitido (docs/scope-close-quarterly-plan.md §9), esto solo informa qué falta.
 * @param {{tipo?: string, outcome?: string|null}[]|null} objectives
 * @returns {object[]}
 */
export function focosSinOutcome(objectives) {
  return (objectives ?? []).filter(o => (o.tipo ?? 'foco') === 'foco' && !o.outcome);
}

/**
 * Pruebas físicas (`report_physical`) donde bajar el valor es la mejora (tiempo). Las que no
 * están acá (`abdominales_30s`, `salto_vertical_cm`, `lanzamiento_balon_mts`) mejoran subiendo.
 * `flexibilidad_banco_pass` no aplica — es booleano, ver `physicalTestScore`.
 */
export const PHYSICAL_LOWER_IS_BETTER = new Set(['velocidad_2377m', 'agilidad_5_lineas_seg', 'tiempo_1km_seg']);

/**
 * Score -2..+2 de una prueba física, comparando `value` contra su `baseline` (protocolo RAC,
 * definido por Marco 21 Jul 2026 — ver TASKS.md T152). `baseline` es siempre el primer valor no
 * nulo que el atleta registró para esa prueba (fijo, nunca la corrida inmediata anterior).
 * Bandas (pct = mejora firmada; negativo = empeora): ≥15% mejora → +2, ≥10% → +1, resto hasta
 * -5% (exclusivo) → 0, hasta -10% (inclusivo) → -1, peor que -10% → -2. Los límites son asimétricos
 * a propósito porque así los dio Marco: "10%"/"15%" de mejora son inclusive-igual-o-mejor, pero
 * "más del 10%" de empeoramiento es estrictamente peor que 10% (a exactamente -10% todavía es -1).
 * `flexibilidad_banco_pass` es especial: booleano sin baseline/porcentaje — pasa=0, no pasa=-2.
 * @param {string} field nombre de columna en report_physical
 * @param {number|null} baseline primer valor no nulo del atleta para este campo (null = sin baseline aún)
 * @param {number|boolean|null} value valor a puntuar
 * @returns {number} score -2..+2
 */
export function physicalTestScore(field, baseline, value) {
  if (field === 'flexibilidad_banco_pass') return value ? 0 : -2;
  if (baseline == null || value == null || baseline === 0) return 0;
  const rawPct = (value - baseline) / Math.abs(baseline);
  const signedPct = PHYSICAL_LOWER_IS_BETTER.has(field) ? -rawPct : rawPct;
  // Redondeo a 6 decimales: evita que el ruido de punto flotante (ej. 4.4-4.0 → 0.39999999999999947)
  // empuje un valor que debería caer justo en un límite (5%/10%/15%) al lado equivocado.
  const pct = Math.round(signedPct * 1e6) / 1e6;
  if (pct >= 0.15) return 2;
  if (pct >= 0.10) return 1;
  if (pct > -0.05) return 0;
  if (pct >= -0.10) return -1;
  return -2;
}

/**
 * Serie de scores -2..+2 para una prueba física, a partir de sus valores crudos ordenados
 * cronológicamente (ascendente). El primer valor no nulo define el baseline del atleta para esa
 * prueba y siempre puntúa 0 (no hay nada contra qué comparar todavía); los siguientes se comparan
 * contra ese baseline fijo vía `physicalTestScore`. `flexibilidad_banco_pass` no tiene baseline —
 * cada valor se puntúa de forma independiente (pasa/no pasa).
 * @param {string} field nombre de columna en report_physical
 * @param {(number|boolean|null)[]|null} rawValues valores crudos ordenados por period ascendente
 * @returns {(number|null)[]} mismo largo que rawValues; null donde el valor era null
 */
export function physicalScoreSeries(field, rawValues) {
  let baseline = null;
  return (rawValues ?? []).map(v => {
    if (v == null) return null;
    const score = physicalTestScore(field, baseline, v);
    if (baseline == null && field !== 'flexibilidad_banco_pass') baseline = v;
    return score;
  });
}

/**
 * Scores mensuales (-2..+2) y último comentario del coach para un foco, a partir de los reportes
 * mensuales del periodo — para mostrarlos en la vista de cierre (docs/scope-close-quarterly-plan.md
 * §13, "vista de cierre: falta contexto de scores/comentarios"). Técnica/táctica leen de
 * `report_on_court` (la nota es compartida por dimensión: `tecnica_nota`/`tactica_nota`, no por
 * sub-dimensión); carácter lee de `report_character` (nota específica `${sub_dimension}_nota`,
 * incluyendo `liderazgo` desde que tiene columna de score — T152, 21 Jul 2026). `physical` usa
 * `physicalScoreSeries` sobre los valores crudos de `report_physical` — el baseline usado es el
 * primer valor **dentro de este slice de `monthlyReports`**, no necesariamente el baseline
 * histórico completo del atleta (esta función solo ve los reportes que le pasan, igual que las
 * otras dimensiones); para un baseline atleta-wide real, ver T166 (backlog).
 * @param {{dimension: string, sub_dimension: string}} foco
 * @param {{report_on_court?: object|object[], report_character?: object|object[], report_physical?: object|object[]}[]|null} monthlyReports ordenados por period ascendente
 * @returns {{ scores: number[], lastNote: string|null }}
 */
export function monthlyScoresForFoco(foco, monthlyReports) {
  const firstRow = (x) => Array.isArray(x) ? (x[0] ?? null) : (x ?? null);
  const table = foco?.dimension === 'tecnica' || foco?.dimension === 'tactica' ? 'report_on_court'
              : foco?.dimension === 'character' ? 'report_character'
              : foco?.dimension === 'physical' ? 'report_physical'
              : null;
  if (!table || !foco?.sub_dimension) return { scores: [], lastNote: null };

  if (table === 'report_physical') {
    const rawValues = (monthlyReports ?? []).map(r => firstRow(r?.report_physical)?.[foco.sub_dimension] ?? null);
    const scores = physicalScoreSeries(foco.sub_dimension, rawValues).filter(s => s != null);
    return { scores, lastNote: null };
  }

  const noteKey = foco.dimension === 'tecnica' ? 'tecnica_nota'
                : foco.dimension === 'tactica' ? 'tactica_nota'
                : `${foco.sub_dimension}_nota`;
  const scores = [];
  let lastNote = null;
  for (const r of monthlyReports ?? []) {
    const row = firstRow(r?.[table]);
    if (!row) continue;
    const v = row[foco.sub_dimension];
    if (v != null) scores.push(v);
    const n = row[noteKey];
    if (n) lastNote = n;
  }
  return { scores, lastNote };
}

/**
 * Focos a pre-seleccionar en el paso 3 del wizard de creación: primero los que tienen
 * `carryover = true` en el plan anterior (señal explícita del coach al cerrar, independiente
 * del `outcome`/estado — docs/scope-close-quarterly-plan.md §16.3), luego completa hasta
 * `maxFocos` con las candidatas más urgentes del dump actual.
 * Deduplica por `dimension_sub_dimension` (un foco puede tener carryover Y ser candidata a la vez).
 * @param {{dimension: string, sub_dimension: string, candidata_a_foco?: boolean, urgencia?: string}[]|null} identified
 * @param {Set<string>|null} carryoverSubs sub_dimension con carryover=true en el plan anterior
 * @param {number} maxFocos
 * @returns {object[]} subconjunto de `identified`, en orden de prioridad
 */
export function preselectFocos(identified, carryoverSubs, maxFocos) {
  const urgenciaOrder = { alta: 0, media: 1, baja: 2 };
  const byUrgencia = (a, b) => (urgenciaOrder[a.urgencia] ?? 1) - (urgenciaOrder[b.urgencia] ?? 1);
  const seen = new Set();
  const out = [];
  const tryAdd = (it) => {
    const k = `${it.dimension}_${it.sub_dimension}`;
    if (seen.has(k) || out.length >= maxFocos) return;
    seen.add(k); out.push(it);
  };
  (identified ?? []).filter(it => carryoverSubs?.has(it.sub_dimension)).forEach(tryAdd);
  (identified ?? []).filter(it => it.candidata_a_foco).slice().sort(byUrgencia).forEach(tryAdd);
  return out;
}

/**
 * Arma el bundle del periodo previo (docs/scope-planning-measurement.md §7.1, §10) que se
 * manda como `prior_bundle` a generate-quarterly-plan al crear el plan siguiente.
 * `outcome` (docs/scope-close-quarterly-plan.md §16.3) es ahora el estado final del objetivo
 * (logrado/parcial/fallido) y `carryover` es la decisión independiente de si sigue al periodo
 * siguiente — antes eran el mismo campo de 4 valores excluyentes.
 * `monthly_scores` se omite deliberadamente en esta rebanada — no hay fuente uniforme de
 * score -2..+2 por sub-dimensión para las 4 dimensiones (liderazgo y physical sin resolver,
 * ver docs/scope-close-quarterly-plan.md §4). Devuelve null si no hay plan o no tiene focos.
 * @param {{coach_retrospective?: string|null, athlete_retrospective?: string|null}|null} plan
 * @param {object[]|null} objectives
 * @returns {object|null}
 */
export function buildPriorBundle(plan, objectives) {
  if (!plan) return null;
  const focos = (objectives ?? []).filter(o => (o.tipo ?? 'foco') === 'foco');
  if (!focos.length) return null;
  return {
    prior_focos: focos.map(o => ({
      dimension:         o.dimension,
      sub_dimension:     o.sub_dimension,
      objetivo:          o.objetivo ?? o.objective_text ?? null,
      outcome:           o.outcome ?? null,
      carryover:         o.carryover ?? null,
      final_assessment:  o.final_assessment ?? null,
    })),
    coach_retrospective:   plan.coach_retrospective ?? null,
    athlete_retrospective: plan.athlete_retrospective ?? null,
  };
}

// ── Notas del atleta (T148 fase 1) ────────────────────────────────────────────

/** Segmentos válidos de una nota (coincide con el CHECK de athlete_notes.segment). */
export const NOTE_SEGMENTS = ['general', 'training', 'tournament'];

/** Label legible por segmento, para el composer y el timeline. */
export const SEGMENT_LABELS = {
  general: 'General',
  training: 'Entrenamiento',
  tournament: 'Torneo',
};

/**
 * Valida el payload de una nota de texto (T148 fase 1) antes de mandarlo a Supabase — espeja los
 * CHECK de la tabla `athlete_notes` (`chk_text_has_body`, `chk_tournament_segment`) para dar
 * feedback inmediato sin round-trip. Devuelve el mensaje de error, o null si es válida.
 * @param {{ body?: string|null, segment?: string|null, tournamentId?: string|null }} note
 * @returns {string|null}
 */
export function noteValidationError(note) {
  const body = (note?.body ?? '').trim();
  const segment = note?.segment ?? null;
  const tournamentId = note?.tournamentId ?? null;
  if (!body) return 'La nota no puede estar vacía.';
  if (!NOTE_SEGMENTS.includes(segment)) return 'Selecciona un segmento válido.';
  if (segment === 'tournament' && !tournamentId) return 'Selecciona el torneo de la nota.';
  if (segment !== 'tournament' && tournamentId) return 'Solo las notas de torneo llevan torneo.';
  return null;
}

/**
 * Tope de intentos de transcripción (T148 fase 2c): la Edge Function `transcribe-note` incrementa
 * `transcription_attempts` en cada corrida; pasado este tope, la barrida diaria deja de reintentar
 * una nota que sigue fallando, para no reintentar infinito.
 */
export const MAX_TRANSCRIPTION_ATTEMPTS = 5;

/**
 * Notas de voz que la barrida diaria (2c) debe reintentar transcribir: `pending` o `failed`, con
 * audio ya subido, y por debajo del tope de intentos. Pura, para testear el predicado y usarla
 * tanto en el script de barrida como en cualquier vista futura. Las `done` nunca entran.
 * @param {{kind?: string, audio_path?: string|null, transcription_status?: string|null, transcription_attempts?: number|null}[]|null} notes
 * @param {number} maxAttempts
 * @returns {object[]}
 */
export function notesNeedingTranscription(notes, maxAttempts = MAX_TRANSCRIPTION_ATTEMPTS) {
  return (notes ?? []).filter(n =>
    n?.kind === 'voice' &&
    !!n?.audio_path &&
    (n?.transcription_status === 'pending' || n?.transcription_status === 'failed') &&
    (n?.transcription_attempts ?? 0) < maxAttempts,
  );
}

/**
 * Extensión de archivo a partir del mime de `MediaRecorder` (T148 fase 2). Safari iOS graba
 * `audio/mp4`, Chrome `audio/webm` — no asumir uno. Ignora los parámetros del mime (`;codecs=…`).
 * @param {string|null} mime
 * @returns {string}
 */
export function mimeToExt(mime) {
  if (!mime) return 'webm';
  const base = mime.split(';')[0].trim().toLowerCase();
  const map = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/mp4': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
  };
  return map[base] ?? 'webm';
}

/**
 * Path del audio de una nota dentro del bucket `athlete-notes-audio` (T148 fase 2). El nombre es
 * el id de la nota para que sea único y trazable 1:1 con su fila.
 * @param {string} noteId
 * @param {string|null} mime
 * @returns {string}
 */
export function noteAudioPath(noteId, mime) {
  return `${noteId}.${mimeToExt(mime)}`;
}

/**
 * Duración en `m:ss` para el contador de grabación y el timeline (T148 fase 2).
 * @param {number|null} seconds
 * @returns {string}
 */
export function fmtDuration(seconds) {
  if (seconds == null || Number.isNaN(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Fecha de una nota en texto relativo corto para el timeline (T148): "hace un momento",
 * "hace N min", "hace N h", "hace N d"; a partir de 7 días, fecha absoluta corta ("14 jul").
 * Pura: recibe el "ahora" en ms como parámetro para poder testearla. Solo display — no decide
 * acceso, así que usar la timezone local del coach en la rama absoluta es correcto.
 * @param {string|null} iso timestamp ISO de created_at
 * @param {number} nowMs Date.now() del momento de render
 * @returns {string}
 */
export function fmtRelativeTime(iso, nowMs) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diffMin = Math.floor((nowMs - then) / 60000);
  if (diffMin < 1)  return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)   return `hace ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7)    return `hace ${diffD} d`;
  const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const d = new Date(then);
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}
