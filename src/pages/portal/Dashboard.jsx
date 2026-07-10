import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Dashboard() {
  const navigate   = useNavigate();
  const { user }   = useAuth();

  useEffect(() => {
    if (!user) return;
    if (user.rol === 'Coach')        navigate('/portal/equipo', { replace: true });
    else if (user.rol === 'Atleta')  navigate('/portal/inicio',    { replace: true });
    else if (user.rol === 'Content') navigate('/portal/contenido', { replace: true });
    else                            navigate('/login',           { replace: true }); // sin perfil → de vuelta al login
  }, [user, navigate]);

  return null;
}
