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

const MAX_FOCOS = 5;
const URGENCIA_ORDER = { alta: 0, media: 1, baja: 2 };
const byUrgencia = (a, b) => (URGENCIA_ORDER[a.urgencia] ?? 1) - (URGENCIA_ORDER[b.urgencia] ?? 1);

// Niveles fijos -2..+2 (peldaños hardcodeados; la descripción cambia por objetivo)
const ANCHOR_LEVELS = [
  ['+2', 'Superado'],
  ['+1', 'Adelantado'],
  ['0',  'Por buen camino'],
  ['-1', 'Rezagado'],
  ['-2', 'Estancado'],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function periodEndFor(startStr) {
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

const focoKey = (dim, sub) => `${dim}_${sub}`;
const uuid = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

// Rúbrica de objetivos — traducción de los 5 componentes de la anatomía (docs/scope-rubrica-objetivos.md
// §3/§6) a texto legible para el coach. `objetivo_motivo` que devuelve el modo `validate` es una lista
// de números separados por coma (ej. "1, 3"), nunca prosa — esto la vuelve UI-legible sin depender del
// prompt para redactar bien la explicación.
const RUBRICA_OBJETIVOS_LABELS = {
  1: 'no agrega una prescripción sustancial (parece calco del diagnóstico)',
  2: 'puede estar inventando detalle que el diagnóstico no menciona',
  3: 'asume una causa que el diagnóstico no especificó',
  4: 'el sujeto parece ser el coach/la academia, no el atleta',
  5: 'se lee más como un plan de entrenamiento que como un objetivo medible',
};
function formatObjetivoMotivo(motivo) {
  if (!motivo) return '';
  const partes = motivo.split(',').map(s => s.trim()).filter(Boolean)
    .map(n => RUBRICA_OBJETIVOS_LABELS[n] ?? n);
  return partes.join('; ');
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PlanesCoach() {
  const { user } = useAuth();

  // view: 'list' | 'create' | 'detail'
  const [view, setView] = useState('list');
  const [step, setStep] = useState(1); // 1 atleta·período · 2 observaciones · 3 focos · 4 revisión

  // ── List ──────────────────────────────────────────────────────────
  const [plans, setPlans]    = useState([]);
  const [loadingList, setLL] = useState(true);

  // ── Create — paso 1/2 ─────────────────────────────────────────────
  const [athletes,    setAth]    = useState([]);
  const [selAthlete,  setSel]    = useState('');
  const [periodStart, setPStart] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [observations, setObs] = useState('');

  // ── Create — draft persistente + guard un plan por atleta/periodo ──
  const [draftPlanId,     setDraftPlanId]    = useState(null);
  const [checkingExisting,setCheckingExisting]= useState(false);
  const [existingBlock,   setExistingBlock]  = useState(null); // plan activo/completado que bloquea crear uno nuevo

  // ── Create — paso 3: selección de focos ───────────────────────────
  const [identifying, setIdent]   = useState(false);
  const [identified,  setIdList]  = useState([]);      // { dimension, sub_dimension, read_corto, candidata_a_foco, urgencia, observacion_suficiente, carryover }
  const [selFocos,    setSelFocos]= useState(new Set()); // focoKey()
  const [dumpQuality, setDumpQuality] = useState(null);  // { level: 'detallado'|'vago', motivo }
  const [lastIdentifiedObs, setLastIdentifiedObs] = useState(null); // texto del dump para el que `identified` es válido

  // ── Create — paso 4: generación + revisión ────────────────────────
  const [generating,  setGen]     = useState(false);
  const [genError,    setGErr]    = useState(null);
  const [genFocos,    setGenFocos]= useState([]);      // { dimension, sub_dimension, diagnostico, objetivo, estandar_usado, anchors }
  const [feedback,    setFeedback]= useState('');
  const [promptVer,   setPromptVer]= useState(null);
  const [genLog,      setGenLog]  = useState([]);      // filas de objective_generation_log (lineaje), se insertan al guardar
  // Veredicto de la pasada de validación aparte (mode: 'validate', docs/scope-rubrica-objetivos.md §11).
  // Autoridad sobre `objetivo_suficiente`/`objetivo_motivo` — el campo que trae genFocos de la propia
  // llamada de generate/regenerate es self-eval (opción 1, no confiable) y no se usa en UI.
  const [validacion,  setValidacion] = useState({});   // focoKey → { objetivo_suficiente, objetivo_motivo }

  const [saving,    setSav]  = useState(false);
  const [saveError, setSErr] = useState(null);

  // ── Detail ────────────────────────────────────────────────────────
  const [activePlan, setActivePlan] = useState(null);

  // ── Load list ─────────────────────────────────────────────────────
  const loadPlans = async () => {
    if (!user?.coach_id) return;
    setLL(true);
    const { data } = await supabase
      .from('quarterly_plans')
      .select('id, athlete_id, period_start, period_end, status, athletes(nombre, apellido), quarterly_plan_objectives(id)')
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
      .eq('activo', true)
      .order('nombre')
      .then(({ data }) => setAth(data ?? []));
  }, [user?.coach_id, view]);

  const periodEnd = periodEndFor(periodStart);

  // Cambiar atleta/período invalida el chequeo de plan existente ya hecho
  useEffect(() => { setExistingBlock(null); }, [selAthlete, periodStart]);

  // ── Reset / nav ───────────────────────────────────────────────────
  const resetCreate = () => {
    setStep(1); setSel(''); setObs('');
    setIdList([]); setSelFocos(new Set()); setDumpQuality(null); setLastIdentifiedObs(null);
    setGenFocos([]); setFeedback(''); setGenLog([]); setPromptVer(null); setValidacion({});
    setGErr(null); setSErr(null);
    setDraftPlanId(null); setExistingBlock(null); setCheckingExisting(false);
  };
  const goCreate = () => { resetCreate(); setView('create'); };
  const goList   = () => { setView('list'); setActivePlan(null); };

  // ── Draft persistente: guardar checkpoint (best-effort, no bloquea) ─
  const persistDraft = async (fields) => {
    if (!draftPlanId) return;
    try {
      await supabase.from('quarterly_plans').update(fields).eq('id', draftPlanId);
    } catch (e) {
      console.warn('No se pudo guardar el borrador:', e);
    }
  };

  // Hidrata el estado local del wizard a partir de un plan draft de la BD
  const hydrateFromDraft = (plan) => {
    const ds = plan.draft_state ?? {};
    setDraftPlanId(plan.id);
    setObs(plan.raw_input ?? '');
    setIdList(ds.identified ?? []);
    setSelFocos(new Set(ds.selFocos ?? []));
    setDumpQuality(ds.dumpQuality ?? null);
    setGenFocos(ds.genFocos ?? []);
    setGenLog(ds.genLog ?? []);
    setPromptVer(ds.promptVer ?? null);
    setLastIdentifiedObs((ds.identified?.length ?? 0) > 0 ? (plan.raw_input ?? '').trim() : null);
    setFeedback('');
    setValidacion({});
    setGErr(null); setSErr(null);
    setStep(ds.step ?? 2);
    // Retomar un borrador con focos ya generados: re-corre la validación aparte, no se persiste.
    if ((ds.genFocos ?? []).length > 0) runValidate(ds.genFocos);
  };

  // ── Paso 1 → 2: valida que no exista ya un plan para atleta+periodo ─
  const handleStep1Continue = async () => {
    if (!selAthlete || !periodStart) return;
    setCheckingExisting(true); setExistingBlock(null); setGErr(null);
    try {
      const { data: existing, error } = await supabase
        .from('quarterly_plans')
        .select('id, status, raw_input, draft_state')
        .eq('athlete_id', selAthlete)
        .eq('period_start', periodStart)
        .neq('status', 'archived')
        .maybeSingle();
      if (error) throw error;

      if (existing?.status === 'draft') {
        hydrateFromDraft(existing);
        return;
      }
      if (existing) {
        setExistingBlock(existing);
        return;
      }

      const { data: created, error: cErr } = await supabase
        .from('quarterly_plans')
        .insert({
          athlete_id:   selAthlete,
          coach_id:     user.coach_id,
          period_start: periodStart,
          period_end:   periodEnd,
          status:       'draft',
        })
        .select('id')
        .single();
      if (cErr) throw cErr;
      setDraftPlanId(created.id);
      setStep(2);
    } catch (e) {
      setGErr(e.message ?? 'Error al validar si ya existe un plan para este atleta y periodo');
    } finally {
      setCheckingExisting(false);
    }
  };

  // ── Paso 2 → 3: identificar sub-dimensiones del dump ──────────────
  const handleIdentify = async () => {
    if (!observations.trim()) return;
    // Sin cambios en el dump desde la última identificación: no vuelvas a llamar al modelo,
    // solo avanza con lo que ya se identificó (evita regenerar focos al ir y volver del paso 2).
    if (lastIdentifiedObs !== null && observations.trim() === lastIdentifiedObs && identified.length > 0) {
      setStep(3);
      return;
    }
    setIdent(true); setGErr(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quarterly-plan', {
        body: { mode: 'identify', observations },
      });
      if (error) throw error;
      let list = data?.identified ?? [];
      if (!list.length) throw new Error('No se identificaron sub-dimensiones. Agrega más detalle al texto.');
      const quality = data?.dump_quality ?? null;

      // Carryover: focos del plan anterior del atleta
      let carryover = new Set();
      try {
        const { data: prior } = await supabase
          .from('quarterly_plans')
          .select('id')
          .eq('athlete_id', selAthlete)
          .in('status', ['active', 'completed'])
          .lt('period_start', periodStart)
          .order('period_start', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (prior?.id) {
          const { data: pObjs } = await supabase
            .from('quarterly_plan_objectives')
            .select('sub_dimension')
            .eq('plan_id', prior.id)
            .eq('tipo', 'foco');
          carryover = new Set((pObjs ?? []).map(o => o.sub_dimension));
        }
      } catch { /* sin plan anterior */ }

      // Ordenar por urgencia (alta → baja) para que la priorización guíe la selección
      list = list
        .map(it => ({ ...it, carryover: carryover.has(it.sub_dimension) }))
        .sort(byUrgencia);
      // Pre-seleccionar las candidatas más urgentes hasta el límite
      const pre = new Set();
      list.filter(it => it.candidata_a_foco).sort(byUrgencia).slice(0, MAX_FOCOS)
        .forEach(it => pre.add(focoKey(it.dimension, it.sub_dimension)));
      setIdList(list);
      setSelFocos(pre);
      setDumpQuality(quality);
      setLastIdentifiedObs(observations.trim());
      setStep(3);
      persistDraft({
        raw_input: observations,
        draft_state: { step: 3, identified: list, selFocos: [...pre], dumpQuality: quality },
      });
    } catch (e) {
      setGErr(e.message ?? 'Error al identificar');
    } finally {
      setIdent(false);
    }
  };

  const toggleFoco = (dim, sub) => {
    const key = focoKey(dim, sub);
    setSelFocos(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < MAX_FOCOS) next.add(key);
      return next;
    });
  };

  const selectedFocoList = () =>
    identified
      .filter(it => selFocos.has(focoKey(it.dimension, it.sub_dimension)))
      // read_corto viaja hasta generate: el diagnóstico se deriva de él, no de releer el dump
      // completo desde cero (docs/scope-rubrica-observaciones.md §7).
      .map(it => ({ dimension: it.dimension, sub_dimension: it.sub_dimension, read_corto: it.read_corto }));

  // ── Validación aparte de los objetivos generados (opción 2, docs/scope-rubrica-objetivos.md §11) ──
  // Best-effort: si falla, simplemente no se muestra aviso — nunca bloquea el flujo de guardar el plan.
  const runValidate = async (focos) => {
    if (!focos.length) return;
    try {
      const { data, error } = await supabase.functions.invoke('generate-quarterly-plan', {
        body: {
          mode: 'validate',
          observations: 'n/a', // el endpoint lo exige pero validate no lo usa (compara diagnostico vs objetivo)
          focos: focos.map(f => ({
            dimension: f.dimension, sub_dimension: f.sub_dimension,
            diagnostico: f.diagnostico ?? '', objetivo: f.objetivo,
          })),
        },
      });
      if (error) throw error;
      const veredictos = data?.veredictos ?? [];
      const next = {};
      veredictos.forEach(v => { next[focoKey(v.dimension, v.sub_dimension)] = v; });
      setValidacion(next);
    } catch (e) {
      console.warn('No se pudo validar los objetivos generados:', e);
    }
  };

  // ── Paso 3 → 4: generar focos completos ───────────────────────────
  const handleGenerate = async () => {
    const focos = selectedFocoList();
    if (!focos.length) return;
    setGen(true); setGErr(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quarterly-plan', {
        body: { mode: 'generate', observations, focos },
      });
      if (error) throw error;
      const out = data?.focos ?? [];
      if (!out.length) throw new Error('No se generaron focos. Revisa el detalle de las observaciones.');
      const root = uuid();
      const promptVersion = data?.prompt_version ?? null;
      const log = [{ id: root, root_id: root, parent_id: null, mode: 'generate',
                     coach_feedback: null, output: out, prompt_version: promptVersion }];
      setGenFocos(out);
      setPromptVer(promptVersion);
      setGenLog(log);
      setFeedback('');
      setValidacion({}); // limpia veredictos de una posible generación anterior
      setStep(4);
      persistDraft({
        draft_state: { step: 4, identified, selFocos: [...selFocos], dumpQuality,
                        genFocos: out, genLog: log, promptVer: promptVersion },
      });
      runValidate(out); // best-effort, no bloquea la navegación a paso 4
    } catch (e) {
      setGErr(e.message ?? 'Error al generar');
    } finally {
      setGen(false);
    }
  };

  // ── Regenerar con feedback del coach (comentario obligatorio) ─────
  const handleRegenerate = async () => {
    if (!feedback.trim()) return; // regla dura: sin comentario no se regenera
    setGen(true); setGErr(null);
    try {
      const { data, error } = await supabase.functions.invoke('generate-quarterly-plan', {
        body: { mode: 'regenerate', observations, focos: selectedFocoList(),
                coach_feedback: feedback.trim(), prior_output: genFocos },
      });
      if (error) throw error;
      const out = data?.focos ?? [];
      if (!out.length) throw new Error('La regeneración no devolvió focos. Ajusta el comentario.');
      const last = genLog[genLog.length - 1];
      const id = uuid();
      const newVer = data?.prompt_version ?? promptVer;
      const log = [...genLog, { id, root_id: last?.root_id ?? id, parent_id: last?.id ?? null,
                                 mode: 'regenerate', coach_feedback: feedback.trim(),
                                 output: out, prompt_version: newVer }];
      setGenLog(log);
      setGenFocos(out);
      setFeedback('');
      setValidacion({}); // limpia veredictos de la versión anterior de los focos
      persistDraft({
        draft_state: { step: 4, identified, selFocos: [...selFocos], dumpQuality,
                        genFocos: out, genLog: log, promptVer: newVer },
      });
      runValidate(out); // best-effort, no bloquea la revisión del coach
    } catch (e) {
      setGErr(e.message ?? 'Error al regenerar');
    } finally {
      setGen(false);
    }
  };

  // ── Guardar plan + objetivos + log de generación ──────────────────
  const handleSavePlan = async () => {
    if (!selAthlete || !genFocos.length) return;
    if (!draftPlanId) { setSErr('No se encontró el borrador de este plan. Vuelve al paso 1 e inténtalo de nuevo.'); return; }
    setSav(true); setSErr(null);
    try {
      const { error: pErr } = await supabase
        .from('quarterly_plans')
        .update({
          raw_input:   observations,
          status:      'active',
          draft_state: null,
        })
        .eq('id', draftPlanId);
      if (pErr) throw pErr;
      const plan = { id: draftPlanId };

      // Sub-dimensiones identificadas que NO son foco → mantenimiento
      const focoKeys = new Set(genFocos.map(f => focoKey(f.dimension, f.sub_dimension)));
      const mantenimiento = identified.filter(it => !focoKeys.has(focoKey(it.dimension, it.sub_dimension)));

      const focoRows = genFocos.map((f, i) => ({
        plan_id:        plan.id,
        dimension:      f.dimension,
        sub_dimension:  f.sub_dimension,
        tipo:           'foco',
        diagnostico:    f.diagnostico ?? null,
        objetivo:       f.objetivo,
        estandar_usado: f.estandar_usado ?? null,
        anchors:        f.anchors ?? null,
        objective_text: f.objetivo, // bridge de compatibilidad: NuevoReporte/AthleteVoice aún lo leen
        sort_order:     i,
      }));
      const mantRows = mantenimiento.map((m, i) => ({
        plan_id:        plan.id,
        dimension:      m.dimension,
        sub_dimension:  m.sub_dimension,
        tipo:           'mantenimiento',
        objetivo:       'Sostener el nivel actual',
        objective_text: 'Sostener el nivel actual',
        sort_order:     genFocos.length + i,
      }));

      const { error: oErr } = await supabase
        .from('quarterly_plan_objectives')
        .insert([...focoRows, ...mantRows]);
      if (oErr) throw oErr;

      // Log de generación (lineaje) — best-effort, no bloquea el guardado
      try {
        for (const row of genLog) {
          await supabase.from('objective_generation_log').insert({
            id:                row.id,
            root_id:           row.root_id,
            parent_id:         row.parent_id,
            plan_id:           plan.id,
            athlete_id:        selAthlete,
            coach_id:          user.coach_id,
            period_start:      periodStart,
            mode:              row.mode,
            prompt_version:    row.prompt_version,
            model:             'gpt-4o-mini',
            input_observations: observations,
            coach_feedback:    row.coach_feedback,
            output:            row.output,
          });
        }
      } catch (logErr) {
        console.warn('No se pudo guardar objective_generation_log:', logErr);
      }

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

  // Reanudar un borrador desde la lista (hidrata el wizard y va a create)
  const resumeDraftFromList = async (planId) => {
    const { data } = await supabase
      .from('quarterly_plans')
      .select('id, athlete_id, period_start, raw_input, draft_state')
      .eq('id', planId)
      .single();
    if (!data) return;
    setSel(data.athlete_id);
    setPStart(data.period_start);
    hydrateFromDraft(data);
    setView('create');
  };

  const openPlan = (plan) => {
    if (plan.status === 'draft') resumeDraftFromList(plan.id);
    else openDetail(plan.id);
  };

  const handleDiscardDraft = async (e, planId) => {
    e.stopPropagation();
    if (!window.confirm('¿Descartar este borrador? Se perderá el progreso.')) return;
    await supabase.from('quarterly_plans').delete().eq('id', planId);
    setPlans(ps => ps.filter(p => p.id !== planId));
  };

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
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => openPlan(p)}
                onKeyDown={e => { if (e.key === 'Enter') openPlan(p); }}
                className="w-full flex items-center gap-4 px-4 py-3 hairline text-left hover:bg-[var(--cream)] transition cursor-pointer"
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
                {p.status === 'draft' && (
                  <button
                    onClick={e => handleDiscardDraft(e, p.id)}
                    className="text-[10px] font-semibold uppercase tracking-wide shrink-0 hover:underline"
                    style={{ color: 'var(--ink-mute)' }}>
                    Descartar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Shell>
  );

  // ────────────────────────────────────────────────────────────────────
  // RENDER — CREATE
  // ────────────────────────────────────────────────────────────────────
  if (view === 'create') {
    const selAth = athletes.find(a => a.id === selAthlete);
    return (
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

          {/* ── Step 1: Atleta + período ──────────────────────────── */}
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
              {genError && <ErrorBox msg={genError} />}
              {existingBlock && (
                <div className="hairline p-3" style={{ background: 'rgba(220,38,38,.06)' }}>
                  <p className="text-[12px]" style={{ color: '#b91c1c', lineHeight: 1.6 }}>
                    Ya existe un plan <strong>{existingBlock.status === 'active' ? 'activo' : 'completado'}</strong> para
                    este atleta en este período. Solo puede haber un plan por atleta y periodo — archívalo o bórralo
                    desde su detalle para poder crear uno nuevo.
                  </p>
                  <button
                    onClick={() => openDetail(existingBlock.id)}
                    className="mt-2 text-[11px] font-semibold uppercase tracking-wide hairline px-3 py-1.5 hover:bg-[var(--paper)] transition">
                    Ver plan existente →
                  </button>
                </div>
              )}
              <button
                onClick={handleStep1Continue}
                disabled={!selAthlete || !periodStart || checkingExisting}
                className="px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-40 hover:opacity-90 transition"
                style={{ background: 'var(--accent)' }}>
                {checkingExisting ? 'Verificando…' : 'Continuar →'}
              </button>
            </div>
          )}

          {/* ── Step 2: Observaciones (dump) ──────────────────────── */}
          {step === 2 && (
            <div className="space-y-5 mt-6">
              <div className="hairline px-4 py-2.5" style={{ background: 'var(--cream)' }}>
                <p className="text-[11px] font-semibold" style={{ color: 'var(--ink-mute)' }}>
                  {selAth?.nombre} {selAth?.apellido}{' · '}{fmtPeriod(periodStart, periodEnd)}
                </p>
              </div>
              <div>
                <p className="text-[13px] mb-3" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
                  Escribe lo que observas de este atleta — sin formato, en tus propias palabras.
                  Técnica, táctica, físico, actitud, lo que sea. Tú describes; el sistema lo estructura.
                </p>
                <textarea
                  value={observations}
                  onChange={e => setObs(e.target.value)}
                  rows={22}
                  placeholder="Ej: El segundo saque le falta kick y lo atacan. La derecha es su arma. El revés sufre con pelota alta. Le falta selección de golpe, se apura. En el tercer set se cae físicamente. Cuando comete un error fácil tira la raqueta…"
                  className="w-full hairline px-4 py-3 text-[13px] bg-[var(--paper)] outline-none resize-y"
                  style={{ lineHeight: 1.7, minHeight: 320 }}
                />
              </div>
              {genError && <ErrorBox msg={genError} />}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
                  ← Volver
                </button>
                <button
                  onClick={handleIdentify}
                  disabled={identifying || !observations.trim()}
                  className="px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-40 hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
                  {identifying ? 'Identificando…' : 'Identificar focos →'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Selección de focos ────────────────────────── */}
          {step === 3 && (
            <div className="space-y-5 mt-6">
              <div>
                <p className="text-[13px]" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
                  Elige hasta <strong>{MAX_FOCOS} focos</strong> para este trimestre. Lo que no elijas
                  queda como <strong>mantenimiento</strong> (se sigue midiendo, pero sin objetivo dedicado).
                </p>
                <p className="text-[11px] mt-1 font-semibold" style={{ color: selFocos.size >= MAX_FOCOS ? 'var(--accent)' : 'var(--ink-mute)' }}>
                  {selFocos.size} / {MAX_FOCOS} seleccionados
                </p>
              </div>

              <FocoGroup
                title="Continúan del trimestre anterior"
                items={identified.filter(it => it.carryover)}
                selected={selFocos} limitReached={selFocos.size >= MAX_FOCOS} onToggle={toggleFoco}
              />
              <FocoGroup
                title="Identificadas en tus observaciones"
                items={identified.filter(it => !it.carryover)}
                selected={selFocos} limitReached={selFocos.size >= MAX_FOCOS} onToggle={toggleFoco}
              />

              {genError && <ErrorBox msg={genError} />}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
                  ← Volver
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={generating || selFocos.size === 0}
                  className="px-6 py-2 text-[11px] font-semibold uppercase tracking-wide text-white disabled:opacity-40 hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
                  {generating ? 'Generando…' : `Generar ${selFocos.size} foco${selFocos.size === 1 ? '' : 's'} →`}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Revisión por feedback ─────────────────────── */}
          {step === 4 && (
            <div className="space-y-6 mt-6">
              {DIM_ORDER.filter(d => genFocos.some(f => f.dimension === d)).map(dim => (
                <div key={dim}>
                  <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>
                    {DIMENSION_LABELS[dim]}
                  </p>
                  <div className="space-y-3">
                    {genFocos.filter(f => f.dimension === dim).map(f => (
                      <FocoCard key={focoKey(f.dimension, f.sub_dimension)} foco={f}
                                veredicto={validacion[focoKey(f.dimension, f.sub_dimension)]} />
                    ))}
                  </div>
                </div>
              ))}

              {genError && <ErrorBox msg={genError} />}

              {/* Regenerar por feedback */}
              <div className="hairline p-4" style={{ background: 'var(--cream)' }}>
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink-mute)' }}>
                  ¿Algo no cuadra?
                </p>
                <p className="text-[11px] mb-2" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
                  Comenta qué cambiarías y vuelve a generar. El comentario es obligatorio para regenerar.
                </p>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="Ej: El objetivo del revés es muy genérico, enfócalo en la pelota alta. Las anclas del saque deberían distinguir mejor entre drill y partido."
                  className="w-full hairline px-3 py-2 text-[12px] bg-[var(--paper)] outline-none resize-none"
                  style={{ lineHeight: 1.6 }}
                />
                <button
                  onClick={handleRegenerate}
                  disabled={generating || !feedback.trim()}
                  className="mt-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--paper)] transition disabled:opacity-40">
                  {generating ? 'Regenerando…' : '↻ Regenerar con mi comentario'}
                </button>
              </div>

              {saveError && <ErrorBox msg={saveError} />}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition">
                  ← Focos
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
  }

  // ────────────────────────────────────────────────────────────────────
  // RENDER — DETAIL
  // ────────────────────────────────────────────────────────────────────
  if (view === 'detail' && activePlan) {
    const objs = (activePlan.quarterly_plan_objectives ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order);
    const focos = objs.filter(o => (o.tipo ?? 'foco') === 'foco');
    const mant  = objs.filter(o => o.tipo === 'mantenimiento');

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
              {DIM_ORDER.filter(d => focos.some(o => o.dimension === d)).map(dim => (
                <div key={dim}>
                  <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>
                    {DIMENSION_LABELS[dim]}
                  </p>
                  <div className="space-y-3">
                    {focos.filter(o => o.dimension === dim).map(o => (
                      <FocoCard
                        key={o.id}
                        foco={{
                          sub_dimension:  o.sub_dimension,
                          diagnostico:    o.diagnostico,
                          objetivo:       o.objetivo ?? o.objective_text,
                          estandar_usado: o.estandar_usado,
                          anchors:        o.anchors,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {mant.length > 0 && (
                <div>
                  <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>
                    Mantenimiento
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {mant.map(o => (
                      <span key={o.id}
                            className="text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide hairline"
                            style={{ color: 'var(--ink-mute)', background: 'var(--paper)' }}>
                        {SUB_LABEL[o.sub_dimension] ?? o.sub_dimension}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
  const steps = ['Atleta y período', 'Observaciones', 'Focos', 'Revisión'];
  return (
    <div className="flex items-center gap-0 mb-1 flex-wrap">
      {steps.map((label, i) => {
        const n = i + 1;
        const done   = n < current;
        const active = n === current;
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

function FocoGroup({ title, items, selected, limitReached, onToggle }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>{title}</p>
      <div className="space-y-1.5">
        {items.map(it => {
          const key = focoKey(it.dimension, it.sub_dimension);
          const isSel = selected.has(key);
          const disabled = !isSel && limitReached;
          return (
            <button
              key={key}
              onClick={() => onToggle(it.dimension, it.sub_dimension)}
              disabled={disabled}
              className="w-full flex items-start gap-3 px-4 py-3 hairline text-left transition disabled:opacity-40"
              style={{ background: isSel ? 'var(--cream)' : 'var(--paper)',
                       borderColor: isSel ? 'var(--accent)' : undefined }}>
              <span className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center text-[10px] font-bold"
                    style={{ background: isSel ? 'var(--accent)' : 'transparent',
                             border: isSel ? 'none' : '1px solid var(--border)',
                             color: 'white' }}>
                {isSel ? '✓' : ''}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold">
                    {SUB_LABEL[it.sub_dimension] ?? it.sub_dimension}
                  </span>
                  <span className="text-[9px] uppercase tracking-wide" style={{ color: 'var(--ink-mute)' }}>
                    {DIMENSION_LABELS[it.dimension]}
                  </span>
                  {it.candidata_a_foco && <UrgenciaChip urgencia={it.urgencia} />}
                </span>
                <span className="block text-[11px] mt-0.5" style={{ color: 'var(--ink-mute)', lineHeight: 1.5 }}>
                  {it.read_corto}
                </span>
                {it.candidata_a_foco && it.observacion_suficiente === false && (
                  <span className="block text-[10.5px] mt-1 font-medium" style={{ color: '#a16207' }}>
                    Mencionaste esto pero no hay un área de mejora concreta — vuelve y agrega más detalle, o déjalo en mantenimiento.
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UrgenciaChip({ urgencia }) {
  const map = {
    alta:  { label: 'urgente',     bg: 'rgba(220,38,38,.12)',  color: '#b91c1c' },
    media: { label: 'a trabajar',  bg: 'rgba(234,179,8,.15)',  color: '#a16207' },
    baja:  { label: 'menor',       bg: 'rgba(107,114,128,.12)', color: '#6b7280' },
  };
  const s = map[urgencia] ?? map.media;
  return (
    <span className="text-[9px] font-semibold px-1.5 py-0.5 uppercase tracking-wide"
          style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function FocoCard({ foco, veredicto }) {
  // Aviso condicional por foco (docs/scope-rubrica-objetivos.md §11) — sustituye la caja fija de
  // "Qué revisar" que antes vivía arriba de todos los focos. `veredicto` viene del modo `validate`
  // (pasada de validación aparte); mientras no llega, no se muestra nada (silencioso, no bloquea).
  const insuficiente = veredicto && veredicto.objetivo_suficiente === false;
  return (
    <div className="hairline px-4 py-3" style={{ background: 'var(--paper)' }}>
      <div className="flex items-center gap-2 mb-1.5">
        <p className="eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>
          {SUB_LABEL[foco.sub_dimension] ?? foco.sub_dimension}
        </p>
        {foco.estandar_usado && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 uppercase tracking-wide"
                style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}>
            {foco.estandar_usado}
          </span>
        )}
      </div>
      {foco.diagnostico && (
        <p className="text-[11px] italic mb-1.5" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
          {foco.diagnostico}
        </p>
      )}
      <p className="text-[13px] font-medium leading-relaxed mb-2">{foco.objetivo}</p>
      {foco.anchors && <AnchorList anchors={foco.anchors} />}
      {insuficiente && (
        <p className="text-[10.5px] mt-2 font-medium" style={{ color: '#a16207' }}>
          Revisa este objetivo antes de guardar: {formatObjetivoMotivo(veredicto.objetivo_motivo)}.
        </p>
      )}
    </div>
  );
}

function AnchorList({ anchors }) {
  return (
    <div className="mt-2 space-y-0.5">
      {ANCHOR_LEVELS.map(([k, label]) => (
        <div key={k} className="flex items-start gap-2 text-[11px]" style={{ lineHeight: 1.5 }}>
          <span className="w-6 shrink-0 font-bold tabular-nums"
                style={{ color: k.startsWith('-') ? '#b91c1c' : k === '0' ? 'var(--ink-mute)' : '#15803d' }}>
            {k}
          </span>
          <span className="w-[88px] shrink-0 text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-mute)' }}>
            {label}
          </span>
          <span className="flex-1" style={{ color: 'var(--ink)' }}>{anchors[k]}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active:    { label: 'Activo',     bg: 'rgba(22,163,74,.1)',   color: '#15803d' },
    draft:     { label: 'Borrador',   bg: 'rgba(234,179,8,.12)',  color: '#a16207' },
    completed: { label: 'Completado', bg: 'rgba(59,130,246,.12)', color: '#1d4ed8' },
    archived:  { label: 'Archivado',  bg: 'rgba(107,114,128,.1)', color: '#6b7280' },
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

function ErrorBox({ msg }) {
  return (
    <div className="p-3 text-[12px] text-red-700 hairline" style={{ background: 'rgba(220,38,38,.06)' }}>
      {msg}
    </div>
  );
}
