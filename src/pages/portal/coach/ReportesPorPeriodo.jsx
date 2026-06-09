import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Icon } from '../../../components/portal/ui';

// ─── helpers ─────────────────────────────────────────────────────────────────

function firstOfMonth(year, month) {
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

function labelPeriod(dateStr) {
  const [y, m] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, 1)
    .toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
}

function prevPeriod(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  const d = new Date(y, m - 2, 1);
  return firstOfMonth(d.getFullYear(), d.getMonth() + 1);
}

function nextPeriod(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  const d = new Date(y, m, 1);
  return firstOfMonth(d.getFullYear(), d.getMonth() + 1);
}

// ─── cell components ──────────────────────────────────────────────────────────

// ─── score helpers ────────────────────────────────────────────────────────────
function avg(vals) {
  const nums = vals.filter(v => v != null);
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function onCourtColor(a) {
  if (a == null) return { bg: 'var(--cream)', text: 'var(--ink-mute)' };
  if (a < -0.4) return { bg: 'rgba(220,38,38,.1)', text: '#b91c1c' };
  if (a >  0.4) return { bg: 'rgba(22,163,74,.12)', text: '#15803d' };
  return { bg: 'rgba(249,213,77,.18)', text: '#92650a' };
}
function charColor(a) {
  if (a == null) return { bg: 'var(--cream)', text: 'var(--ink-mute)' };
  if (a < 2.5) return { bg: 'rgba(220,38,38,.1)', text: '#b91c1c' };
  if (a > 3.5) return { bg: 'rgba(22,163,74,.12)', text: '#15803d' };
  return { bg: 'rgba(249,213,77,.18)', text: '#92650a' };
}
function ScoreBadge({ value, fmt, colors, title }) {
  return (
    <span
      className="inline-flex items-center justify-center text-[11px] font-bold tabular-nums px-2 py-0.5"
      style={{ background: colors.bg, color: colors.text, borderRadius: 4, minWidth: 36 }}
      title={title}
    >
      {fmt(value)}
    </span>
  );
}

function SectionCell({ data, type, noReport }) {
  if (noReport) return <span className="font-mono text-[13px]" style={{ color: 'var(--ink-mute)' }}>—</span>;
  if (!data?.completed_at) {
    return (
      <span
        className="inline-block w-6 h-6 rounded-full"
        style={{ border: '1.5px solid var(--ink-mute)', opacity: 0.25 }}
      />
    );
  }
  const date = new Date(data.completed_at).toLocaleDateString('es-MX');

  if (type === 'oncourt') {
    const score = avg([data.serve, data.forehand, data.backhand, data.volea,
                       data.devolucion, data.footwork, data.seleccion_golpe,
                       data.manejo_riesgo, data.puntos_clave, data.adaptacion_tactica,
                       data.transferencia_partido]);
    return <ScoreBadge value={score} colors={onCourtColor(score)}
      fmt={v => v == null ? '—' : (v > 0 ? `+${v.toFixed(1)}` : v.toFixed(1))}
      title={`On-court avg · ${date}`} />;
  }
  if (type === 'character') {
    const score = avg([data.etica_trabajo, data.coachabilidad]);
    return <ScoreBadge value={score} colors={charColor(score)}
      fmt={v => v == null ? '—' : v.toFixed(1)}
      title={`Character avg · ${date}`} />;
  }
  if (type === 'physical') {
    const done = [data.sprint_20m, data.salto_vertical_cm, data.spider_drill_seg,
                  data.sentadillas_1min, data.lagartijas_1min, data.beep_test_nivel]
                 .filter(v => v != null).length;
    const colors = done >= 4 ? { bg: 'rgba(22,163,74,.12)', text: '#15803d' }
                 : done >= 2 ? { bg: 'rgba(249,213,77,.18)', text: '#92650a' }
                 :             { bg: 'var(--cream)', text: 'var(--ink-mute)' };
    return <ScoreBadge value={done} colors={colors} fmt={v => `${v}/6`}
      title={`${done} de 6 tests · ${date}`} />;
  }
  return null;
}

function AthleteVoiceCell({ completedAt, noReport }) {
  if (noReport) return <span className="font-mono text-[13px]" style={{ color: 'var(--ink-mute)' }}>—</span>;
  if (completedAt) {
    return (
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full"
        style={{ background: 'var(--good)', color: '#fff' }}
        title={new Date(completedAt).toLocaleDateString('es-MX')}
      >
        <Icon name="check" size={13} stroke={2.5} />
      </span>
    );
  }
  // Report exists but athlete hasn't submitted voice
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5"
      style={{ background: '#fff3cd', color: '#a07000', borderRadius: 4 }}
    >
      <Icon name="flag" size={11} stroke={2} />
      Pendiente
    </span>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ReportesPorPeriodo() {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const today = new Date();
  const [period, setPeriod] = useState(firstOfMonth(today.getFullYear(), today.getMonth() + 1));
  const [rows,   setRows]   = useState([]);   // { athlete, report | null }
  const [loading, setLoad]  = useState(true);
  const [error,   setErr]   = useState(null);

  useEffect(() => {
    if (!user?.coach_id) return;
    let cancelled = false;

    async function load() {
      setLoad(true);
      setErr(null);

      // 1. Athletes
      const { data: athletes, error: aErr } = await supabase
        .from('athletes')
        .select('id, nombre, apellido, fecha_nacimiento')
        .eq('coach_id', user.coach_id)
        .eq('activo', true)
        .order('apellido');

      if (cancelled) return;
      if (aErr) { setErr(aErr.message); setLoad(false); return; }
      if (!athletes?.length) { setRows([]); setLoad(false); return; }

      // 2. Reports for this period (with sub-sections + scores for badge display)
      const { data: reports, error: rErr } = await supabase
        .from('reports')
        .select(`
          id, athlete_id, period,
          report_on_court ( completed_at, serve, forehand, backhand, volea, devolucion,
            footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica,
            transferencia_partido ),
          report_physical ( completed_at, sprint_20m, salto_vertical_cm, spider_drill_seg,
            sentadillas_1min, lagartijas_1min, beep_test_nivel ),
          report_character ( completed_at, etica_trabajo, coachabilidad ),
          report_athlete_voice ( completed_at )
        `)
        .in('athlete_id', athletes.map(a => a.id))
        .eq('period', period);

      if (cancelled) return;
      if (rErr) { setErr(rErr.message); setLoad(false); return; }

      // 3. Merge
      const byAthlete = Object.fromEntries((reports ?? []).map(r => [r.athlete_id, r]));
      setRows(athletes.map(a => ({ athlete: a, report: byAthlete[a.id] ?? null })));
      setLoad(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user?.coach_id, period]);

  // ── derived stats ────────────────────────────────────────────────────────────
  const total     = rows.length;
  const conReporte = rows.filter(r => r.report).length;
  const avPendientes = rows.filter(r => r.report && !r.report.report_athlete_voice?.[0]?.completed_at).length;

  return (
    <div className="flex-1 p-8 portal-layout">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Seguimiento</h1>
          <p className="text-[12px] font-mono text-[var(--ink-mute)] mt-1">
            {total} atletas · {conReporte} con reporte · {avPendientes} Athlete Voice pendiente
          </p>
        </div>

        {/* Period picker */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPeriod(prevPeriod(period))}
            className="w-8 h-8 flex items-center justify-center transition hover:opacity-70"
            style={{ border: '1px solid var(--stroke)', borderRadius: 6, color: 'var(--ink-soft)' }}
          >
            <Icon name="chevRight" size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <span className="font-display font-bold text-[14px] capitalize min-w-[140px] text-center">
            {labelPeriod(period)}
          </span>
          <button
            onClick={() => setPeriod(nextPeriod(period))}
            className="w-8 h-8 flex items-center justify-center transition hover:opacity-70"
            style={{ border: '1px solid var(--stroke)', borderRadius: 6, color: 'var(--ink-soft)' }}
          >
            <Icon name="chevRight" size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <p className="text-[var(--ink-mute)] text-sm">Cargando…</p>}
      {error   && <p className="text-red-500 text-sm">Error: {error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="text-[var(--ink-mute)] text-sm">Sin atletas registrados.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="hairline bg-[var(--paper)]">
          <table className="w-full text-[13px]">
            <thead
              className="eyebrow text-[10px]"
              style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}
            >
              <tr>
                <th className="text-left px-5 py-3">Atleta</th>
                <th className="text-center px-4 py-3">On-court</th>
                <th className="text-center px-4 py-3">Physical</th>
                <th className="text-center px-4 py-3">Character</th>
                <th className="text-center px-4 py-3">Athlete Voice</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ athlete: a, report: r }) => {
                const noReport = !r;
                // Supabase returns one-to-one (unique FK) relations as objects, not arrays
                const one = (rel) => Array.isArray(rel) ? rel[0] : (rel ?? null);
                const oc  = one(r?.report_on_court);
                const ph  = one(r?.report_physical);
                const ch  = one(r?.report_character);
                const av  = one(r?.report_athlete_voice)?.completed_at ?? null;

                return (
                  <tr
                    key={a.id}
                    className="hairline-t hover:bg-[var(--cream)] transition cursor-pointer"
                    onClick={() => navigate(`/portal/alumnos/${a.id}`)}
                  >
                    {/* Athlete */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 court-bg shrink-0" />
                        <span className="font-display font-bold text-[14px]">
                          {a.nombre} {a.apellido}
                        </span>
                      </div>
                    </td>

                    {/* Sections */}
                    <td className="px-4 py-4 text-center">
                      <SectionCell data={oc} type="oncourt" noReport={noReport} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <SectionCell data={ph} type="physical" noReport={noReport} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <SectionCell data={ch} type="character" noReport={noReport} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <AthleteVoiceCell completedAt={av} noReport={noReport} />
                    </td>

                    {/* Action */}
                    <td
                      className="px-4 py-4 text-right"
                      onClick={e => e.stopPropagation()}
                    >
                      {noReport ? (
                        <button
                          onClick={() =>
                            navigate('/portal/reportes/nuevo', {
                              state: { athleteId: a.id, period },
                            })
                          }
                          className="text-[11px] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 transition hover:opacity-80"
                          style={{ background: 'var(--accent)', color: '#fff', borderRadius: 4 }}
                        >
                          + Nuevo
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/portal/reportes/nuevo`, {
                            state: { athleteId: a.id, period },
                          })}
                          className="text-[11px] font-semibold uppercase tracking-[0.08em] px-3 py-1.5 transition hover:opacity-70"
                          style={{
                            border: '1px solid var(--stroke)',
                            color: 'var(--ink-soft)',
                            borderRadius: 4,
                          }}
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
