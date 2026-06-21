import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { avg, ocTo5, score5Color, fmtPeriod, normalizeSeries, SCORE5_LABEL,
         STROKE_KEYS, TACTIC_KEYS } from '../../../lib/athletics.js';

// ─── Mini sparkline ───────────────────────────────────────────────────────────

function Sparkline({ values = [], w = 120, h = 40 }) {
  const valid = values.map((v, i) => ({ v, i })).filter(p => p.v != null);
  if (valid.length < 2) return <span style={{ color: 'var(--ink-mute)', fontSize: 10 }}>—</span>;
  const P = 4;
  const n = values.length;
  const xf = i => P + (i / (n - 1)) * (w - P * 2);
  const yf = v => h - P - ((v - 1) / 4) * (h - P * 2);
  const d  = valid.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${xf(p.i).toFixed(1)},${yf(p.v).toFixed(1)}`).join(' ');
  const col = score5Color(Math.round(valid[valid.length - 1].v));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h }}>
      <path d={d} stroke={col} strokeWidth="2" fill="none" opacity="0.7" />
      {valid.map(p => (
        <circle key={p.i} cx={xf(p.i)} cy={yf(p.v)} r="2.5" fill={score5Color(Math.round(p.v))} />
      ))}
    </svg>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

function StatTile({ label, value, sub, pending }) {
  return (
    <div className="hairline p-4" style={{ background: 'var(--paper)' }}>
      <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      <p className={`font-num font-black leading-none tnum ${pending ? 'text-[20px]' : 'text-[32px]'}`}
         style={{ color: pending ? 'var(--ink-mute)' : 'var(--ink)' }}>
        {value}
      </p>
      {sub && <p className="text-[10px] mt-1.5" style={{ color: 'var(--ink-mute)' }}>{sub}</p>}
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function AtletaRendimiento() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [reports,  setReports]  = useState([]);
  const [ocMap,    setOcMap]    = useState({});
  const [chMap,    setChMap]    = useState({});
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!user?.athlete_id) return;
    let cancelled = false;

    async function load() {
      const { data: reps } = await supabase
        .from('reports').select('id, period')
        .eq('athlete_id', user.athlete_id)
        .order('period', { ascending: false }).limit(8);

      const ids = (reps ?? []).map(r => r.id);
      let oc = {}, ch = {};

      if (ids.length > 0) {
        const [ocRes, chRes] = await Promise.all([
          supabase.from('report_on_court')
            .select('report_id, utr, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido, tecnica_nota, tactica_nota')
            .in('report_id', ids),
          supabase.from('report_character')
            .select('report_id, etica_trabajo, coachabilidad, liderazgo_nota')
            .in('report_id', ids),
        ]);
        const toMap = rows => Object.fromEntries((rows ?? []).map(r => [r.report_id, r]));
        oc = toMap(ocRes.data); ch = toMap(chRes.data);
      }

      if (!cancelled) {
        setReports(reps ?? []);
        setOcMap(oc); setChMap(ch);
        setLoading(false);
      }
    }

    load().catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [user?.athlete_id]);

  if (loading) return <Shell><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></Shell>;

  // Series más antiguas → más recientes para sparklines — últimos 5 períodos
  const chrono = [...reports].reverse().slice(-5);
  const tecSeries  = chrono.map(r => { const a = avg(ocMap[r.id], STROKE_KEYS); return a != null ? ocTo5(a) : null; });
  const tacSeries  = chrono.map(r => { const a = avg(ocMap[r.id], TACTIC_KEYS); return a != null ? ocTo5(a) : null; });
  // Character is -2/+2 like on-court — convert to 1-5 via ocTo5 for consistent display
  const charSeries = chrono.map(r => {
    const c = chMap[r.id];
    if (!c) return null;
    const a = avg(c, ['etica_trabajo', 'coachabilidad']);
    return a != null ? ocTo5(a) : null;
  });
  const utrSeries  = chrono.map(r => ocMap[r.id]?.utr ? Number(ocMap[r.id].utr) : null);

  const lastRep   = reports[0];
  const lastOC    = lastRep ? ocMap[lastRep.id] : null;
  const lastCh    = lastRep ? chMap[lastRep.id] : null;
  const currentUTR = lastOC?.utr;
  const prevUTR    = reports[1] ? ocMap[reports[1].id]?.utr : null;
  const deltaUTR   = currentUTR && prevUTR ? (Number(currentUTR) - Number(prevUTR)).toFixed(2) : null;

  const tecScore  = tecSeries[tecSeries.length - 1];
  const tacScore  = tacSeries[tacSeries.length - 1];
  const charScore = charSeries[charSeries.length - 1];

  return (
    <Shell>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/portal/inicio')}
                  className="text-[12px] font-mono hover:underline" style={{ color: 'var(--ink-mute)' }}>
            ← Inicio
          </button>
          <h1 className="font-display font-extrabold text-[24px] leading-none">Mi rendimiento</h1>
        </div>

        {reports.length === 0 ? (
          <div className="hairline p-4 md:p-8 text-center" style={{ background: 'var(--paper)' }}>
            <p className="font-display font-bold text-[16px] mb-2">Sin reportes aún</p>
            <p className="text-[12px]" style={{ color: 'var(--ink-mute)' }}>
              Cuando tu coach complete tu primer reporte trimestral, aparecerá aquí tu historial de desarrollo.
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            {/* Rankings */}
            <section>
              <p className="eyebrow !text-[11px] mb-3">Rankings</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px hairline" style={{ background: 'var(--line)' }}>
                <StatTile
                  label="UTR"
                  value={currentUTR ? Number(currentUTR).toFixed(1) : '—'}
                  sub={deltaUTR != null ? `${Number(deltaUTR) > 0 ? '+' : ''}${deltaUTR} vs período anterior` : `${reports.length} período${reports.length !== 1 ? 's' : ''} evaluados`}
                />
                <StatTile label="AMTP" value="—" sub="pendiente de API" pending />
                <StatTile label="ITF" value="—" sub="pendiente de API" pending />
              </div>
              {utrSeries.filter(v => v != null).length >= 2 && (
                <div className="hairline mt-0.5 px-4 py-3" style={{ background: 'var(--paper)' }}>
                  <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)' }}>
                    UTR · últimos {chrono.length} períodos ({Math.min(...utrSeries.filter(v => v != null)).toFixed(1)} – {Math.max(...utrSeries.filter(v => v != null)).toFixed(1)})
                  </p>
                  {/* normalizeSeries escala el UTR a su propio rango para que la línea quede dentro del gráfico */}
                  <Sparkline values={normalizeSeries(utrSeries)} w={200} h={44} />
                </div>
              )}
            </section>

            {/* Evaluación del coach */}
            <section>
              <p className="eyebrow !text-[11px] mb-3">Evaluación del coach · {fmtPeriod(lastRep?.period)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Técnica */}
                <div className="hairline p-4" style={{ background: 'var(--paper)' }}>
                  <div style={{ height: 3, background: tecScore ? score5Color(Math.round(tecScore)) : 'var(--line)', marginBottom: 12 }} />
                  <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>Técnica</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-num font-black text-[32px] tnum" style={{ color: score5Color(tecScore ? Math.round(tecScore) : null) }}>
                      {tecScore != null ? Math.round(tecScore) : '—'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>/5</span>
                  </div>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: score5Color(tecScore ? Math.round(tecScore) : null) }}>
                    {SCORE5_LABEL[tecScore ? Math.round(tecScore) : null] ?? '—'}
                  </p>
                  <div className="mt-3"><Sparkline values={tecSeries} w={80} h={32} /></div>
                  {lastOC?.tecnica_nota && (
                    <p className="text-[11px] italic mt-2 leading-relaxed" style={{ color: 'var(--ink-mute)', borderLeft: '2px solid var(--accent)', paddingLeft: 6 }}>
                      "{lastOC.tecnica_nota}"
                    </p>
                  )}
                </div>

                {/* Táctica */}
                <div className="hairline p-4" style={{ background: 'var(--paper)' }}>
                  <div style={{ height: 3, background: tacScore ? score5Color(Math.round(tacScore)) : 'var(--line)', marginBottom: 12 }} />
                  <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>Táctica</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-num font-black text-[32px] tnum" style={{ color: score5Color(tacScore ? Math.round(tacScore) : null) }}>
                      {tacScore != null ? Math.round(tacScore) : '—'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>/5</span>
                  </div>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: score5Color(tacScore ? Math.round(tacScore) : null) }}>
                    {SCORE5_LABEL[tacScore ? Math.round(tacScore) : null] ?? '—'}
                  </p>
                  <div className="mt-3"><Sparkline values={tacSeries} w={80} h={32} /></div>
                  {lastOC?.tactica_nota && (
                    <p className="text-[11px] italic mt-2 leading-relaxed" style={{ color: 'var(--ink-mute)', borderLeft: '2px solid var(--accent)', paddingLeft: 6 }}>
                      "{lastOC.tactica_nota}"
                    </p>
                  )}
                </div>

                {/* Carácter */}
                <div className="hairline p-4" style={{ background: 'var(--paper)' }}>
                  <div style={{ height: 3, background: charScore ? score5Color(Math.round(charScore)) : 'var(--line)', marginBottom: 12 }} />
                  <p className="eyebrow !text-[10px] mb-2" style={{ color: 'var(--ink-mute)' }}>Carácter</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-num font-black text-[32px] tnum" style={{ color: score5Color(charScore ? Math.round(charScore) : null) }}>
                      {charScore != null ? Math.round(charScore) : '—'}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>/5</span>
                  </div>
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: score5Color(charScore ? Math.round(charScore) : null) }}>
                    {SCORE5_LABEL[charScore ? Math.round(charScore) : null] ?? '—'}
                  </p>
                  <div className="mt-3"><Sparkline values={charSeries} w={80} h={32} /></div>
                  {lastCh?.liderazgo_nota && (
                    <p className="text-[11px] italic mt-2 leading-relaxed" style={{ color: 'var(--ink-mute)', borderLeft: '2px solid var(--accent)', paddingLeft: 6 }}>
                      "{lastCh.liderazgo_nota}"
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Historial de períodos */}
            {reports.length > 1 && (
              <section>
                <p className="eyebrow !text-[11px] mb-3">Historial de períodos</p>
                <div className="hairline overflow-x-auto" style={{ background: 'var(--paper)' }}>
                  <table className="w-full text-[11px] min-w-[360px]">
                    <thead style={{ background: 'var(--cream)' }}>
                      <tr>
                        <th className="text-left px-4 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>Período</th>
                        <th className="text-center px-4 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>Técnica</th>
                        <th className="text-center px-4 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>Táctica</th>
                        <th className="text-center px-4 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>Carácter</th>
                        <th className="text-right px-4 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>UTR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r, i) => {
                        const oc  = ocMap[r.id];
                        const ch  = chMap[r.id];
                        const tec = oc ? ocTo5(avg(oc, STROKE_KEYS)) : null;
                        const tac = oc ? ocTo5(avg(oc, TACTIC_KEYS)) : null;
                        const chv = ch ? ocTo5(avg(ch, ['etica_trabajo', 'coachabilidad'])) : null;
                        return (
                          <tr key={r.id} className="hairline-t">
                            <td className="px-4 py-2.5 font-display font-bold text-[12px]">
                              {fmtPeriod(r.period)}
                              {i === 0 && <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5" style={{ background: 'rgba(139,69,19,.1)', color: 'var(--accent)' }}>Actual</span>}
                            </td>
                            <td className="px-4 py-2.5 text-center font-num font-bold" style={{ color: score5Color(tec) }}>{tec ?? '—'}</td>
                            <td className="px-4 py-2.5 text-center font-num font-bold" style={{ color: score5Color(tac) }}>{tac ?? '—'}</td>
                            <td className="px-4 py-2.5 text-center font-num font-bold" style={{ color: score5Color(chv) }}>{chv ?? '—'}</td>
                            <td className="px-4 py-2.5 text-right font-num font-black tnum" style={{ fontSize: 14 }}>
                              {oc?.utr ? Number(oc.utr).toFixed(1) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex-1 p-4 md:p-8 portal-layout">{children}</div>;
}
