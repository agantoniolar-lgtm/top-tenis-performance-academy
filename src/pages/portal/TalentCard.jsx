import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  calcCat, calcEdad, avg, ocTo5, score5Color, fmtPeriod, winLossRecord,
  STROKE_KEYS, TACTIC_KEYS, SCORE5_LABEL,
} from '../../lib/athletics.js';

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ values = [], w = 100, h = 40, showValues = false }) {
  const valid = values.map((v, i) => ({ v, i })).filter(p => p.v != null);
  if (valid.length < 2) return (
    <div style={{ width: w, height: h }} className="flex items-center justify-center">
      <span style={{ color: 'var(--ink-mute)', fontSize: 9 }}>sin historial</span>
    </div>
  );
  const P = showValues ? 11 : 4;
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
      {showValues && valid.map(p => (
        <text key={`t${p.i}`} x={xf(p.i)} y={yf(p.v) - 5} textAnchor="middle"
              style={{ fontSize: 8, fontWeight: 700, fill: 'var(--ink-soft)' }}>
          {Number.isInteger(p.v) ? p.v : p.v.toFixed(1)}
        </text>
      ))}
    </svg>
  );
}

// ─── NoteCard — coach quote por dimensión ─────────────────────────────────────

function NoteCard({ label, note }) {
  return (
    <div className="hairline p-4 flex flex-col gap-2" style={{ background: 'var(--paper)' }}>
      <p className="eyebrow !text-[10px]" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      {note ? (
        <p className="text-[12px] leading-relaxed italic flex-1"
           style={{ color: 'var(--ink-soft)', borderLeft: '2px solid var(--accent)', paddingLeft: 10 }}>
          "{note}"
        </p>
      ) : (
        <p className="text-[11px] flex-1" style={{ color: 'var(--ink-mute)' }}>
          Sin nota del coach para este período.
        </p>
      )}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ eyebrow, sub, note, tag, children }) {
  return (
    <div className="hairline" style={{ background: 'var(--paper)' }}>
      <div className="px-6 py-4 hairline-b flex items-start justify-between">
        <div>
          <p className="eyebrow !text-[11px]">{eyebrow}</p>
          {sub && <p className="text-[11px] mt-0.5" style={{ color: 'var(--ink-mute)' }}>{sub}</p>}
        </div>
        <div className="flex items-center gap-2">
          {note && <span className="text-[10px] font-mono px-2 py-0.5 hairline" style={{ color: 'var(--ink-mute)' }}>🔒 {note}</span>}
          {tag  && <span className="text-[10px] font-mono px-2 py-0.5 hairline" style={{ color: 'var(--accent)' }}>{tag}</span>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function HeaderMetric({ label, value, sub, accent }) {
  return (
    <div className="px-4 py-4" style={{ background: accent ? 'var(--accent)' : 'rgba(255,255,255,0.08)', color: 'white' }}>
      <p className="text-[9px] font-mono uppercase tracking-wider mb-1" style={{ opacity: 0.7 }}>{label}</p>
      <p className="font-num font-black text-[28px] leading-none tnum">{value}</p>
      <p className="text-[9px] font-mono mt-1" style={{ opacity: 0.6 }}>{sub}</p>
    </div>
  );
}

function StatCard({ label, value, sub, source, pending }) {
  return (
    <div className="px-5 py-5" style={{ background: 'var(--paper)' }}>
      <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      <p className={`font-num font-black leading-none tnum ${pending ? 'text-[24px]' : 'text-[36px]'}`}
         style={{ color: pending ? 'var(--ink-mute)' : 'var(--ink)' }}>
        {value}
      </p>
      <p className="text-[10px] mt-2" style={{ color: 'var(--ink-mute)' }}>{sub}</p>
      <p className="text-[9px] font-mono mt-1 uppercase tracking-wide" style={{ color: 'var(--line-strong)' }}>
        fuente: {source}
      </p>
    </div>
  );
}

/**
 * Barra de percepción: punto del coach y punto del atleta sobre la misma escala.
 * Internamente usa 1–5 (ocTo5), pero se muestra con los labels cualitativos
 * de la rúbrica (Estancado … Superado) — lo que importa es ver el gap, p. ej.
 * el atleta se siente "Rezagado" y el coach lo ve "Por buen camino".
 * Si coach y atleta coinciden, se muestra un solo círculo verde.
 */
function PerceptionBar({ coach, atleta }) {
  const pos = v => `${((v - 1) / 4) * 100}%`;
  const aligned = coach != null && atleta != null && coach === atleta;
  return (
    <div>
      <div className="relative h-6">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px]" style={{ background: 'var(--line)' }} />
        {[1, 2, 3, 4, 5].map(t => (
          <span key={t} className="absolute top-1/2 -translate-y-1/2 w-[1px] h-2"
                style={{ left: pos(t), background: 'var(--line-strong)' }} />
        ))}
        {aligned ? (
          <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                title={`Coach y atleta alineados: ${SCORE5_LABEL[coach]}`}
                style={{ left: pos(coach), background: 'var(--good)', border: '2px solid var(--paper)' }} />
        ) : (
          <>
            {coach != null && (
              <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full"
                    title={`Coach: ${SCORE5_LABEL[coach]}`}
                    style={{ left: pos(coach), background: 'var(--green-deep)', border: '2px solid var(--paper)' }} />
            )}
            {atleta != null && (
              <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full"
                    title={`Atleta: ${SCORE5_LABEL[atleta]}`}
                    style={{ left: pos(atleta), background: 'var(--accent)', border: '2px solid var(--paper)' }} />
            )}
          </>
        )}
      </div>
      <div className="flex justify-between text-[9px] font-mono uppercase tracking-wide" style={{ color: 'var(--ink-mute)' }}>
        <span>{SCORE5_LABEL[1]}</span>
        <span>{SCORE5_LABEL[5]}</span>
      </div>
    </div>
  );
}

function RecruitRow({ label, value }) {
  return (
    <div>
      <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      <p className="text-[13px]" style={{ color: value ? 'var(--ink)' : 'var(--ink-mute)' }}>
        {value || '—'}
      </p>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function TalentCard() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [athlete, setAth]     = useState(null);
  const [reports, setRep]     = useState([]);
  const [ocMap,   setOcMap]   = useState({});
  const [chMap,   setChMap]   = useState({});
  const [avMap,   setAvMap]   = useState({});
  const [record,  setRecord]  = useState({ w: 0, l: 0, total: 0 });
  const [amtp,    setAmtp]    = useState([]);   // últimos 2 períodos AMTP, desc
  const [loading, setLoad]    = useState(true);
  const [error,   setErr]     = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      const [{ data: ath, error: e1 }, { data: recProfile }, { data: amtpRows }] = await Promise.all([
        supabase.from('athletes').select('*').eq('id', id).single(),
        supabase.from('athlete_recruitment_profile').select('*').eq('athlete_id', id).maybeSingle(),
        supabase.from('amtp_rankings')
          .select('posicion, puntos, periodo')
          .eq('athlete_id', id)
          .order('periodo', { ascending: false })
          .limit(2),
      ]);
      if (e1 || !ath) { setErr(e1?.message ?? 'Atleta no encontrado'); setLoad(false); return; }

      // Map DB column names → component shape
      ath.recruitment_profile = recProfile ? {
        division:      recProfile.division_objetivo,
        grad_year:     recProfile.grad_year,
        gpa:           recProfile.gpa,
        english_level: recProfile.english_level,
        study_area:    recProfile.study_area,
      } : null;

      const [{ data: reps, error: e2 }, { data: tourns }] = await Promise.all([
        supabase.from('reports').select('id, period')
          .eq('athlete_id', id).order('period', { ascending: false }).limit(5),
        supabase.from('athlete_tournaments').select('victoria, partidos_jugados').eq('athlete_id', id),
      ]);
      if (e2) { setErr(e2.message); setLoad(false); return; }

      const ids = (reps ?? []).map(r => r.id);
      let oc = {}, ch = {}, av = {};

      if (ids.length > 0) {
        const [ocRes, chRes, avRes] = await Promise.all([
          supabase.from('report_on_court')
            .select('report_id, utr, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido, tecnica_nota, tactica_nota')
            .in('report_id', ids),
          supabase.from('report_character')
            .select('report_id, etica_trabajo, coachabilidad, liderazgo_nota')
            .in('report_id', ids),
          supabase.from('report_athlete_voice')
            .select('report_id, completed_at, serve, forehand, backhand, volea, devolucion, footwork, seleccion_golpe, manejo_riesgo, puntos_clave, adaptacion_tactica, transferencia_partido, etica_trabajo, coachabilidad')
            .in('report_id', ids),
        ]);
        const toMap = rows => Object.fromEntries((rows ?? []).map(r => [r.report_id, r]));
        oc = toMap(ocRes.data); ch = toMap(chRes.data); av = toMap(avRes.data);
      }

      if (!cancelled) {
        setAth(ath); setRep(reps ?? []); setOcMap(oc); setChMap(ch); setAvMap(av);
        setRecord(winLossRecord(tourns)); setAmtp(amtpRows ?? []); setLoad(false);
      }
    }
    load().catch(e => { if (!cancelled) { setErr(e.message); setLoad(false); } });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="flex-1 p-4 md:p-8"><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></div>;
  if (error)   return <div className="flex-1 p-4 md:p-8"><p style={{ color: 'var(--bad)', fontSize: 13 }}>Error: {error}</p></div>;
  if (!athlete) return null;

  // Series oldest → newest
  const chrono = [...reports].reverse();

  const tecSeries  = chrono.map(r => { const a = avg(ocMap[r.id], STROKE_KEYS); return a != null ? ocTo5(a) : null; });
  const tacSeries  = chrono.map(r => { const a = avg(ocMap[r.id], TACTIC_KEYS); return a != null ? ocTo5(a) : null; });
  const charSeries = chrono.map(r => {
    const c = chMap[r.id];
    if (!c) return null;
    const a = avg(c, ['etica_trabajo', 'coachabilidad']);
    return a != null ? ocTo5(a) : null;
  });

  // Overall: promedio de las 3 dimensiones disponibles por período
  const overallSeries = chrono.map((_, i) => {
    const vals = [tecSeries[i], tacSeries[i], charSeries[i] != null ? charSeries[i] : null]
      .filter(v => v != null);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  });

  const lastRep = reports[0];
  const lastOC  = lastRep ? ocMap[lastRep.id] : null;
  const lastCh  = lastRep ? chMap[lastRep.id] : null;

  const currentUTR = lastOC?.utr ?? athlete.utr_actual;
  const prevUTR    = reports[1] ? ocMap[reports[1].id]?.utr : null;
  const deltaUTR   = currentUTR && prevUTR ? Number(currentUTR) - Number(prevUTR) : null;

  // AMTP ranking — últimos 2 períodos
  const amtpCur   = amtp[0] ?? null;
  const amtpPrev  = amtp[1] ?? null;
  const amtpDeltaPts = amtpCur && amtpPrev
    ? Number(amtpCur.puntos) - Number(amtpPrev.puntos)
    : null;
  const amtpDeltaPos = amtpCur && amtpPrev
    ? amtpPrev.posicion - amtpCur.posicion  // positivo = subió posiciones
    : null;

  // B5: Percepción coach vs. atleta — comparar reportes de periodo, no PTFs.
  // Usa el reporte más reciente que tenga athlete voice completado.
  const percRep = reports.find(r => avMap[r.id]?.completed_at && ocMap[r.id]);
  const percOC  = percRep ? ocMap[percRep.id] : null;
  const percCh  = percRep ? chMap[percRep.id] : null;
  const percAV  = percRep ? avMap[percRep.id] : null;
  const percRows = percRep ? [
    { label: 'Técnica', coach: ocTo5(avg(percOC, STROKE_KEYS)), atleta: ocTo5(avg(percAV, STROKE_KEYS)) },
    { label: 'Táctica', coach: ocTo5(avg(percOC, TACTIC_KEYS)), atleta: ocTo5(avg(percAV, TACTIC_KEYS)) },
    { label: 'Carácter',
      coach:  ocTo5(avg(percCh, ['etica_trabajo', 'coachabilidad'])),
      atleta: ocTo5(avg(percAV, ['etica_trabajo', 'coachabilidad'])) },
  ].filter(r => r.coach != null || r.atleta != null) : [];

  const overallNow  = overallSeries[overallSeries.length - 1];
  const overallPrev = overallSeries[overallSeries.length - 2] ?? null;
  const overallRnd  = overallNow != null ? Math.round(overallNow) : null;
  const overallDelta = overallNow != null && overallPrev != null ? overallNow - overallPrev : null;

  return (
    <div className="flex-1 min-h-screen" style={{ background: 'var(--cream)' }}>

      {/* ── Top nav ────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 hairline-b px-6 py-3 flex items-center justify-between"
           style={{ background: 'var(--paper)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/portal/alumnos/${id}`)}
                  className="text-[12px] font-mono uppercase tracking-wide hover:underline"
                  style={{ color: 'var(--ink-mute)' }}>
            ← Expediente
          </button>
          <span style={{ color: 'var(--line-strong)' }}>·</span>
          <span className="eyebrow !text-[10px]">Talent Card</span>
        </div>
        <button className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide hairline transition opacity-40 cursor-not-allowed"
                title="PDF export — en backlog">
          PDF ↓
        </button>
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-8 space-y-5">

        {/* ── Header band ─────────────────────────────────────────────────── */}
        <div className="overflow-hidden" style={{ background: 'var(--green-deep)', color: 'white' }}>
          <div className="px-8 pt-8 pb-6">
            <p className="eyebrow !text-[10px] mb-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Top Tenis Performance Academy · Talent Card
            </p>
            <p className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              TTPA · {(athlete.id ?? '').slice(0, 8).toUpperCase()} · v{new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}
            </p>

            <div className="mt-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="col-span-1 md:col-span-7">
                <p className="eyebrow !text-[10px] mb-1.5" style={{ color: 'var(--accent)' }}>
                  Atleta · {calcCat(athlete.fecha_nacimiento)} · México
                </p>
                <h1 className="font-display font-extrabold leading-[0.9] tracking-[-0.025em]"
                    style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
                  {athlete.nombre} {athlete.apellido}
                </h1>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px]"
                     style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {calcEdad(athlete.fecha_nacimiento) && <span>{calcEdad(athlete.fecha_nacimiento)} años</span>}
                  {athlete.mano_dominante && <><span>·</span><span className="capitalize">{athlete.mano_dominante}</span></>}
                  {athlete.fecha_ingreso && (
                    <><span>·</span>
                    <span>Academia desde{' '}
                      <b style={{ color: 'rgba(255,255,255,0.8)' }}>{fmtPeriod(athlete.fecha_ingreso)}</b>
                    </span></>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-5 grid grid-cols-3 gap-px"
                   style={{ background: 'rgba(255,255,255,0.1)' }}>
                <HeaderMetric
                  label="UTR"
                  value={currentUTR ? Number(currentUTR).toFixed(1) : '—'}
                  sub={deltaUTR != null ? `${deltaUTR > 0 ? '+' : ''}${deltaUTR.toFixed(2)} vs anterior` : 'sin comparación'}
                  accent
                />
                <HeaderMetric
                  label="AMTP"
                  value={amtpCur ? `#${amtpCur.posicion}` : '—'}
                  sub={
                    amtpDeltaPos != null
                      ? `${amtpDeltaPos > 0 ? '+' : ''}${amtpDeltaPos} pos vs anterior`
                      : amtpCur ? `${Number(amtpCur.puntos).toFixed(1)} pts` : 'sin ranking aún'
                  }
                />
                <HeaderMetric label="W / L"
                  value={record.total > 0 ? `${record.w} / ${record.l}` : '— / —'}
                  sub={record.total > 0 ? `${record.total} torneo${record.total !== 1 ? 's' : ''} con resultado` : 'sin resultados aún'} />
              </div>
            </div>
          </div>
        </div>

        {/* ── 01 · Perfil de reclutamiento ─────────────────────────────────── */}
        {/* Completado por el atleta durante el registro — read-only para el coach */}
        <Section
          eyebrow="01 · Perfil de reclutamiento"
          note="Completado por el atleta"
        >
          {athlete.recruitment_profile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5">
              <RecruitRow label="División objetivo"        value={athlete.recruitment_profile?.division} />
              <RecruitRow label="Graduación esperada"      value={athlete.recruitment_profile?.grad_year} />
              <RecruitRow label="GPA (promedio académico)" value={athlete.recruitment_profile?.gpa} />
              <RecruitRow label="Nivel de inglés"          value={athlete.recruitment_profile?.english_level} />
              <RecruitRow label="Área de estudio"          value={athlete.recruitment_profile?.study_area} />
            </div>
          ) : (
            <div className="hairline p-6" style={{ background: 'var(--cream)' }}>
              <p className="text-[12px]" style={{ color: 'var(--ink-mute)' }}>
                El atleta aún no ha completado su perfil de reclutamiento.
                Este perfil se llena durante el registro y puede ser actualizado por el atleta.
              </p>
              <p className="text-[10px] font-mono mt-2" style={{ color: 'var(--ink-mute)' }}>
                Campos: división objetivo · graduación · GPA · inglés · área de estudio
              </p>
            </div>
          )}
        </Section>

        {/* ── 02 · Rankings & Resultados ──────────────────────────────────── */}
        <Section eyebrow="02 · Rankings & Resultados">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px hairline" style={{ background: 'var(--line)' }}>
            <StatCard
              label="UTR"
              value={currentUTR ? Number(currentUTR).toFixed(1) : '—'}
              sub={deltaUTR != null ? `${deltaUTR > 0 ? '+' : ''}${deltaUTR.toFixed(2)} vs período anterior` : '—'}
              source="NuevoReporte"
            />
            <StatCard
              label="AMTP"
              value={amtpCur ? `#${amtpCur.posicion}` : '—'}
              sub={
                amtpDeltaPts != null
                  ? `${amtpDeltaPts > 0 ? '+' : ''}${amtpDeltaPts.toFixed(1)} pts vs ${amtpPrev.periodo}`
                  : amtpCur
                    ? `${Number(amtpCur.puntos).toFixed(1)} pts · ${amtpCur.periodo}`
                    : 'sin ranking registrado'
              }
              source="amtp.mx"
              pending={!amtpCur}
            />
            <StatCard label="W / L"
              value={record.total > 0 ? `${record.w} / ${record.l}` : '— / —'}
              sub={record.total > 0 ? `partidos · ${record.total} torneo${record.total !== 1 ? 's' : ''} con resultado` : 'sin resultados de torneo aún'}
              source="PTF / torneos" pending={record.total === 0} />
            <StatCard label="Períodos" value={String(reports.length)} sub="con reporte del coach" source="reportes" />
          </div>
          <p className="text-[11px] mt-3" style={{ color: 'var(--ink-mute)' }}>
            Con API UTR: mejor victoria por nivel de oponente, win rate por rango UTR. W/L se agrega cuando se capturen resultados de torneos.
          </p>
        </Section>

        {/* ── 03 · Lo que dice el coach ───────────────────────────────────── */}
        {/*
          Diferencia vs. Expediente:
          - Expediente = CÓMO evalúa el coach (sub-scores por golpe, todos los períodos, datos brutos)
          - Talent Card = QUÉ concluye el coach (narrativa, trayectoria global, señal de carácter)
          El recruiter no puede contextualizar "3/5 en Táctica" — sí puede leer lo que el coach escribió.
        */}
        <Section
          eyebrow="03 · Lo que dice el coach"
          sub={lastRep ? `Último período: ${fmtPeriod(lastRep.period)} · ${reports.length} período${reports.length !== 1 ? 's' : ''} de historial` : 'Sin reportes aún'}
        >
          {reports.length === 0 ? (
            <div className="hairline p-8 text-center" style={{ background: 'var(--cream)' }}>
              <p className="text-[13px]" style={{ color: 'var(--ink-mute)' }}>Sin reportes del coach aún.</p>
            </div>
          ) : (
            <div className="space-y-5">

              {/* Trayectoria global */}
              <div className="hairline p-5" style={{ background: 'var(--paper)' }}>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="shrink-0">
                    <p className="eyebrow !text-[9px] mb-1" style={{ color: 'var(--ink-mute)' }}>Trayectoria global</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-num font-black text-[48px] leading-none tnum"
                            style={{ color: score5Color(overallRnd) }}>
                        {overallNow != null ? overallNow.toFixed(1) : '—'}
                      </span>
                      <span style={{ color: 'var(--ink-mute)', fontSize: 12 }}>/5</span>
                      {overallDelta != null && (
                        <span className="text-[16px] font-bold ml-1"
                              style={{ color: overallDelta > 0.2 ? 'var(--good)' : overallDelta < -0.2 ? 'var(--bad)' : 'var(--ink-mute)' }}>
                          {overallDelta > 0.2 ? '↑' : overallDelta < -0.2 ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] font-semibold mt-0.5" style={{ color: score5Color(overallRnd) }}>
                      {SCORE5_LABEL[overallRnd] ?? '—'}
                    </p>
                  </div>
                  <Sparkline values={overallSeries} w={140} h={50} showValues />
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--ink-mute)', maxWidth: 220 }}>
                    Promedio de Técnica, Táctica y Carácter en los últimos {reports.length} período{reports.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>

              {/* Notas del coach por dimensión */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <NoteCard label="Técnica"             note={lastOC?.tecnica_nota} />
                <NoteCard label="Táctica"             note={lastOC?.tactica_nota} />
                <NoteCard label="Carácter / Liderazgo" note={lastCh?.liderazgo_nota} />
              </div>

              {/* Señal de carácter */}
              {lastCh && (lastCh.etica_trabajo != null || lastCh.coachabilidad != null) && (
                <div className="hairline p-4" style={{ background: 'var(--cream)' }}>
                  <p className="eyebrow !text-[9px] mb-3" style={{ color: 'var(--ink-mute)' }}>
                    Señal de carácter · diferenciador para recruiters
                  </p>
                  <div className="flex gap-8">
                    {lastCh.etica_trabajo != null && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--ink-mute)' }}>Ética de trabajo</p>
                        <p className="text-[14px] font-semibold" style={{ color: score5Color(ocTo5(lastCh.etica_trabajo)) }}>
                          {SCORE5_LABEL[ocTo5(lastCh.etica_trabajo)]}
                        </p>
                      </div>
                    )}
                    {lastCh.coachabilidad != null && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--ink-mute)' }}>Coachabilidad</p>
                        <p className="text-[14px] font-semibold" style={{ color: score5Color(ocTo5(lastCh.coachabilidad)) }}>
                          {SCORE5_LABEL[ocTo5(lastCh.coachabilidad)]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* ── 04 · Coach vs. Atleta ───────────────────────────────────────── */}
        <Section
          eyebrow="04 · Percepción: Coach vs. Atleta"
          tag="Para el recruiter"
          sub={percRep ? `Reporte de ${fmtPeriod(percRep.period)} · evaluación del coach vs. Athlete Voice` : undefined}
        >
          {percRows.length > 0 ? (
            <div className="space-y-4">
              {percRows.map(r => {
                const gap = r.coach != null && r.atleta != null ? r.atleta - r.coach : null;
                return (
                  <div key={r.label} className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-12 sm:items-center sm:gap-3">
                    {/* Label + valores — full width en mobile, 3 cols en sm+ */}
                    <div className="sm:col-span-3 flex sm:block items-center justify-between">
                      <div>
                        <p className="eyebrow !text-[10px]" style={{ color: 'var(--ink-mute)' }}>{r.label}</p>
                        <p className="text-[10px] leading-tight mt-0.5 hidden sm:block" style={{ color: 'var(--ink-soft)' }}>
                          Coach: <b>{SCORE5_LABEL[r.coach] ?? '—'}</b><br />
                          Atleta: <b>{SCORE5_LABEL[r.atleta] ?? '—'}</b>
                        </p>
                      </div>
                      {/* Delta visible inline en mobile, oculto en sm (aparece al final) */}
                      {gap != null && gap !== 0 && (
                        <p className="sm:hidden text-[11px] font-mono font-bold"
                           style={{ color: gap > 0 ? 'var(--accent)' : 'var(--bad)' }}>
                          {gap > 0 ? `+${gap}` : gap} atl.
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-7">
                      <PerceptionBar coach={r.coach} atleta={r.atleta} />
                    </div>
                    <p className="hidden sm:block sm:col-span-2 text-right text-[11px] font-mono font-bold"
                       style={{ color: gap == null ? 'var(--ink-mute)' : gap > 0 ? 'var(--accent)' : 'var(--bad)' }}>
                      {gap == null || gap === 0 ? '' : gap > 0 ? `+${gap} atleta` : `${gap} atleta`}
                    </p>
                  </div>
                );
              })}
              <div className="flex gap-5 pt-2 text-[10px]" style={{ color: 'var(--ink-mute)' }}>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--green-deep)' }} /> Coach
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} /> Atleta
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--good)' }} /> Alineados
                </span>
                <span className="ml-auto">Rúbrica del reporte: {SCORE5_LABEL[1]} → {SCORE5_LABEL[5]}</span>
              </div>
            </div>
          ) : (
            <div className="hairline p-8 text-center" style={{ background: 'var(--cream)' }}>
              <p className="font-display font-bold text-[16px] mb-2">Sin Athlete Voice aún</p>
              <p className="text-[12px]" style={{ color: 'var(--ink-mute)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
                Cuando el atleta complete su Athlete Voice de un período con reporte del coach,
                esta sección mostrará el gap entre la evaluación del coach y su autopercepción
                en Técnica, Táctica y Carácter.
              </p>
            </div>
          )}
        </Section>

        {/* ── 05 · Especialistas ─────────────────────────────────────────── */}
        <Section eyebrow="05 · Especialistas">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Psicólogo', 'Nutriólogo', 'Preparador Físico'].map(sp => (
              <div key={sp} className="hairline p-5 text-center" style={{ background: 'var(--cream)' }}>
                <p className="eyebrow !text-[10px] mb-1.5" style={{ color: 'var(--ink-mute)' }}>{sp}</p>
                <p className="text-[11px]" style={{ color: 'var(--ink-mute)' }}>Post-MVP</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div className="py-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider"
             style={{ color: 'var(--ink-mute)', borderTop: '0.5px solid var(--line)' }}>
          <span>TTPA · TALENT CARD · {(athlete.id ?? '').slice(0, 8).toUpperCase()}</span>
          <span>Evidencia real del coach</span>
          <span>{new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
