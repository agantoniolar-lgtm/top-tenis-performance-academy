import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { TACTIC_DESCS, minPeriodFor, isPeriodAllowed, fmtPeriodLong } from '../../../lib/athletics.js';

// ─── On-court fields ───────────────────────────────────────────────────────
const STROKES = [
  { key: 'serve',    label: 'Saque' },
  { key: 'forehand', label: 'Derecha' },
  { key: 'backhand', label: 'Revés' },
  { key: 'volea',    label: 'Volea' },
  { key: 'devolucion', label: 'Devolución' },
  { key: 'footwork', label: 'Movimiento' },
];
const TACTICS = [
  { key: 'seleccion_golpe',      label: 'Selección de golpe' },
  { key: 'manejo_riesgo',        label: 'Manejo de riesgo' },
  { key: 'puntos_clave',         label: 'Puntos clave' },
  { key: 'adaptacion_tactica',   label: 'Adaptación táctica' },
  { key: 'transferencia_partido',label: 'Transferencia al partido' },
].map(t => ({ ...t, desc: TACTIC_DESCS[t.key] }));

// ─── Physical fields ────────────────────────────────────────────────────────
const PHYSICAL_NUM = [
  { key: 'sprint_20m',         label: 'Sprint 20m (seg)', placeholder: '3.14' },
  { key: 'salto_vertical_cm',  label: 'Salto vertical (cm)', placeholder: '42' },
  { key: 'spider_drill_seg',   label: 'Spider drill (seg)', placeholder: '4.62' },
  { key: 'sentadillas_1min',   label: 'Sentadillas 1 min (reps)', placeholder: '30' },
  { key: 'lagartijas_1min',    label: 'Lagartijas 1 min (reps)', placeholder: '20' },
  { key: 'beep_test_nivel',    label: 'Beep test nivel', placeholder: '8' },
  { key: 'beep_test_rep',      label: 'Beep test rep', placeholder: '5' },
];
const FMS_FIELDS = [
  { key: 'fms_squat',      label: 'Squat' },
  { key: 'fms_lunge_izq',  label: 'Lunge izq.' },
  { key: 'fms_lunge_der',  label: 'Lunge der.' },
  { key: 'fms_hombro_izq', label: 'Hombro izq.' },
  { key: 'fms_hombro_der', label: 'Hombro der.' },
];

// ─── Character fields ───────────────────────────────────────────────────────
const CHAR_SCORES = [
  { key: 'etica_trabajo', label: 'Ética de trabajo' },
  { key: 'coachabilidad', label: 'Coachabilidad' },
];

const defScores = (fields, def = 0) => Object.fromEntries(fields.map(f => [f.key, def]));

const TABS = [
  { id: 'oncourt',   label: 'On-court' },
  { id: 'physical',  label: 'Physical' },
  { id: 'character', label: 'Character' },
];

export default function NuevoReporte() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();

  const [tab,       setTab]   = useState('oncourt');
  const [athletes,  setAth]   = useState([]);
  const [athleteId, setAtId]  = useState(location.state?.athleteId ?? '');
  const [period,    setPer]   = useState(() => {
    if (location.state?.period) return location.state.period;
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });

  // On-court state
  const [utr,      setUtr]   = useState('');
  const [strokes,  setStr]   = useState(defScores(STROKES, 0));
  const [tactics,  setTac]   = useState(defScores(TACTICS, 0));
  const [tecNota,  setTecN]  = useState('');
  const [tacNota,  setTacN]  = useState('');

  // Physical state
  const [phys,     setPhys]  = useState(Object.fromEntries(PHYSICAL_NUM.map(f => [f.key, ''])));
  const [fms,      setFms]   = useState(Object.fromEntries(FMS_FIELDS.map(f => [f.key, false])));

  // Character state
  const [charScores, setChar] = useState(defScores(CHAR_SCORES, 0));
  const [lideNota,  setLide]  = useState('');
  const [conductaLog, setCond] = useState('');

  const [saving,  setSav]  = useState(false);
  const [error,   setErr]  = useState(null);
  const [done,    setDone] = useState(false);
  const [saved,   setSaved] = useState({ oncourt: false, physical: false, character: false });

  useEffect(() => {
    if (!user?.coach_id) return;
    supabase.from('athletes').select('id, nombre, apellido, fecha_ingreso')
      .eq('coach_id', user.coach_id).eq('activo', true).order('nombre')
      .then(({ data }) => setAth(data ?? []));
  }, [user?.coach_id]);

  // Pre-cargar datos existentes cuando viene del botón "Editar"
  useEffect(() => {
    if (!athleteId || !period || !user?.coach_id) return;
    supabase
      .from('reports')
      .select(`
        id,
        report_on_court ( serve, forehand, backhand, volea, devolucion, footwork,
          seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido,
          utr, tecnica_nota, tactica_nota, completed_at ),
        report_physical ( sprint_20m, salto_vertical_cm, spider_drill_seg,
          sentadillas_1min, lagartijas_1min, beep_test_nivel, beep_test_rep,
          fms_squat, fms_lunge_izq, fms_lunge_der, fms_hombro_izq, fms_hombro_der, completed_at ),
        report_character ( etica_trabajo, coachabilidad, liderazgo_nota, conducta_log, completed_at )
      `)
      .eq('athlete_id', athleteId)
      .eq('period', period)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        // Supabase returns one-to-one (unique FK) relations as objects, not arrays
        const oc = Array.isArray(data.report_on_court) ? data.report_on_court[0] : data.report_on_court;
        if (oc) {
          if (oc.utr) setUtr(String(oc.utr));
          setStr({ serve: oc.serve ?? 0, forehand: oc.forehand ?? 0, backhand: oc.backhand ?? 0,
                   volea: oc.volea ?? 0, devolucion: oc.devolucion ?? 0, footwork: oc.footwork ?? 0 });
          setTac({ seleccion_golpe: oc.seleccion_golpe ?? 0, manejo_riesgo: oc.manejo_riesgo ?? 0,
                   puntos_clave: oc.puntos_clave ?? 0, adaptacion_tactica: oc.adaptacion_tactica ?? 0,
                   transferencia_partido: oc.transferencia_partido ?? 0 });
          setTecN(oc.tecnica_nota ?? '');
          setTacN(oc.tactica_nota ?? '');
          if (oc.completed_at) setSaved(s => ({ ...s, oncourt: true }));
        }
        const ph = Array.isArray(data.report_physical) ? data.report_physical[0] : data.report_physical;
        if (ph) {
          setPhys({
            sprint_20m:        ph.sprint_20m        != null ? String(ph.sprint_20m)        : '',
            salto_vertical_cm: ph.salto_vertical_cm != null ? String(ph.salto_vertical_cm) : '',
            spider_drill_seg:  ph.spider_drill_seg  != null ? String(ph.spider_drill_seg)  : '',
            sentadillas_1min:  ph.sentadillas_1min  != null ? String(ph.sentadillas_1min)  : '',
            lagartijas_1min:   ph.lagartijas_1min   != null ? String(ph.lagartijas_1min)   : '',
            beep_test_nivel:   ph.beep_test_nivel   != null ? String(ph.beep_test_nivel)   : '',
            beep_test_rep:     ph.beep_test_rep     != null ? String(ph.beep_test_rep)     : '',
          });
          setFms({ fms_squat: ph.fms_squat ?? false, fms_lunge_izq: ph.fms_lunge_izq ?? false,
                   fms_lunge_der: ph.fms_lunge_der ?? false, fms_hombro_izq: ph.fms_hombro_izq ?? false,
                   fms_hombro_der: ph.fms_hombro_der ?? false });
          if (ph.completed_at) setSaved(s => ({ ...s, physical: true }));
        }
        const ch = Array.isArray(data.report_character) ? data.report_character[0] : data.report_character;
        if (ch) {
          setChar({ etica_trabajo: ch.etica_trabajo ?? 0, coachabilidad: ch.coachabilidad ?? 0 });
          setLide(ch.liderazgo_nota ?? '');
          setCond(ch.conducta_log ?? '');
          if (ch.completed_at) setSaved(s => ({ ...s, character: true }));
        }
      });
  }, [athleteId, period, user?.coach_id]);

  // B3: el reporte no puede ser anterior al mes de ingreso del atleta
  const selectedAthlete = athletes.find(a => a.id === athleteId);
  const minPeriod = minPeriodFor(selectedAthlete?.fecha_ingreso);
  const periodAllowed = isPeriodAllowed(period, selectedAthlete?.fecha_ingreso);

  // Upsert the report container, return report_id
  const ensureReport = async () => {
    if (!periodAllowed) {
      throw new Error(`El período no puede ser anterior al ingreso del atleta (${fmtPeriodLong(selectedAthlete?.fecha_ingreso)}).`);
    }
    const { data, error } = await supabase
      .from('reports')
      .upsert({ athlete_id: athleteId, coach_id: user.coach_id, period },
               { onConflict: 'athlete_id,period', ignoreDuplicates: false })
      .select('id').single();
    if (error) throw error;
    return data.id;
  };

  const saveOnCourt = async () => {
    if (!athleteId) return setErr('Selecciona un atleta.');
    setSav(true); setErr(null);
    try {
      const reportId = await ensureReport();
      const { error: ocErr } = await supabase.from('report_on_court').upsert({
        report_id: reportId, ...strokes, ...tactics,
        utr: utr ? parseFloat(utr) : null,
        tecnica_nota: tecNota || null, tactica_nota: tacNota || null,
        completed_at: new Date().toISOString(), completed_by: user.coach_id,
      }, { onConflict: 'report_id' });
      if (ocErr) throw ocErr;
      setSaved(s => ({ ...s, oncourt: true }));
      setTab('physical');
    } catch (e) { setErr(e.message); }
    finally { setSav(false); }
  };

  const savePhysical = async () => {
    if (!athleteId) return setErr('Selecciona un atleta.');
    setSav(true); setErr(null);
    try {
      const reportId = await ensureReport();
      const payload = { report_id: reportId, ...fms };
      PHYSICAL_NUM.forEach(f => { if (phys[f.key]) payload[f.key] = parseFloat(phys[f.key]); });
      const { error } = await supabase.from('report_physical')
        .upsert({ ...payload, completed_at: new Date().toISOString(), completed_by: user.coach_id },
                 { onConflict: 'report_id' });
      if (error) throw error;
      setSaved(s => ({ ...s, physical: true }));
      setTab('character');
    } catch (e) { setErr(e.message); }
    finally { setSav(false); }
  };

  const saveCharacter = async () => {
    if (!athleteId) return setErr('Selecciona un atleta.');
    setSav(true); setErr(null);
    try {
      const reportId = await ensureReport();
      const { error } = await supabase.from('report_character').upsert({
        report_id: reportId, ...charScores,
        liderazgo_nota: lideNota || null, conducta_log: conductaLog || null,
        completed_at: new Date().toISOString(), completed_by: user.coach_id,
      }, { onConflict: 'report_id' });
      if (error) throw error;
      setSaved(s => ({ ...s, character: true }));
      setDone(true);
    } catch (e) { setErr(e.message); }
    finally { setSav(false); }
  };

  if (done) return (
    <Shell>
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
             style={{ background: 'rgba(22,163,74,.12)', color: 'var(--good)' }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L20 7"/></svg>
        </div>
        <h2 className="font-display font-extrabold text-[24px] mb-2">Reporte completo</h2>
        <p className="text-[var(--ink-mute)] text-[13px] mb-6">
          Secciones guardadas: {Object.entries(saved).filter(([,v]) => v).map(([k]) => k).join(', ')}.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate('/portal/alumnos')}
                  className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
            Ver atletas
          </button>
          <button onClick={() => { setDone(false); setAtId(''); setUtr(''); setStr(defScores(STROKES, 0)); setTac(defScores(TACTICS, 0)); setPhys(Object.fromEntries(PHYSICAL_NUM.map(f=>[f.key,'']))); setChar(defScores(CHAR_SCORES, 0)); setSaved({oncourt:false,physical:false,character:false}); setTab('oncourt'); }}
                  className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wide text-white hover:opacity-90"
                  style={{ background: 'var(--accent)' }}>
            Nuevo reporte
          </button>
        </div>
      </div>
    </Shell>
  );

  return (
    <Shell>
      <div className="max-w-2xl">
        <h1 className="font-display font-extrabold text-[28px] leading-none mb-1">Nuevo reporte</h1>

        {/* Atleta + Periodo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 mt-4">
          <Field label="Atleta" required>
            <select value={athleteId} onChange={e => setAtId(e.target.value)} required
                    className="w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none">
              <option value="">— seleccionar —</option>
              {athletes.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
            </select>
          </Field>
          <Field label="Periodo (mes)">
            <input type="month" value={period.slice(0,7)} min={minPeriod ?? undefined}
                   onChange={e => setPer(`${e.target.value}-01`)}
                   className="w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none" />
            {!periodAllowed && athleteId && (
              <p className="text-[11px] mt-1" style={{ color: 'var(--bad)' }}>
                Anterior al ingreso del atleta ({fmtPeriodLong(selectedAthlete?.fecha_ingreso)}).
              </p>
            )}
          </Field>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 hairline-b mb-6">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-4 py-3 text-[11px] uppercase tracking-[0.1em] font-semibold relative transition ${
                      tab === t.id ? 'text-[var(--ink)]' : 'text-[var(--ink-mute)] hover:text-[var(--ink)]'
                    }`}>
              {t.label}
              {saved[t.id] && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--good)', verticalAlign: 'middle' }} />}
              {tab === t.id && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px]" style={{ background: 'var(--accent)' }} />}
            </button>
          ))}
        </div>

        {error && <div className="p-3 mb-4 text-[12px] text-red-700 hairline" style={{ background: 'rgba(220,38,38,.06)' }}>{error}</div>}

        {/* On-court */}
        {tab === 'oncourt' && (
          <div className="space-y-6">
            <Field label="UTR al momento del reporte">
              <input type="number" step="0.01" min="1" max="16" value={utr}
                     onChange={e => setUtr(e.target.value)} placeholder="ej. 9.2"
                     className="w-32 hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none" />
            </Field>
            <div>
              <p className="eyebrow !text-[10px] mb-3 text-[var(--ink-mute)]">Técnica</p>
              <ScaleLegend type="oncourt" />
              <div className="space-y-3 mt-3">
                {STROKES.map(s => <ScoreRow key={s.key} label={s.label} value={strokes[s.key]} onChange={v => setStr(p => ({ ...p, [s.key]: v }))} values={[-2,-1,0,1,2]} />)}
              </div>
              <textarea value={tecNota} onChange={e => setTecN(e.target.value)} rows={3}
                        placeholder="Notas técnicas…"
                        className="w-full mt-3 hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none resize-none" />
            </div>
            <div>
              <p className="eyebrow !text-[10px] mb-3 text-[var(--ink-mute)]">Táctica</p>
              <div className="space-y-3">
                {TACTICS.map(t => <ScoreRow key={t.key} label={t.label} desc={t.desc} value={tactics[t.key]} onChange={v => setTac(p => ({ ...p, [t.key]: v }))} values={[-2,-1,0,1,2]} />)}
              </div>
              <textarea value={tacNota} onChange={e => setTacN(e.target.value)} rows={3}
                        placeholder="Notas tácticas…"
                        className="w-full mt-3 hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none resize-none" />
            </div>
            <SaveBtn onClick={saveOnCourt} saving={saving} label="Guardar y continuar →" />
          </div>
        )}

        {/* Physical */}
        {tab === 'physical' && (
          <div className="space-y-6">
            <div>
              <p className="eyebrow !text-[10px] mb-3 text-[var(--ink-mute)]">Tests de rendimiento</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PHYSICAL_NUM.map(f => (
                  <Field key={f.key} label={f.label}>
                    <input type="number" step="0.01" value={phys[f.key]}
                           onChange={e => setPhys(p => ({ ...p, [f.key]: e.target.value }))}
                           placeholder={f.placeholder}
                           className="w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none" />
                  </Field>
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow !text-[10px] mb-1 text-[var(--ink-mute)]">FMS simplificado (Pass / Fail)</p>
              <p className="text-[11px] mb-3" style={{ color: 'var(--ink-mute)', lineHeight: 1.5 }}>
                Marca <b>Pass</b> (✓) si el atleta completa el patrón de movimiento sin compensaciones, restricciones ni dolor.
                Si hay cualquiera de las tres, es <b>Fail</b> (sin marcar).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FMS_FIELDS.map(f => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer text-[13px]">
                    <input type="checkbox" checked={fms[f.key]}
                           onChange={e => setFms(p => ({ ...p, [f.key]: e.target.checked }))}
                           className="w-4 h-4 accent-[var(--accent)]" />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setTab('oncourt')} className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">← Volver</button>
              <SaveBtn onClick={savePhysical} saving={saving} label="Guardar y continuar →" />
            </div>
          </div>
        )}

        {/* Character */}
        {tab === 'character' && (
          <div className="space-y-6">
            <div>
              <p className="eyebrow !text-[10px] mb-3 text-[var(--ink-mute)]">Evaluación de conducta</p>
              <ScaleLegend type="oncourt" />
              <div className="space-y-3 mt-3">
                {CHAR_SCORES.map(s => <ScoreRow key={s.key} label={s.label} value={charScores[s.key]} onChange={v => setChar(p => ({ ...p, [s.key]: v }))} values={[-2,-1,0,1,2]} />)}
              </div>
            </div>
            <Field label="Liderazgo (narrativo)">
              <textarea value={lideNota} onChange={e => setLide(e.target.value)} rows={3}
                        placeholder="Describe el comportamiento de liderazgo del período…"
                        className="w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none resize-none" />
            </Field>
            <Field label="Log de conducta (incidentes y momentos positivos)">
              <textarea value={conductaLog} onChange={e => setCond(e.target.value)} rows={4}
                        placeholder="Ej: 14 Jun — felicitó a rival después de perder en semifinal…"
                        className="w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none resize-none" />
            </Field>
            <div className="flex gap-3">
              <button onClick={() => setTab('physical')} className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">← Volver</button>
              <SaveBtn onClick={saveCharacter} saving={saving} label="Finalizar reporte" />
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

const ONCOURT_LABELS = { '-2': 'Estancado', '-1': 'Rezagado', '0': 'Por buen camino', '1': 'Adelantado', '2': 'Superado' };
const CHAR_LABELS    = { '1': 'Ausente', '2': 'Inconsistente', '3': 'Por buen camino', '4': 'Proactivo', '5': 'Consolidado' };

function ScaleLegend({ type }) {
  const items = type === 'oncourt'
    ? [[-2,'Estancado'],[-1,'Rezagado'],[0,'Por buen camino'],[1,'Adelantado'],[2,'Superado']]
    : [[1,'Ausente'],[2,'Inconsistente'],[3,'Por buen camino'],[4,'Proactivo'],[5,'Consolidado']];
  return (
    <div className="flex gap-0 text-[10px] hairline overflow-hidden" style={{ borderRadius: 2 }}>
      {items.map(([v, lbl]) => (
        <div key={v} className="flex-1 text-center py-1 px-0.5 leading-tight"
             style={{ background: v < 0 ? 'rgba(220,38,38,.07)' : v === 0 ? 'var(--cream)' : 'rgba(22,163,74,.07)',
                      color: v < 0 ? '#b91c1c' : v === 0 ? 'var(--ink-mute)' : '#15803d',
                      borderRight: '0.5px solid var(--border)' }}>
          <div className="font-bold">{v > 0 ? `+${v}` : v}</div>
          <div style={{ opacity: 0.8 }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

function ScoreRow({ label, desc, value, onChange, values = [-2,-1,0,1,2] }) {
  const labels = values.includes(0) ? ONCOURT_LABELS : CHAR_LABELS;
  const fmt = (n) => n > 0 ? `+${n}` : `${n}`;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <span className="text-[13px] sm:w-44 sm:shrink-0" title={desc} style={desc ? { cursor: 'help' } : undefined}>
        {label}
        {desc && <span className="block text-[10px] leading-tight" style={{ color: 'var(--ink-mute)' }}>{desc}</span>}
      </span>
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          {values.map(n => (
            <button key={n} type="button" onClick={() => onChange(n)}
                    className="w-8 h-8 text-[12px] font-bold transition"
                    style={value === n ? { background: 'var(--accent)', color: 'white' } : { background: 'var(--cream)', color: 'var(--ink-mute)' }}>
              {fmt(n)}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[var(--ink-mute)] ml-2 truncate">{labels[String(value)]}</span>
      </div>
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

function Field({ label, children, required }) {
  return (
    <div>
      <label className="eyebrow !text-[10px] block mb-1.5 text-[var(--ink-mute)]">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
