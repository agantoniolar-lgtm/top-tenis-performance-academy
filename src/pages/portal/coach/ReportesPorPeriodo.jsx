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

function SectionCell({ completedAt, noReport }) {
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
  return (
    <span
      className="inline-block w-6 h-6 rounded-full"
      style={{ border: '1.5px solid var(--ink-mute)', opacity: 0.35 }}
    />
  );
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

      // 2. Reports for this period (with sub-sections)
      const { data: reports, error: rErr } = await supabase
        .from('reports')
        .select(`
          id, athlete_id, period,
          report_on_court ( completed_at ),
          report_physical ( completed_at ),
          report_character ( completed_at ),
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
                const oc  = r?.report_on_court?.[0]?.completed_at ?? null;
                const ph  = r?.report_physical?.[0]?.completed_at ?? null;
                const ch  = r?.report_character?.[0]?.completed_at ?? null;
                const av  = r?.report_athlete_voice?.[0]?.completed_at ?? null;

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
                      <SectionCell completedAt={oc} noReport={noReport} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <SectionCell completedAt={ph} noReport={noReport} />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <SectionCell completedAt={ch} noReport={noReport} />
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
