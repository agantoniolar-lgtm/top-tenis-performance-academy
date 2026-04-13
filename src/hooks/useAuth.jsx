import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { login as authLogin, logout as authLogout, getUser } from '../data/auth';

const AuthContext = createContext(null);

/**
 * Proveedor de autenticación para Top Tenis Performance Academy.
 * Envuelve la aplicación y provee el contexto de autenticación.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuario = getUser();
    if (usuario) {
      setUser(usuario);
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password) => {
    const usuario = authLogin(email, password);
    if (usuario) {
      setUser(usuario);
    }
    return usuario;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    authLogout();
  }, []);

  const value = {
    user,
    isAuthenticated: user !== null,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook de autenticación. Debe usarse dentro de un AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
