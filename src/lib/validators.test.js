import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone } from './validators.js';

// ─── isValidEmail ──────────────────────────────────────────────────────────

describe('isValidEmail', () => {
  it('acepta correos con formato válido', () => {
    expect(isValidEmail('daniela@ejemplo.com')).toBe(true);
    expect(isValidEmail('carlos.lopez@toptenispa.mx')).toBe(true);
  });
  it('recorta espacios antes de validar', () => {
    expect(isValidEmail('  daniela@ejemplo.com  ')).toBe(true);
  });
  it('rechaza correos sin @', () => {
    expect(isValidEmail('daniela.ejemplo.com')).toBe(false);
  });
  it('rechaza correos sin dominio con punto', () => {
    expect(isValidEmail('daniela@ejemplo')).toBe(false);
  });
  it('rechaza correos con espacios internos', () => {
    expect(isValidEmail('daniela @ejemplo.com')).toBe(false);
  });
  it('rechaza vacío/null/undefined', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
  });
});

// ─── isValidPhone ──────────────────────────────────────────────────────────

describe('isValidPhone', () => {
  it('acepta 10 dígitos exactos', () => {
    expect(isValidPhone('5512345678')).toBe(true);
  });
  it('acepta con formato (espacios, +, guiones, paréntesis)', () => {
    expect(isValidPhone('+52 55 1234 5678')).toBe(true);
    expect(isValidPhone('(55) 1234-5678')).toBe(true);
  });
  it('rechaza menos de 10 dígitos', () => {
    expect(isValidPhone('551234567')).toBe(false); // 9 dígitos
    expect(isValidPhone('12345')).toBe(false);
  });
  it('rechaza vacío/null/undefined', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone(null)).toBe(false);
    expect(isValidPhone(undefined)).toBe(false);
  });
});
