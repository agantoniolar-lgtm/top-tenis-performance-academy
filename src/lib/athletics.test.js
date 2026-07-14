import { describe, it, expect } from 'vitest';
import {
  calcCat, calcEdad, isRecruitmentRelevant,
  avg, ocTo5, ocAvgLabel, score5Color, fmtSign, fmtPeriod,
  SCORE5_LABEL, CHAR_LABEL,
} from './athletics.js';

// ─── calcCat ─────────────────────────────────────────────────────────────────

describe('calcCat', () => {
  const year = new Date().getFullYear();
  const dob  = (edad) => `${year - edad}-06-01`;

  it('devuelve 12U para edad ≤ 12', () => {
    expect(calcCat(dob(10))).toBe('12U');
    expect(calcCat(dob(12))).toBe('12U');
  });
  it('devuelve 14U para edad 13–14', () => {
    expect(calcCat(dob(13))).toBe('14U');
    expect(calcCat(dob(14))).toBe('14U');
  });
  it('devuelve 16U para edad 15–16', () => {
    expect(calcCat(dob(15))).toBe('16U');
    expect(calcCat(dob(16))).toBe('16U');
  });
  it('devuelve 18U para edad ≥ 17', () => {
    expect(calcCat(dob(17))).toBe('18U');
    expect(calcCat(dob(20))).toBe('18U');
  });
  it('devuelve — si no hay fecha', () => {
    expect(calcCat(null)).toBe('—');
    expect(calcCat(undefined)).toBe('—');
    expect(calcCat('')).toBe('—');
  });
});

// ─── isRecruitmentRelevant ───────────────────────────────────────────────────

describe('isRecruitmentRelevant', () => {
  const year = new Date().getFullYear();
  const dob  = (edad) => `${year - edad}-06-01`;

  it('false para atletas 12U/14U (muy chicos para reclutamiento)', () => {
    expect(isRecruitmentRelevant(dob(10))).toBe(false);
    expect(isRecruitmentRelevant(dob(14))).toBe(false);
  });
  it('true para atletas 16U/18U', () => {
    expect(isRecruitmentRelevant(dob(15))).toBe(true);
    expect(isRecruitmentRelevant(dob(18))).toBe(true);
  });
  it('false si no hay fecha de nacimiento', () => {
    expect(isRecruitmentRelevant(null)).toBe(false);
    expect(isRecruitmentRelevant(undefined)).toBe(false);
    expect(isRecruitmentRelevant('')).toBe(false);
  });
});

// ─── calcEdad ────────────────────────────────────────────────────────────────

describe('calcEdad', () => {
  const year = new Date().getFullYear();

  it('calcula la edad correctamente', () => {
    // Usar la fecha de hoy exacta N años atrás para que el cumpleaños
    // siempre sea "hoy" y la edad sea exactamente N, sin importar cuándo corre el test.
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    expect(calcEdad(`${year - 15}-${mm}-${dd}`)).toBe(15);
    expect(calcEdad(`${year - 1}-${mm}-${dd}`)).toBe(1);
  });
  it('devuelve null si no hay fecha', () => {
    expect(calcEdad(null)).toBeNull();
    expect(calcEdad('')).toBeNull();
  });
});

// ─── avg ─────────────────────────────────────────────────────────────────────

describe('avg', () => {
  it('calcula el promedio de las claves dadas', () => {
    expect(avg({ a: 1, b: 3 }, ['a', 'b'])).toBe(2);
    expect(avg({ a: -2, b: 2 }, ['a', 'b'])).toBe(0);
  });
  it('ignora claves con null/undefined', () => {
    expect(avg({ a: 4, b: null, c: undefined }, ['a', 'b', 'c'])).toBe(4);
  });
  it('devuelve null si el objeto es null', () => {
    expect(avg(null, ['a'])).toBeNull();
  });
  it('devuelve null si ninguna clave tiene valor numérico', () => {
    expect(avg({ a: null }, ['a'])).toBeNull();
    expect(avg({}, ['a', 'b'])).toBeNull();
  });
  it('ignora claves que no existen en el objeto', () => {
    expect(avg({ serve: 1 }, ['serve', 'forehand'])).toBe(1);
  });
});

// ─── ocTo5 ───────────────────────────────────────────────────────────────────

describe('ocTo5', () => {
  it('mapea correctamente los valores extremos y el centro', () => {
    expect(ocTo5(-2)).toBe(1);
    expect(ocTo5(-1)).toBe(2);
    expect(ocTo5(0)).toBe(3);
    expect(ocTo5(1)).toBe(4);
    expect(ocTo5(2)).toBe(5);
  });
  it('clampea valores fuera del rango', () => {
    expect(ocTo5(-3)).toBe(1);
    expect(ocTo5(3)).toBe(5);
  });
  it('devuelve null si el input es null', () => {
    expect(ocTo5(null)).toBeNull();
    expect(ocTo5(undefined)).toBeNull();
  });
  it('redondea valores decimales', () => {
    expect(ocTo5(0.4)).toBe(3);
    expect(ocTo5(0.6)).toBe(4);
  });
});

// ─── ocAvgLabel ──────────────────────────────────────────────────────────────

describe('ocAvgLabel', () => {
  it('devuelve el label correcto por rango', () => {
    expect(ocAvgLabel(-2)).toBe('Estancado');
    expect(ocAvgLabel(-1)).toBe('Rezagado');
    expect(ocAvgLabel(0)).toBe('Por buen camino');
    expect(ocAvgLabel(1)).toBe('Adelantado');
    expect(ocAvgLabel(2)).toBe('Superado');
  });
  it('devuelve null si el input es null', () => {
    expect(ocAvgLabel(null)).toBeNull();
  });
});

// ─── score5Color ─────────────────────────────────────────────────────────────

describe('score5Color', () => {
  it('devuelve bad para scores ≤ 2', () => {
    expect(score5Color(1)).toBe('var(--bad)');
    expect(score5Color(2)).toBe('var(--bad)');
  });
  it('devuelve ink-mute para score 3', () => {
    expect(score5Color(3)).toBe('var(--ink-mute)');
  });
  it('devuelve good para scores ≥ 4', () => {
    expect(score5Color(4)).toBe('var(--good)');
    expect(score5Color(5)).toBe('var(--good)');
  });
  it('devuelve ink-mute si el valor es null', () => {
    expect(score5Color(null)).toBe('var(--ink-mute)');
    expect(score5Color(undefined)).toBe('var(--ink-mute)');
  });
});

// ─── fmtSign ─────────────────────────────────────────────────────────────────

describe('fmtSign', () => {
  it('agrega + a positivos', () => {
    expect(fmtSign(1)).toBe('+1');
    expect(fmtSign(2)).toBe('+2');
  });
  it('no agrega signo extra a negativos', () => {
    expect(fmtSign(-1)).toBe('-1');
    expect(fmtSign(-2)).toBe('-2');
  });
  it('muestra 0 sin signo', () => {
    expect(fmtSign(0)).toBe('0');
  });
});

// ─── Constantes — smoke tests ────────────────────────────────────────────────

describe('constantes', () => {
  it('SCORE5_LABEL tiene 5 entradas', () => {
    expect(Object.keys(SCORE5_LABEL)).toHaveLength(5);
  });
  it('CHAR_LABEL tiene 5 entradas', () => {
    expect(Object.keys(CHAR_LABEL)).toHaveLength(5);
  });
  it('SCORE5_LABEL y CHAR_LABEL comparten el label del centro', () => {
    expect(SCORE5_LABEL[3]).toBe('Por buen camino');
    expect(CHAR_LABEL[3]).toBe('Por buen camino');
  });
});

describe('fmtPeriod', () => {
  it('devuelve — para null', () => {
    expect(fmtPeriod(null)).toBe('—');
  });
  it('devuelve — para undefined', () => {
    expect(fmtPeriod(undefined)).toBe('—');
  });
  it('muestra el mes correcto sin offset UTC (junio no se convierte en mayo)', () => {
    // '2026-06-01' parseado como UTC midnight = May 31 en UTC-6 → bug anterior
    const result = fmtPeriod('2026-06-01');
    expect(result).toContain('2026');
    expect(result.toLowerCase()).not.toContain('may');
    expect(result.toLowerCase()).toMatch(/jun/);
  });
  it('muestra enero correctamente', () => {
    const result = fmtPeriod('2026-01-01');
    expect(result).toContain('2026');
    expect(result.toLowerCase()).toMatch(/ene/);
  });
});

// ─── fmtPeriodLong ───────────────────────────────────────────────────────────

import { fmtPeriodLong, fmtPeriodRange, minPeriodFor, isPeriodAllowed, normalizeSeries, winLossRecord } from './athletics.js';

describe('fmtPeriodLong', () => {
  it('devuelve — para null', () => {
    expect(fmtPeriodLong(null)).toBe('—');
  });
  it('muestra el mes completo sin offset UTC', () => {
    const result = fmtPeriodLong('2026-06-01');
    expect(result.toLowerCase()).toContain('junio');
    expect(result).toContain('2026');
  });
});

// ─── fmtPeriodRange ──────────────────────────────────────────────────────────

describe('fmtPeriodRange', () => {
  it('devuelve — si falta start', () => {
    expect(fmtPeriodRange(null, '2026-09-30')).toBe('—');
  });
  it('devuelve — si falta end', () => {
    expect(fmtPeriodRange('2026-07-01', null)).toBe('—');
  });
  it('devuelve — si faltan ambos', () => {
    expect(fmtPeriodRange(undefined, undefined)).toBe('—');
  });
  it('formatea un trimestre dentro del mismo año', () => {
    const result = fmtPeriodRange('2026-07-01', '2026-09-30');
    expect(result.toLowerCase()).toMatch(/jul/);
    expect(result.toLowerCase()).toMatch(/sep/);
    expect(result).toContain('2026');
  });
  it('formatea un trimestre que cruza fin de año sin offset UTC', () => {
    // '2026-12-01' y '2027-02-28' no deben deslizarse un día por parseo UTC
    const result = fmtPeriodRange('2026-12-01', '2027-02-28');
    expect(result.toLowerCase()).toMatch(/dic/);
    expect(result.toLowerCase()).toMatch(/feb/);
    expect(result).toContain('2027');
  });
});

// ─── minPeriodFor ────────────────────────────────────────────────────────────

describe('minPeriodFor', () => {
  it('devuelve YYYY-MM del mes de ingreso', () => {
    expect(minPeriodFor('2026-04-20')).toBe('2026-04');
  });
  it('devuelve null si no hay fecha', () => {
    expect(minPeriodFor(null)).toBeNull();
    expect(minPeriodFor(undefined)).toBeNull();
  });
});

// ─── isPeriodAllowed ─────────────────────────────────────────────────────────

describe('isPeriodAllowed', () => {
  it('permite el mismo mes del ingreso (registro el 20-abr → reporte de abril ok)', () => {
    expect(isPeriodAllowed('2026-04-01', '2026-04-20')).toBe(true);
  });
  it('permite meses posteriores', () => {
    expect(isPeriodAllowed('2026-06-01', '2026-04-20')).toBe(true);
  });
  it('bloquea meses anteriores al ingreso', () => {
    expect(isPeriodAllowed('2026-03-01', '2026-04-20')).toBe(false);
  });
  it('sin fecha de ingreso, todo período es válido', () => {
    expect(isPeriodAllowed('2026-01-01', null)).toBe(true);
  });
  it('devuelve false si no hay período', () => {
    expect(isPeriodAllowed(null, '2026-04-20')).toBe(false);
    expect(isPeriodAllowed('', '2026-04-20')).toBe(false);
  });
});

// ─── normalizeSeries ─────────────────────────────────────────────────────────

describe('normalizeSeries', () => {
  it('mapea min→1 y max→5', () => {
    expect(normalizeSeries([8, 10])).toEqual([1, 5]);
  });
  it('interpola valores intermedios', () => {
    expect(normalizeSeries([8, 9, 10])).toEqual([1, 3, 5]);
  });
  it('conserva nulls', () => {
    expect(normalizeSeries([8, null, 10])).toEqual([1, null, 5]);
  });
  it('serie constante devuelve 3', () => {
    expect(normalizeSeries([9.2, 9.2])).toEqual([3, 3]);
  });
  it('serie vacía o solo nulls devuelve nulls', () => {
    expect(normalizeSeries([])).toEqual([]);
    expect(normalizeSeries([null, null])).toEqual([null, null]);
  });
});

// ─── winLossRecord ───────────────────────────────────────────────────────────

describe('winLossRecord', () => {
  it('campeón: gana todos los partidos que jugó', () => {
    expect(winLossRecord([{ victoria: true, partidos_jugados: 5 }]))
      .toEqual({ w: 5, l: 0, total: 1 });
  });
  it('eliminado: gana todos menos el último', () => {
    expect(winLossRecord([{ victoria: false, partidos_jugados: 4 }]))
      .toEqual({ w: 3, l: 1, total: 1 });
  });
  it('suma varios torneos y total cuenta torneos, no partidos', () => {
    expect(winLossRecord([
      { victoria: true,  partidos_jugados: 3 },
      { victoria: false, partidos_jugados: 2 },
    ])).toEqual({ w: 4, l: 1, total: 2 });
  });
  it('fila sin partidos_jugados asume 1 partido', () => {
    expect(winLossRecord([{ victoria: true }, { victoria: false }]))
      .toEqual({ w: 1, l: 1, total: 2 });
  });
  it('eliminado en su único partido: 0-1', () => {
    expect(winLossRecord([{ victoria: false, partidos_jugados: 1 }]))
      .toEqual({ w: 0, l: 1, total: 1 });
  });
  it('ignora filas sin resultado', () => {
    expect(winLossRecord([{ victoria: true, partidos_jugados: 2 }, { victoria: null, partidos_jugados: 3 }]))
      .toEqual({ w: 2, l: 0, total: 1 });
  });
  it('devuelve ceros con null o lista vacía', () => {
    expect(winLossRecord(null)).toEqual({ w: 0, l: 0, total: 0 });
    expect(winLossRecord([])).toEqual({ w: 0, l: 0, total: 0 });
  });
});

// ─── P&M — cierre de plan trimestral ───────────────────────────────────────────

import { formatCoachRetrospective, focosSinOutcome, buildPriorBundle } from './athletics.js';

describe('formatCoachRetrospective', () => {
  it('combina las 3 respuestas con su pregunta', () => {
    const out = formatCoachRetrospective(['A', 'B', 'C']);
    expect(out.split('\n\n')).toHaveLength(3);
    expect(out).toContain('A');
    expect(out).toContain('B');
    expect(out).toContain('C');
  });
  it('omite respuestas vacías o solo espacios', () => {
    const out = formatCoachRetrospective(['A', '', '   ']);
    expect(out.split('\n\n')).toHaveLength(1);
    expect(out).toContain('A');
  });
  it('devuelve null si todas las respuestas están vacías', () => {
    expect(formatCoachRetrospective(['', '', ''])).toBeNull();
  });
  it('devuelve null si el input es null o undefined', () => {
    expect(formatCoachRetrospective(null)).toBeNull();
    expect(formatCoachRetrospective(undefined)).toBeNull();
  });
});

describe('focosSinOutcome', () => {
  it('devuelve solo focos (no mantenimiento) sin outcome', () => {
    const objs = [
      { tipo: 'foco', outcome: 'logrado' },
      { tipo: 'foco', outcome: null },
      { tipo: 'mantenimiento', outcome: null },
    ];
    expect(focosSinOutcome(objs)).toHaveLength(1);
  });
  it('devuelve array vacío si todos los focos ya tienen outcome', () => {
    expect(focosSinOutcome([{ tipo: 'foco', outcome: 'logrado' }])).toEqual([]);
  });
  it('maneja input null o undefined', () => {
    expect(focosSinOutcome(null)).toEqual([]);
    expect(focosSinOutcome(undefined)).toEqual([]);
  });
});

describe('buildPriorBundle', () => {
  it('arma el bundle solo con focos (excluye mantenimiento) y las retrospectivas del plan', () => {
    const plan = { coach_retrospective: 'x', athlete_retrospective: null };
    const objs = [
      { tipo: 'foco', dimension: 'tecnica', sub_dimension: 'forehand', objetivo: 'obj', outcome: 'logrado', final_assessment: 'bien' },
      { tipo: 'mantenimiento', dimension: 'tactica', sub_dimension: 'puntos_clave' },
    ];
    const bundle = buildPriorBundle(plan, objs);
    expect(bundle.prior_focos).toHaveLength(1);
    expect(bundle.prior_focos[0].sub_dimension).toBe('forehand');
    expect(bundle.coach_retrospective).toBe('x');
    expect(bundle.athlete_retrospective).toBeNull();
  });
  it('devuelve null si no hay plan', () => {
    expect(buildPriorBundle(null, [])).toBeNull();
  });
  it('devuelve null si el plan no tiene ningún foco (solo mantenimiento o vacío)', () => {
    expect(buildPriorBundle({}, [{ tipo: 'mantenimiento' }])).toBeNull();
    expect(buildPriorBundle({}, [])).toBeNull();
    expect(buildPriorBundle({}, null)).toBeNull();
  });
});
