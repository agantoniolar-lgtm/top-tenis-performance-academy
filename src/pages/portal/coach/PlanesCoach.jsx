import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

// ─── Constants ─────────────────────────────────────────────────────────────────

const DIMENSION_LABELS = {
  tecnica:   'Técnica',
  tactica:   'Táctica',
  physical:  'Physical',
  character: 'Carácter',
};
const DIM_ORDER = ['tecnica', 'tactica', 'physical', 'character'];

const SUB_LABEL = {
  serve:                 'Saque',
  forehand:              'Derecha',
  backhand:              'Revés',
  volea:                 'Volea',
  devolucion:            'Devolución',
  footwork:              'Movimiento',
  seleccion_golpe:       'Selección de golpe',
  manejo_riesgo:         'Manejo de riesgo',
  puntos_clave:          'Puntos clave',
  adaptacion_tactica:    'Adaptación táctica',
  transferencia_partido: 'Transferencia al partido',
  sprint_20m:            'Velocidad / Sprint 20m',
  beep_test:             'Resistencia / Beep test',
  salto_vertical:        'Potencia / Salto vertical',
  spider_drill:          'Agilidad / Spider drill',
  fms:                   'Movilidad / FMS',
  fuerza_inferior:       'Fuerza tren inferior',
  fuerza_superior:       'Fuerza tren superior',
  etica_trabajo:         'Ética de trabajo',
  coachabilidad:         'Coachabilidad',
  liderazgo:             'Liderazgo',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function periodEndFor(startStr) {
  // e.g. '2026-07-01' → '2026-09-30'
  const d = new Date(startStr + 'T12:00:00');
  d.setMonth(d.getMonth() + 3);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function fmtPeriod(start, end) {
  const s = new Date(start + 'T12:00:00');
  const e = new Date(end   + 'T12:00:00');
  const sMon = s.toLocaleDateString('es-MX', { month: 'short' });
  const eMon = e.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
  return `${sMon} – ${eMon}`;
}

function athleteName(plan) {
  const a = Array.isArray(plan.athletes) ? plan.athletes[0] : plan.athletes;
  return a ? `${a.nombre} ${a.apellido}` : '—';
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PlanesCoach() {
  const { user } = useAuth();

  // view: 'list' | 'create' | 'detail'
  const [view, setView]     = useState('list');
  const [step, setStep]     = useState(1); // only when view === 'create'

  // ── List ──────────────────────────────────────────────────────────
  const [plans, setPlans]       = useState([]);
  const [loadingList, setLL]    = useState(true);

  // ── Create ────────────────────────────────────────────────────────
  const [athletes,       setAth]    = useState([]);
  const [selAthlete,     setSel]    = useState('');
  const [periodStart,    setPStart] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [observations,   setObs]   = useState('');
  const [generating,     setGen]   = useState(false);
  const [genError,       setGErr]  = useState(null);
  const [objectives,     setObjs]  = useState([]); // { dimension, sub_dimension, objective_text }
  const [validating,     setVal]   = useState(false);
  const [validation,     setVRes]  = useState(null); // { covered, missing, vague }
  const [valError,       setVErr]  = useState(null);
  const [saving,         setSav]   = useState(false);
  const [saveError,      setSErr]  = useState(null);

  // Shared inline-edit state (used in both create step 3 and detail view)
  const [editingId,  setEditId]  = useState(null); // key string
  const [editText,   setEditTxt] = useState('');

  // ── Detail ────────────────────────────────────────────────────────
  const [activePlan,  setActivePlan] = useState(null);
  const [updatingObj, setUpdObj]     = useState(false);

  // ── Load list ────────────────────────────────────────────────────
  const loadPlans = async () => {
    if (!user?.coach_id) return;
    setLL(true);
    const { data } = await supabase
      .from('quarterly_plans')
      .select('id, athlete_id, period_start, period_end, status, athletes(nombre, apellido), quarterly_plan_objectives(id)')
      .eq('coach_id', user.coach_id)
      .order('period_start', { ascending: false });
    setPlans(data ?? []);
    setLL(false);
  };

  useEffect(() => { loadPlans(); }, [user?.coach_id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load athletes (for create) ────────────────────────────────────
  useEffect(() => {
    if (!user?.coach_id || view !== 'create') return;
    supabase
      .from('athletes')
      .select('id, nombre, apellido')
      .eq('coach_id', user.coach_id)
      .eq('activo', true)
      .order('nombre')
      .then(({ data }) => setAth(data ?? []));
  }, [user?.coach_id, view]);

  const periodEnd = periodEndFor(periodStart);

  // ── Helpers ────────────────────────────────────────────────────────
  const resetCreate = () => {
    setStep(1); setSel(''); setObs(''); setObjs([]);
    setGErr(null); setSErr(null); setEditId(null);
    setVRes(null); setVErr(null);
  };

  const goCreate = () => { resetCreate(); setView('create'); };
  const goList   = () => { setView('list'); setActivePlan(null); setEditId(null); };

  // ── Validate observations ─────────────────────────────────────────
  const handleValidate = async () => {
    if (!observations.trim()) return;
    setVal(true); setVErr(null); setVRes(null);
    try {
      const { data, error } = await supabase.functions.invoke('validate-quarterly-plan', {
        body: { observations },
      });
      if (error) throw error;
      setVRes(data);
    } catch (e) {
      setVErr(e.message ?? 'Error al validar');
    } finally {
      setVal(false);
    }
  };

  // ── Generate plan ─────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!observations.trim()) return;
    setGen(true); setGErr(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quarterly-plan', {
        body: { observations },
      });
      if (error) throw error;
      const objs = data?.objectives ?? [];
      if (!objs.length) throw new Error('No se generaron objetivos. Intenta agregar más detalle en tus observaciones.');
      setObjs(objs);
      setStep(3);
    } catch (e) {
      setGErr(e.message ?? 'Error al generar el plan');
    } finally {
      setGen(false);
    }
  };

  // ── Save plan ─────────────────────────────────────────────────────
  const handleSavePlan = async () => {
    if (!selAthlete || !objectives.length) return;
    setSav(true); setSErr(null);
    try {
      const { data: plan, error: pErr } = await supabase
        .from('quarterly_plans')
        .insert({
          athlete_id:   selAthlete,
          coach_id:     user.coach_id,
          period_start: periodStart,
          period_end:   periodEnd,
          raw_input:    observations,
          status:       'active',
        })
        .select('id')
        .single();
      if (pErr) throw pErr;

      const rows = objectives.map((o, i) => ({
        plan_id:        plan.id,
        dimension:      o.dimension,
        sub_dimension:  o.sub_dimension,
        objective_text: o.objective_text,
        sort_order:     i,
      }));
      const { error: oErr } = await supabase.from('quarterly_plan_objectives').insert(rows);
      if (oErr) throw oErr;

      await loadPlans();
      resetCreate();
      setView('list');
    } catch (e) {
      setSErr(e.message);
    } finally {
      setSav(false);
    }
  };

  // ── Open detail ───────────────────────────────────────────────────
  const openDetail = async (planId) => {
    const { data } = await supabase
      .from('quarterly_plans')
      .select('*, athletes(nombre, apellido), quarterly_plan_objectives(*)')
      .eq('id', planId)
      .single();
    if (data) { setActivePlan(data); setView('detail'); }
  };

  // ── Inline edit (detail) ──────────────────────────────────────────
  const handleUpdateObjective = async (objId) => {
    if (!editText.trim()) { setEditId(null); return; }
    setUpdObj(true);
    const { error } = await supabase
      .from('quarterly_plan_objectives')
      .update({ objective_text: editText.trim() })
      .eq('id', objId);
    if (!error) {
      setActivePlan(p => ({
        ...p,
        quarterly_plan_objectives: p.quarterly_plan_objectives.map(o =>
          o.id === objId ? { ...o, objective_text: editText.trim() } : o
        ),
      }));
    }
    setEditId(null);
    setUpdObj(false);
  };

  // ── Archive ───────────────────────────────────────────────────────
  const handleArchive = async (planId) => {
    if (!window.confirm('¿Archivar este plan? Ya no aparecerá en los reportes activos.')) return;
    await supabase.from('quarterly_plans').update({ status: 'archived' }).eq('id', planId);
    setActivePlan(p => ({ ...p, status: 'archived' }));
    setPlans(ps => ps.map(p => p.id === planId ? { ...p, status: 'archived' } : p));
  };

  // ────────────────────────────────────────────────────────────────────
  // RENDER — LIST
  // ────────────────────────────────────────────────────────────────────
  if (view === 'list') return (
    <Shell>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Planes trimestrales</h1>
          <p className="text-[12px] mt-1" style={{ color: 'var(--ink-mute)' }}>
            Genera y gestiona planes de desarrollo por atleta.
          </p>
        </div>
        <button
          onClick={goCreate}
          className="shrink-0 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white hover:opacity-90 transition"
          style={{ background: 'var(--accent)' }}>
          + Nuevo plan
        </button>
      </div>

      {loadingList ? (
        <p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p>
      ) : plans.length === 0 ? (
        <EmptyState onNew={goCreate} />
      ) : (
        <div className="space-y-1">
          {plans.map(p => {
            const nObj = (p.quarterly_plan_objectives ?? []).length;
            return (
              <button
                key={p.id}
                onClick={() => openDetail(p.id)}
                className="w-full flex items-center gap-4 px-4 py-3 hairline text-left hover:bg-[var(--cream)] transition"
                style={{ background: 'var(--paper)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{athleteName(p)}</p>
                  <p className="text-[11px]" style={{ color: 'var(--ink-mute)' }}>
                    {fmtPeriod(p.period_start, p.period_end)}
                  </p>
                </div>
                <span className="text-[11px] shrink-0" style={{ color: 'var(--ink-mute)' }}>
                  {nObj} obj.
                </span>
                <StatusBadge status={p.status} />
              </button>
            );
          })}
        </div>
      )}
    </Shell>
  );

  // ────────────────────────────────────────────────────────────────────
  // RENDER — CREATE
  // ────────────────────────────────────────────────────────────────────
  if (view === 'create') return (
    <Shell>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={goList}
            className="text-[11px] font-semibold uppercase tracking-wide hairline px-3 py-1.5 hover:bg-[var(--cream)] transition">
            ← Volver
          </button>
          <h1 className="font-display font-extrabold text-[24px] leading-none">Nuevo plan</h1>
        </div>

        <StepBar current={step} />

        {/* ── Step 1: Atleta + período ────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5 mt-6">
            <Field label="Atleta" required>
              <select
                value={selAthlete}
                onChange={e => setSel(e.target.value)}
                className="w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none">
                <option value="">— seleccionar —</option>
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
                ))}
              </select>
            </Field>
            <Field label="Inicio del trimestre" required>
              <input
                type="date"
                value={periodStart}
                onChange={e => setPStart(e.target.value)}
                className="hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none" />
              {periodStart && (
                <p className="text-[11px] mt-1.5" style={{ color: 'var(--ink-mute)' }}>
                  Período: <strong>{fmtPeriod(periodStart, periodEnd)}</strong>
                </p>
              )}
            </Field>
            <button
              onClick={() => setStep(2)}
              disabled={!selAthlete || !periodStart}
              className="px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-40 hover:opacity-90 transition"
              style={{ background: 'var(--accent)' }}>
              Continuar →
            </button>
          </div>
        )}

        {/* ── Step 2: Observaciones ────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5 mt-6">
            <div className="hairline px-4 py-2.5" style={{ background: 'var(--cream)' }}>
              <p className="text-[11px] font-semibold" style={{ color: 'var(--ink-mute)' }}>
                {athletes.find(a => a.id === selAthlete)?.nombre} {athletes.find(a => a.id === selAthlete)?.apellido}
                {' · '}{fmtPeriod(periodStart, periodEnd)}
              </p>
            </div>
            <div>
              <p className="text-[13px] mb-3" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
                Escribe lo que observas de este atleta — sin formato, en tus propias palabras. Técnica, táctica, físico, actitud, lo que sea. Mientras más detalle, mejor el plan.
              </p>
              <textarea
                value={observations}
                onChange={e => { setObs(e.target.value); setVRes(null); setVErr(null); }}
                rows={12}
                placeholder="Ej: Su derecha todavía se encoge, tiene que aprender a soltar el brazo. El revés es sólido pero no rota bien con los hombros. Su movilidad es muy buena. Cuando hay puntos apretados llora pero no para de competir…"
                className="w-full hairline px-4 py-3 text-[13px] bg-[var(--paper)] outline-none resize-none"
                style={{ lineHeight: 1.7 }}
              />
            </div>
            {/* ── Validation results ─────────────────────────────── */}
            {valError && <ErrorBox msg={valError} />}
            {validation && (
              <ValidationWarnings validation={validation} />
            )}

            {genError && <ErrorBox msg={genError} />}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
                ← Volver
              </button>
              <button
                onClick={handleValidate}
                disabled={validating || !observations.trim()}
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition disabled:opacity-40">
                {validating ? 'Validando…' : '⚑ Validar observaciones'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating || !observations.trim()}
                className="px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-40 hover:opacity-90 transition"
                style={{ background: 'var(--accent)' }}>
                {generating ? 'Generando…' : 'Generar plan →'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review + guardar ─────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6 mt-6">
            <p className="text-[13px]" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
              Revisa los objetivos generados. Haz clic en cualquiera para editarlo antes de guardar.
            </p>

            {DIM_ORDER.filter(d => objectives.some(o => o.dimension === d)).map(dim => (
              <div key={dim}>
                <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>
                  {DIMENSION_LABELS[dim]}
                </p>
                <div className="space-y-2">
                  {objectives.filter(o => o.dimension === dim).map(o => {
                    const key = `${o.dimension}_${o.sub_dimension}`;
                    const isEdit = editingId === key;
                    return (
                      <div key={key} className="hairline px-4 py-3" style={{ background: 'var(--paper)' }}>
                        <p className="eyebrow !text-[9px] mb-1.5" style={{ color: 'var(--ink-mute)' }}>
                          {SUB_LABEL[o.sub_dimension] ?? o.sub_dimension}
                        </p>
                        {isEdit ? (
                          <div className="flex items-start gap-2">
                            <textarea
                              autoFocus
                              value={editText}
                              onChange={e => setEditTxt(e.target.value)}
                              rows={2}
                              className="flex-1 hairline px-2 py-1 text-[12px] bg-[var(--cream)] outline-none resize-none"
                            />
                            <button
                              onClick={() => {
                                if (editText.trim()) {
                                  setObjs(prev => prev.map(x =>
                                    x.dimension === o.dimension && x.sub_dimension === o.sub_dimension
                                      ? { ...x, objective_text: editText.trim() }
                                      : x
                                  ));
                                }
                                setEditId(null);
                              }}
                              className="text-[11px] font-semibold uppercase tracking-wide px-3 py-1 text-white hover:opacity-90 transition"
                              style={{ background: 'var(--accent)' }}>
                              OK
                            </button>
                          </div>
                        ) : (
                          <p
                            className="text-[13px] leading-relaxed cursor-pointer group"
                            onClick={() => { setEditId(key); setEditTxt(o.objective_text); }}>
                            {o.objective_text}
                            <span className="ml-2 text-[10px] opacity-0 group-hover:opacity-100 transition"
                                  style={{ color: 'var(--ink-mute)' }}>
                              editar
                            </span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {saveError && <ErrorBox msg={saveError} />}
            <div className="flex gap-3">
              <button
                onClick={() => { setStep(2); setObjs([]); setEditId(null); }}
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
                ← Regenerar
              </button>
              <button
                onClick={handleSavePlan}
                disabled={saving}
                className="px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-40 hover:opacity-90 transition"
                style={{ background: 'var(--accent)' }}>
                {saving ? 'Guardando…' : 'Guardar plan'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );

  // ────────────────────────────────────────────────────────────────────
  // RENDER — DETAIL
  // ────────────────────────────────────────────────────────────────────
  if (view === 'detail' && activePlan) {
    const objs = (activePlan.quarterly_plan_objectives ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order);

    return (
      <Shell>
        <div className="max-w-2xl">
          <button
            onClick={goList}
            className="text-[11px] font-semibold uppercase tracking-wide text-[var(--ink-mute)] hover:text-[var(--ink)] transition mb-3 block">
            ← Todos los planes
          </button>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display font-extrabold text-[26px] leading-none">
                {athleteName(activePlan)}
              </h1>
              <p className="text-[12px] mt-1 flex items-center gap-2" style={{ color: 'var(--ink-mute)' }}>
                {fmtPeriod(activePlan.period_start, activePlan.period_end)}
                <StatusBadge status={activePlan.status} />
              </p>
            </div>
            {activePlan.status === 'active' && (
              <button
                onClick={() => handleArchive(activePlan.id)}
                className="text-[11px] font-semibold uppercase tracking-wide hairline px-3 py-1.5 hover:bg-[var(--cream)] transition shrink-0"
                style={{ color: 'var(--ink-mute)' }}>
                Archivar
              </button>
            )}
          </div>

          {objs.length === 0 ? (
            <p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Este plan no tiene objetivos registrados.</p>
          ) : (
            <div className="space-y-6">
              {DIM_ORDER.filter(d => objs.some(o => o.dimension === d)).map(dim => (
                <div key={dim}>
                  <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>
                    {DIMENSION_LABELS[dim]}
                  </p>
                  <div className="space-y-2">
                    {objs.filter(o => o.dimension === dim).map(o => {
                      const isEdit = editingId === o.id;
                      return (
                        <div key={o.id} className="hairline px-4 py-3" style={{ background: 'var(--paper)' }}>
                          <p className="eyebrow !text-[9px] mb-1.5" style={{ color: 'var(--ink-mute)' }}>
                            {SUB_LABEL[o.sub_dimension] ?? o.sub_dimension}
                          </p>
                          {isEdit ? (
                            <div className="flex items-start gap-2">
                              <textarea
                                autoFocus
                                value={editText}
                                onChange={e => setEditTxt(e.target.value)}
                                rows={2}
                                className="flex-1 hairline px-2 py-1 text-[12px] bg-[var(--cream)] outline-none resize-none"
                              />
                              <button
                                onClick={() => handleUpdateObjective(o.id)}
                                disabled={updatingObj}
                                className="text-[11px] font-semibold uppercase tracking-wide px-3 py-1 text-white hover:opacity-90 transition disabled:opacity-40"
                                style={{ background: 'var(--accent)' }}>
                                {updatingObj ? '…' : 'OK'}
                              </button>
                              <button
                                onClick={() => setEditId(null)}
                                className="text-[11px] font-semibold uppercase tracking-wide hairline px-3 py-1 hover:bg-[var(--cream)] transition">
                                ✕
                              </button>
                            </div>
                          ) : (
                            <p
                              className="text-[13px] leading-relaxed cursor-pointer group"
                              onClick={() => { setEditId(o.id); setEditTxt(o.objective_text); }}>
                              {o.objective_text}
                              <span className="ml-2 text-[10px] opacity-0 group-hover:opacity-100 transition"
                                    style={{ color: 'var(--ink-mute)' }}>
                                editar
                              </span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Shell>
    );
  }

  return null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="eyebrow !text-[10px] block mb-1.5" style={{ color: 'var(--ink-mute)' }}>
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function StepBar({ current }) {
  const steps = ['Atleta y período', 'Observaciones', 'Revisión'];
  return (
    <div className="flex items-center gap-0 mb-1">
      {steps.map((label, i) => {
        const n = i + 1;
        const done    = n < current;
        const active  = n === current;
        return (
          <div key={n} className="flex items-center gap-0">
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  background: active ? 'var(--accent)' : done ? 'var(--good)' : 'var(--cream)',
                  color: active || done ? 'white' : 'var(--ink-mute)',
                }}>
                {done ? '✓' : n}
              </div>
              <span className="text-[11px] font-medium"
                    style={{ color: active ? 'var(--ink)' : 'var(--ink-mute)' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-6 h-px mx-2" style={{ background: 'var(--border)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active:   { label: 'Activo',    bg: 'rgba(22,163,74,.1)',    color: '#15803d' },
    draft:    { label: 'Borrador',  bg: 'rgba(234,179,8,.12)',   color: '#a16207' },
    archived: { label: 'Archivado', bg: 'rgba(107,114,128,.1)',  color: '#6b7280' },
  };
  const s = map[status] ?? map.archived;
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5"
          style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function EmptyState({ onNew }) {
  return (
    <div className="py-16 text-center">
      <p className="text-[13px] mb-4" style={{ color: 'var(--ink-mute)' }}>
        Aún no hay planes trimestrales. Crea el primero para empezar a trackear objetivos por atleta.
      </p>
      <button
        onClick={onNew}
        className="px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white hover:opacity-90 transition"
        style={{ background: 'var(--accent)' }}>
        + Crear primer plan
      </button>
    </div>
  );
}

function ValidationWarnings({ validation }) {
  const { missing = [], vague = [] } = validation;
  const allClear = missing.length === 0 && vague.length === 0;

  if (allClear) {
    return (
      <div className="p-3 text-[12px] font-medium hairline flex items-center gap-2"
           style={{ background: 'rgba(22,163,74,.07)', color: '#15803d' }}>
        <span>✓</span>
        <span>Cobertura completa y descripciones suficientes. Listo para generar.</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {missing.length > 0 && (
        <div className="hairline p-4" style={{ background: 'rgba(234,179,8,.07)' }}>
          <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: '#92400e' }}>
            ⚠ Dimensiones no cubiertas en tus observaciones ({missing.length})
          </p>
          <p className="text-[11px] mb-3" style={{ color: '#78350f', lineHeight: 1.6 }}>
            Si quieres que estas sub-dimensiones aparezcan en los reportes mensuales,
            mencionarlas en el texto — aunque sea a nivel de mantenimiento.
            Ejemplo: <em>"La volea quiero mantenerla en su nivel actual este trimestre."</em>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map(k => (
              <span key={k}
                    className="text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide"
                    style={{ background: 'rgba(234,179,8,.18)', color: '#92400e' }}>
                {SUB_LABEL[k] ?? k}
              </span>
            ))}
          </div>
        </div>
      )}
      {vague.length > 0 && (
        <div className="hairline p-4" style={{ background: 'rgba(234,179,8,.07)' }}>
          <p className="text-[11px] font-bold uppercase tracking-wide mb-2" style={{ color: '#92400e' }}>
            ⚠ Descripciones con poco detalle ({vague.length})
          </p>
          <div className="space-y-2">
            {vague.map(v => (
              <div key={v.sub_dimension}>
                <p className="text-[11px] font-semibold" style={{ color: '#78350f' }}>
                  {SUB_LABEL[v.sub_dimension] ?? v.sub_dimension}
                </p>
                <p className="text-[11px]" style={{ color: '#92400e', lineHeight: 1.6 }}>
                  {v.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="p-3 text-[12px] text-red-700 hairline" style={{ background: 'rgba(220,38,38,.06)' }}>
      {msg}
    </div>
  );
}
