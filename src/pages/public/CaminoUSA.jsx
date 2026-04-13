import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, GraduationCap, Users, Trophy } from 'lucide-react';

const timelineSteps = [
  {
    num: '01',
    title: 'Evaluación de potencial',
    desc: 'Entendemos dónde estás hoy: técnica, físico, mental, académico y UTR.',
  },
  {
    num: '02',
    title: 'Plan de desarrollo',
    desc: 'Creamos un roadmap personalizado de 1-4 años hacia la beca.',
  },
  {
    num: '03',
    title: 'Circuito de torneos',
    desc: 'Construimos tu historial competitivo: AMTP, ITF Junior, UTR.',
  },
  {
    num: '04',
    title: 'Perfil universitario',
    desc: 'Te ayudamos a preparar tu perfil para coaches universitarios: video, carta, académico.',
  },
  {
    num: '05',
    title: 'Contacto con universidades',
    desc: 'Usamos nuestra red de contactos en universidades NCAA y NAIA.',
  },
  {
    num: '06',
    title: 'La beca',
    desc: 'Negociamos junto contigo y te preparamos para el siguiente capítulo.',
  },
];

const credibilityCards = [
  {
    icon: GraduationCap,
    title: 'Nuestro director vivió el proceso',
    desc: 'Alejandro pasó por el proceso de reclutamiento universitario, jugó tenis colegial en Estados Unidos y conoce de primera mano cada paso del camino. Esa experiencia es la base de nuestra metodología.',
  },
  {
    icon: Users,
    title: '15+ universidades NCAA en contacto',
    desc: 'Mantenemos relación directa con coaches de más de 15 programas universitarios en divisiones NCAA I, II, III y NAIA, lo que nos permite conectar a nuestros alumnos con las oportunidades correctas.',
  },
  {
    icon: Trophy,
    title: 'Primer alumno TTPA en clasificatorias Challenger',
    desc: 'Nuestro programa de alto rendimiento ya ha producido un jugador que logró acceder a las clasificatorias de un torneo Challenger, demostrando que la metodología funciona.',
  },
];

const faqItems = [
  {
    q: '¿En qué año debo empezar el proceso?',
    a: 'Lo ideal es comenzar entre los 14 y 15 años (segundo o tercero de secundaria). Esto da tiempo suficiente para desarrollar el nivel competitivo, preparar el perfil académico y construir relación con los coaches universitarios. Sin embargo, hemos trabajado con jugadores que empezaron a los 16-17 y lograron resultados exitosos.',
  },
  {
    q: '¿Qué nivel de inglés necesito?',
    a: 'Las universidades en Estados Unidos requieren un puntaje mínimo en el TOEFL o el SAT. Generalmente, un TOEFL de 70-80 puntos es suficiente para la mayoría de los programas, aunque las universidades más competitivas pueden pedir más. Te ayudamos a planificar tu preparación de inglés como parte del roadmap.',
  },
  {
    q: '¿Qué es UTR y por qué importa?',
    a: 'UTR (Universal Tennis Rating) es el sistema de ranking más utilizado por coaches universitarios en EE.UU. para evaluar jugadores internacionales. A diferencia del ranking nacional, el UTR mide tu nivel real de juego basado en resultados. Un UTR competitivo es clave para llamar la atención de coaches universitarios.',
  },
  {
    q: '¿Necesito jugar ITF para ser considerado?',
    a: 'No es estrictamente necesario, pero ayuda significativamente. Los torneos ITF Junior son reconocidos internacionalmente y demuestran que puedes competir a un nivel alto. Sin embargo, un buen historial en torneos AMTP combinado con un UTR competitivo también puede abrir puertas, especialmente para programas NCAA II, III y NAIA.',
  },
  {
    q: '¿Cuánto cuesta la universidad en USA con beca?',
    a: 'El costo total de una universidad en EE.UU. puede ir de $30,000 a $70,000 USD al año. Las becas deportivas pueden cubrir desde el 25% hasta el 100% del costo, dependiendo de la división, el programa y tu nivel. En NCAA Division I, las becas pueden ser completas. En División II y NAIA, suelen ser parciales pero se complementan con becas académicas. Te ayudamos a entender las opciones reales para tu caso.',
  },
];

export default function CaminoUSA() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B3A2A] min-h-[500px] flex items-center">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="font-['Playfair_Display',serif] text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight mb-6">
            El tenis que juegas aquí abre puertas allá.
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Tenemos los contactos, la metodología y la experiencia para guiarte en cada paso del proceso de reclutamiento universitario en Estados Unidos.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1B3A2A] text-center mb-16">
            Tu camino hacia la beca
          </h2>

          {/* Desktop horizontal */}
          <div className="hidden lg:flex items-start justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-6 left-[8%] right-[8%] h-0.5 bg-[#8B4513]/30" />

            {timelineSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 w-1/6 px-2">
                <div className="w-12 h-12 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-sm font-bold mb-4 shrink-0">
                  {step.num}
                </div>
                <h3 className="font-bold text-[#1B3A2A] text-sm mb-2">{step.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Mobile vertical */}
          <div className="lg:hidden space-y-0">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B4513] text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {step.num}
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div className="w-0.5 h-full min-h-[60px] bg-[#8B4513]/30" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-bold text-[#1B3A2A] mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué TTPA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1B3A2A] text-center mb-12">
            ¿Por qué TTPA?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {credibilityCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-[#F8F6F2] rounded-xl p-8 text-center border border-gray-100"
                >
                  <div className="w-16 h-16 rounded-full bg-[#8B4513]/10 flex items-center justify-center mx-auto mb-6">
                    <Icon size={28} className="text-[#8B4513]" />
                  </div>
                  <h3 className="font-bold text-[#1B3A2A] text-lg mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1B3A2A] text-center mb-12">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-[#1B3A2A] pr-4">{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-[#8B4513] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-in-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-600 text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B3A2A] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para dar el primer paso?
          </h2>
          <p className="text-white/70 mb-8">
            Agenda una evaluación inicial y descubre cómo podemos ayudarte a llegar a una universidad en Estados Unidos.
          </p>
          <Link
            to="/contacto"
            className="inline-block bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
}
