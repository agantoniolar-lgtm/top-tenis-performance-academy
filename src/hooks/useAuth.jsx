/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// user shape: { id (auth uid), email, nombre, rol, coach_id | athlete_id }

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Enriquece el auth user con datos del perfil (coaches / athletes)
  async function enrichUser(authUser) {
    if (!authUser) { setUser(null); return; }

    // Intentar como coach primero
    const { data: coach } = await supabase
      .from('coaches')
      .select('id, nombre, apellido')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (coach) {
      setUser({
        id:       authUser.id,
        email:    authUser.email,
        nombre:   `${coach.nombre} ${coach.apellido}`,
        rol:      'Coach',
        coach_id: coach.id,
      });
      return;
    }

    // Intentar como atleta
    const { data: athlete } = await supabase
      .from('athletes')
      .select('id, nombre, apellido')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (athlete) {
      setUser({
        id:         authUser.id,
        email:      authUser.email,
        nombre:     `${athlete.nombre} ${athlete.apellido}`,
        rol:        'Atleta',
        athlete_id: athlete.id,
      });
      return;
    }

    // Fallback: usuario sin perfil conocido
    setUser({ id: authUser.id, email: authUser.email, nombre: authUser.email, rol: 'Desconocido' });
  }

  useEffect(() => {
    // Sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      enrichUser(session?.user ?? null).finally(() => setLoading(false));
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      enrichUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
