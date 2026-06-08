import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const navigate   = useNavigate();
  const { user }   = useAuth();

  useEffect(() => {
    if (!user) return;
    // Coaches → alumnos, todos los demás (atletas o incompletos) → inicio atleta
    navigate(user.rol === 'Coach' ? '/portal/alumnos' : '/portal/inicio', { replace: true });
  }, [user, navigate]);

  return null;
}
