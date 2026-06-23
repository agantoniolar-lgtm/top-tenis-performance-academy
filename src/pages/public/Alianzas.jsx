import { Heart, Brain, Zap } from 'lucide-react';

const alliances = [
  {
    icon: Heart,
    title: 'Fisioterapia Deportiva',
    desc: 'Trabajamos con especialistas en fisioterapia deportiva para mantener a nuestros jugadores en las mejores condiciones físicas y prevenir lesiones.',
    services: [
      'Evaluación biomecánica funcional',
      'Prevención de lesiones deportivas',
      'Atención y rehabilitación post-lesión',
      'Seguimiento continuo durante temporada',
    ],
  },
  {
    icon: Brain,
    title: 'Psicología del Deporte',
    desc: 'El aspecto mental es fundamental en el tenis competitivo. Nuestros aliados en psicología deportiva ayudan a nuestros jugadores a desarrollar fortaleza mental.',
    services: [
      'Sesiones individuales de psicología deportiva',
      'Sesiones grupales de preparación mental',
      'Preparación mental pre-torneo',
      'Manejo de presión y ansiedad competitiva',
    ],
  },
  {
    icon: Zap,
    title: 'Rendimiento Deportivo',
    desc: 'La preparación física especializada para tenis es clave para el rendimiento. Nuestros aliados diseñan programas adaptados a las demandas del deporte.',
    services: [
      'Evaluación física integral',
      'Acondicionamiento físico específico para tenis',
      'Seguimiento de métricas de rendimiento',
      'Planificación de cargas durante torneos',
    ],
  },
];

export default function Alianzas() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#1B3A2A] py-24 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M-1 5L5-1M3 9L9 3' stroke='white' stroke-width='0.6'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B3A2A]/60" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="uppercase text-xs tracking-[3px] text-[#8B4513] mb-4">
            Alianzas estrat&eacute;gicas
          </p>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-bold text-white leading-tight">
            El tenis es 50% t&eacute;cnica. El otro 50% es todo lo dem&aacute;s.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mt-6">
            En Top Tenis Performance Academy creemos en un enfoque integral. Por eso nos aliamos con los mejores profesionales en fisioterapia, psicolog&iacute;a deportiva y rendimiento f&iacute;sico.
          </p>
        </div>
      </section>

      {/* Alliance cards */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {alliances.map((ally, i) => {
              const Icon = ally.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-none border border-gray-200 p-8 flex flex-col"
                >
                  <div className="w-14 h-14 rounded-full bg-[#8B4513]/10 flex items-center justify-center mb-5">
                    <Icon size={26} className="text-[#8B4513]" />
                  </div>

                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#1B3A2A] mb-3">
                    {ally.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {ally.desc}
                  </p>

                  <ul className="space-y-2 mt-auto">
                    {ally.services.map((s, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B4513] mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA alianzas */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#1B3A2A] mb-4">
            &iquest;Eres una instituci&oacute;n interesada en aliarte con Top Tenis Performance Academy?
          </h2>
          <p className="text-gray-600 mb-6">
            Nos encantar&iacute;a explorar c&oacute;mo podemos colaborar para beneficiar a nuestros jugadores.
          </p>
          <a
            href="mailto:contacto@toptenis.mx"
            className="inline-block bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Esr&iacute;benos a contacto@toptenis.mx
          </a>
        </div>
      </section>

      {/* Yonex */}
      <section className="py-16 bg-[#F8F6F2]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm text-[#8B4513] font-semibold uppercase tracking-wider mb-6">
            Patrocinador Oficial
          </p>
          <p className="tracking-[0.2em] font-black text-[#1B3A2A] text-3xl mb-6">YONEX</p>
          <p className="text-gray-600 text-lg">
            Patrocinador oficial de entrenamiento
          </p>
        </div>
      </section>
    </div>
  );
}
