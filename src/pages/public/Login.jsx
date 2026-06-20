import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { CircleDot, LogIn, AlertCircle } from 'lucide-react';

const DEMO = { email: 'marco@toptenispa.mx', password: 'coach123', rol: 'Coach' };

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      const uid = data?.user?.id;

      // Redirect por rol: coach → /portal/alumnos, atleta → /portal/inicio
      const { data: coach } = await supabase.from('coaches').select('id').eq('user_id', uid).maybeSingle();
      navigate(coach ? '/portal/alumnos' : '/portal/inicio');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B3A2A] flex-col items-center justify-center text-white p-12">
        <CircleDot className="w-32 h-32 mb-8 text-[#8B4513] opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-center leading-tight">
          Top Tenis<br />Performance Academy
        </h1>
        <p className="mt-4 text-white/60 text-center text-lg max-w-sm">
          Portal de seguimiento integral para jugadores, coaches y familias.
        </p>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#1B3A2A] mb-1">Iniciar sesión</h2>
          <p className="text-gray-500 mb-6">Ingresa tus credenciales para acceder al portal.</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onInput={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onInput={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Entrando…' : 'Entrar al portal'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center text-sm text-gray-500">
            <p>
              ¿Eres atleta nuevo?{' '}
              <Link to="/registro" className="text-[#8B4513] font-medium hover:underline">
                Crea tu cuenta
              </Link>
            </p>
            <p>
              ¿Eres coach?{' '}
              <Link to="/registro-coach" className="text-[#8B4513] font-medium hover:underline">
                Acceso de coaches
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
