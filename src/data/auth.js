// ============================================================
// Autenticación — Top Tenis Performance Academy
// ============================================================

const STORAGE_KEY = 'ttpa_user';

export const CUENTAS = [
  {
    id: 1,
    email: 'alejandro@toptenispa.mx',
    password: 'admin123',
    nombre: 'Alejandro',
    rol: 'Admin',
  },
  {
    id: 2,
    email: 'marco@toptenispa.mx',
    password: 'coach123',
    nombre: 'Marco Reyes',
    rol: 'Coach',
  },
  {
    id: 3,
    email: 'carlos@toptenispa.mx',
    password: 'alumno123',
    nombre: 'Carlos Mendoza',
    rol: 'Alumno',
  },
  {
    id: 4,
    email: 'sofia@toptenispa.mx',
    password: 'alumno123',
    nombre: 'Sofía Ruiz',
    rol: 'Alumno',
  },
  {
    id: 5,
    email: 'padre@toptenispa.mx',
    password: 'padre123',
    nombre: 'Roberto Mendoza',
    rol: 'Padre',
  },
];

/**
 * Intenta iniciar sesión con email y contraseña.
 * Si las credenciales son válidas, guarda el usuario en localStorage y lo devuelve.
 * Si no, devuelve null.
 */
export function login(email, password) {
  const cuenta = CUENTAS.find(
    (c) => c.email === email && c.password === password,
  );

  if (!cuenta) {
    return null;
  }

  const usuario = {
    id: cuenta.id,
    email: cuenta.email,
    nombre: cuenta.nombre,
    rol: cuenta.rol,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  return usuario;
}

/**
 * Cierra la sesión eliminando los datos de localStorage y redirige a /.
 */
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/';
}

/**
 * Devuelve el usuario actual desde localStorage, o null si no hay sesión.
 */
export function getUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
