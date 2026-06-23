import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, BarChart3, GraduationCap, Trophy,
  Users, ArrowRight, CheckCircle,
} from 'lucide-react';
import VideoPlaceholder from '../../components/shared/VideoPlaceholder';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ end, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Score helpers ────────────────────────────────────────────────────────────

const SCORE5_LABEL = {
  1: 'Estancado', 2: 'Rezagado', 3: 'Por buen camino',
  4: 'Adelantado', 5: 'Superado',
};

function scoreColor(v) {
  if (!v) return 'var(--ink-mute)';
  return v <= 2 ? 'var(--bad)' : v === 3 ? 'var(--ink-mute)' : 'var(--good)';
}

// ─── UTR Sparkline (inline SVG) ───────────────────────────────────────────────

function UTRSparkline({ values, periods }) {
  const minV = Math.min(...values) - 0.15;
  const maxV = Math.max(...values) + 0.15;
  const range = maxV - minV;
  const n = values.length;
  const W = 560;
  const H = 80;
  const PX = 14;
  const PY = 18;

  const xf = (i) => PX + (i / (n - 1)) * (W - PX * 2);
  const yf = (v) => PY + (1 - (v - minV) / range) * (H - PY * 2);

  const linePath = values
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xf(i).toFixed(1)},${yf(v).toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L${xf(n - 1).toFixed(1)},${H} L${xf(0).toFixed(1)},${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H + 22}`}
      style={{ width: '100%' }}
      aria-label={`UTR progresión de ${values[0].toFixed(1)} a ${values[n - 1].toFixed(1)} en ${n} períodos`}
    >
      <path d={areaPath} fill="#1B3A2A" fillOpacity="0.06" />
      <path d={linePath} stroke="#1B3A2A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={xf(i)} cy={yf(v)} r={i === n - 1 ? 4.5 : 3} fill="#1B3A2A" />
          {i === 0 && (
            <text x={xf(i)} y={yf(v) - 9} textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="'Inter',sans-serif">
              {v.toFixed(1)}
            </text>
          )}
          {i === n - 1 && (
            <text x={xf(i)} y={yf(v) - 9} textAnchor="middle" fontSize="11" fill="#1B3A2A" fontWeight="bold" fontFamily="'Inter',sans-serif">
              {v.toFixed(1)}
            </text>
          )}
        </g>
      ))}
      {periods.map((p, i) => (
        <text key={i} x={xf(i)} y={H + 18} textAnchor="middle" fontSize="9.5" fill="#9CA3AF" fontFamily="'Inter',sans-serif">
          {p}
        </text>
      ))}
    </svg>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PERIODS = ["Q1 '25", "Q2 '25", "Q3 '25", "Q4 '25", "Q1 '26", "Q2 '26"];
const MOCK_UTR     = [6.5, 7.0, 7.4, 7.9, 8.4, 8.7];

const MOCK_SWING = [
  { label: '1er saque %',         value: '67%',    trend: '+4 pp vs período ant.', up: true  },
  { label: 'Vel. prom. 1er saque', value: '162',   sub: 'km/h promedio',           trend: null },
  { label: 'Break pts. conv.',     value: '43%',    trend: '+8 pp vs período ant.', up: true  },
  { label: 'Winners / Errores',    value: '34/18',  sub: 'ratio 1.9',               trend: null },
];

const MOCK_SHOTS = [
  { label: 'Derecha 48%', color: '#1B3A2A', width: '48%' },
  { label: 'Revés 31%',   color: '#2D5A3D', width: '31%' },
  { label: 'Slice 12%',   color: '#8B4513', width: '12%' },
  { label: 'Volea 9%',    color: '#C17A4A', width: '9%'  },
];

const MOCK_EVAL = [
  { label: 'Técnica',  score: 4 },
  { label: 'Táctica',  score: 3 },
  { label: 'Carácter', score: 5 },
];

const MOCK_HISTORY = [
  { period: "Q2 '26", tec: 4, tac: 3, char: 5, utr: 8.7 },
  { period: "Q1 '26", tec: 4, tac: 3, char: 4, utr: 8.4 },
  { period: "Q4 '25", tec: 3, tac: 3, char: 4, utr: 7.9 },
  { period: "Q3 '25", tec: 3, tac: 2, char: 4, utr: 7.4 },
  { period: "Q2 '25", tec: 2, tac: 2, char: 3, utr: 7.0 },
];

const ARMANDO_BADGES = [
  '#1 EdoMex · #4 Nacional Mexicano',
  'UTR 12.07',
  'Marian University, Indianapolis',
  'Capitán del equipo',
  'Invicto Crossroads League 2019',
  'ITF Junior · 7 países',
  'Liga Bayern, Alemania',
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div>

      {/* ── S1 — Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#1B3A2A]">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="uppercase text-xs tracking-[3px] text-[#8B4513] mb-6">
            ACADEMIA DE ALTO RENDIMIENTO &middot; NAUCALPAN, M&Eacute;XICO
          </p>
          <h1 className="font-['Playfair_Display'] font-bold text-5xl md:text-7xl text-white mb-6 leading-tight">
            Formamos a los mejores juniors de M&eacute;xico.
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Entrenamiento de alto rendimiento, medici&oacute;n con datos reales y un sistema probado para obtener becas universitarias en Estados Unidos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/contacto"
              className="rounded-md px-6 py-3 font-semibold transition bg-[#8B4513] text-white hover:bg-[#A0522D]"
            >
              Solicitar evaluaci&oacute;n
            </Link>
            <Link
              to="/login"
              className="text-white underline font-semibold transition hover:text-gray-300"
            >
              Acceder al portal &rarr;
            </Link>
          </div>
          <div className="max-w-3xl mx-auto">
            <VideoPlaceholder description="[VIDEO] Entrenamiento en cancha — sesi&oacute;n de alto rendimiento TTPA" />
          </div>
        </div>
      </section>

      {/* ── S2 — Stats band ────────────────────────────────────────────────── */}
      <section className="bg-[#1B3A2A] py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold"><AnimatedCounter end={28} /></p>
              <p className="text-sm text-gray-300 mt-2">Jugadores en formaci&oacute;n</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold"><AnimatedCounter end={8} suffix="+" /></p>
              <p className="text-sm text-gray-300 mt-2">A&ntilde;os en alto rendimiento</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold"><AnimatedCounter end={120} suffix="+" /></p>
              <p className="text-sm text-gray-300 mt-2">Torneos AMTP &middot; UTR &middot; ITF</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold"><AnimatedCounter end={15} suffix="+" /></p>
              <p className="text-sm text-gray-300 mt-2">Universidades NCAA en red</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── S3 — El método ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="eyebrow text-center text-[#8B4513] mb-4">El m&eacute;todo TTPA</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-14">
            M&aacute;s que clases. Un sistema de formaci&oacute;n.
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: 'Formación técnica',
                desc: 'Dos sesiones diarias con metodología profesional. Saque, derecha, revés, volea, movimiento — trabajados y medidos.',
              },
              {
                icon: BarChart3,
                title: 'Medición constante',
                desc: 'Evaluaciones trimestrales del coach, análisis post-torneo con datos reales y seguimiento de UTR período a período.',
              },
              {
                icon: Trophy,
                title: 'Competencia real',
                desc: 'Circuito completo de torneos AMTP, UTR e ITF Junior. El historial competitivo que los coaches universitarios buscan.',
              },
              {
                icon: GraduationCap,
                title: 'El camino a USA',
                desc: 'Cada alumno construye su expediente desde el primer día. Nuestro director lo vivió — sabe exactamente lo que se necesita.',
                link: '/camino-usa',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-[#F8F6F2] rounded-xl flex items-center justify-center mx-auto mb-5">
                  <item.icon size={26} className="text-[#8B4513]" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
                {item.link && (
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1 text-[#8B4513] text-sm font-semibold mt-3 hover:text-[#A0522D] transition"
                  >
                    Conocer el proceso <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── S4 — Lo que medimos ────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-20">
        <div className="max-w-5xl mx-auto px-6">

          <p className="eyebrow text-[#8B4513] mb-3">Lo que medimos</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-1">
            Cada golpe, cada partido, cada per&iacute;odo.
          </h2>
          <p className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-gray-400 mb-4">
            Registrado.
          </p>
          <p className="text-sm italic text-gray-400 mb-10">
            Vista de muestra &middot; Jugador A &middot; 16U &middot; Q2 2026
          </p>

          {/* Análisis de partido */}
          <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>
            An&aacute;lisis de partido
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {MOCK_SWING.map((m, i) => (
              <div key={i} className="hairline bg-white p-4">
                <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)' }}>{m.label}</p>
                <p className="font-num font-black text-[28px] leading-none tnum mb-1">{m.value}</p>
                {m.sub   && <p className="text-[10px]" style={{ color: 'var(--ink-mute)' }}>{m.sub}</p>}
                {m.trend && (
                  <p className="text-[10px] mt-1" style={{ color: m.up ? 'var(--good)' : 'var(--bad)' }}>
                    {m.trend}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Shot distribution */}
          <div className="hairline bg-white p-4 mb-8">
            <p className="eyebrow !text-[9px] mb-3" style={{ color: 'var(--ink-mute)' }}>
              Distribuci&oacute;n de golpes
            </p>
            <div className="flex h-2.5 overflow-hidden mb-3">
              {MOCK_SHOTS.map((s, i) => (
                <div key={i} style={{ width: s.width, background: s.color }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {MOCK_SHOTS.map((s, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--ink-mute)' }}>
                  <span className="w-2 h-2 shrink-0" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* UTR + Coach eval — two columns */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>
                Ranking UTR &middot; progresi&oacute;n
              </p>
              <div className="hairline bg-white p-4">
                <UTRSparkline values={MOCK_UTR} periods={MOCK_PERIODS} />
              </div>
            </div>

            <div>
              <p className="eyebrow !text-[10px] mb-3" style={{ color: 'var(--ink-mute)' }}>
                Evaluaci&oacute;n del coach &middot; Q2 2026
              </p>
              <div className="grid grid-cols-3 gap-3">
                {MOCK_EVAL.map((item, i) => (
                  <div key={i} className="hairline bg-white overflow-hidden">
                    <div style={{ height: 3, background: scoreColor(item.score) }} />
                    <div className="p-4">
                      <p className="eyebrow !text-[9px] mb-2" style={{ color: 'var(--ink-mute)' }}>{item.label}</p>
                      <div className="flex items-baseline gap-0.5 mb-1">
                        <span className="font-num font-black text-[28px] leading-none tnum" style={{ color: scoreColor(item.score) }}>
                          {item.score}
                        </span>
                        <span className="text-[12px]" style={{ color: 'var(--ink-mute)' }}>/5</span>
                      </div>
                      <p className="text-[10px] font-semibold" style={{ color: scoreColor(item.score) }}>
                        {SCORE5_LABEL[item.score]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <p className="text-xs italic text-gray-400 mt-6">
            Datos de muestra &middot; an&aacute;lisis de partido + evaluaci&oacute;n trimestral del coach
          </p>
        </div>
      </section>

      {/* ── S5 — Portal preview ────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <p className="eyebrow text-[#8B4513] mb-3">El expediente del atleta</p>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                Un historial que habla por s&iacute; solo.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cada atleta tiene un expediente completo: evaluaciones per&iacute;odo a per&iacute;odo, progresi&oacute;n de UTR, historial de torneos y perfil de reclutamiento universitario.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Los padres pueden verlo. Los coaches universitarios pueden evaluarlo. El atleta puede usarlo.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:text-[#A0522D] transition"
              >
                Acceder al portal <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mock periods table — styled as portal */}
            <div className="portal-layout overflow-hidden hairline">
              <div
                className="px-4 py-3 hairline-b flex items-center justify-between"
                style={{ background: 'var(--cream)' }}
              >
                <p className="eyebrow !text-[10px]">Historial de per&iacute;odos &middot; Jugador A</p>
                <span
                  className="text-[9px] font-mono px-2 py-0.5"
                  style={{ background: 'rgba(139,69,19,.1)', color: 'var(--accent)' }}
                >
                  16U
                </span>
              </div>
              <table className="w-full text-[11px]">
                <thead style={{ background: 'var(--cream)' }}>
                  <tr>
                    <th className="text-left px-3 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>Per&iacute;odo</th>
                    <th className="text-center px-2 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>T&eacute;c</th>
                    <th className="text-center px-2 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>T&aacute;c</th>
                    <th className="text-center px-2 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>Car</th>
                    <th className="text-right px-3 py-2 eyebrow !text-[9px]" style={{ color: 'var(--ink-mute)' }}>UTR</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.map((row, i) => (
                    <tr key={i} className="hairline-t">
                      <td className="px-3 py-2 font-display font-bold text-[12px]">{row.period}</td>
                      <td className="px-2 py-2 text-center font-num font-bold" style={{ color: scoreColor(row.tec) }}>{row.tec}</td>
                      <td className="px-2 py-2 text-center font-num font-bold" style={{ color: scoreColor(row.tac) }}>{row.tac}</td>
                      <td className="px-2 py-2 text-center font-num font-bold" style={{ color: scoreColor(row.char) }}>{row.char}</td>
                      <td className="px-3 py-2 text-right font-num font-black tnum" style={{ fontSize: 13 }}>{row.utr.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>

      {/* ── S6 — Armando Tlacaelel ─────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <ImagePlaceholder
                description="Armando Tlacaelel — Director General TTPA"
                aspectRatio="aspect-[3/4]"
              />
            </div>
            <div className="order-1 md:order-2">
              <p className="uppercase tracking-wider text-sm text-[#8B4513] font-semibold mb-3">
                Fundador &middot; Director General
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                Lo vivi&oacute;. Ahora lo construye para los siguientes.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Armando lleg&oacute; al #1 del Estado de M&eacute;xico y al #4 nacional antes de competir en torneos ITF Junior en El Salvador, Rep&uacute;blica Dominicana, Cuba, Canad&aacute;, Puerto Rico, Guatemala y M&eacute;xico. Jug&oacute; cuatro a&ntilde;os en Marian University (Indianapolis) como capit&aacute;n del equipo, terminando invicto en la Crossroads League 2019.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Regres&oacute; a M&eacute;xico con una misi&oacute;n clara: construir el sistema de formaci&oacute;n que &eacute;l habr&iacute;a querido cuando era junior. Top Tenis Performance Academy es ese sistema.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {ARMANDO_BADGES.map((badge, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-[#1A1A1A] font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <Link
                to="/nosotros"
                className="inline-flex items-center gap-2 text-[#8B4513] font-semibold hover:text-[#A0522D] transition"
              >
                Conoce al equipo <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── S7 — Para cada persona ─────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-14">
            Para cada persona en el proceso
          </h2>
          <div className="grid md:grid-cols-3 gap-8">

            <div className="border border-gray-200 p-8">
              <div className="w-12 h-12 bg-[#F8F6F2] flex items-center justify-center mb-5">
                <Target size={22} className="text-[#8B4513]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Para el atleta</h3>
              <ul className="space-y-3">
                {[
                  'Monitorea tu técnica, táctica y carácter período a período',
                  'Registra tu voz en el expediente con Athlete Voice',
                  'Construye tu perfil de reclutamiento para universidades en EE.UU.',
                  'Analiza tu juego con datos reales después de cada torneo',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={15} className="text-[#2D5A3D] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 p-8">
              <div className="w-12 h-12 bg-[#F8F6F2] flex items-center justify-center mb-5">
                <Users size={22} className="text-[#8B4513]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Para los padres</h3>
              <ul className="space-y-3">
                {[
                  'Reportes trimestrales del coach — transparencia total del progreso',
                  'Seguimiento de UTR y torneos en tiempo real',
                  'Perfil de reclutamiento activo desde el inicio',
                  'Inversión con métricas claras de desarrollo técnico y personal',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <CheckCircle size={15} className="text-[#2D5A3D] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 p-8 relative">
              <span className="absolute top-4 right-4 text-[10px] uppercase tracking-widest font-semibold text-[#8B4513] border border-[#8B4513]/40 px-2 py-0.5">
                Pr&oacute;ximamente
              </span>
              <div className="w-12 h-12 bg-[#F8F6F2] flex items-center justify-center mb-5">
                <GraduationCap size={22} className="text-[#8B4513]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Para recruiters</h3>
              <ul className="space-y-3">
                {[
                  'Expedientes verificados y firmados por el coach',
                  'Historial competitivo completo: AMTP, UTR, ITF Junior',
                  'Rankings actualizados y perfil de reclutamiento en un clic',
                  'Contacto directo con la academia',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                    <CheckCircle size={15} className="text-gray-300 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── S8 — Sede ──────────────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="uppercase tracking-wider text-sm text-[#8B4513] font-semibold mb-3">
                Nuestra sede
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                Casa Blanca Lomas Verdes
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Entrenamos en el Club Casa Blanca, Lomas Verdes, Naucalpan. Una de las mejores instalaciones del Estado de M&eacute;xico. Canchas de superficie dura profesional y un ambiente 100% competitivo.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { label: 'Matutino',    value: '9:00 – 12:00 · Lunes a Viernes' },
                  { label: 'Vespertino', value: '16:00 – 19:00 · Lunes a Jueves' },
                ].map((h, i) => (
                  <div key={i} className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider w-24 shrink-0">
                      {h.label}
                    </span>
                    <span className="text-gray-600 text-sm">{h.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-8 bg-white border border-gray-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400 tracking-widest">YONEX</span>
                </div>
                <span className="text-xs text-gray-400">Patrocinador oficial</span>
              </div>
            </div>
            <div>
              <ImagePlaceholder description="Canchas Club Casa Blanca Lomas Verdes" />
            </div>
          </div>
        </div>
      </section>

      {/* ── S9 — Testimonios ───────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="font-['Playfair_Display'] italic text-2xl md:text-3xl text-[#1A1A1A] leading-relaxed mb-8">
            &ldquo;Llegu&eacute; sin saber lo que era un torneo ITF. A los dos a&ntilde;os estoy clasificando a Challengers y representando a M&eacute;xico en dobles.&rdquo;
          </blockquote>
          <p className="text-[#8B4513] font-semibold text-sm uppercase tracking-wider">
            Alumno TTPA &middot; ITF Junior &middot; Clasificatorias Challenger
          </p>
        </div>
      </section>

      {/* ── S10 — CTA final ────────────────────────────────────────────────── */}
      <section className="bg-[#1B3A2A] py-20">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-4">
            &iquest;Listo para empezar?
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Agenda una evaluaci&oacute;n en cancha y descubre c&oacute;mo podemos ayudarte a alcanzar tu potencial.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contacto"
              className="rounded-md px-6 py-3 font-semibold transition bg-[#8B4513] text-white hover:bg-[#A0522D]"
            >
              Solicitar evaluaci&oacute;n
            </Link>
            <a
              href="https://wa.me/5256400804070"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-6 py-3 font-semibold transition border-2 border-white text-white hover:bg-white hover:text-[#1B3A2A]"
            >
              Escr&iacute;benos por WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
