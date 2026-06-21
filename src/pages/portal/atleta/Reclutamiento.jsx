import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { calcEdad } from '../../../lib/athletics.js';

const DIVISIONS   = ['D1','D2','D3','NAIA','NJCAA'];
const ENG_LEVELS  = ['A1 – Básico','A2','B1','B2 – Intermedio','C1','C2 – Avanzado'];
const GRAD_YEARS  = ['2025','2026','2027','2028','2029','2030'];
const STUDY_AREAS = ['Business / Administración','Ingeniería','Ciencias del Deporte','Comunicación','Psicología','Ciencias de la Salud','Otro'];

export default function AtletaReclutamiento() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState(false);
  const [atletaEdad, setAtletaEdad] = useState(null);

  const [division,   setDiv]  = useState('');
  const [gradYear,   setGrad] = useState('');
  const [gpa,        setGpa]  = useState('');
  const [english,    setEng]  = useState('');
  const [studyArea,  setSA]   = useState('');

  useEffect(() => {
    if (!user?.athlete_id) return;
    Promise.all([
      supabase.from('athlete_recruitment_profile')
        .select('*').eq('athlete_id', user.athlete_id).maybeSingle(),
      supabase.from('athletes')
        .select('fecha_nacimiento').eq('user_id', user.id).single(),
    ]).then(([recRes, athRes]) => {
      const data = recRes.data;
      if (data) {
        setDiv(data.division_objetivo ?? '');
        setGrad(data.grad_year ?? '');
        setGpa(data.gpa ?? '');
        setEng(data.english_level ?? '');
        setSA(data.study_area ?? '');
      }
      setAtletaEdad(calcEdad(athRes.data?.fecha_nacimiento));
      setLoading(false);
    });
  }, [user?.athlete_id, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess(false);

    const payload = {
      athlete_id:        user.athlete_id,
      division_objetivo: division || null,
      grad_year:         gradYear || null,
      gpa:               gpa ? parseFloat(gpa) : null,
      english_level:     english || null,
      study_area:        studyArea || null,
    };

    const { error: dbErr } = await supabase
      .from('athlete_recruitment_profile')
      .upsert(payload, { onConflict: 'athlete_id' });

    setSaving(false);
    if (dbErr) { setError(dbErr.message); return; }
    setSuccess(true);
  };

  if (loading) return <Shell><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></Shell>;

  // GPA, inglés y área de estudio solo aplican a partir de los 17 años
  const showAdvanced = atletaEdad == null || atletaEdad >= 17;

  return (
    <Shell>
      <form onSubmit={handleSubmit} className="max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <button type="button" onClick={() => navigate('/portal/inicio')}
                  className="text-[12px] font-mono hover:underline" style={{ color: 'var(--ink-mute)' }}>
            ← Inicio
          </button>
          <h1 className="font-display font-extrabold text-[24px] leading-none">Perfil de reclutamiento</h1>
        </div>
        <p className="text-[12px] mb-6" style={{ color: 'var(--ink-mute)' }}>
          Solo visible para ti y los recruiters. Tu coach no ve esta información.
        </p>

        {error   && <p className="text-[12px] text-red-600 mb-4">{error}</p>}
        {success && <p className="text-[12px] mb-4" style={{ color: 'var(--good)' }}>Perfil guardado.</p>}

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="División objetivo">
              <select value={division} onChange={e => setDiv(e.target.value)} className={inp}>
                <option value="">— seleccionar —</option>
                {DIVISIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Graduación esperada">
              <select value={gradYear} onChange={e => setGrad(e.target.value)} className={inp}>
                <option value="">— año —</option>
                {GRAD_YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </Field>
          </div>
          {showAdvanced ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="GPA (promedio académico)">
                  <input type="number" min="0" max="10" step="0.1" value={gpa}
                         onChange={e => setGpa(e.target.value)} placeholder="ej. 8.5" className={inp} />
                </Field>
                <Field label="Nivel de inglés">
                  <select value={english} onChange={e => setEng(e.target.value)} className={inp}>
                    <option value="">— seleccionar —</option>
                    {ENG_LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Área de estudio de interés">
                <select value={studyArea} onChange={e => setSA(e.target.value)} className={inp}>
                  <option value="">— seleccionar —</option>
                  {STUDY_AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </Field>
            </>
          ) : (
            <p className="text-[11px] p-3 hairline" style={{ color: 'var(--ink-mute)', background: 'var(--cream)' }}>
              GPA, nivel de inglés y área de estudio estarán disponibles a partir de los 17 años.
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button type="submit" disabled={saving}
                  className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-wide text-white disabled:opacity-60 hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
            {saving ? 'Guardando…' : 'Guardar'}
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
  return <div className="flex-1 p-4 md:p-8 portal-layout">{children}</div>;
}
