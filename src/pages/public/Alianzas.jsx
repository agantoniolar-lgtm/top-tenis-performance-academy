import { Heart, Brain, Zap } from 'lucide-react';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';

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
      {/* Intro */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A2A] mb-6">
            El tenis es 50% técnica. El otro 50% es todo lo demás.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            En Top Tenis Performance Academy creemos en un enfoque integral. Por eso nos aliamos con los mejores profesionales en fisioterapia, psicología deportiva y rendimiento físico para ofrecer a nuestros alumnos un desarrollo completo dentro y fuera de la cancha.
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
                  className="bg-white rounded-xl shadow-sm p-8 flex flex-col"
                >
                  <div className="w-14 h-14 rounded-full bg-[#8B4513]/10 flex items-center justify-center mb-6">
                    <Icon size={26} className="text-[#8B4513]" />
                  </div>

                  <ImagePlaceholder
                    description="Logo del aliado"
                    aspectRatio="aspect-[3/1]"
                    className="mb-6"
                  />

                  <h3 className="font-bold text-xl text-[#1B3A2A] mb-3">
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
          <h2 className="text-2xl font-bold text-[#1B3A2A] mb-4">
            ¿Eres una institución interesada en aliarte con Top Tenis Performance Academy?
          </h2>
          <p className="text-gray-600 mb-6">
            Nos encantaría explorar cómo podemos colaborar para beneficiar a nuestros jugadores.
          </p>
          <a
            href="mailto:contacto@toptenis.mx"
            className="inline-block bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Escríbenos a contacto@toptenis.mx
          </a>
        </div>
      </section>

      {/* Yonex */}
      <section className="py-16 bg-[#F8F6F2]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-sm text-[#8B4513] font-semibold uppercase tracking-wider mb-6">
            Patrocinador Oficial
          </p>
          <ImagePlaceholder
            description="Logo Yonex"
            aspectRatio="aspect-[4/1]"
            className="max-w-sm mx-auto mb-6"
          />
          <p className="text-gray-600 text-lg">
            Patrocinador oficial de entrenamiento
          </p>
        </div>
      </section>
    </div>
  );
}
