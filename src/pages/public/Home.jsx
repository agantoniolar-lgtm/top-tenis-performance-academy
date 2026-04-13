import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, BarChart3, GraduationCap, ArrowRight } from 'lucide-react';
import VideoPlaceholder from '../../components/shared/VideoPlaceholder';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';

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
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Home() {
  return (
    <div>
      {/* Section 1 — Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#1B3A2A]">
        <div className="absolute inset-0 bg-[#1B3A2A]" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="uppercase text-xs tracking-[3px] text-[#8B4513] mb-6">
            ACADEMIA DE ALTO RENDIMIENTO &middot; NAUCALPAN, M&Eacute;XICO
          </p>
          <h1 className="font-['Playfair_Display'] font-bold text-5xl md:text-7xl text-white mb-6 leading-tight">
            Tu camino a jugar tenis en la universidad
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Formamos a los mejores jugadores juniors de M&eacute;xico para competir en el circuito ITF y obtener becas universitarias en Estados Unidos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/programas"
              className="rounded-md px-6 py-3 font-semibold transition bg-white text-[#1B3A2A] hover:bg-gray-100"
            >
              Conoce nuestros programas
            </Link>
            <Link
              to="/login"
              className="text-white underline font-semibold transition hover:text-gray-300"
            >
              Acceder al portal &rarr;
            </Link>
          </div>
          <div className="max-w-3xl mx-auto">
            <VideoPlaceholder description='[VIDEO] Entrenamiento en cancha — Alejandro con alumnos' />
          </div>
        </div>
      </section>

      {/* Section 2 — Stats band */}
      <section className="bg-[#1B3A2A] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter end={28} />
              </p>
              <p className="text-sm text-gray-300 mt-2">Jugadores en formaci&oacute;n</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter end={8} suffix="+" />
              </p>
              <p className="text-sm text-gray-300 mt-2">A&ntilde;os en alto rendimiento</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter end={120} suffix="+" />
              </p>
              <p className="text-sm text-gray-300 mt-2">Torneos AMTP &middot; UTR &middot; ITF Junior</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">
                <AnimatedCounter end={1} />
              </p>
              <p className="text-sm text-gray-300 mt-2">Casa Blanca Lomas Verdes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — La propuesta */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-14">
            M&aacute;s que clases. Un sistema de formaci&oacute;n.
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Target,
                title: 'T\u00e9cnica y competencia',
                desc: 'Entrenamos dos veces al d\u00eda con metodolog\u00eda de alto rendimiento, torneos AMTP e ITF Junior a lo largo de M\u00e9xico.',
              },
              {
                icon: BarChart3,
                title: 'Seguimiento hol\u00edstico',
                desc: 'Reportes peri\u00f3dicos de tu coach, an\u00e1lisis post-torneo, y alianzas con fisioterapia, psicolog\u00eda y rendimiento deportivo.',
              },
              {
                icon: GraduationCap,
                title: 'El Camino a USA',
                desc: 'Nuestro sistema prepara a cada alumno para obtener una beca universitaria en Estados Unidos. El proceso empieza desde el primer d\u00eda.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-[#F8F6F2] rounded-xl flex items-center justify-center mx-auto mb-5">
                  <item.icon size={28} className="text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Founder Feature */}
      <section className="bg-[#F8F6F2] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <ImagePlaceholder description="Alejandro en cancha con uniforme Top Tenis" />
            </div>
            <div className="order-1 md:order-2">
              <p className="uppercase tracking-wider text-sm text-[#8B4513] font-semibold mb-3">
                Fundador y Director
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                Formado en USA. Construyendo el camino para los siguientes.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Alejandro Tlacaetel jug&oacute; tenis universitario en Estados Unidos como jugador Division I. Despu&eacute;s de vivir en carne propia lo que significa competir al m&aacute;s alto nivel, regres&oacute; a M&eacute;xico con una misi&oacute;n clara: crear un sistema que prepare a los juniors mexicanos para el mismo camino.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Hoy, Top Tenis Performance Academy es el resultado de esa visi&oacute;n. Un programa que combina entrenamiento de alto rendimiento, competencia constante y un proceso estructurado para obtener becas universitarias en USA.
              </p>
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

      {/* Section 5 — Testimonial */}
      <section className="bg-[#F8F6F2] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="font-['Playfair_Display'] italic text-2xl md:text-3xl text-[#1A1A1A] leading-relaxed mb-8">
            &ldquo;Llegu&eacute; sin saber lo que era un torneo ITF. A los dos a&ntilde;os estoy clasificando a Challengers y representando a M&eacute;xico en dobles.&rdquo;
          </blockquote>
          <p className="text-[#8B4513] font-semibold text-sm uppercase tracking-wider">
            Alumno TTPA &middot; ITF Junior &middot; Clasificatorias Challenger
          </p>
        </div>
      </section>

      {/* Section 6 — Preview de programas */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] text-center mb-14">
            Programas
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Alto Rendimiento',
                desc: 'Turno matutino 9-12 y vespertino 4-7. Entrenamiento diario de alto nivel con metodolog\u00eda profesional, competencia constante y seguimiento integral.',
                link: '/programas',
                cta: 'Ver programa \u2192',
              },
              {
                title: 'El Camino a USA',
                desc: 'De las canchas de Naucalpan a la NCAA. Un proceso paso a paso para que cada alumno consiga una beca universitaria en Estados Unidos.',
                link: '/camino-usa',
                cta: 'Conoce el proceso \u2192',
              },
              {
                title: 'Casa Blanca Lomas Verdes',
                desc: 'Entrenamiento de alto rendimiento en una de las mejores sedes del Estado de M\u00e9xico. Canchas profesionales y ambiente competitivo.',
                link: '/programas',
                cta: 'Ver sede \u2192',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition group"
              >
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{card.desc}</p>
                <Link
                  to={card.link}
                  className="inline-flex items-center gap-1 text-[#8B4513] font-semibold hover:text-[#A0522D] transition"
                >
                  {card.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — CTA final */}
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
