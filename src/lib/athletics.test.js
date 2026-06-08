import { describe, it, expect } from 'vitest';
import {
  calcCat, calcEdad,
  avg, ocTo5, ocAvgLabel, score5Color, fmtSign,
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

// ─── calcEdad ────────────────────────────────────────────────────────────────

describe('calcEdad', () => {
  const year = new Date().getFullYear();

  it('calcula la edad correctamente', () => {
    expect(calcEdad(`${year - 15}-01-01`)).toBe(15);
    expect(calcEdad(`${year - 1}-01-01`)).toBe(1);
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
