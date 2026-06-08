import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  calcCat, calcEdad, avg, ocTo5, score5Color, fmtPeriod,
  STROKE_KEYS, TACTIC_KEYS, SCORE5_LABEL, CHAR_LABEL,
} from '../../lib/athletics.js';

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ values = [], w = 100, h = 40 }) {
  const valid = values.map((v, i) => ({ v, i })).filter(p => p.v != null);
  if (valid.length < 2) return (
    <div style={{ width: w, height: h }} className="flex items-center justify-center">
      <span style={{ color: 'var(--ink-mute)', fontSize: 9 }}>sin historial</span>
    </div>
  );
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

  const [athlete, setAth]   = useState(null);
  const [reports, setRep]   = useState([]);
  const [ocMap,   setOcMap] = useState({});
  const [chMap,   setChMap] = useState({});
  const [loading, setLoad]  = useState(true);
  const [error,   setErr]   = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      const { data: ath, error: e1 } = await supabase.from('athletes').select('*').eq('id', id).single();
      if (e1 || !ath) { setErr(e1?.message ?? 'Atleta no encontrado'); setLoad(false); return; }

      const { data: reps, error: e2 } = await supabase
        .from('reports').select('id, period')
        .eq('athlete_id', id).order('period', { ascending: false }).limit(6);
      if (e2) { setErr(e2.message); setLoad(false); return; }

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

      if (!cancelled) { setAth(ath); setRep(reps ?? []); setOcMap(oc); setChMap(ch); setLoad(false); }
    }
    load().catch(e => { if (!cancelled) { setErr(e.message); setLoad(false); } });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="flex-1 p-8"><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></div>;
  if (error)   return <div className="flex-1 p-8"><p style={{ color: 'var(--bad)', fontSize: 13 }}>Error: {error}</p></div>;
  if (!athlete) return null;

  // Series oldest → newest
  const chrono = [...reports].reverse();

  const tecSeries  = chrono.map(r => { const a = avg(ocMap[r.id], STROKE_KEYS); return a != null ? ocTo5(a) : null; });
  const tacSeries  = chrono.map(r => { const a = avg(ocMap[r.id], TACTIC_KEYS); return a != null ? ocTo5(a) : null; });
  const charSeries = chrono.map(r => {
    const c = chMap[r.id];
    if (!c) return null;
    const v = [c.etica_trabajo, c.coachabilidad].filter(x => x != null);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
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

            <div className="mt-7 grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-7">
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
                      <b style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {new Date(athlete.fecha_ingreso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' })}
                      </b>
                    </span></>
                  )}
                </div>
              </div>

              <div className="col-span-12 md:col-span-5 grid grid-cols-3 gap-px"
                   style={{ background: 'rgba(255,255,255,0.1)' }}>
                <HeaderMetric
                  label="UTR"
                  value={currentUTR ? Number(currentUTR).toFixed(1) : '—'}
                  sub={deltaUTR != null ? `${deltaUTR > 0 ? '+' : ''}${deltaUTR.toFixed(2)} vs anterior` : 'sin comparación'}
                  accent
                />
                <HeaderMetric label="AMTP" value="—" sub="pendiente API" />
                <HeaderMetric label="W / L" value="— / —" sub="pendiente datos" />
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px hairline" style={{ background: 'var(--line)' }}>
            <StatCard
              label="UTR"
              value={currentUTR ? Number(currentUTR).toFixed(1) : '—'}
              sub={deltaUTR != null ? `${deltaUTR > 0 ? '+' : ''}${deltaUTR.toFixed(2)} vs período anterior` : '—'}
              source="NuevoReporte"
            />
            <StatCard label="AMTP" value="—" sub="pendiente de conexión API" source="amtp.mx" pending />
            <StatCard label="W / L" value="— / —" sub="pendiente datos de torneo" source="PTF / torneos" pending />
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
              <div className="hairline p-5 flex items-center gap-6" style={{ background: 'var(--paper)' }}>
                <div>
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

                <Sparkline values={overallSeries} w={140} h={50} />

                <p className="text-[11px] leading-relaxed ml-auto" style={{ color: 'var(--ink-mute)', maxWidth: 200 }}>
                  Promedio de Técnica, Táctica y Carácter en los últimos {reports.length} período{reports.length !== 1 ? 's' : ''}.
                </p>
              </div>

              {/* Notas del coach por dimensión */}
              <div className="grid grid-cols-3 gap-4">
                <NoteCard label="Técnica"             note={lastOC?.tecnica_nota} />
                <NoteCard label="Táctica"             note={lastOC?.tactica_nota} />
                <NoteCard label="Carácter / Liderazgo" note={lastCh?.liderazgo_nota} />
              </div>

              {/* Señal de carácter */}
              {lastCh && (lastCh.etica_trabajo || lastCh.coachabilidad) && (
                <div className="hairline p-4" style={{ background: 'var(--cream)' }}>
                  <p className="eyebrow !text-[9px] mb-3" style={{ color: 'var(--ink-mute)' }}>
                    Señal de carácter · diferenciador para recruiters
                  </p>
                  <div className="flex gap-8">
                    {lastCh.etica_trabajo && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--ink-mute)' }}>Ética de trabajo</p>
                        <p className="text-[14px] font-semibold" style={{ color: score5Color(lastCh.etica_trabajo) }}>
                          {CHAR_LABEL[lastCh.etica_trabajo]}
                        </p>
                      </div>
                    )}
                    {lastCh.coachabilidad && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wide mb-1" style={{ color: 'var(--ink-mute)' }}>Coachabilidad</p>
                        <p className="text-[14px] font-semibold" style={{ color: score5Color(lastCh.coachabilidad) }}>
                          {CHAR_LABEL[lastCh.coachabilidad]}
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
        <Section eyebrow="04 · Percepción: Coach vs. Atleta" tag="Para el recruiter">
          <div className="hairline p-8 text-center" style={{ background: 'var(--cream)' }}>
            <p className="font-display font-bold text-[16px] mb-2">En construcción</p>
            <p className="text-[12px]" style={{ color: 'var(--ink-mute)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
              Cuando el atleta complete sus PTFs y se conecte a la base de datos, esta sección mostrará
              el gap entre la evaluación del coach y la autopercepción del atleta en Técnica, Mental y Físico.
            </p>
          </div>
        </Section>

        {/* ── 05 · Especialistas ─────────────────────────────────────────── */}
        <Section eyebrow="05 · Especialistas">
          <div className="grid grid-cols-3 gap-4">
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
