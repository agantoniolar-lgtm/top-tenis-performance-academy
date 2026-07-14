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
 * Arma el bundle del periodo previo (docs/scope-planning-measurement.md §7.1, §10) que se
 * manda como `prior_bundle` a generate-quarterly-plan al crear el plan siguiente.
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
      final_assessment:  o.final_assessment ?? null,
    })),
    coach_retrospective:   plan.coach_retrospective ?? null,
    athlete_retrospective: plan.athlete_retrospective ?? null,
  };
}
