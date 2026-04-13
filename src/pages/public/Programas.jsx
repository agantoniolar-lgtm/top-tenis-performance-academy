import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ClipboardList, Phone, UserCheck, Rocket, CalendarCheck } from 'lucide-react';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';

const tabs = ['Alto Rendimiento', 'Casa Blanca Lomas Verdes', 'Evaluaci\u00f3n de nivel'];

const queIncluye = [
  'Entrenamiento diario de alto rendimiento (matutino o vespertino)',
  'Metodolog\u00eda profesional con coaches certificados',
  'Seguimiento de UTR y ranking AMTP',
  'Reportes mensuales personalizados',
  'An\u00e1lisis post-torneo (PTF)',
  'Inscripci\u00f3n y log\u00edstica para torneos AMTP, UTR e ITF Junior',
  'Programa de preparaci\u00f3n f\u00edsica',
  'Pelotas Yonex cortes\u00eda de nuestro patrocinador oficial',
];

const pasos = [
  { icon: ClipboardList, title: 'Llena formulario', desc: 'Completa el formulario de contacto con la informaci\u00f3n del jugador.' },
  { icon: Phone, title: 'Contacto 24h', desc: 'Te contactamos por WhatsApp en menos de 24 horas para agendar.' },
  { icon: UserCheck, title: 'Sesi\u00f3n en cancha', desc: 'Evaluamos al jugador en cancha para conocer su nivel actual.' },
  { icon: CalendarCheck, title: 'Plan personalizado', desc: 'Dise\u00f1amos un plan de entrenamiento basado en la evaluaci\u00f3n.' },
  { icon: Rocket, title: 'Inicio', desc: 'El jugador se integra al grupo de entrenamiento correspondiente.' },
];

export default function Programas() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full h-[300px] bg-[#1B3A2A] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 text-center px-6">
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold text-white">
            Programas
          </h1>
          <p className="text-gray-300 mt-4 text-lg">Encuentra el programa ideal para tu nivel y objetivos.</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Tab buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition ${
                  activeTab === i
                    ? 'bg-[#1B3A2A] text-white'
                    : 'bg-[#F8F6F2] text-[#1A1A1A] hover:bg-[#1B3A2A]/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1 — Alto Rendimiento */}
          {activeTab === 0 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A1A] mb-4">
                Alto Rendimiento
              </h2>
              <div className="bg-[#F8F6F2] rounded-xl p-8 mb-8">
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">
                  &iquest;Para qui&eacute;n es?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Para jugadores juniors que quieren competir al m&aacute;s alto nivel en M&eacute;xico. Jugadores con ranking AMTP, participaci&oacute;n en torneos UTR o ITF Junior, o que buscan llegar a ese nivel. Se requiere evaluaci&oacute;n previa en cancha.
                </p>
              </div>

              {/* Schedule */}
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Horarios</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#1B3A2A] text-white">
                      <th className="text-left px-6 py-3 rounded-tl-lg">Turno</th>
                      <th className="text-left px-6 py-3">Horario</th>
                      <th className="text-left px-6 py-3 rounded-tr-lg">D&iacute;as</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4 font-semibold">Matutino</td>
                      <td className="px-6 py-4">9:00 &ndash; 12:00</td>
                      <td className="px-6 py-4">Lunes a Viernes</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Vespertino</td>
                      <td className="px-6 py-4">16:00 &ndash; 19:00</td>
                      <td className="px-6 py-4">Lunes a Jueves</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Que incluye */}
              <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Qu&eacute; incluye</h3>
              <ul className="space-y-3 mb-10">
                {queIncluye.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#2D5A3D] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contacto"
                className="inline-block rounded-md px-6 py-3 font-semibold transition bg-[#8B4513] text-white hover:bg-[#A0522D]"
              >
                Solicitar evaluaci&oacute;n
              </Link>
            </div>
          )}

          {/* Tab 2 — Casa Blanca Lomas Verdes */}
          {activeTab === 1 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A1A] mb-4">
                Casa Blanca Lomas Verdes
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Nuestra sede principal se encuentra en el Club Casa Blanca Lomas Verdes, Naucalpan, Estado de M&eacute;xico. Un espacio ideal para el desarrollo de jugadores de alto rendimiento con canchas profesionales y ambiente competitivo.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-[#F8F6F2] rounded-xl p-8">
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">Informaci&oacute;n de la sede</h3>
                  <div className="space-y-3 text-gray-600">
                    <p>
                      <span className="font-semibold text-[#1A1A1A]">Direcci&oacute;n:</span><br />
                      Club Casa Blanca, Lomas Verdes, Naucalpan, Estado de M&eacute;xico
                    </p>
                    <p>
                      <span className="font-semibold text-[#1A1A1A]">Horarios de entrenamiento:</span><br />
                      Matutino: 9:00 &ndash; 12:00 (L-V)<br />
                      Vespertino: 16:00 &ndash; 19:00 (L-J)
                    </p>
                    <p>
                      <span className="font-semibold text-[#1A1A1A]">Canchas:</span><br />
                      Canchas de superficie dura profesional
                    </p>
                  </div>
                </div>
                <div>
                  <ImagePlaceholder description="Canchas Casa Blanca Lomas Verdes" />
                </div>
              </div>

              <Link
                to="/contacto"
                className="inline-block rounded-md px-6 py-3 font-semibold transition bg-[#8B4513] text-white hover:bg-[#A0522D]"
              >
                Agendar visita
              </Link>
            </div>
          )}

          {/* Tab 3 — Evaluacion de nivel */}
          {activeTab === 2 && (
            <div className="max-w-4xl mx-auto">
              <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1A1A1A] mb-4">
                Evaluaci&oacute;n de nivel
              </h2>
              <p className="text-gray-600 leading-relaxed mb-12">
                Nuestro proceso de evaluaci&oacute;n est&aacute; dise&ntilde;ado para conocer al jugador, entender sus objetivos y asignarle el plan de entrenamiento ideal.
              </p>

              {/* Steps */}
              <div className="relative">
                {pasos.map((paso, i) => (
                  <div key={i} className="flex gap-6 mb-10 last:mb-0">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#1B3A2A] flex items-center justify-center flex-shrink-0">
                        <paso.icon size={22} className="text-white" />
                      </div>
                      {i < pasos.length - 1 && (
                        <div className="w-0.5 h-full bg-[#1B3A2A]/20 mt-2" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pt-2">
                      <p className="text-xs text-[#8B4513] font-semibold uppercase tracking-wider mb-1">
                        Paso {i + 1}
                      </p>
                      <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{paso.title}</h3>
                      <p className="text-gray-600">{paso.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Link
                  to="/contacto"
                  className="inline-block rounded-md px-6 py-3 font-semibold transition bg-[#8B4513] text-white hover:bg-[#A0522D]"
                >
                  Solicitar evaluaci&oacute;n
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
