import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CircleDot, UserPlus, AlertCircle } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();

  const [coaches,  setCoaches]  = useState([]);
  const [step,     setStep]     = useState(1); // 1 = datos personales, 2 = cuenta
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  // Paso 1
  const [nombre,     setNombre]   = useState('');
  const [apellido,   setApellido] = useState('');
  const [fechaNac,   setFechaNac] = useState('');
  const [mano,       setMano]     = useState('');
  const [coachId,    setCoachId]  = useState('');

  // Paso 2
  const [email,      setEmail]    = useState('');
  const [password,   setPass]     = useState('');
  const [passConf,   setPassConf] = useState('');

  useEffect(() => {
    supabase.from('coaches').select('id, nombre, apellido').order('nombre')
      .then(({ data }) => setCoaches(data ?? []));
  }, []);

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !fechaNac || !coachId) {
      setError('Todos los campos son obligatorios.');
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
      const { error: dbErr } = await supabase.from('athletes').insert({
        user_id:          uid,
        coach_id:         coachId,
        nombre:           nombre.trim(),
        apellido:         apellido.trim(),
        fecha_nacimiento: fechaNac,
        mano_dominante:   mano || null,
        fecha_ingreso:    new Date().toISOString().slice(0, 10),
        activo:           true,
      });

      if (dbErr) throw dbErr;

      navigate('/portal/inicio');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
    } finally {
      setSaving(false);
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
          Crea tu cuenta y empieza a construir tu expediente.
        </p>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-[#1B3A2A]">Crear cuenta</h2>
            <span className="text-sm text-gray-400">Paso {step} de 2</span>
          </div>
          <p className="text-gray-500 mb-6">
            {step === 1 ? 'Tus datos personales.' : 'Tu email y contraseña para entrar al portal.'}
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Paso 1: Datos personales ───────────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input value={nombre} onChange={e => setNombre(e.target.value)} required
                         placeholder="Daniela"
                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                  <input value={apellido} onChange={e => setApellido(e.target.value)} required
                         placeholder="López"
                         className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento *</label>
                <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} required
                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mano dominante</label>
                <select value={mano} onChange={e => setMano(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm">
                  <option value="">— seleccionar —</option>
                  <option value="diestro">Diestro</option>
                  <option value="zurdo">Zurdo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu coach *</label>
                <select value={coachId} onChange={e => setCoachId(e.target.value)} required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm">
                  <option value="">— seleccionar —</option>
                  {coaches.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
                  ))}
                </select>
              </div>

              <button type="submit"
                      className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white font-semibold py-2.5 rounded-lg transition-colors">
                Siguiente →
              </button>
            </form>
          )}

          {/* ── Paso 2: Cuenta ────────────────────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                       placeholder="daniela@ejemplo.com"
                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input type="password" value={password} onChange={e => setPass(e.target.value)} required
                       placeholder="Mínimo 8 caracteres"
                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña *</label>
                <input type="password" value={passConf} onChange={e => setPassConf(e.target.value)} required
                       placeholder="Repite tu contraseña"
                       className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A] text-sm" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep(1); setError(''); }}
                        className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  ← Volver
                </button>
                <button type="submit" disabled={saving}
                        className="flex-1 bg-[#1B3A2A] hover:bg-[#2D5A3D] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                  <UserPlus className="w-4 h-4" />
                  {saving ? 'Creando cuenta…' : 'Crear cuenta'}
                </button>
              </div>
            </form>
          )}

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
