import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { calcCat, calcEdad } from '../../../lib/athletics.js';

// ─── Sub-components ───────────────────────────────────────────────────────────

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
          <span className={`text-[10px] font-mono px-2 py-0.5 uppercase tracking-wide ${done ? 'text-[var(--good)]' : 'text-[var(--bad)]'}`}
                style={{ background: done ? 'rgba(22,163,74,.1)' : 'rgba(220,38,38,.08)' }}>
            {done ? 'Completo' : 'Pendiente'}
          </span>
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
  const [hasPTF] = useState(false); // TODO: conectar cuando PTF guarde en Supabase
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    async function load() {
      const [athRes, recRes] = await Promise.all([
        supabase.from('athletes')
          .select('id, nombre, apellido, fecha_nacimiento, mano_dominante, tipo_reves, altura_cm, peso_kg, escuela, grado_escolar, coaches(nombre, apellido)')
          .eq('user_id', user.id).single(),
        supabase.from('athlete_recruitment_profile')
          .select('*').eq('athlete_id', user.athlete_id).maybeSingle(),
      ]);

      if (!cancelled) {
        setAthlete(athRes.data);
        setRecruitment(recRes.data);
        setLoading(false);
      }
    }

    load().catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [user?.id, user?.athlete_id]);

  if (loading) return <Shell><p style={{ color: 'var(--ink-mute)', fontSize: 13 }}>Cargando…</p></Shell>;

  const profileComplete    = !!(athlete?.altura_cm && athlete?.peso_kg && athlete?.escuela);
  const recruitmentComplete = !!(recruitment?.division_objetivo && recruitment?.grad_year && recruitment?.english_level);
  const bothComplete        = profileComplete && recruitmentComplete;

  const edad = calcEdad(athlete?.fecha_nacimiento);
  const cat  = calcCat(athlete?.fecha_nacimiento);

  // ── Vista: onboarding (falta al menos uno) ────────────────────────────────

  if (!bothComplete) {
    const completedCount = [profileComplete, recruitmentComplete].filter(Boolean).length;
    return (
      <Shell>
        <div className="mb-8">
          <p className="eyebrow !text-[10px] mb-1" style={{ color: 'var(--ink-mute)' }}>Bienvenido</p>
          <h1 className="font-display font-extrabold text-[32px] leading-none">
            {athlete?.nombre} {athlete?.apellido}
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-1.5 rounded-full overflow-hidden flex-1 max-w-[180px]"
                 style={{ background: 'var(--line)' }}>
              <div className="h-full transition-all"
                   style={{ width: `${(completedCount / 2) * 100}%`, background: 'var(--accent)' }} />
            </div>
            <p className="text-[12px]" style={{ color: 'var(--ink-mute)' }}>
              {completedCount} de 2 secciones completadas
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <OnboardingCard
            number="1"
            title="Completa tu perfil"
            description="Agrega tu información física y académica. Tu coach la usa para tomar mejores decisiones de entrenamiento."
            done={profileComplete}
            cta="Completar perfil →"
            onClick={() => navigate('/portal/mi-perfil')}
          />
          <OnboardingCard
            number="2"
            title="Perfil de reclutamiento"
            description="¿Qué división buscas? ¿En qué área quieres estudiar? Esta información solo la ves tú y los recruiters."
            done={recruitmentComplete}
            cta="Llenar perfil de reclutamiento →"
            onClick={() => navigate('/portal/mi-reclutamiento')}
          />
        </div>
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

          <div className="p-5 grid grid-cols-2 gap-6">
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

      </div>
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="flex-1 p-8 portal-layout">{children}</div>;
}
