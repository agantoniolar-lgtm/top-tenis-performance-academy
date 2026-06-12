import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { TACTIC_DESCS } from '../../../lib/athletics.js';

// ─── Field definitions ────────────────────────────────────────────────────────

const TECH = [
  { key: 'serve',      label: 'Saque' },
  { key: 'forehand',   label: 'Derecha' },
  { key: 'backhand',   label: 'Revés' },
  { key: 'volea',      label: 'Volea' },
  { key: 'devolucion', label: 'Devolución' },
  { key: 'footwork',   label: 'Movimiento' },
];
const TAC = [
  { key: 'seleccion_golpe',       label: 'Selección de golpe' },
  { key: 'manejo_riesgo',         label: 'Manejo de riesgo' },
  { key: 'puntos_clave',          label: 'Puntos clave' },
  { key: 'adaptacion_tactica',    label: 'Adaptación táctica' },
  { key: 'transferencia_partido', label: 'Transferencia al partido' },
].map(t => ({ ...t, desc: TACTIC_DESCS[t.key] }));
const PHYS = [
  { key: 'velocidad',           label: 'Velocidad' },
  { key: 'resistencia',         label: 'Resistencia' },
  { key: 'potencia',            label: 'Potencia' },
  { key: 'agilidad',            label: 'Agilidad' },
  { key: 'movilidad',           label: 'Movilidad' },
  { key: 'fuerza_tren_inferior', label: 'Fuerza tren inferior' },
  { key: 'fuerza_tren_superior', label: 'Fuerza tren superior' },
];
const CHAR = [
  { key: 'etica_trabajo', label: 'Ética de trabajo' },
  { key: 'coachabilidad', label: 'Coachabilidad' },
  { key: 'liderazgo',     label: 'Liderazgo' },
];

const TABS = [
  { id: 'oncourt',   label: 'On-court' },
  { id: 'physical',  label: 'Physical' },
  { id: 'character', label: 'Carácter' },
];

// on-court fields: -2 to +2 (same as coach's report_on_court)
// physical + character fields: 1 to 5
const defScores = (fields, def) => Object.fromEntries(fields.map(f => [f.key, def]));

function labelPeriod(dateStr) {
  const [y, m] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, 1)
    .toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AthleteVoice() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [params]   = useSearchParams();

  const [period, setPeriod] = useState(() => {
    const p = params.get('period');
    if (p) return p;
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  // B9: períodos con reporte del coach y estado del athlete voice de cada uno
  const [available, setAvail] = useState([]);

  const [tab,      setTab]    = useState('oncourt');
  const [reportId, setRid]    = useState(null);
  const [noReport, setNone]   = useState(false);
  const [loading,  setLoad]   = useState(true);
  const [saving,   setSav]    = useState(false);
  const [error,    setErr]    = useState(null);
  const [done,     setDone]   = useState(false);
  const [saved,    setSaved]  = useState({ oncourt: false, physical: false, character: false });

  const [tech,      setTech]  = useState(defScores(TECH, 0));
  const [tac,       setTac]   = useState(defScores(TAC, 0));
  const [phys,      setPhys]  = useState(defScores(PHYS, 0));
  const [char_,     setChar]  = useState(defScores(CHAR, 0));
  const [reflexion, setRef]   = useState('');

  // ── B9: lista de períodos con reporte del coach ───────────────────────────
  useEffect(() => {
    if (!user?.athlete_id) return;
    supabase
      .from('reports')
      .select('period, report_athlete_voice(completed_at)')
      .eq('athlete_id', user.athlete_id)
      .order('period', { ascending: false })
      .then(({ data }) => {
        const list = (data ?? []).map(r => {
          const av = Array.isArray(r.report_athlete_voice) ? r.report_athlete_voice[0] : r.report_athlete_voice;
          return { period: r.period, done: !!av?.completed_at };
        });
        setAvail(list);
        // Sin ?period en la URL, abrir el período más reciente con reporte
        if (!params.get('period') && list.length > 0) setPeriod(list[0].period);
      });
  }, [user?.athlete_id, params]);

  // ── Load report + pre-fill if already submitted ───────────────────────────
  useEffect(() => {
    if (!user?.athlete_id) return;
    // Reset al cambiar de período
    setLoad(true); setNone(false); setErr(null); setRid(null); setDone(false);
    setTech(defScores(TECH, 0)); setTac(defScores(TAC, 0));
    setPhys(defScores(PHYS, 0)); setChar(defScores(CHAR, 0)); setRef('');
    setSaved({ oncourt: false, physical: false, character: false });
    setTab('oncourt');
    supabase
      .from('reports')
      .select(`
        id,
        report_athlete_voice (
          serve, forehand, backhand, volea, devolucion, footwork,
          seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido,
          velocidad, resistencia, potencia, agilidad, movilidad,
          fuerza_tren_inferior, fuerza_tren_superior,
          etica_trabajo, coachabilidad, liderazgo, reflexion_mes, completed_at
        )
      `)
      .eq('athlete_id', user.athlete_id)
      .eq('period', period)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setNone(true); setLoad(false); return; }
        setRid(data.id);
        const av = Array.isArray(data.report_athlete_voice)
          ? data.report_athlete_voice[0]
          : data.report_athlete_voice;
        if (av) {
          setTech({ serve: av.serve ?? 0, forehand: av.forehand ?? 0, backhand: av.backhand ?? 0,
                    volea: av.volea ?? 0, devolucion: av.devolucion ?? 0, footwork: av.footwork ?? 0 });
          setTac({ seleccion_golpe: av.seleccion_golpe ?? 0, manejo_riesgo: av.manejo_riesgo ?? 0,
                   puntos_clave: av.puntos_clave ?? 0, adaptacion_tactica: av.adaptacion_tactica ?? 0,
                   transferencia_partido: av.transferencia_partido ?? 0 });
          setPhys({ velocidad: av.velocidad ?? 0, resistencia: av.resistencia ?? 0,
                    potencia: av.potencia ?? 0, agilidad: av.agilidad ?? 0,
                    movilidad: av.movilidad ?? 0, fuerza_tren_inferior: av.fuerza_tren_inferior ?? 0,
                    fuerza_tren_superior: av.fuerza_tren_superior ?? 0 });
          setChar({ etica_trabajo: av.etica_trabajo ?? 0, coachabilidad: av.coachabilidad ?? 0,
                    liderazgo: av.liderazgo ?? 0 });
          setRef(av.reflexion_mes ?? '');
          if (av.completed_at) setSaved({ oncourt: true, physical: true, character: true });
        }
        setLoad(false);
      });
  }, [user?.athlete_id, period]);

  // ── Save handlers ─────────────────────────────────────────────────────────
  const saveOnCourt = async () => {
    setSav(true); setErr(null);
    try {
      const { error: e } = await supabase.from('report_athlete_voice')
        .upsert({ report_id: reportId, ...tech, ...tac }, { onConflict: 'report_id' });
      if (e) throw e;
      setSaved(s => ({ ...s, oncourt: true }));
      setTab('physical');
    } catch (e) { setErr(e.message); }
    finally { setSav(false); }
  };

  const savePhysical = async () => {
    setSav(true); setErr(null);
    try {
      const { error: e } = await supabase.from('report_athlete_voice')
        .upsert({ report_id: reportId, ...phys }, { onConflict: 'report_id' });
      if (e) throw e;
      setSaved(s => ({ ...s, physical: true }));
      setTab('character');
    } catch (e) { setErr(e.message); }
    finally { setSav(false); }
  };

  const saveCharacter = async () => {
    setSav(true); setErr(null);
    try {
      const { error: e } = await supabase.from('report_athlete_voice')
        .upsert({
          report_id: reportId, ...char_,
          reflexion_mes: reflexion || null,
          completed_at: new Date().toISOString(),
          completed_by: user.id,
        }, { onConflict: 'report_id' });
      if (e) throw e;
      setSaved(s => ({ ...s, character: true }));
      setDone(true);
    } catch (e) { setErr(e.message); }
    finally { setSav(false); }
  };

  // ── States ────────────────────────────────────────────────────────────────
  if (loading) return <Shell><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></Shell>;

  if (noReport) return (
    <Shell>
      <div className="max-w-md py-16">
        <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>
          {labelPeriod(period)}
        </p>
        <h2 className="font-display font-extrabold text-[22px] mb-2">Sin reporte este período</h2>
        <p className="text-[13px] mb-6" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
          Tu coach aún no ha creado un reporte para este período. Cuando lo haga, podrás agregar tu perspectiva aquí.
        </p>
        {available.length > 0 && (
          <div className="mb-6">
            <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>Períodos disponibles</p>
            <PeriodPicker available={available} period={period} onSelect={setPeriod} />
          </div>
        )}
        <button onClick={() => navigate('/portal/inicio')}
                className="text-[11px] font-semibold uppercase tracking-wide hairline px-4 py-2 hover:bg-[var(--cream)] transition">
          ← Volver
        </button>
      </div>
    </Shell>
  );

  if (done) return (
    <Shell>
      <div className="max-w-md text-center py-20">
        <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
             style={{ background: 'rgba(22,163,74,.12)', color: 'var(--good)' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l5 5L20 7"/>
          </svg>
        </div>
        <h2 className="font-display font-extrabold text-[24px] mb-2">¡Athlete Voice enviado!</h2>
        <p className="text-[13px] mb-1" style={{ color: 'var(--ink-mute)' }}>
          {labelPeriod(period)}
        </p>
        <p className="text-[13px] mb-6" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
          Tu perspectiva quedó registrada. Tu coach puede verla al revisar tu expediente.
        </p>
        <button onClick={() => navigate('/portal/inicio')}
                className="px-5 py-2 text-[12px] font-semibold uppercase tracking-wide text-white hover:opacity-90 transition"
                style={{ background: 'var(--accent)' }}>
          Volver al inicio
        </button>
      </div>
    </Shell>
  );

  return (
    <Shell>
      <div className="max-w-2xl">
        <div className="mb-6">
          <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>
            Athlete Voice · {labelPeriod(period)}
          </p>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Tu perspectiva</h1>
          <p className="text-[12px] mt-1" style={{ color: 'var(--ink-mute)' }}>
            ¿Cómo te sentiste este período? Evalúa tu propio juego — tu coach verá esto junto con su evaluación.
          </p>
          {available.length > 1 && (
            <div className="mt-3">
              <PeriodPicker available={available} period={period} onSelect={setPeriod} />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 hairline-b mb-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-4 py-3 text-[11px] uppercase tracking-[0.1em] font-semibold relative transition ${
                      tab === t.id ? 'text-[var(--ink)]' : 'text-[var(--ink-mute)] hover:text-[var(--ink)]'
                    }`}>
              {t.label}
              {saved[t.id] && (
                <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--good)', verticalAlign: 'middle' }} />
              )}
              {tab === t.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px]"
                     style={{ background: 'var(--accent)' }} />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 mb-4 text-[12px] text-red-700 hairline"
               style={{ background: 'rgba(220,38,38,.06)' }}>
            {error}
          </div>
        )}

        {/* On-court */}
        {tab === 'oncourt' && (
          <div className="space-y-6">
            <div>
              <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>Técnica</p>
              <ScaleLegend />
              <div className="space-y-3 mt-3">
                {TECH.map(f => (
                  <ScoreRow key={f.key} label={f.label} value={tech[f.key]}
                            onChange={v => setTech(p => ({ ...p, [f.key]: v }))}
                            values={[-2, -1, 0, 1, 2]} />
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>Táctica</p>
              <div className="space-y-3">
                {TAC.map(f => (
                  <ScoreRow key={f.key} label={f.label} desc={f.desc} value={tac[f.key]}
                            onChange={v => setTac(p => ({ ...p, [f.key]: v }))}
                            values={[-2, -1, 0, 1, 2]} />
                ))}
              </div>
            </div>
            <SaveBtn onClick={saveOnCourt} saving={saving} label="Guardar y continuar →" />
          </div>
        )}

        {/* Physical */}
        {tab === 'physical' && (
          <div className="space-y-6">
            <div>
              <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>
                ¿Cómo te sientes físicamente este período?
              </p>
              <ScaleLegend />
              <div className="space-y-3 mt-3">
                {PHYS.map(f => (
                  <ScoreRow key={f.key} label={f.label} value={phys[f.key]}
                            onChange={v => setPhys(p => ({ ...p, [f.key]: v }))}
                            values={[-2, -1, 0, 1, 2]} />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTab('oncourt')}
                      className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
                ← Volver
              </button>
              <SaveBtn onClick={savePhysical} saving={saving} label="Guardar y continuar →" />
            </div>
          </div>
        )}

        {/* Character */}
        {tab === 'character' && (
          <div className="space-y-6">
            <div>
              <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>Evaluación de carácter</p>
              <ScaleLegend />
              <div className="space-y-3 mt-3">
                {CHAR.map(f => (
                  <ScoreRow key={f.key} label={f.label} value={char_[f.key]}
                            onChange={v => setChar(p => ({ ...p, [f.key]: v }))}
                            values={[-2, -1, 0, 1, 2]} />
                ))}
              </div>
            </div>
            <div>
              <label className="eyebrow !text-[10px] block mb-1.5" style={{ color: 'var(--ink-mute)' }}>
                Reflexión del período
              </label>
              <textarea
                value={reflexion}
                onChange={e => setRef(e.target.value)}
                rows={5}
                placeholder="¿Qué aprendiste este período? ¿Qué quieres mejorar? ¿Cómo te sentiste dentro y fuera de la cancha?"
                className="w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none resize-none"
                style={{ lineHeight: 1.6 }}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTab('physical')}
                      className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
                ← Volver
              </button>
              <SaveBtn onClick={saveCharacter} saving={saving} label="Enviar Athlete Voice" />
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Chips de períodos con reporte del coach: punto verde = athlete voice enviado. */
function PeriodPicker({ available, period, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {available.map(({ period: p, done }) => (
        <button key={p} type="button" onClick={() => onSelect(p)}
                className="px-3 py-1.5 text-[11px] font-semibold hairline transition flex items-center gap-1.5"
                style={p === period
                  ? { background: 'var(--accent)', color: 'white' }
                  : { background: 'var(--paper)', color: 'var(--ink-soft)' }}>
          {labelPeriod(p)}
          <span className="inline-block w-1.5 h-1.5 rounded-full"
                title={done ? 'Athlete Voice enviado' : 'Pendiente'}
                style={{ background: done ? 'var(--good)' : (p === period ? 'rgba(255,255,255,.5)' : 'var(--bad)') }} />
        </button>
      ))}
    </div>
  );
}

// All sections use -2/+2 scale
const ONCOURT_LABELS = { '-2': 'Estancado', '-1': 'Rezagado', '0': 'Por buen camino', '1': 'Adelantado', '2': 'Superado' };

function ScaleLegend() {
  const items = [[-2,'Estancado'],[-1,'Rezagado'],[0,'Por buen camino'],[1,'Adelantado'],[2,'Superado']];
  return (
    <div className="flex gap-0 text-[10px] hairline overflow-hidden" style={{ borderRadius: 2 }}>
      {items.map(([v, lbl]) => (
        <div key={v} className="flex-1 text-center py-1 px-0.5 leading-tight"
             style={{
               background: v < 0 ? 'rgba(220,38,38,.07)' : v === 0 ? 'var(--cream)' : 'rgba(22,163,74,.07)',
               color: v < 0 ? '#b91c1c' : v === 0 ? 'var(--ink-mute)' : '#15803d',
               borderRight: '0.5px solid var(--border)',
             }}>
          <div className="font-bold">{v > 0 ? `+${v}` : v}</div>
          <div style={{ opacity: 0.8 }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

function ScoreRow({ label, desc, value, onChange, values }) {
  const labels = ONCOURT_LABELS;
  const fmt = n => n > 0 ? `+${n}` : `${n}`;
  return (
    <div className="flex items-center gap-4">
      <span className="text-[13px] w-44 shrink-0" title={desc} style={desc ? { cursor: 'help' } : undefined}>
        {label}
        {desc && <span className="block text-[10px] leading-tight" style={{ color: 'var(--ink-mute)' }}>{desc}</span>}
      </span>
      <div className="flex gap-1">
        {values.map(n => (
          <button key={n} type="button" onClick={() => onChange(n)}
                  className="w-8 h-8 text-[12px] font-bold transition"
                  style={value === n
                    ? { background: 'var(--accent)', color: 'white' }
                    : { background: 'var(--cream)', color: 'var(--ink-mute)' }}>
            {fmt(n)}
          </button>
        ))}
      </div>
      <span className="text-[11px] w-28 truncate" style={{ color: 'var(--ink-mute)' }}>
        {labels[String(value)]}
      </span>
    </div>
  );
}

function SaveBtn({ onClick, saving, label }) {
  return (
    <button type="button" onClick={onClick} disabled={saving}
            className="px-6 py-2 text-[12px] font-semibold uppercase tracking-wide text-white disabled:opacity-60 hover:opacity-90 transition"
            style={{ background: 'var(--accent)' }}>
      {saving ? 'Guardando…' : label}
    </button>
  );
}

function Shell({ children }) {
  return <div className="flex-1 p-8 portal-layout">{children}</div>;
}
