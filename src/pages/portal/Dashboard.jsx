import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dashboard redirige al listado de atletas (el home real del portal es Atletas)
export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/portal/alumnos', { replace: true }); }, [navigate]);
  return null;
}
