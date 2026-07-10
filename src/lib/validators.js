/**
 * validators.js — validación de formato para datos de contacto.
 * Solo funciones puras sin side effects.
 */

/**
 * Valida que un string tenga formato de correo electrónico razonable.
 * No implementa el spec completo de RFC 5322 — cubre el caso práctico:
 * algo@algo.algo, sin espacios.
 * @param {string|null|undefined} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Valida que un teléfono tenga al menos 10 dígitos, ignorando espacios,
 * guiones, paréntesis y el signo +. Acepta "+52 55 1234 5678" o
 * "5512345678" por igual — lo que importa es la cantidad de dígitos reales.
 * @param {string|null|undefined} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}
