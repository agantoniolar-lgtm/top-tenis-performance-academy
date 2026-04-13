import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CUENTAS } from '../../data/auth';
import { CircleDot, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const user = login(email, password);
    if (user) {
      navigate('/portal');
    } else {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
  };

  const autoFill = (cuenta) => {
    setEmail(cuenta.email);
    setPassword(cuenta.password);
    setError('');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left half */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B3A2A] flex-col items-center justify-center text-white p-12">
        <CircleDot className="w-32 h-32 mb-8 text-[#8B4513] opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-center leading-tight">
          Top Tenis<br />Performance Academy
        </h1>
        <p className="mt-4 text-white/60 text-center text-lg max-w-sm">
          Portal de seguimiento integral para jugadores, coaches y familias.
        </p>
      </div>

      {/* Right half */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8 overflow-y-auto">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Entrar al portal
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Cuentas de demostración
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Email</th>
                    <th className="text-left px-3 py-2 font-medium">Contraseña</th>
                    <th className="text-left px-3 py-2 font-medium">Rol</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {CUENTAS.map((cuenta) => (
                    <tr key={cuenta.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{cuenta.email}</td>
                      <td className="px-3 py-2 text-gray-500 font-mono text-xs">{cuenta.password}</td>
                      <td className="px-3 py-2">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[#1B3A2A]/10 text-[#1B3A2A]">
                          {cuenta.rol}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => autoFill(cuenta)}
                          className="text-xs text-[#8B4513] hover:text-[#6B3410] font-medium whitespace-nowrap"
                        >
                          Usar esta cuenta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
