import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase';
import {
  calcCat, avg, ocAvgLabel, fmtSign, fmtPeriod, fmtPeriodLong, winLossRecord,
  STROKE_KEYS as OC_STROKE_KEYS,
  TACTIC_KEYS as OC_TACTIC_KEYS,
  STROKE_LABELS,
  TACTIC_LABELS,
  TACTIC_DESCS,
  OC_LABEL,
} from '../../../lib/athletics.js';

const OC_ALL_KEYS = [...OC_STROKE_KEYS, ...OC_TACTIC_KEYS];

function scoreColor(v) {
  if (v == null) return 'var(--ink-mute)';
  if (v < 0)    return 'var(--bad)';
  if (v === 0)  return 'var(--ink-mute)';
  return 'var(--good)';
}

export default function AlumnoDetalle() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [athlete, setAth]   = useState(null);
  const [reports, setRep]   = useState([]);   // raw reports
  const [ocMap,   setOcMap] = useState({});   // report_id → on_court row
  const [phMap,   setPhMap] = useState({});
  const [chMap,   setChMap] = useState({});
  const [avMap,   setAvMap] = useState({});
  const [record,  setRec]   = useState({ w: 0, l: 0, total: 0 });
  const [amtp,    setAmtp]  = useState([]);   // últimos 2 períodos, desc
  const [loading, setLoad]  = useState(true);
  const [error,   setErr]   = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      // 1. Athlete
      const { data: ath, error: e1 } = await supabase
        .from('athletes')
        .select('id, nombre, apellido, fecha_nacimiento, mano_dominante, tipo_reves, altura_cm, peso_kg, email, telefono, nombre_padre, telefono_padre, escuela, grado_escolar, fecha_ingreso, utr_actual, activo, coach_id')
        .eq('id', id).single();
      if (e1) { setErr(e1.message); setLoad(false); return; }

      // 2. Reports (last 6) + record de torneos + AMTP últimos 2 períodos
      const [{ data: reps, error: e2 }, { data: tourns }, { data: amtpData }] = await Promise.all([
        supabase.from('reports').select('id, period, created_at')
          .eq('athlete_id', id).order('period', { ascending: false }).limit(6),
        supabase.from('athlete_tournaments').select('victoria, partidos_jugados').eq('athlete_id', id),
        supabase.from('amtp_rankings').select('posicion, puntos, periodo')
          .eq('athlete_id', id).order('periodo', { ascending: false }).limit(2),
      ]);
      if (e2) { setErr(e2.message); setLoad(false); return; }
      if (!cancelled) setRec(winLossRecord(tourns));

      const repIds = (reps ?? []).map(r => r.id);

      if (repIds.length === 0) {
        if (!cancelled) { setAth(ath); setRep([]); setLoad(false); }
        return;
      }

      // 3. Secciones — queries separadas para evitar problemas con PostgREST
      const [ocRes, phRes, chRes, avRes] = await Promise.all([
        supabase.from('report_on_court')
          .select('report_id, completed_at, utr, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido, tecnica_nota, tactica_nota')
          .in('report_id', repIds),
        supabase.from('report_physical')
          .select('report_id, completed_at').in('report_id', repIds),
        supabase.from('report_character')
          .select('report_id, completed_at, etica_trabajo, coachabilidad').in('report_id', repIds),
        supabase.from('report_athlete_voice')
          .select('report_id, completed_at').in('report_id', repIds),
      ]);

      const toMap = (rows) => Object.fromEntries((rows ?? []).map(r => [r.report_id, r]));

      if (!cancelled) {
        setAth(ath);
        setRep(reps ?? []);
        setOcMap(toMap(ocRes.data));
        setPhMap(toMap(phRes.data));
        setChMap(toMap(chRes.data));
        setAvMap(toMap(avRes.data));
        setAmtp(amtpData ?? []);
        setLoad(false);
      }
    }

    load().catch(e => { if (!cancelled) { setErr(e.message); setLoad(false); } });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Shell><p className="text-[var(--ink-mute)] text-sm">Cargando…</p></Shell>;
  if (error)   return <Shell><p className="text-red-500 text-sm">Error: {error}</p></Shell>;
  if (!athlete) return <Shell><p className="text-[var(--ink-mute)] text-sm">Atleta no encontrado.</p></Shell>;

  const isOwn    = athlete.coach_id === user?.coach_id;

  const lastRep  = reports[0];
  const prevRep  = reports[1];
  const lastOC   = lastRep ? ocMap[lastRep.id] : null;
  const prevOC   = prevRep ? ocMap[prevRep.id] : null;
  const lastCh   = lastRep ? chMap[lastRep.id] : null;
  const prevCh   = prevRep ? chMap[prevRep.id] : null;

  const deltaEtica = lastCh?.etica_trabajo != null && prevCh?.etica_trabajo != null
    ? lastCh.etica_trabajo - prevCh.etica_trabajo : null;
  const deltaCoach = lastCh?.coachabilidad != null && prevCh?.coachabilidad != null
    ? lastCh.coachabilidad - prevCh.coachabilidad : null;

  const currentAvg  = avg(lastOC, OC_ALL_KEYS);
  const prevAvg     = avg(prevOC, OC_ALL_KEYS);
  const deltaAvg    = currentAvg != null && prevAvg != null ? currentAvg - prevAvg : null;
  const ocLabel     = ocAvgLabel(currentAvg);

  const currentUTR  = lastOC?.utr ?? athlete.utr_actual;
  const prevUTR     = prevOC?.utr;
  const deltaUTR    = currentUTR && prevUTR ? Number(currentUTR) - Number(prevUTR) : null;

  const amtpCur     = amtp[0] ?? null;
  const amtpPrev    = amtp[1] ?? null;
  const amtpDeltaPos = amtpCur && amtpPrev ? amtpPrev.posicion - amtpCur.posicion : null;

  return (
    <Shell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-[72px] h-[88px] court-bg shrink-0" />
          <div>
            <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>Expediente</p>
            <h1 className="font-display font-extrabold text-[32px] leading-[0.95]">
              {athlete.nombre} {athlete.apellido}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
              <span><b style={{ color: 'var(--ink)' }}>{calcCat(athlete.fecha_nacimiento)}</b></span>
              <span style={{ color: 'var(--ink-mute)' }}>·</span>
              <span className="capitalize">{athlete.mano_dominante ?? '—'}</span>
              {athlete.tipo_reves && (
                <><span style={{ color: 'var(--ink-mute)' }}>·</span>
                <span>Revés {athlete.tipo_reves === 'una_mano' ? '1 mano' : '2 manos'}</span></>
              )}
              {athlete.altura_cm && (
                <><span style={{ color: 'var(--ink-mute)' }}>·</span><span>{athlete.altura_cm} cm</span></>
              )}
              {athlete.peso_kg && (
                <><span style={{ color: 'var(--ink-mute)' }}>·</span><span>{athlete.peso_kg} kg</span></>
              )}
              {athlete.fecha_ingreso && <>
                <span style={{ color: 'var(--ink-mute)' }}>·</span>
                <span>Ingreso <b style={{ color: 'var(--ink)' }}>
                  {fmtPeriod(athlete.fecha_ingreso)}
                </b></span>
              </>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px]" style={{ color: 'var(--ink-mute)' }}>
              {athlete.email && <span>{athlete.email}</span>}
              {athlete.telefono && <><span>·</span><span>{athlete.telefono}</span></>}
              {athlete.escuela && (
                <><span>·</span>
                <span>{athlete.escuela}{athlete.grado_escolar ? ` · ${athlete.grado_escolar}` : ''}</span></>
              )}
              {athlete.nombre_padre && (
                <><span>·</span>
                <span>Tutor: {athlete.nombre_padre}{athlete.telefono_padre ? ` · ${athlete.telefono_padre}` : ''}</span></>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isOwn && (
            <span className="px-3 py-1.5 text-[11px] font-mono hairline" style={{ color: 'var(--ink-mute)' }}>
              Solo lectura
            </span>
          )}
          <button
            onClick={() => navigate(`/portal/alumnos/${id}/talent-card`)}
            className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] hairline hover:bg-[var(--cream)] transition">
            Talent Card
          </button>
          {isOwn && (
            <button
              onClick={() => navigate('/portal/reportes/nuevo', { state: { athleteId: id } })}
              className="px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90 transition"
              style={{ background: 'var(--accent)' }}>
              + Nuevo reporte
            </button>
          )}
        </div>
      </div>

      {/* Headline metrics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-px hairline bg-[var(--line)] mb-6">
        <MetricCard label="UTR"            value={currentUTR ? Number(currentUTR).toFixed(1) : '—'} delta={deltaUTR} deltaLabel="vs mes ant." />
        <MetricCard
          label="AMTP"
          value={amtpCur ? `#${amtpCur.posicion}` : '—'}
          delta={amtpDeltaPos}
          deltaLabel={amtpPrev ? `vs ${amtpPrev.periodo}` : 'vs ant.'}
          sub={!amtpCur ? 'sin ranking' : undefined}
          textValue={!amtpCur}
        />
        <MetricCard label="W / L"          value={record.total > 0 ? `${record.w}–${record.l}` : '—'}
                    sub={record.total > 0 ? `${record.total} torneo${record.total !== 1 ? 's' : ''} con resultado` : 'sin torneos con resultado'} />
        <MetricCard label="On-court"       value={ocLabel ?? '—'} delta={deltaAvg} deltaLabel="vs mes ant." textValue />
        <MetricCard label="Ética trabajo"  value={OC_LABEL[String(lastCh?.etica_trabajo)] ?? '—'} delta={deltaEtica} deltaLabel="vs mes ant." textValue />
        <MetricCard label="Coachabilidad"  value={OC_LABEL[String(lastCh?.coachabilidad)] ?? '—'} delta={deltaCoach} deltaLabel="vs mes ant." textValue />
      </div>

      {/* Strokes del último reporte */}
      {lastOC && lastOC.completed_at && (
        <div className="hairline bg-[var(--paper)] mb-6">
          <div className="px-5 py-4 hairline-b">
            <p className="eyebrow !text-[10px] mb-0.5" style={{ color: 'var(--ink-mute)' }}>Técnica · último reporte</p>
            <p className="font-display font-bold text-[16px]">
              {lastRep?.period ? fmtPeriodLong(lastRep.period) : '—'}
            </p>
          </div>
          {/* Mobile: lista de filas — Desktop: grid */}
          <div className="md:hidden">
            {OC_STROKE_KEYS.map(key => (
              <ScoreRow key={key} label={STROKE_LABELS[key]}
                        curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-6 gap-px" style={{ background: 'var(--line)' }}>
            {OC_STROKE_KEYS.map(key => (
              <DimCell key={key} label={STROKE_LABELS[key]}
                       curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          {lastOC.tecnica_nota && (
            <div className="px-5 py-3 hairline-t text-[12px]" style={{ color: 'var(--ink-soft)', background: 'var(--cream)' }}>
              {lastOC.tecnica_nota}
            </div>
          )}

          {/* Táctica — sub-dimensiones propias */}
          <div className="px-5 py-4 hairline-t hairline-b flex items-center justify-between">
            <p className="eyebrow !text-[10px]" style={{ color: 'var(--ink-mute)' }}>Táctica · último reporte</p>
            <p className="font-display font-bold text-[14px]">
              {ocAvgLabel(avg(lastOC, OC_TACTIC_KEYS)) ?? '—'}
            </p>
          </div>
          <div className="md:hidden">
            {OC_TACTIC_KEYS.map(key => (
              <ScoreRow key={key} label={TACTIC_LABELS[key]} desc={TACTIC_DESCS[key]}
                        curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-5 gap-px" style={{ background: 'var(--line)' }}>
            {OC_TACTIC_KEYS.map(key => (
              <DimCell key={key} label={TACTIC_LABELS[key]} desc={TACTIC_DESCS[key]}
                       curr={lastOC?.[key]} prev={prevOC?.[key]} />
            ))}
          </div>
          {lastOC.tactica_nota && (
            <div className="px-5 py-3 hairline-t text-[12px]" style={{ color: 'var(--ink-soft)', background: 'var(--cream)' }}>
              {lastOC.tactica_nota}
            </div>
          )}
        </div>
      )}

      {/* Historial */}
      <div>
        <h2 className="font-display font-bold text-[18px] mb-3">Historial de reportes</h2>
        {reports.length === 0 ? (
          <div className="hairline bg-[var(--paper)] p-4 md:p-8 text-center">
            <p className="text-[var(--ink-mute)] text-[13px]">Sin reportes aún.</p>
            <button onClick={() => navigate('/portal/reportes/nuevo', { state: { athleteId: id } })}
                    className="mt-3 text-[12px] font-mono uppercase hover:underline" style={{ color: 'var(--accent)' }}>
              Crear primer reporte →
            </button>
          </div>
        ) : (
          <div className="hairline bg-[var(--paper)] overflow-x-auto">
            <table className="w-full text-[12px] min-w-[480px]">
              <thead className="eyebrow text-[10px]" style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}>
                <tr>
                  <th className="text-left px-5 py-3">Periodo</th>
                  <th className="text-left px-4 py-3">On-court</th>
                  <th className="text-left px-4 py-3">Physical</th>
                  <th className="text-left px-4 py-3">Character</th>
                  <th className="text-left px-4 py-3">Athlete Voice</th>
                  <th className="text-right px-5 py-3">UTR</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => {
                  const oc = ocMap[r.id];
                  const ph = phMap[r.id];
                  const ch = chMap[r.id];
                  const av = avMap[r.id];
                  return (
                    <tr key={r.id} className="hairline-t hover:bg-[var(--cream)] transition">
                      <td className="px-5 py-3 font-display font-bold">
                        {fmtPeriodLong(r.period)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusDot done={!!oc?.completed_at} label={oc ? ocAvgLabel(avg(oc, OC_ALL_KEYS)) : null} />
                      </td>
                      <td className="px-4 py-3"><StatusDot done={!!ph?.completed_at} /></td>
                      <td className="px-4 py-3"><StatusDot done={!!ch?.completed_at} label={ch ? ocAvgLabel(avg(ch, ['etica_trabajo', 'coachabilidad'])) : null} /></td>
                      <td className="px-4 py-3"><StatusDot done={!!av?.completed_at} /></td>
                      <td className="px-5 py-3 text-right font-num font-black text-[16px] tnum">
                        {oc?.utr ? Number(oc.utr).toFixed(1) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Shell>
  );
}

function MetricCard({ label, value, delta, deltaLabel, sub, textValue = false, wide = false }) {
  return (
    <div className={`bg-[var(--paper)] px-5 py-4${wide ? ' col-span-2 md:col-span-1' : ''}`}>
      <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      {textValue
        ? <p className="font-display font-bold text-[18px] leading-tight">{value}</p>
        : <p className="font-num font-black text-[40px] leading-none tnum">{value}</p>
      }
      {delta != null && (
        <p className="text-[11px] font-mono mt-1.5 font-bold"
           style={{ color: delta > 0 ? 'var(--good)' : delta < 0 ? 'var(--bad)' : 'var(--ink-mute)' }}>
          {delta > 0 ? '+' : ''}{delta.toFixed(2)} {deltaLabel}
        </p>
      )}
      {delta == null && sub && (
        <p className="text-[10px] mt-1.5" style={{ color: 'var(--ink-mute)' }}>{sub}</p>
      )}
    </div>
  );
}

function ScoreRow({ label, desc, curr, prev }) {
  const delta = curr != null && prev != null ? curr - prev : null;
  return (
    <div className="flex items-center justify-between px-5 py-3 bg-[var(--paper)] hairline-b" title={desc}>
      <span className="text-[13px] font-medium" style={{ color: 'var(--ink-soft)' }}>{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-num font-black text-[22px] tnum leading-none" style={{ color: scoreColor(curr) }}>
          {curr != null ? fmtSign(curr) : '—'}
        </span>
        <span className="text-[11px] font-medium w-20 text-right" style={{ color: scoreColor(curr) }}>
          {OC_LABEL[String(curr)] ?? ''}
        </span>
        {delta != null && (
          <span className="text-[11px] font-mono w-10 text-right font-bold"
                style={{ color: delta > 0 ? 'var(--good)' : delta < 0 ? 'var(--bad)' : 'var(--ink-mute)' }}>
            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}

function DimCell({ label, desc, curr, prev }) {
  const delta = curr != null && prev != null ? curr - prev : null;
  return (
    <div className="bg-[var(--paper)] px-4 py-4 text-center" title={desc}>
      <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)', cursor: desc ? 'help' : 'default' }}>
        {label}
      </p>
      <p className="font-num font-black text-[28px] tnum leading-none" style={{ color: scoreColor(curr) }}>
        {curr != null ? fmtSign(curr) : '—'}
      </p>
      <p className="text-[9px] mt-1 font-medium leading-tight" style={{ color: scoreColor(curr) }}>
        {OC_LABEL[String(curr)] ?? ''}
      </p>
      {delta != null && (
        <p className="text-[10px] font-mono mt-1 font-bold"
           style={{ color: delta > 0 ? 'var(--good)' : delta < 0 ? 'var(--bad)' : 'var(--ink-mute)' }}>
          {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
        </p>
      )}
      {desc && (
        <p className="text-[9px] mt-1.5 leading-tight" style={{ color: 'var(--ink-mute)' }}>{desc}</p>
      )}
    </div>
  );
}

function StatusDot({ done, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: done ? 'var(--good)' : 'var(--line-strong)' }} />
      {label && <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{label}</span>}
    </span>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
