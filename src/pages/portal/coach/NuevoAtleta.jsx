import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

const GRADOS = [
  '1° Primaria','2° Primaria','3° Primaria','4° Primaria','5° Primaria','6° Primaria',
  '1° Secundaria','2° Secundaria','3° Secundaria',
  '1° Preparatoria','2° Preparatoria','3° Preparatoria',
  'Universidad','Otro',
];

export default function NuevoAtleta() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [saving,   setSav] = useState(false);
  const [error,    setErr] = useState(null);

  // Identity
  const [nombre,         setNombre]    = useState('');
  const [apellido,       setApellido]  = useState('');
  const [segundoApellido, setSegApell] = useState('');
  const [fechaNac,       setFechaNac]  = useState('');
  const [mano,           setMano]      = useState('');
  const [tipoReves,      setReves]     = useState('');
  // Physical
  const [altura,         setAltura]    = useState('');
  const [peso,           setPeso]      = useState('');
  // Contact
  const [email,          setEmail]     = useState('');
  const [telefono,       setTel]       = useState('');
  // Family
  const [nombrePadre,    setNPadre]    = useState('');
  const [emailPadre,     setEPadre]    = useState('');
  const [telefonoPadre,  setTPadre]    = useState('');
  // Academic
  const [escuela,        setEscuela]   = useState('');
  const [grado,          setGrado]     = useState('');
  // Academy
  const [fechaIngreso,   setIngreso]   = useState(() => new Date().toISOString().slice(0, 10));
  const [utr,            setUtr]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !apellido.trim() || !fechaNac) {
      setErr('Nombre, apellido y fecha de nacimiento son obligatorios.');
      return;
    }
    if (!user?.coach_id) {
      setErr('No se encontró el coach_id del usuario.');
      return;
    }

    setSav(true);
    setErr(null);

    const { data, error: dbErr } = await supabase
      .from('athletes')
      .insert({
        coach_id:       user.coach_id,
        nombre:          nombre.trim(),
        apellido:        apellido.trim(),
        segundo_apellido: segundoApellido.trim() || null,
        fecha_nacimiento: fechaNac,
        mano_dominante: mano || null,
        tipo_reves:     tipoReves || null,
        altura_cm:      altura ? parseInt(altura) : null,
        peso_kg:        peso ? parseFloat(peso) : null,
        email:          email.trim() || null,
        telefono:       telefono.trim() || null,
        nombre_padre:   nombrePadre.trim() || null,
        email_padre:    emailPadre.trim() || null,
        telefono_padre: telefonoPadre.trim() || null,
        escuela:        escuela.trim() || null,
        grado_escolar:  grado || null,
        fecha_ingreso:  fechaIngreso || null,
        utr_actual:     utr ? parseFloat(utr) : null,
        activo:         true,
      })
      .select('id')
      .single();

    setSav(false);

    if (dbErr) { setErr(dbErr.message); return; }
    navigate(`/portal/alumnos/${data.id}`);
  };

  return (
    <Shell>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h1 className="font-display font-extrabold text-[28px] leading-none mb-1">Nuevo atleta</h1>
        <p className="text-[12px] mb-8" style={{ color: 'var(--ink-mute)' }}>
          El perfil de reclutamiento (división objetivo, GPA, etc.) lo completa el atleta después.
        </p>

        {error && (
          <div className="p-3 mb-6 text-[12px] text-red-700 hairline" style={{ background: 'rgba(220,38,38,.06)' }}>
            {error}
          </div>
        )}

        {/* ── Identidad ──────────────────────────────────────────────────── */}
        <SectionHeader label="Identidad" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Nombre *">
            <input value={nombre} onChange={e => setNombre(e.target.value)} required
                   placeholder="Daniela" className={input} />
          </Field>
          <Field label="Primer apellido *">
            <input value={apellido} onChange={e => setApellido(e.target.value)} required
                   placeholder="López" className={input} />
          </Field>
          <Field label="Segundo apellido">
            <input value={segundoApellido} onChange={e => setSegApell(e.target.value)}
                   placeholder="García" className={input} />
          </Field>
          <Field label="Fecha de nacimiento *">
            <input type="date" value={fechaNac} onChange={e => setFechaNac(e.target.value)} required
                   className={input} />
          </Field>
          <Field label="Mano dominante">
            <select value={mano} onChange={e => setMano(e.target.value)} className={input}>
              <option value="">— seleccionar —</option>
              <option value="diestro">Diestro</option>
              <option value="zurdo">Zurdo</option>
            </select>
          </Field>
          <Field label="Tipo de revés">
            <select value={tipoReves} onChange={e => setReves(e.target.value)} className={input}>
              <option value="">— seleccionar —</option>
              <option value="una_mano">Una mano</option>
              <option value="dos_manos">Dos manos</option>
            </select>
          </Field>
        </div>

        {/* ── Físico ─────────────────────────────────────────────────────── */}
        <SectionHeader label="Datos físicos" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Altura (cm)">
            <input type="number" min="100" max="220" value={altura} onChange={e => setAltura(e.target.value)}
                   placeholder="168" className={input} />
          </Field>
          <Field label="Peso (kg)">
            <input type="number" min="30" max="150" step="0.1" value={peso} onChange={e => setPeso(e.target.value)}
                   placeholder="58.5" className={input} />
          </Field>
        </div>

        {/* ── Contacto ───────────────────────────────────────────────────── */}
        <SectionHeader label="Contacto del atleta" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Email">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                   placeholder="daniela@ejemplo.com" className={input} />
          </Field>
          <Field label="Teléfono">
            <input type="tel" value={telefono} onChange={e => setTel(e.target.value)}
                   placeholder="+52 55 1234 5678" className={input} />
          </Field>
        </div>

        {/* ── Familia ────────────────────────────────────────────────────── */}
        <SectionHeader label="Padre / Tutor" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Nombre">
            <input value={nombrePadre} onChange={e => setNPadre(e.target.value)}
                   placeholder="Carlos López" className={input} />
          </Field>
          <Field label="Teléfono">
            <input type="tel" value={telefonoPadre} onChange={e => setTPadre(e.target.value)}
                   placeholder="+52 55 9876 5432" className={input} />
          </Field>
          <Field label="Email" wide>
            <input type="email" value={emailPadre} onChange={e => setEPadre(e.target.value)}
                   placeholder="carlos@ejemplo.com" className={input} />
          </Field>
        </div>

        {/* ── Académico ──────────────────────────────────────────────────── */}
        <SectionHeader label="Académico" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Escuela">
            <input value={escuela} onChange={e => setEscuela(e.target.value)}
                   placeholder="Colegio Lomas Verdes" className={input} />
          </Field>
          <Field label="Grado actual">
            <select value={grado} onChange={e => setGrado(e.target.value)} className={input}>
              <option value="">— seleccionar —</option>
              {GRADOS.map(g => <option key={g}>{g}</option>)}
            </select>
          </Field>
        </div>

        {/* ── Academia ───────────────────────────────────────────────────── */}
        <SectionHeader label="Academia" />
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Field label="Fecha de ingreso">
            <input type="date" value={fechaIngreso} onChange={e => setIngreso(e.target.value)}
                   className={input} />
          </Field>
          <Field label="UTR inicial (si se conoce)">
            <input type="number" step="0.01" min="1" max="16" value={utr} onChange={e => setUtr(e.target.value)}
                   placeholder="ej. 7.4" className={input} />
          </Field>
        </div>

        {/* ── Submit ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
                  className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60 hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
            {saving ? 'Guardando…' : 'Crear atleta'}
          </button>
          <button type="button" onClick={() => navigate('/portal/alumnos')}
                  className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] hairline hover:bg-[var(--cream)] transition">
            Cancelar
          </button>
        </div>
      </form>
    </Shell>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const input = 'w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none';

function SectionHeader({ label }) {
  return (
    <p className="eyebrow !text-[10px] mb-3 pb-2 hairline-b" style={{ color: 'var(--ink-mute)' }}>
      {label}
    </p>
  );
}

function Field({ label, children, wide }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <label className="eyebrow !text-[10px] block mb-1.5" style={{ color: 'var(--ink-mute)' }}>{label}</label>
      {children}
    </div>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
