import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { fmtPeriodRange } from '../../../lib/athletics.js';

// ─── Constants ─────────────────────────────────────────────────────────────────
// Mismos labels/orden que src/pages/portal/coach/PlanesCoach.jsx — se mantienen
// locales a este archivo siguiendo la convención ya usada entre coach/atleta
// (AthleteVoice.jsx tampoco comparte sus arrays de campos con PlanesCoach.jsx).

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
  // Nombres viejos (T152, 21 Jul 2026): quarterly_plan_objectives ya tiene objetivos reales
  // guardados con estas keys — generate-quarterly-plan todavía no se actualizó al protocolo
  // nuevo (fuera de alcance de T152), así que se mantienen vivos hasta que eso pase.
  sprint_20m:            'Velocidad / Sprint 20m',
  beep_test:             'Resistencia / Beep test',
  salto_vertical:        'Potencia / Salto vertical',
  spider_drill:          'Agilidad / Spider drill',
  fms:                   'Movilidad / FMS',
  fuerza_inferior:       'Fuerza tren inferior',
  fuerza_superior:       'Fuerza tren superior',
  // Nombres del protocolo RAC (T152) — para cuando generate-quarterly-plan los empiece a usar.
  velocidad_2377m:       'Velocidad',
  agilidad_5_lineas_seg: 'Agilidad',
  abdominales_30s:       'Abdominales',
  salto_vertical_cm:     'Salto vertical',
  lanzamiento_balon_mts: 'Lanzamiento de balón',
  flexibilidad_banco_pass: 'Flexibilidad',
  tiempo_1km_seg:        '1000m',
  etica_trabajo:         'Ética de trabajo',
  coachabilidad:         'Coachabilidad',
  liderazgo:             'Liderazgo',
};

const ANCHOR_LEVELS = [
  ['+2', 'Superado'],
  ['+1', 'Adelantado'],
  ['0',  'Por buen camino'],
  ['-1', 'Rezagado'],
  ['-2', 'Estancado'],
];

// docs/scope-close-quarterly-plan.md §16.3 — outcome es el estado final del objetivo
// (logrado/parcial/fallido); carryover (continúa/depriorizado) es la decisión del coach de
// si el foco sigue al periodo siguiente, no un resultado del objetivo — no se le muestra al
// atleta como si fuera un outcome.
const OUTCOME_LABELS = {
  logrado: { label: 'Logrado', bg: 'rgba(22,163,74,.12)', color: '#15803d' },
  parcial: { label: 'Parcial', bg: 'rgba(234,179,8,.15)', color: '#a16207' },
  fallido: { label: 'Fallido', bg: 'rgba(220,38,38,.12)', color: '#b91c1c' },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MiPlan() {
  const { user } = useAuth();

  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [expanded, setExpanded] = useState(null); // id del plan completado abierto

  const loadPlans = async () => {
    if (!user?.athlete_id) return;
    setLoading(true);
    const { data, error: e } = await supabase
      .from('quarterly_plans')
      .select('*, quarterly_plan_objectives(*)')
      .eq('athlete_id', user.athlete_id)
      .in('status', ['active', 'completed'])
      .order('period_start', { ascending: false });
    setError(e ? e.message : null);
    setPlans(data ?? []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch-on-mount vía función async, mismo patrón que PlanesCoach.jsx (loadPlans)
  useEffect(() => { loadPlans(); }, [user?.athlete_id]);

  const active    = plans.find(p => p.status === 'active');
  const completed = plans.filter(p => p.status === 'completed');

  if (loading) return <Shell><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></Shell>;

  return (
    <Shell>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-[28px] leading-none">Mi plan</h1>
          <p className="text-[12px] mt-1" style={{ color: 'var(--ink-mute)' }}>
            Tus objetivos del trimestre y el historial de planes anteriores.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 text-[12px] text-red-700 hairline" style={{ background: 'rgba(220,38,38,.06)' }}>
            {error}
          </div>
        )}

        {!active && completed.length === 0 && !error && (
          <p className="text-[13px]" style={{ color: 'var(--ink-mute)' }}>
            Tu coach todavía no te ha asignado un plan trimestral.
          </p>
        )}

        {active && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <p className="eyebrow !text-[10px]" style={{ color: 'var(--ink-mute)' }}>
                Plan activo · {fmtPeriodRange(active.period_start, active.period_end)}
              </p>
            </div>
            <PlanBody plan={active} />
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>
              Planes anteriores
            </p>
            <div className="space-y-1">
              {completed.map(p => {
                const isOpen = expanded === p.id;
                return (
                  <div key={p.id} className="hairline" style={{ background: 'var(--paper)' }}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : p.id)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--cream)] transition">
                      <span className="text-[13px] font-semibold">
                        {fmtPeriodRange(p.period_start, p.period_end)}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide"
                            style={{ color: 'var(--ink-mute)' }}>
                        {isOpen ? 'Ocultar ▲' : 'Ver ▼'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1">
                        <PlanBody plan={p} closed />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Cuerpo de un plan: focos por dimensión + mantenimiento. `closed` agrega outcome/final_assessment/retrospectivas. */
function PlanBody({ plan, closed = false }) {
  const objs = (plan.quarterly_plan_objectives ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const focos = objs.filter(o => (o.tipo ?? 'foco') === 'foco');
  const mant  = objs.filter(o => o.tipo === 'mantenimiento');

  if (objs.length === 0) {
    return <p className="text-[13px]" style={{ color: 'var(--ink-mute)' }}>Este plan no tiene objetivos registrados.</p>;
  }

  return (
    <div className="space-y-6">
      {DIM_ORDER.filter(d => focos.some(o => o.dimension === d)).map(dim => (
        <div key={dim}>
          <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>
            {DIMENSION_LABELS[dim]}
          </p>
          <div className="space-y-3">
            {focos.filter(o => o.dimension === dim).map(o => (
              <FocoCard key={o.id} foco={o} closed={closed} />
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

      {closed && (plan.coach_retrospective || plan.athlete_retrospective) && (
        <div className="space-y-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="eyebrow !text-[10px]" style={{ color: 'var(--ink-mute)' }}>
            Retrospectiva del periodo
          </p>
          {plan.coach_retrospective && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--ink-mute)' }}>
                Tu coach
              </p>
              <p className="text-[13px]" style={{ lineHeight: 1.6 }}>{plan.coach_retrospective}</p>
            </div>
          )}
          {plan.athlete_retrospective && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--ink-mute)' }}>
                Tú
              </p>
              <p className="text-[13px]" style={{ lineHeight: 1.6 }}>{plan.athlete_retrospective}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** No muestra `diagnostico` (se redacta pensando en el coach, no en 2ª persona para el atleta) —
 * docs/scope-mis-planes-atleta.md §4. */
function FocoCard({ foco, closed }) {
  const outcome = closed ? OUTCOME_LABELS[foco.outcome] : null;
  return (
    <div className="hairline px-4 py-3" style={{ background: 'var(--paper)' }}>
      <div className="flex items-center gap-2 mb-1.5">
        <p className="eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>
          {SUB_LABEL[foco.sub_dimension] ?? foco.sub_dimension}
        </p>
        {outcome && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 uppercase tracking-wide"
                style={{ background: outcome.bg, color: outcome.color }}>
            {outcome.label}
          </span>
        )}
      </div>
      <p className="text-[13px] font-medium leading-relaxed mb-2">{foco.objetivo ?? foco.objective_text}</p>
      {foco.anchors && <AnchorList anchors={foco.anchors} />}
      {closed && foco.final_assessment && (
        <p className="text-[12px] mt-2 italic" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
          {foco.final_assessment}
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

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
