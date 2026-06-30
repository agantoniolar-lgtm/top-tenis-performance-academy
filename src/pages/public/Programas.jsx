import { Link } from 'react-router-dom';
import { CheckCircle, ClipboardList, Phone, UserCheck, Rocket, CalendarCheck } from 'lucide-react';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';
import { CmsImage } from '../../components/shared/PublicMedia';
import { usePublicContent } from '../../contexts/PublicContent';

const queIncluye = [
  'Entrenamiento diario de alto rendimiento (matutino o vespertino)',
  'Metodología profesional con coaches certificados',
  'Seguimiento de UTR y ranking AMTP',
  'Reportes trimestrales personalizados',
  'Análisis post-torneo (PTF)',
  'Inscripción y logística para torneos AMTP, UTR e ITF Junior',
  'Programa de preparación física',
  'Pelotas Yonex cortesía de nuestro patrocinador oficial',
];

const pasos = [
  { icon: ClipboardList, title: 'Llena el formulario', desc: 'Completa el formulario de contacto con la información del jugador.' },
  { icon: Phone, title: 'Contacto en 24h', desc: 'Te contactamos por WhatsApp en menos de 24 horas para agendar.' },
  { icon: UserCheck, title: 'Sesión en cancha', desc: 'Evaluamos al jugador en cancha para conocer su nivel actual.' },
  { icon: CalendarCheck, title: 'Plan personalizado', desc: 'Diseñamos un plan de entrenamiento basado en la evaluación.' },
  { icon: Rocket, title: 'Inicio', desc: 'El jugador se integra al grupo de entrenamiento correspondiente.' },
];

export default function Programas() {
  const { text, asset } = usePublicContent();
  const fotoHero = asset('programas', 'foto_hero');
  const fotoSede = asset('programas', 'foto_sede');

  return (
    <div>
      {/* Hero */}
      <section className="relative w-full h-[340px] bg-[#1B3A2A] flex items-center justify-center overflow-hidden">
        {fotoHero?.url && (
          <>
            <img
              src={fotoHero.url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-[#1B3A2A]/50" />
          </>
        )}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M-1 5L5-1M3 9L9 3' stroke='white' stroke-width='0.6'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B3A2A]/60" />
        <div className="relative z-10 text-center px-6">
          <p className="uppercase text-xs tracking-[3px] text-[#8B4513] mb-4">
            Top Tenis Performance Academy
          </p>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-6xl font-bold text-white">
            El programa
          </h1>
          <p className="text-gray-300 mt-4 text-base">
            Alto rendimiento desde el primer d&iacute;a.
          </p>
        </div>
      </section>

      {/* Alto Rendimiento */}
      <section className="bg-white py-20" id="alto-rendimiento">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="uppercase tracking-wider text-sm text-[#8B4513] font-semibold mb-3">
                Nuestro programa
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                {text('programas', 'titulo', 'Alto Rendimiento')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {text('programas', 'descripcion', 'Para jugadores juniors que quieren competir al más alto nivel en México. Se requiere ranking AMTP, participación en torneos UTR o ITF Junior, o el potencial para llegar a ese nivel. La evaluación inicial es el primer paso.')}
              </p>

              <h3 className="text-base font-bold text-[#1A1A1A] mb-3">Horarios</h3>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#1B3A2A] text-white">
                      <th className="text-left px-5 py-3 rounded-tl-lg text-sm">Turno</th>
                      <th className="text-left px-5 py-3 text-sm">Horario</th>
                      <th className="text-left px-5 py-3 rounded-tr-lg text-sm">D&iacute;as</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-5 py-3.5 font-semibold text-sm">Matutino</td>
                      <td className="px-5 py-3.5 text-gray-600 text-sm">9:00 &ndash; 12:00</td>
                      <td className="px-5 py-3.5 text-gray-600 text-sm">Lunes a Viernes</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3.5 font-semibold text-sm">Vespertino</td>
                      <td className="px-5 py-3.5 text-gray-600 text-sm">16:00 &ndash; 19:00</td>
                      <td className="px-5 py-3.5 text-gray-600 text-sm">Lunes a Jueves</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Link
                to="/contacto"
                className="inline-block rounded-md px-6 py-3 font-semibold transition bg-[#8B4513] text-white hover:bg-[#A0522D]"
              >
                Solicitar evaluaci&oacute;n
              </Link>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1A1A] mb-4">Qu&eacute; incluye</h3>
              <ul className="space-y-3">
                {queIncluye.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-[#2D5A3D] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra sede */}
      <section className="bg-[#F8F6F2] py-20" id="sede">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <CmsImage
                url={fotoSede?.url}
                alt="Canchas Club Casa Blanca Lomas Verdes"
                fallback={<ImagePlaceholder description="Canchas Club Casa Blanca Lomas Verdes" />}
              />
            </div>
            <div className="order-1 md:order-2">
              <p className="uppercase tracking-wider text-sm text-[#8B4513] font-semibold mb-3">
                Nuestra sede
              </p>
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                Casa Blanca Lomas Verdes
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Entrenamos en el Club Casa Blanca, Lomas Verdes, Naucalpan. Canchas de superficie dura profesional, ambiente competitivo y acceso completo al sistema de seguimiento de la academia.
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-[#1A1A1A]">Direcci&oacute;n:</span>{' '}
                  Club Casa Blanca, Lomas Verdes, Naucalpan, Estado de M&eacute;xico
                </p>
                <p>
                  <span className="font-semibold text-[#1A1A1A]">Matutino:</span>{' '}
                  9:00 &ndash; 12:00 (L&ndash;V)
                </p>
                <p>
                  <span className="font-semibold text-[#1A1A1A]">Vespertino:</span>{' '}
                  16:00 &ndash; 19:00 (L&ndash;J)
                </p>
                <p>
                  <span className="font-semibold text-[#1A1A1A]">Superficie:</span>{' '}
                  Cancha dura profesional
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El primer paso — Evaluación */}
      <section className="bg-white py-20" id="evaluacion">
        <div className="max-w-4xl mx-auto px-6">
          <p className="uppercase tracking-wider text-sm text-[#8B4513] font-semibold mb-3">
            El primer paso
          </p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            Evaluaci&oacute;n de nivel
          </h2>
          <p className="text-gray-600 leading-relaxed mb-12 max-w-2xl">
            Nuestro proceso de evaluaci&oacute;n est&aacute; dise&ntilde;ado para conocer al jugador, entender sus objetivos y asignarle el plan de entrenamiento ideal.
          </p>

          <div className="relative">
            {pasos.map((paso, i) => (
              <div key={i} className="flex gap-6 mb-10 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#1B3A2A] flex items-center justify-center flex-shrink-0">
                    <paso.icon size={22} className="text-white" />
                  </div>
                  {i < pasos.length - 1 && (
                    <div className="w-0.5 h-full bg-[#1B3A2A]/20 mt-2" />
                  )}
                </div>
                <div className="pt-2">
                  <p className="text-xs text-[#8B4513] font-semibold uppercase tracking-wider mb-1">
                    Paso {i + 1}
                  </p>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">{paso.title}</h3>
                  <p className="text-gray-600 text-sm">{paso.desc}</p>
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
      </section>
    </div>
  );
}
