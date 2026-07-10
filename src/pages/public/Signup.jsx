import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { calcEdad } from '../../lib/athletics.js';
import { CircleDot, UserPlus, AlertCircle } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [step,     setStep]     = useState(1); // 1 = datos personales, 2 = cuenta
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  // Paso 1
  const [nombre,          setNombre]   = useState('');
  const [apellido,        setApellido] = useState('');
  const [segundoApellido, setSegApell] = useState('');
  const [fechaNac,        setFechaNac] = useState('');
  const [mano,            setMano]     = useState('');

  // Padre/tutor — solo aplica si el atleta es menor de edad
  const [nombrePadre,    setNombrePadre]    = useState('');
  const [telefonoPadre,  setTelefonoPadre]  = useState('');
  const [emailPadre,     setEmailPadre]     = useState('');

  // Paso 2
  const [email,      setEmail]    = useState('');
  const [password,   setPass]     = useState('');
  const [passConf,   setPassConf] = useState('');

  const edad    = calcEdad(fechaNac);
  const esMenor = edad !== null && edad < 18;

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !fechaNac) {
      setError('Nombre, apellido y fecha de nacimiento son obligatorios.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== passConf) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 8)   { setError('La contraseña debe tener al menos 8 caracteres.'); return; }

    setSaving(true);
    setError('');

    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signUp({ email, password });
      if (authErr) throw authErr;

      const uid = authData.user?.id;
      if (!uid) throw new Error('No se pudo crear la cuenta. Intenta de nuevo.');

      // Si no hay sesión, Supabase requiere confirmación de email.
      // En ese caso pedimos al usuario que confirme antes de continuar.
      if (!authData.session) {
        navigate('/registro-pendiente');
        return;
      }

      // 2. Crear el perfil del atleta vinculado al auth user
      //    Ya no se asigna coach_id al alta — coach_id es nullable, ningún coach
      //    "dueño" del atleta desde el registro (ver docs/scope-coach-atleta-libre.md).
      const { error: dbErr } = await supabase.from('athletes').insert({
        user_id:          uid,
        nombre:           nombre.trim(),
        apellido:         apellido.trim(),
        segundo_apellido: segundoApellido.trim() || null,
        fecha_nacimiento: fechaNac,
        mano_dominante:   mano || null,
        fecha_ingreso:    new Date().toISOString().slice(0, 10),
        nombre_padre:     nombrePadre.trim() || null,
        telefono_padre:   telefonoPadre.trim() || null,
        email_padre:      emailPadre.trim() || null,
        activo:           true,
      });

      if (dbErr) throw dbErr;

      // Re-enriquecer el usuario ahora que el row de athletes existe
      await refreshUser();
      navigate('/portal/inicio');
    } catch (err) {
      // Si auth se creó pero el perfil falló, hacer logout para no quedar en estado roto
      await supabase.auth.signOut().catch(() => {});
      setError(err.message || 'Error al crear la cuenta.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-[#E0DED8] rounded-[2px] px-4 py-2.5 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513]';
  const labelCls = 'block text-sm font-medium text-[#4A4842] mb-1';

  return (
    <div className="flex min-h-screen" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0E2419] flex-col items-center justify-center text-white p-12">
        <CircleDot className="w-32 h-32 mb-8 text-[#8B4513] opacity-80" strokeWidth={1.5} />
        <h1 className="text-4xl font-bold text-center leading-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}>
          Top Tenis<br />Performance Academy
        </h1>
        <p className="mt-4 text-white/60 text-center text-base max-w-sm">
          Crea tu cuenta y empieza a construir tu expediente.
        </p>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-[#14110D]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em' }}>
              Crear cuenta
            </h2>
            <span className="text-sm text-[#8A8780] font-mono">Paso {step} de 2</span>
          </div>
          <p className="text-[#8A8780] mb-6 text-sm">
            {step === 1 ? 'Datos del jugador · Email y contraseña en el paso 2.' : 'Tu email y contraseña para entrar al portal.'}
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-[2px] px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Paso 1: Datos personales ───────────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nombre *</label>
                  <input value={nombre} onChange={e => setNombre(e.target.value)} required
                         placeholder="Daniela" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Primer apellido *</label>
                  <input value={apellido} onChange={e => setApellido(e.target.value)} required
                         placeholder="López" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Segundo apellido</label>
                  <input value={segundoApellido} onChange={e => setSegApell(e.target.value)}
                         placeholder="García" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Fecha de nacimiento *</label>
                <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)}
                       required className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Mano dominante</label>
                <select value={mano} onChange={e => setMano(e.target.value)} className={inputCls}>
                  <option value="">— seleccionar —</option>
                  <option value="diestro">Diestro</option>
                  <option value="zurdo">Zurdo</option>
                </select>
              </div>

              {/* Padre/Tutor — solo para menores de edad. Marcado como obligatorio
                  pero non-blocking: no impide continuar el registro si se deja vacío. */}
              {esMenor && (
                <div className="border border-[#E0DED8] rounded-[2px] p-4 bg-[#FAFAF7]">
                  <p className="text-[13px] font-semibold text-[#14110D] mb-1">Padre / Tutor *</p>
                  <p className="text-[11px] text-[#8A8780] mb-3">
                    Como el jugador es menor de edad, necesitamos el contacto de un padre o tutor.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Nombre</label>
                      <input value={nombrePadre} onChange={e => setNombrePadre(e.target.value)}
                             placeholder="Carlos López" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Teléfono</label>
                        <input type="tel" value={telefonoPadre} onChange={e => setTelefonoPadre(e.target.value)}
                               placeholder="+52 55 9876 5432" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Email</label>
                        <input type="email" value={emailPadre} onChange={e => setEmailPadre(e.target.value)}
                               placeholder="carlos@ejemplo.com" className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit"
                      className="w-full disabled:opacity-60 text-white font-semibold py-2.5 rounded-[2px] transition-opacity hover:opacity-90 uppercase tracking-[0.08em] text-sm"
                      style={{ background: 'var(--accent)' }}>
                Continuar al paso 2 →
              </button>
            </form>
          )}

          {/* ── Paso 2: Cuenta ────────────────────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                       placeholder="daniela@ejemplo.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Contraseña *</label>
                <input type="password" value={password} onChange={e => setPass(e.target.value)} required
                       placeholder="Mínimo 8 caracteres" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Confirmar contraseña *</label>
                <input type="password" value={passConf} onChange={e => setPassConf(e.target.value)} required
                       placeholder="Repite tu contraseña" className={inputCls} />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(1); setError(''); }}
                        className="flex-1 border border-[#E0DED8] text-[#4A4842] font-semibold py-2.5 rounded-[2px] hover:bg-[#FAFAF7] transition-colors text-sm">
                  ← Volver
                </button>
                <button type="submit" disabled={saving}
                        className="flex-1 disabled:opacity-60 text-white font-semibold py-2.5 rounded-[2px] transition-opacity hover:opacity-90 flex items-center justify-center gap-2 uppercase tracking-[0.08em] text-sm"
                        style={{ background: 'var(--accent)' }}>
                  <UserPlus className="w-4 h-4" />
                  {saving ? 'Creando…' : 'Crear cuenta'}
                </button>
              </div>
            </form>
          )}

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
