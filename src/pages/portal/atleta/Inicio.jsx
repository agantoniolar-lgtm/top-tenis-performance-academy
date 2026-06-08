import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

// ─── Estado de cada sección ───────────────────────────────────────────────────

function StatusBadge({ done }) {
  return done
    ? <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide"
            style={{ background: 'rgba(22,163,74,.1)', color: 'var(--good)' }}>Completo</span>
    : <span className="text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide"
            style={{ background: 'rgba(220,38,38,.08)', color: 'var(--bad)' }}>Pendiente</span>;
}

function OnboardingCard({ number, title, description, done, cta, onClick }) {
  return (
    <div className="hairline" style={{ background: 'var(--paper)' }}>
      <div style={{ height: 3, background: done ? 'var(--good)' : 'var(--line)' }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 flex items-center justify-center text-[11px] font-bold"
                  style={{ background: done ? 'rgba(22,163,74,.1)' : 'var(--cream)', color: done ? 'var(--good)' : 'var(--ink-mute)' }}>
              {done ? '✓' : number}
            </span>
            <p className="font-display font-bold text-[15px]">{title}</p>
          </div>
          <StatusBadge done={done} />
        </div>
        <p className="text-[12px] mb-4" style={{ color: 'var(--ink-mute)', lineHeight: 1.5 }}>
          {description}
        </p>
        {!done && (
          <button onClick={onClick}
                  className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
            {cta}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function AtletaInicio() {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [athlete,     setAthlete]     = useState(null);
  const [recruitment, setRecruitment] = useState(null);
  const [lastReport,  setLastReport]  = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.athlete_id) return;
    let cancelled = false;

    async function load() {
      const [athRes, recRes, repRes] = await Promise.all([
        supabase.from('athletes')
          .select('id, nombre, apellido, fecha_nacimiento, mano_dominante, altura_cm, peso_kg, tipo_reves, escuela')
          .eq('id', user.athlete_id).single(),
        supabase.from('athlete_recruitment_profile')
          .select('*').eq('athlete_id', user.athlete_id).maybeSingle(),
        supabase.from('reports')
          .select('id, period').eq('athlete_id', user.athlete_id)
          .order('period', { ascending: false }).limit(1).maybeSingle(),
      ]);

      if (!cancelled) {
        setAthlete(athRes.data);
        setRecruitment(recRes.data);
        setLastReport(repRes.data);
        setLoading(false);
      }
    }

    load().catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [user?.athlete_id]);

  if (loading) return (
    <Shell>
      <p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p>
    </Shell>
  );

  const profileComplete = !!(athlete?.altura_cm && athlete?.peso_kg && athlete?.tipo_reves && athlete?.escuela);
  const recruitmentComplete = !!(recruitment?.division_objetivo && recruitment?.grad_year && recruitment?.english_level);
  const hasReport = !!lastReport;

  const completedCount = [profileComplete, recruitmentComplete, hasReport].filter(Boolean).length;

  return (
    <Shell>
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>Bienvenido</p>
        <h1 className="font-display font-extrabold text-[32px] leading-none">
          {athlete?.nombre} {athlete?.apellido}
        </h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="h-1.5 rounded-full overflow-hidden flex-1 max-w-[200px]"
               style={{ background: 'var(--line)' }}>
            <div className="h-full transition-all"
                 style={{ width: `${(completedCount / 3) * 100}%`, background: 'var(--accent)' }} />
          </div>
          <p className="text-[12px]" style={{ color: 'var(--ink-mute)' }}>
            {completedCount} de 3 secciones completadas
          </p>
        </div>
      </div>

      {/* Onboarding cards */}
      <div className="space-y-4 max-w-xl">
        <OnboardingCard
          number="1"
          title="Completa tu perfil"
          description="Agrega tu información física y académica. Tu coach la usa para tomar mejores decisiones de entrenamiento."
          done={profileComplete}
          cta="Completar perfil →"
          onClick={() => navigate(`/portal/mi-perfil`)}
        />

        <OnboardingCard
          number="2"
          title="Perfil de reclutamiento"
          description="¿Qué división buscas? ¿En qué área quieres estudiar? Esta información solo la ves tú y los recruiters."
          done={recruitmentComplete}
          cta="Llenar perfil de reclutamiento →"
          onClick={() => navigate(`/portal/mi-reclutamiento`)}
        />

        <OnboardingCard
          number="3"
          title="Primer formulario PTF"
          description="Después de tu próximo torneo, llena tu Post-Torneo Form. Es tu voz en tu expediente — lo que piensas de tu propio juego."
          done={hasReport}
          cta="Ver mis torneos →"
          onClick={() => navigate(`/portal/mis-torneos`)}
        />
      </div>

      {/* Talent Card preview */}
      <div className="mt-8 hairline p-5 max-w-xl" style={{ background: 'var(--paper)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>Tu Talent Card</p>
            <p className="font-display font-bold text-[15px]">
              {completedCount === 0
                ? 'Empieza llenando tu perfil'
                : completedCount < 3
                  ? 'En construcción — sigue llenando'
                  : 'Lista para compartir'}
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--ink-mute)' }}>
              Tu coach irá agregando sus evaluaciones trimestrales.
            </p>
          </div>
          {hasReport && (
            <button
              onClick={() => navigate(`/portal/mi-talent-card`)}
              className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide hairline hover:bg-[var(--cream)] transition shrink-0">
              Ver →
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex-1 p-8 portal-layout">{children}</div>;
}
