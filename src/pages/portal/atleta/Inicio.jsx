import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { calcCat, calcEdad, fmtPeriodLong } from '../../../lib/athletics.js';

// ─── Sub-components ───────────────────────────────────────────────────────────

function OnboardingCard({ number, title, subtitle, context, done, locked, cta, onClick }) {
  return (
    <div className="hairline transition-opacity"
         style={{ background: 'var(--paper)', opacity: locked ? 0.6 : 1 }}>
      <div style={{ height: 3, background: done ? 'var(--good)' : 'var(--line)' }} />
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Big number — Big Shoulders Display */}
          <div className="shrink-0 pt-0.5">
            <span className="font-num font-bold text-[40px] leading-none"
                  style={{ color: done ? 'var(--good)' : 'var(--line-strong)' }}>
              {`0${number}`}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="font-display font-bold text-[15px]">{title}</p>
              <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide shrink-0"
                    style={{
                      background: done ? 'rgba(22,163,74,.1)' : 'rgba(220,38,38,.08)',
                      color: done ? 'var(--good)' : 'var(--bad)',
                    }}>
                {done ? 'Completo' : 'Pendiente'}
              </span>
            </div>

            {/* Field list */}
            <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--ink-mute)' }}>
              {subtitle}
            </p>

            {/* Value context */}
            <p className="text-[12px] mb-4 pl-3"
               style={{ color: 'var(--ink-soft)', borderLeft: '2px solid var(--line-strong)', lineHeight: 1.55 }}>
              {context}
            </p>

            {!done && (
              <button
                onClick={locked ? undefined : onClick}
                disabled={locked}
                className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition ${
                  locked ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                style={{ background: 'var(--accent)' }}
              >
                {cta}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="eyebrow !text-[9px] mb-0.5" style={{ color: 'var(--ink-mute)' }}>{label}</p>
      <p className="text-[13px]">{value}</p>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function AtletaInicio() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [athlete,     setAthlete]     = useState(null);
  const [recruitment, setRecruitment] = useState(null);
  const [hasPTF,      setHasPTF]      = useState(false);
  // Athlete Voice: null = no report yet, false = pending, true = done
  const [avStatus,    setAvStatus]    = useState(null);
  const [avPeriod,    setAvPeriod]    = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    async function load() {
      const [athRes, recRes, reportRes, ptfRes] = await Promise.all([
        supabase.from('athletes')
          .select('id, nombre, apellido, fecha_nacimiento, mano_dominante, tipo_reves, altura_cm, peso_kg, escuela, grado_escolar, coaches(nombre, apellido)')
          .eq('user_id', user.id).single(),
        supabase.from('athlete_recruitment_profile')
          .select('*').eq('athlete_id', user.athlete_id).maybeSingle(),
        // B9: el reporte disponible es el más reciente del coach, no el del mes en curso
        supabase.from('reports')
          .select('id, period, report_athlete_voice(completed_at)')
          .eq('athlete_id', user.athlete_id)
          .order('period', { ascending: false })
          .limit(1)
          .maybeSingle(),
        // B8: detectar si ya existe al menos un PTF
        supabase.from('post_tournament_forms')
          .select('id', { count: 'exact', head: true })
          .eq('athlete_id', user.athlete_id),
      ]);

      if (!cancelled) {
        setAthlete(athRes.data);
        setRecruitment(recRes.data);
        setHasPTF((ptfRes.count ?? 0) > 0);
        if (reportRes.data) {
          const av = Array.isArray(reportRes.data.report_athlete_voice)
            ? reportRes.data.report_athlete_voice[0]
            : reportRes.data.report_athlete_voice;
          setAvPeriod(reportRes.data.period);
          setAvStatus(av?.completed_at ? true : false);
        } else {
          setAvStatus(null); // el coach no ha creado ningún reporte aún
        }
        setLoading(false);
      }
    }

    load().catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [user?.id, user?.athlete_id]);

  if (loading) return <Shell><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></Shell>;

  const profileComplete    = !!(athlete?.altura_cm && athlete?.peso_kg && athlete?.escuela);
  const edad = calcEdad(athlete?.fecha_nacimiento);
  const showAdvancedRec = edad == null || edad >= 17;
  const recruitmentComplete = !!(recruitment?.division_objetivo && recruitment?.grad_year &&
    (!showAdvancedRec || recruitment?.english_level));
  const bothComplete        = profileComplete && recruitmentComplete;

  const cat  = calcCat(athlete?.fecha_nacimiento);

  // ── Vista: onboarding (falta al menos uno) ────────────────────────────────

  if (!bothComplete) {
    const completedCount = [profileComplete, recruitmentComplete].filter(Boolean).length;
    return (
      <Shell>
        {/* Header con proposición de valor */}
        <div className="mb-8 max-w-xl">
          <h1 className="font-display font-extrabold text-[32px] leading-none mb-3">
            Hola, {athlete?.nombre}.
          </h1>
          <p className="text-[14px] mb-4" style={{ color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Antes de que tu coach pueda darte seguimiento personalizado y construir tu expediente universitario, necesitamos un poco de información tuya.
          </p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 overflow-hidden flex-1 max-w-[180px]"
                 style={{ background: 'var(--line)' }}>
              <div className="h-full transition-all"
                   style={{ width: `${(completedCount / 2) * 100}%`, background: 'var(--accent)' }} />
            </div>
            <p className="text-[12px] font-mono" style={{ color: 'var(--ink-mute)' }}>
              {completedCount} de 2 pasos completados
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <OnboardingCard
            number="1"
            title="Perfil del jugador"
            subtitle="Altura · Peso · Escuela · Tipo de revés"
            context="Tu coach necesita estos datos para llevar tu seguimiento físico y comparar tu evolución período a período."
            done={profileComplete}
            locked={false}
            cta="Completar →"
            onClick={() => navigate('/portal/mi-perfil')}
          />
          <OnboardingCard
            number="2"
            title="Reclutamiento universitario"
            subtitle="División · GPA · Año de graduación · Área de estudio"
            context="Construye tu expediente para universidades en EE.UU. Si buscas una beca NCAA, NAIA o D3, tu coach necesita estos datos para ayudarte."
            done={recruitmentComplete}
            locked={!profileComplete}
            cta="Completar →"
            onClick={() => navigate('/portal/mi-reclutamiento')}
          />
        </div>

        <p className="text-[11px] mt-6 max-w-xl" style={{ color: 'var(--ink-mute)', lineHeight: 1.6 }}>
          Puedes editar esta información en cualquier momento desde tu perfil. Ambas secciones son necesarias para acceder a tu dashboard de rendimiento.
        </p>
      </Shell>
    );
  }

  // ── Vista: dashboard (ambas secciones completas) ──────────────────────────

  return (
    <Shell>
      {/* Header */}
      <div className="mb-6">
        <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>Portal del atleta</p>
        <h1 className="font-display font-extrabold text-[32px] leading-none">
          {athlete?.nombre} {athlete?.apellido}
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-mute)' }}>
          {edad ? `${edad} años · ` : ''}{cat}
          {athlete?.coaches && (
            <span> · Coach: <b style={{ color: 'var(--ink)' }}>{athlete.coaches.nombre} {athlete.coaches.apellido}</b></span>
          )}
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">

        {/* Card: Información del atleta */}
        <div className="hairline" style={{ background: 'var(--paper)' }}>
          <div className="px-5 py-4 hairline-b flex items-center justify-between">
            <p className="eyebrow !text-[11px]">Tu información</p>
            <div className="flex gap-2">
              <button onClick={() => navigate('/portal/mi-perfil')}
                      className="text-[11px] font-mono hover:underline" style={{ color: 'var(--ink-mute)' }}>
                Editar perfil
              </button>
              <span style={{ color: 'var(--line-strong)' }}>·</span>
              <button onClick={() => navigate('/portal/mi-reclutamiento')}
                      className="text-[11px] font-mono hover:underline" style={{ color: 'var(--ink-mute)' }}>
                Editar reclutamiento
              </button>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Perfil físico */}
            <div className="space-y-3">
              <p className="eyebrow !text-[10px]" style={{ color: 'var(--accent)' }}>Perfil físico</p>
              <InfoRow label="Mano dominante" value={athlete?.mano_dominante ? athlete.mano_dominante.charAt(0).toUpperCase() + athlete.mano_dominante.slice(1) : null} />
              <InfoRow label="Tipo de revés" value={athlete?.tipo_reves === 'una_mano' ? 'Una mano' : athlete?.tipo_reves === 'dos_manos' ? 'Dos manos' : null} />
              <InfoRow label="Altura / Peso" value={athlete?.altura_cm && athlete?.peso_kg ? `${athlete.altura_cm} cm · ${athlete.peso_kg} kg` : null} />
              <InfoRow label="Escuela · Grado (actualizar cada verano)" value={athlete?.escuela ? `${athlete.escuela}${athlete.grado_escolar ? ` · ${athlete.grado_escolar}` : ''}` : null} />
            </div>

            {/* Perfil de reclutamiento */}
            <div className="space-y-3">
              <p className="eyebrow !text-[10px]" style={{ color: 'var(--accent)' }}>Reclutamiento</p>
              <InfoRow label="División objetivo" value={recruitment?.division_objetivo} />
              <InfoRow label="Graduación esperada" value={recruitment?.grad_year} />
              <InfoRow label="GPA" value={recruitment?.gpa ? String(recruitment.gpa) : null} />
              <InfoRow label="Inglés" value={recruitment?.english_level} />
              <InfoRow label="Área de estudio" value={recruitment?.study_area} />
            </div>
          </div>
        </div>

        {/* Card: PTF */}
        <div className="hairline" style={{ background: 'var(--paper)' }}>
          <div style={{ height: 3, background: hasPTF ? 'var(--good)' : 'var(--line)' }} />
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-[15px] mb-1">
                {hasPTF ? 'Llena tu siguiente PTF' : 'Llena tu primer PTF'}
              </p>
              <p className="text-[12px]" style={{ color: 'var(--ink-mute)', lineHeight: 1.5 }}>
                {hasPTF
                  ? 'Ya tienes un PTF guardado. Llena el del próximo torneo.'
                  : 'Después de tu próximo torneo, registra tu reflexión. Es tu voz en tu expediente — lo que piensas de tu propio juego.'}
              </p>
            </div>
            <button onClick={() => navigate('/portal/mis-torneos')}
                    className="ml-6 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white hover:opacity-90 transition shrink-0"
                    style={{ background: 'var(--accent)' }}>
              Ir a torneos →
            </button>
          </div>
        </div>

        {/* Card: Athlete Voice */}
        {avStatus !== null && (
          <div className="hairline" style={{ background: 'var(--paper)' }}>
            <div style={{ height: 3, background: avStatus ? 'var(--good)' : 'var(--accent)' }} />
            <div className="p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display font-bold text-[15px]">Athlete Voice</p>
                  {!avStatus && (
                    <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide"
                          style={{ background: 'rgba(220,38,38,.08)', color: 'var(--bad)' }}>
                      Pendiente
                    </span>
                  )}
                  {avStatus && (
                    <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide"
                          style={{ background: 'rgba(22,163,74,.1)', color: 'var(--good)' }}>
                      Completo
                    </span>
                  )}
                </div>
                <p className="text-[12px]" style={{ color: 'var(--ink-mute)', lineHeight: 1.5 }}>
                  {avStatus
                    ? `Ya enviaste tu auto-evaluación de ${fmtPeriodLong(avPeriod)}. Tu coach puede verla.`
                    : `Tu coach ya creó tu reporte de ${fmtPeriodLong(avPeriod)}. Agrega tu perspectiva — cómo te sentiste este período en cancha, físicamente y en carácter.`}
                </p>
              </div>
              {!avStatus && (
                <button
                  onClick={() => navigate(`/portal/athlete-voice?period=${avPeriod}`)}
                  className="ml-6 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white hover:opacity-90 transition shrink-0"
                  style={{ background: 'var(--accent)' }}>
                  Evalúate →
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
