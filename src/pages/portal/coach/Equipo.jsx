import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import {
  calcCat, avg, ocAvgLabel, fmtPeriodLong,
  STROKE_KEYS, TACTIC_KEYS,
} from '../../../lib/athletics.js';

const OC_KEYS = [...STROKE_KEYS, ...TACTIC_KEYS];
const CH_KEYS = ['etica_trabajo', 'coachabilidad'];

export default function Equipo() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [athletes,  setAthletes]  = useState([]);
  const [coaches,   setCoaches]   = useState({});   // coachId → { nombre }
  const [amtpByAth, setAmtpByAth] = useState({});   // athleteId → { posicion, periodo }
  const [repsByAth, setRepsByAth] = useState({});   // athleteId → [report, ...]
  const [ocByRep,   setOcByRep]   = useState({});   // reportId  → on_court row
  const [chByRep,   setChByRep]   = useState({});   // reportId  → character row
  const [view,      setView]      = useState('cards');
  const [loading,   setLoad]      = useState(true);
  const [error,     setErr]       = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1. Athletes
      const athRes = await supabase.from('athletes')
        .select('id, nombre, apellido, fecha_nacimiento, coach_id, utr_actual')
        .eq('activo', true)
        .order('utr_actual', { ascending: false });
      if (athRes.error) { if (!cancelled) { setErr(athRes.error.message); setLoad(false); } return; }

      const aths   = athRes.data ?? [];
      const athIds = aths.map(a => a.id);

      // 2. Coaches + AMTP ranking (período más reciente por atleta) en paralelo
      const [cchRes, amtpRes] = await Promise.all([
        supabase.from('coaches').select('id, nombre'),
        athIds.length > 0
          ? supabase.from('amtp_rankings')
              .select('athlete_id, posicion, periodo')
              .in('athlete_id', athIds)
              .order('periodo', { ascending: false })
          : Promise.resolve({ data: [] }),
      ]);

      const coachMap = Object.fromEntries((cchRes.data ?? []).map(c => [c.id, c]));

      const amtpMap = {};
      for (const r of (amtpRes.data ?? [])) {
        if (!amtpMap[r.athlete_id]) amtpMap[r.athlete_id] = r;   // queda el período más reciente
      }

      if (athIds.length === 0) {
        if (!cancelled) { setAthletes([]); setCoaches(coachMap); setAmtpByAth(amtpMap); setLoad(false); }
        return;
      }

      // 3. Reports for all athletes — last 3 each
      const { data: reps, error: e2 } = await supabase
        .from('reports')
        .select('id, period, athlete_id')
        .in('athlete_id', athIds)
        .order('period', { ascending: false });
      if (e2) { if (!cancelled) { setErr(e2.message); setLoad(false); } return; }

      const byAth = {};
      for (const r of (reps ?? [])) {
        if (!byAth[r.athlete_id]) byAth[r.athlete_id] = [];
        if (byAth[r.athlete_id].length < 3) byAth[r.athlete_id].push(r);
      }

      const allRepIds  = Object.values(byAth).flat().map(r => r.id);
      const lastRepIds = Object.values(byAth).map(rs => rs[0]?.id).filter(Boolean);

      if (allRepIds.length === 0) {
        if (!cancelled) { setAthletes(aths); setCoaches(coachMap); setRepsByAth(byAth); setAmtpByAth(amtpMap); setLoad(false); }
        return;
      }

      // 4. on_court for ALL recent reports (pill completion + metrics)
      //    character only for last report (headline metric)
      const [ocRes, chRes] = await Promise.all([
        supabase.from('report_on_court')
          .select('report_id, completed_at, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido')
          .in('report_id', allRepIds),
        supabase.from('report_character')
          .select('report_id, completed_at, etica_trabajo, coachabilidad')
          .in('report_id', lastRepIds),
      ]);

      const toMap = rows => Object.fromEntries((rows ?? []).map(r => [r.report_id, r]));

      if (!cancelled) {
        setAthletes(aths);
        setCoaches(coachMap);
        setRepsByAth(byAth);
        setOcByRep(toMap(ocRes.data));
        setChByRep(toMap(chRes.data));
        setAmtpByAth(amtpMap);
        setLoad(false);
      }
    }

    load().catch(e => { if (!cancelled) { setErr(e.message); setLoad(false); } });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Shell><p className="text-[var(--ink-mute)] text-sm">Cargando equipo…</p></Shell>;
  if (error)   return <Shell><p className="text-red-500 text-sm">Error: {error}</p></Shell>;

  const myCoachId = user?.coach_id;

  return (
    <Shell>
      <TabBar active="equipo" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Equipo</h1>
          <p className="text-[12px] font-mono text-[var(--ink-mute)] mt-1">
            {athletes.length} atletas activos
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <p className="text-[11px] flex items-center gap-2 mb-5" style={{ color: 'var(--ink-mute)' }}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
        Borde cobre = tus atletas. Los demás son solo lectura.
      </p>

      {athletes.length === 0 ? (
        <p className="text-[var(--ink-mute)] text-sm">Sin atletas en la academia.</p>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {athletes.map(a => (
            <AthleteCard
              key={a.id}
              athlete={a}
              isOwn={a.coach_id === myCoachId}
              coachName={coaches[a.coach_id]?.nombre}
              amtp={amtpByAth[a.id]}
              reports={repsByAth[a.id] ?? []}
              ocByRep={ocByRep}
              chByRep={chByRep}
              onClick={() => navigate(`/portal/alumnos/${a.id}`)}
            />
          ))}
        </div>
      ) : (
        <TeamTable
          athletes={athletes}
          coaches={coaches}
          amtpByAth={amtpByAth}
          repsByAth={repsByAth}
          ocByRep={ocByRep}
          chByRep={chByRep}
          myCoachId={myCoachId}
          onRowClick={a => navigate(`/portal/alumnos/${a.id}`)}
        />
      )}
    </Shell>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function AthleteCard({ athlete: a, isOwn, coachName, amtp, reports, ocByRep, chByRep, onClick }) {
  const lastOC  = reports[0] ? ocByRep[reports[0].id] : null;
  const lastCH  = reports[0] ? chByRep[reports[0].id] : null;
  const ocLabel = ocAvgLabel(avg(lastOC, OC_KEYS));
  const chLabel = ocAvgLabel(avg(lastCH, CH_KEYS));

  return (
    <div
      onClick={onClick}
      className="bg-[var(--paper)] cursor-pointer transition hover:bg-[var(--cream)] hairline"
      style={isOwn ? { borderLeft: '3px solid var(--accent)' } : {}}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-12 court-bg shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display font-bold text-[14px] leading-tight">
                {a.nombre} {a.apellido}
              </span>
              {isOwn
                ? <span className="tag text-[9px]" style={{ background: '#E8F5EE', color: '#15602E' }}>Tuyo</span>
                : <span className="tag text-[9px]" style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}>Ver</span>
              }
            </div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--ink-mute)' }}>
              {coachName ?? '—'} · {calcCat(a.fecha_nacimiento)}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-px bg-[var(--line)] hairline mb-3">
          <CardMetric label="UTR"      value={a.utr_actual ? Number(a.utr_actual).toFixed(1) : '—'} big />
          <CardMetric label="AMTP"     value={amtp ? `#${amtp.posicion}` : '—'} />
          <CardMetric label="On-court" value={ocLabel ?? '—'} />
          <CardMetric label="Carácter" value={chLabel ?? '—'} />
        </div>

        {/* Report pills */}
        {reports.length > 0 ? (
          <div>
            <div className="eyebrow !text-[9px] mb-1.5" style={{ color: 'var(--ink-mute)' }}>
              Últimos reportes
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {reports.map(r => {
                const done = !!ocByRep[r.id]?.completed_at;
                return (
                  <button
                    key={r.id}
                    onClick={e => { e.stopPropagation(); onClick(); }}
                    className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono hairline hover:bg-[var(--line)] transition"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: done ? 'var(--good)' : 'var(--line-strong)' }} />
                    {fmtPeriodLong(r.period)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-[10px]" style={{ color: 'var(--ink-mute)' }}>Sin reportes aún</p>
        )}
      </div>
    </div>
  );
}

function CardMetric({ label, value, big = false }) {
  return (
    <div className="bg-[var(--paper)] px-3 py-3 text-center">
      <p className="eyebrow !text-[9px] mb-1" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      {big
        ? <p className="font-num font-black text-[26px] leading-none tnum">{value}</p>
        : <p className="font-display font-bold text-[12px] leading-tight">{value}</p>
      }
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

function TeamTable({ athletes, coaches, amtpByAth, repsByAth, ocByRep, chByRep, myCoachId, onRowClick }) {
  return (
    <div className="hairline bg-[var(--paper)] overflow-x-auto">
      <table className="w-full text-[12px] min-w-[640px]">
        <thead className="eyebrow text-[10px]" style={{ background: 'var(--cream)', color: 'var(--ink-mute)' }}>
          <tr>
            <th className="text-left px-5 py-3">Atleta</th>
            <th className="text-left px-4 py-3 hidden md:table-cell">Cat.</th>
            <th className="text-right px-4 py-3">UTR</th>
            <th className="text-right px-4 py-3 hidden sm:table-cell">AMTP</th>
            <th className="text-left px-4 py-3 hidden lg:table-cell">On-court</th>
            <th className="text-left px-4 py-3 hidden lg:table-cell">Carácter</th>
            <th className="text-left px-5 py-3">Reportes</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map(a => {
            const isOwn   = a.coach_id === myCoachId;
            const amtp    = amtpByAth[a.id];
            const reports = repsByAth[a.id] ?? [];
            const lastOC  = reports[0] ? ocByRep[reports[0].id] : null;
            const lastCH  = reports[0] ? chByRep[reports[0].id] : null;
            const ocLabel = ocAvgLabel(avg(lastOC, OC_KEYS));
            const chLabel = ocAvgLabel(avg(lastCH, CH_KEYS));

            return (
              <tr
                key={a.id}
                className="hairline-t hover:bg-[var(--cream)] cursor-pointer transition"
                onClick={() => onRowClick(a)}
                style={isOwn ? { borderLeft: '3px solid var(--accent)' } : {}}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-9 court-bg shrink-0" />
                    <div>
                      <div className="font-display font-bold text-[13px]">
                        {a.nombre} {a.apellido}
                      </div>
                      <div className="text-[10px] font-mono" style={{ color: 'var(--ink-mute)' }}>
                        {coaches[a.coach_id]?.nombre ?? '—'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="tag" style={{ background: 'var(--cream)', color: 'var(--ink-soft)' }}>
                    {calcCat(a.fecha_nacimiento)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-num font-black text-[20px] tnum leading-none">
                    {a.utr_actual ? Number(a.utr_actual).toFixed(1) : '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden sm:table-cell" style={{ color: 'var(--ink-soft)' }}>
                  {amtp ? `#${amtp.posicion}` : '—'}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--ink-soft)' }}>
                  {ocLabel ?? '—'}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--ink-soft)' }}>
                  {chLabel ?? '—'}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5 flex-wrap">
                    {reports.length === 0 ? (
                      <span style={{ color: 'var(--ink-mute)' }}>—</span>
                    ) : reports.map(r => {
                      const done = !!ocByRep[r.id]?.completed_at;
                      const [y, m] = (r.period ?? '').split('-').map(Number);
                      const label = y
                        ? new Date(y, m - 1, 1).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })
                        : '—';
                      return (
                        <span
                          key={r.id}
                          className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono hairline"
                          style={{ color: 'var(--ink-mute)' }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: done ? 'var(--good)' : 'var(--line-strong)' }} />
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export function TabBar({ active }) {
  const navigate = useNavigate();
  return (
    <div className="flex mb-6" style={{ borderBottom: '1px solid var(--line-strong)' }}>
      {[
        { id: 'mis',    label: 'Mis atletas', path: '/portal/alumnos' },
        { id: 'equipo', label: 'Equipo',      path: '/portal/equipo'  },
      ].map(t => (
        <button
          key={t.id}
          onClick={() => navigate(t.path)}
          className="px-4 py-2.5 text-[13px] font-medium transition"
          style={{
            background: 'transparent',
            color: active === t.id ? 'var(--ink)' : 'var(--ink-mute)',
            borderBottom: active === t.id ? '2px solid var(--ink)' : '2px solid transparent',
            marginBottom: '-1px',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div className="flex gap-1">
      {[
        { id: 'cards', icon: '⊞' },
        { id: 'table', icon: '≡' },
      ].map(v => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          className="w-8 h-8 hairline flex items-center justify-center text-[15px] transition"
          style={{
            background: view === v.id ? 'var(--cream)' : 'transparent',
            color:      view === v.id ? 'var(--ink)'   : 'var(--ink-mute)',
          }}
        >
          {v.icon}
        </button>
      ))}
    </div>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
