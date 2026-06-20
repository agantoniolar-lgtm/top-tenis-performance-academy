import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { CircleDot, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';

// El código de invitación se configura en .env.local (VITE_COACH_INVITE_CODE).
// En Vercel, agregarlo en Settings → Environment Variables.
const INVITE_CODE = import.meta.env.VITE_COACH_INVITE_CODE ?? '';

export default function CoachSignup() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [saving,      setSaving]    = useState(false);
  const [error,       setError]     = useState('');
  const [showPass,    setShowPass]  = useState(false);

  const [nombre,      setNombre]    = useState('');
  const [apellido,    setApellido]  = useState('');
  const [email,       setEmail]     = useState('');
  const [password,    setPassword]  = useState('');
  const [passConf,    setPassConf]  = useState('');
  const [codigo,      setCodigo]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !apellido.trim()) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }
    if (INVITE_CODE && codigo !== INVITE_CODE) {
      setError('Código de invitación incorrecto.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== passConf) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSaving(true);

    try {
      // 1. Crear cuenta en Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
      if (authErr) throw authErr;

      const uid = authData.user?.id;
      if (!uid) throw new Error('No se pudo crear la cuenta. Intenta de nuevo.');

      // Si Supabase requiere confirmación de email, no habrá sesión activa todavía.
      // En ese caso creamos el row de coaches con user_id y pedimos que confirmen.
      const { error: dbErr } = await supabase.from('coaches').insert({
        user_id:  uid,
        nombre:   nombre.trim(),
        apellido: apellido.trim(),
      });
      if (dbErr) throw dbErr;

      if (!authData.session) {
        // Email no confirmado todavía — redirigir a pantalla de espera
        navigate('/registro-pendiente');
        return;
      }

      await refreshUser();
      navigate('/portal/alumnos');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1B3A2A] flex-col items-center justify-center text-white p-12">
        <CircleDot className="w-32 h-32 mb-8 text-[#8B4513] opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-center leading-tight">
          Top Tenis<br />Performance Academy
        </h1>
        <p className="mt-4 text-white/60 text-center text-lg max-w-sm">
          Acceso para coaches al portal de seguimiento.
        </p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#1B3A2A] mb-1">Crear cuenta de coach</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Necesitas un código de invitación para registrarte.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nombre *</label>
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Carlos"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Apellido *</label>
                <input
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  placeholder="Martínez"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="carlos@toptenispa.mx"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Contraseña *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  autoComplete="new-password"
                  className={inputClass + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirmar contraseña *</label>
              <input
                type="password"
                value={passConf}
                onChange={e => setPassConf(e.target.value)}
                placeholder="Repite tu contraseña"
                required
                autoComplete="new-password"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Código de invitación *</label>
              <input
                type="password"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                placeholder="Código proporcionado por la academia"
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {saving ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#8B4513] font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
