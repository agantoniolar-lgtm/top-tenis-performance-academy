import { Link } from 'react-router-dom';
import { Award, Users, Heart } from 'lucide-react';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';
import Badge from '../../components/shared/Badge';

const timeline = [
  '#1 EdoMex \u00b7 #4 Nacional Mexicano',
  'Torneos ITF Junior en 7 pa\u00edses',
  '4 a\u00f1os en Marian University, Indianapolis',
  'Capit\u00e1n \u00b7 Invicto Crossroads League 2019',
  'Regres\u00f3 a M\u00e9xico y fund\u00f3 Top Tenis PA',
];

const coaches = [
  {
    nombre: 'Armando Tlacaelel',
    rol: 'Director General',
    credencial: 'UTR 12.07 \u00b7 Division I',
    desc: 'Fundador de TTPA. Lleg\u00f3 al #1 del Estado de M\u00e9xico y al #4 nacional. Cuatro a\u00f1os en Marian University (Indianapolis) como capit\u00e1n del equipo, invicto en la Crossroads League 2019.',
  },
  {
    nombre: 'Marco Reyes',
    rol: 'Head Coach',
    credencial: 'Jugador activo ATP',
    desc: 'Jugador profesional activo en el circuito ATP. Combina su experiencia competitiva con una metodolog\u00eda de entrenamiento enfocada en resultados.',
  },
  {
    nombre: 'Roberto Garc\u00eda',
    rol: 'Entrenador',
    credencial: 'Selecci\u00f3n estatal',
    desc: 'Integrante de la selecci\u00f3n estatal con amplia experiencia en formaci\u00f3n de jugadores juveniles de alto nivel.',
  },
  {
    nombre: 'Laura M\u00e9ndez',
    rol: 'Entrenadora',
    credencial: 'Especialista t\u00e9cnica',
    desc: 'Especialista en desarrollo t\u00e9cnico y biomec\u00e1nica del tenis. Enfoque detallado en la correcci\u00f3n y optimizaci\u00f3n de golpes.',
  },
];

export default function Nosotros() {
  return (
    <div>
      {/* Section 1 — Hero interior */}
      <section className="relative w-full h-[400px] bg-[#1B3A2A] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M-1 5L5-1M3 9L9 3' stroke='white' stroke-width='0.6'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B3A2A]/60" />
        <div className="relative z-10 text-center px-6">
          <p className="uppercase text-xs tracking-[3px] text-[#8B4513] mb-4">
            Academia &middot; Naucalpan, M&eacute;xico
          </p>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold text-white">
            El equipo detr&aacute;s del camino.
          </h1>
        </div>
      </section>

      {/* Section 2 — Historia de Armando */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="uppercase tracking-wider text-sm text-[#8B4513] font-semibold mb-4">
                La historia
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A1A] mb-8">
                Lo vivi&oacute;. Ahora lo construye para los siguientes.
              </h2>

              {/* Timeline */}
              <div className="relative pl-8 mb-8">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-[#8B4513]/30" />
                {timeline.map((step, i) => (
                  <div key={i} className="relative mb-6 last:mb-0">
                    <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-[#8B4513] border-2 border-white" />
                    <p className="text-[#1A1A1A] font-medium">{step}</p>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <Badge type="utr">UTR 12.07</Badge>
                <Badge type="utr">#1 EdoMex &middot; #4 Nacional</Badge>
                <Badge type="completed">Marian University, Indianapolis</Badge>
                <Badge type="completed">Capit&aacute;n &middot; Invicto 2019</Badge>
                <Badge type="reviewed">ITF Junior &mdash; 7 pa&iacute;ses</Badge>
                <Badge type="reviewed">Liga Bayern, Alemania</Badge>
              </div>
            </div>
            <div>
              <ImagePlaceholder
                description="Armando Tlacaelel en cancha"
                aspectRatio="aspect-[3/4]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Equipo de coaches */}
      <section className="bg-[#F8F6F2] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-14">
            Nuestro equipo
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coaches.map((coach, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <ImagePlaceholder
                  description={coach.nombre}
                  aspectRatio="aspect-[3/4]"
                  className="rounded-none"
                />
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{coach.nombre}</h3>
                  <p className="text-[#8B4513] text-sm font-semibold mb-2">{coach.rol}</p>
                  <Badge type="utr" className="mb-3">{coach.credencial}</Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">{coach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Filosofia */}
      <section className="bg-[#1B3A2A] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-center mb-14">
            Nuestra filosof&iacute;a
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Award,
                title: 'Trabajo',
                desc: 'No hay atajos. El progreso viene del esfuerzo diario, la disciplina en cada sesi\u00f3n y la voluntad de mejorar un detalle a la vez.',
              },
              {
                icon: Users,
                title: 'Orden',
                desc: 'Un sistema claro de entrenamiento, competencia y seguimiento. Cada alumno sabe d\u00f3nde est\u00e1 y hacia d\u00f3nde va.',
              },
              {
                icon: Heart,
                title: 'Pasi\u00f3n',
                desc: 'Amamos este deporte. Esa energ\u00eda se transmite en cada entrenamiento, en cada viaje a torneo, en cada logro de nuestros alumnos.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <item.icon size={28} className="text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Yonex badge */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-wider text-gray-400 mb-6">Patrocinador oficial</p>
          <p className="tracking-[0.2em] font-black text-[#1B3A2A] text-3xl mb-4">YONEX</p>
          <p className="text-[#1A1A1A] font-semibold text-lg">
            Orgullosamente patrocinados por Yonex
          </p>
        </div>
      </section>
    </div>
  );
}
