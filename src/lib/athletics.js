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
/** Escala carácter 1..5 */
export const CHAR_LABEL = {
  1: 'Ausente', 2: 'Inconsistente', 3: 'Por buen camino',
  4: 'Proactivo', 5: 'Consolidado',
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
  return new Date(p).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' });
}
