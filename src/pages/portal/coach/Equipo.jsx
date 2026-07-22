import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import {
  calcCat, avg, ocAvgLabel, fmtPeriodLong,
  STROKE_KEYS, TACTIC_KEYS, onboardingGaps, hasPendingPTF,
} from '../../../lib/athletics.js';

const OC_KEYS = [...STROKE_KEYS, ...TACTIC_KEYS];
const CH_KEYS = ['etica_trabajo', 'coachabilidad'];

export default function Equipo() {
  const navigate  = useNavigate();

  const [athletes,  setAthletes]  = useState([]);
  const [coaches,   setCoaches]   = useState({});   // coachId → { nombre }
  const [amtpByAth, setAmtpByAth] = useState({});   // athleteId → { posicion, periodo }
  const [repsByAth, setRepsByAth] = useState({});   // athleteId → [report, ...]
  const [ocByRep,   setOcByRep]   = useState({});   // reportId  → on_court row
  const [chByRep,   setChByRep]   = useState({});   // reportId  → character row
  const [recruitmentByAth, setRecruitmentByAth] = useState({});    // athleteId → athlete_recruitment_profile row
  const [pendingPTFByAth,  setPendingPTFByAth]  = useState(new Set()); // athleteIds con >=1 torneo sin PTF
  const [physicalBaselineByAth, setPhysicalBaselineByAth] = useState(new Set()); // athleteIds con baseline físico (T166)
  const [view,      setView]      = useState('cards');
  const [loading,   setLoad]      = useState(true);
  const [error,     setErr]       = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 1. Athletes
      const athRes = await supabase.from('athletes')
        .select('id, nombre, apellido, fecha_nacimiento, coach_id, utr_actual, altura_cm, peso_kg, escuela, nombre_padre, telefono_padre, email_padre')
        .eq('activo', true)
        .order('utr_actual', { ascending: false });
      if (athRes.error) { if (!cancelled) { setErr(athRes.error.message); setLoad(false); } return; }

      const aths   = athRes.data ?? [];
      const athIds = aths.map(a => a.id);

      // 2. Coaches + AMTP ranking (período más reciente por atleta) + perfiles de reclutamiento
      //    + torneos con PTF pendiente (T161), en paralelo
      const [cchRes, amtpRes, recRes, tournRes] = await Promise.all([
        supabase.from('coaches').select('id, nombre'),
        athIds.length > 0
          ? supabase.from('amtp_rankings')
              .select('athlete_id, posicion, periodo')
              .in('athlete_id', athIds)
              .order('periodo', { ascending: false })
          : Promise.resolve({ data: [] }),
        athIds.length > 0
          ? supabase.from('athlete_recruitment_profile')
              .select('athlete_id, division_objetivo, grad_year, english_level').in('athlete_id', athIds)
          : Promise.resolve({ data: [] }),
        athIds.length > 0
          ? supabase.from('athlete_tournaments')
              .select('athlete_id, tournaments(fecha), post_tournament_forms(id)').in('athlete_id', athIds)
          : Promise.resolve({ data: [] }),
      ]);

      const coachMap = Object.fromEntries((cchRes.data ?? []).map(c => [c.id, c]));
      const recruitmentMap = Object.fromEntries((recRes.data ?? []).map(r => [r.athlete_id, r]));

      const amtpMap = {};
      for (const r of (amtpRes.data ?? [])) {
        if (!amtpMap[r.athlete_id]) amtpMap[r.athlete_id] = r;   // queda el período más reciente
      }

      const tournByAth = {};
      for (const t of (tournRes.data ?? [])) {
        if (!tournByAth[t.athlete_id]) tournByAth[t.athlete_id] = [];
        tournByAth[t.athlete_id].push({ fecha: t.tournaments?.fecha ?? null, hasForm: (t.post_tournament_forms?.length ?? 0) > 0 });
      }
      const todayISO = new Date().toISOString().slice(0, 10);
      const pendingPTFSet = new Set(
        Object.keys(tournByAth).filter(athId => hasPendingPTF(tournByAth[athId], todayISO))
      );

      if (athIds.length === 0) {
        if (!cancelled) {
          setAthletes([]); setCoaches(coachMap); setAmtpByAth(amtpMap);
          setRecruitmentByAth(recruitmentMap); setPendingPTFByAth(pendingPTFSet);
          setLoad(false);
        }
        return;
      }

      // 3. Reports for all athletes (sin cap — hace falta el historial completo para saber si
      //    ya existe algún baseline físico, T166) — la vista solo muestra los últimos 3 por atleta.
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

      const allRepIds     = Object.values(byAth).flat().map(r => r.id);
      const lastRepIds     = Object.values(byAth).map(rs => rs[0]?.id).filter(Boolean);
      const allRepIdsEver  = (reps ?? []).map(r => r.id);
      const athIdByRepId   = Object.fromEntries((reps ?? []).map(r => [r.id, r.athlete_id]));

      if (allRepIds.length === 0) {
        if (!cancelled) {
          setAthletes(aths); setCoaches(coachMap); setRepsByAth(byAth); setAmtpByAth(amtpMap);
          setRecruitmentByAth(recruitmentMap); setPendingPTFByAth(pendingPTFSet);
          setLoad(false);
        }
        return;
      }

      // 4. on_court for ALL recent reports (pill completion + metrics)
      //    character only for last report (headline metric)
      //    physical: cualquier report_physical con completed_at, en TODO el historial (no solo
      //    los últimos 3) — determina si el atleta ya tiene baseline físico (T166).
      const [ocRes, chRes, phRes] = await Promise.all([
        supabase.from('report_on_court')
          .select('report_id, completed_at, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido')
          .in('report_id', allRepIds),
        supabase.from('report_character')
          .select('report_id, completed_at, etica_trabajo, coachabilidad')
          .in('report_id', lastRepIds),
        supabase.from('report_physical')
          .select('report_id')
          .in('report_id', allRepIdsEver)
          .not('completed_at', 'is', null),
      ]);

      const toMap = rows => Object.fromEntries((rows ?? []).map(r => [r.report_id, r]));
      const physicalBaselineSet = new Set(
        (phRes.data ?? []).map(r => athIdByRepId[r.report_id]).filter(Boolean)
      );

      if (!cancelled) {
        setAthletes(aths);
        setCoaches(coachMap);
        setRepsByAth(byAth);
        setOcByRep(toMap(ocRes.data));
        setChByRep(toMap(chRes.data));
        setAmtpByAth(amtpMap);
        setRecruitmentByAth(recruitmentMap);
        setPendingPTFByAth(pendingPTFSet);
        setPhysicalBaselineByAth(physicalBaselineSet);
        setLoad(false);
      }
    }

    load().catch(e => { if (!cancelled) { setErr(e.message); setLoad(false); } });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Shell><p className="text-[var(--ink-mute)] text-sm">Cargando equipo…</p></Shell>;
  if (error)   return <Shell><p className="text-red-500 text-sm">Error: {error}</p></Shell>;

  const gapsFor = a => onboardingGaps({
    athlete: a,
    recruitment: recruitmentByAth[a.id],
    pendingPTF: pendingPTFByAth.has(a.id),
    hasPhysicalBaseline: physicalBaselineByAth.has(a.id),
  });

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[28px] leading-none">Equipo</h1>
          <p className="text-[12px] font-mono text-[var(--ink-mute)] mt-1">
            {athletes.length} atletas activos
          </p>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {athletes.length === 0 ? (
        <p className="text-[var(--ink-mute)] text-sm">Sin atletas en la academia.</p>
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {athletes.map(a => (
            <AthleteCard
              key={a.id}
              athlete={a}
              coachName={coaches[a.coach_id]?.nombre}
              amtp={amtpByAth[a.id]}
              reports={repsByAth[a.id] ?? []}
              ocByRep={ocByRep}
              chByRep={chByRep}
              gaps={gapsFor(a)}
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
          gapsFor={gapsFor}
          onRowClick={a => navigate(`/portal/alumnos/${a.id}`)}
        />
      )}
    </Shell>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function AthleteCard({ athlete: a, coachName, amtp, reports, ocByRep, chByRep, gaps, onClick }) {
  const lastOC  = reports[0] ? ocByRep[reports[0].id] : null;
  const lastCH  = reports[0] ? chByRep[reports[0].id] : null;
  const ocLabel = ocAvgLabel(avg(lastOC, OC_KEYS));
  const chLabel = ocAvgLabel(avg(lastCH, CH_KEYS));

  return (
    <div
      onClick={onClick}
      className="bg-[var(--paper)] cursor-pointer transition hover:bg-[var(--cream)] hairline"
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
              <GapBadges gaps={gaps} />
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

function TeamTable({ athletes, coaches, amtpByAth, repsByAth, ocByRep, chByRep, gapsFor, onRowClick }) {
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
            const amtp    = amtpByAth[a.id];
            const reports = repsByAth[a.id] ?? [];
            const lastOC  = reports[0] ? ocByRep[reports[0].id] : null;
            const lastCH  = reports[0] ? chByRep[reports[0].id] : null;
            const ocLabel = ocAvgLabel(avg(lastOC, OC_KEYS));
            const chLabel = ocAvgLabel(avg(lastCH, CH_KEYS));
            const gaps    = gapsFor(a);

            return (
              <tr
                key={a.id}
                className="hairline-t hover:bg-[var(--cream)] cursor-pointer transition"
                onClick={() => onRowClick(a)}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-9 court-bg shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="font-display font-bold text-[13px]">
                          {a.nombre} {a.apellido}
                        </div>
                        <GapBadges gaps={gaps} />
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

/**
 * Badges de onboarding pendiente (T161) — mismo tag ámbar que "Reclutamiento pendiente" ya
 * usaba. Máximo 2 visibles para no saturar la card en mobile; el resto se resume en "+N más"
 * (el desglose completo vive en AlumnoDetalle.jsx).
 */
const GAP_BADGE_CAP = 2;

function GapBadges({ gaps }) {
  if (!gaps || gaps.length === 0) return null;
  const visible = gaps.slice(0, GAP_BADGE_CAP);
  const extra   = gaps.length - visible.length;
  return (
    <>
      {visible.map(g => (
        <span key={g.key} className="tag text-[9px]" style={{ background: '#FFF6D6', color: '#8A6D00' }}>
          {g.label}
        </span>
      ))}
      {extra > 0 && (
        <span className="tag text-[9px]" style={{ background: '#FFF6D6', color: '#8A6D00' }}>
          +{extra} más
        </span>
      )}
    </>
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
