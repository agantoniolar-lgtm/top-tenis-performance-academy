import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { calcEdad } from '../../../lib/athletics.js';

const GRADOS = [
  '1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria',
  '1° Secundaria','2° Secundaria','3° Secundaria',
  '1° Preparatoria','2° Preparatoria','3° Preparatoria',
  'Universidad','Otro',
];

export default function AtletaPerfil() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const [fechaNac,  setFechaNac]  = useState('');
  const [mano,      setMano]      = useState('');
  const [tipoReves, setReves]     = useState('');
  const [altura,    setAltura]    = useState('');
  const [peso,      setPeso]      = useState('');
  const [escuela,   setEscuela]   = useState('');
  const [grado,     setGrado]     = useState('');

  // Padre/tutor — solo se pide (y se muestra) si el atleta es menor de edad.
  const [nombrePadre,   setNombrePadre]   = useState('');
  const [telefonoPadre, setTelefonoPadre] = useState('');
  const [emailPadre,    setEmailPadre]    = useState('');

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('athletes')
      .select('fecha_nacimiento, mano_dominante, tipo_reves, altura_cm, peso_kg, escuela, grado_escolar, nombre_padre, telefono_padre, email_padre')
      .eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setFechaNac(data.fecha_nacimiento ?? '');
          setMano(data.mano_dominante ?? '');
          setReves(data.tipo_reves ?? '');
          setAltura(data.altura_cm ?? '');
          setPeso(data.peso_kg ?? '');
          setEscuela(data.escuela ?? '');
          setGrado(data.grado_escolar ?? '');
          setNombrePadre(data.nombre_padre ?? '');
          setTelefonoPadre(data.telefono_padre ?? '');
          setEmailPadre(data.email_padre ?? '');
        }
        setLoading(false);
      });
  }, [user?.id]);

  const edad    = calcEdad(fechaNac);
  const esMenor = edad !== null && edad < 18;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);

    // Filtramos por user_id (mismo campo que usa el RLS USING clause)
    // para garantizar que la política coincide sin ambigüedad
    const { error: dbErr } = await supabase.from('athletes').update({
      fecha_nacimiento: fechaNac || null,
      mano_dominante:   mano || null,
      tipo_reves:       tipoReves || null,
      altura_cm:        altura ? parseInt(altura) : null,
      peso_kg:          peso ? parseFloat(peso) : null,
      escuela:          escuela.trim() || null,
      grado_escolar:    grado || null,
      nombre_padre:     nombrePadre.trim() || null,
      telefono_padre:   telefonoPadre.trim() || null,
      email_padre:      emailPadre.trim() || null,
    }).eq('user_id', user.id);

    setSaving(false);
    if (dbErr) { setError(dbErr.message); return; }
    await refreshUser();
    setSuccess(true);
  };

  if (loading) return <Shell><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></Shell>;

  return (
    <Shell>
      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <button type="button" onClick={() => navigate('/portal/inicio')}
                  className="text-[12px] font-mono hover:underline" style={{ color: 'var(--ink-mute)' }}>
            ← Inicio
          </button>
          <h1 className="font-display font-extrabold text-[24px] leading-none">Mi perfil</h1>
        </div>

        {error   && <p className="text-[12px] text-red-600 mb-4">{error}</p>}
        {success && <p className="text-[12px] mb-4" style={{ color: 'var(--good)' }}>Perfil actualizado.</p>}

        <div className="space-y-5">
          <Field label="Fecha de nacimiento">
            <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} className={inp} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Mano dominante">
              <select value={mano} onChange={e => setMano(e.target.value)} className={inp}>
                <option value="">— seleccionar —</option>
                <option value="diestro">Diestro</option>
                <option value="zurdo">Zurdo</option>
              </select>
            </Field>
            <Field label="Tipo de revés">
              <select value={tipoReves} onChange={e => setReves(e.target.value)} className={inp}>
                <option value="">— seleccionar —</option>
                <option value="una_mano">Una mano</option>
                <option value="dos_manos">Dos manos</option>
              </select>
            </Field>
            <Field label="Altura (cm)">
              <input type="number" min="100" max="220" value={altura} onChange={e => setAltura(e.target.value)} placeholder="168" className={inp} />
            </Field>
            <Field label="Peso (kg)">
              <input type="number" min="30" max="150" step="0.1" value={peso} onChange={e => setPeso(e.target.value)} placeholder="58.5" className={inp} />
            </Field>
          </div>
          <Field label="Escuela">
            <input value={escuela} onChange={e => setEscuela(e.target.value)} placeholder="Colegio Lomas Verdes" className={inp} />
          </Field>
          <Field label="Grado actual">
            <select value={grado} onChange={e => setGrado(e.target.value)} className={inp}>
              <option value="">— seleccionar —</option>
              {GRADOS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
        </div>

        {/* Padre/Tutor — solo para menores de edad. Obligatorio en el label,
            pero non-blocking: guardar el resto del perfil no depende de esto. */}
        {esMenor && (
          <div className="hairline p-4 mt-6" style={{ background: 'var(--cream)' }}>
            <p className="text-[13px] font-semibold mb-1">Padre / Tutor *</p>
            <p className="text-[11px] mb-4" style={{ color: 'var(--ink-mute)' }}>
              Como eres menor de edad, necesitamos el contacto de un padre o tutor.
            </p>
            <div className="space-y-4">
              <Field label="Nombre">
                <input value={nombrePadre} onChange={e => setNombrePadre(e.target.value)}
                       placeholder="Carlos López" className={inp} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Teléfono">
                  <input type="tel" value={telefonoPadre} onChange={e => setTelefonoPadre(e.target.value)}
                         placeholder="+52 55 9876 5432" className={inp} />
                </Field>
                <Field label="Email">
                  <input type="email" value={emailPadre} onChange={e => setEmailPadre(e.target.value)}
                         placeholder="carlos@ejemplo.com" className={inp} />
                </Field>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <button type="submit" disabled={saving}
                  className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-white disabled:opacity-60 hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Shell>
  );
}

const inp = 'w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none';

function Field({ label, children }) {
  return (
    <div>
      <label className="eyebrow !text-[10px] block mb-1.5" style={{ color: 'var(--ink-mute)' }}>{label}</label>
      {children}
    </div>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
