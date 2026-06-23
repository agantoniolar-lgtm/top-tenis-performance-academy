import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, AlertCircle, Eye, EyeOff } from 'lucide-react';

const INVITE_CODE = import.meta.env.VITE_CONTENT_INVITE_CODE ?? '';

export default function ContentSignup() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);

  const [nombre,   setNombre]   = useState('');
  const [apellido, setApellido] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [passConf, setPassConf] = useState('');
  const [codigo,   setCodigo]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !apellido.trim()) {
      setError('Nombre y apellido son obligatorios.');
      return;
    }
    if (INVITE_CODE && codigo !== INVITE_CODE) {
      setError('Código de acceso incorrecto.');
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
      const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
      if (authErr) throw authErr;

      const uid = authData.user?.id;
      if (!uid) throw new Error('No se pudo crear la cuenta. Intenta de nuevo.');

      const { error: dbErr } = await supabase.from('content_managers').insert({
        user_id:  uid,
        nombre:   nombre.trim(),
        apellido: apellido.trim(),
      });
      if (dbErr) throw dbErr;

      if (!authData.session) {
        navigate('/registro-pendiente');
        return;
      }

      await refreshUser();
      navigate('/portal/contenido');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full border border-[#E0DED8] rounded-[2px] px-4 py-2.5 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513]';
  const labelClass = 'block text-sm font-medium text-[#4A4842] mb-1';

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0E2419] flex-col items-center justify-center text-white p-12">
        <LayoutDashboard className="w-32 h-32 mb-8 text-[#8B4513] opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-center leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}>
          Top Tenis<br />Performance Academy
        </h1>
        <p className="mt-4 text-white/60 text-center text-base max-w-sm">
          Panel de gestión de contenido del sitio web.
        </p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#14110D] mb-1"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}>
            Acceso — Content Manager
          </h2>
          <p className="text-[#8A8780] mb-6 text-sm">
            Necesitas el código de acceso para continuar.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-[2px] px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nombre *</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)}
                       placeholder="Ana" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Apellido *</label>
                <input value={apellido} onChange={e => setApellido(e.target.value)}
                       placeholder="García" required className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="ana@toptenispa.mx" required autoComplete="email"
                     className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Contraseña *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                       onChange={e => setPassword(e.target.value)}
                       placeholder="Mínimo 8 caracteres" required autoComplete="new-password"
                       className={inputClass + ' pr-10'} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8780] hover:text-[#4A4842]"
                        tabIndex={-1}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass}>Confirmar contraseña *</label>
              <input type="password" value={passConf} onChange={e => setPassConf(e.target.value)}
                     placeholder="Repite tu contraseña" required autoComplete="new-password"
                     className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Código de acceso *</label>
              <input type="password" value={codigo} onChange={e => setCodigo(e.target.value)}
                     placeholder="Código proporcionado por la academia" required
                     className={inputClass} />
            </div>

            <button type="submit" disabled={saving}
                    className="w-full disabled:opacity-60 text-white font-semibold py-2.5 rounded-[2px] transition-opacity hover:opacity-90 flex items-center justify-center gap-2 uppercase tracking-[0.08em] text-sm"
                    style={{ background: 'var(--accent)' }}>
              {saving ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8A8780]">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
