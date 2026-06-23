import { torneosPublicos, proximosTorneos } from '../../data/dummy';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';
import { MapPin, Calendar, Tag } from 'lucide-react';

const typeBadge = (categoria) => {
  if (categoria.includes('ITF'))
    return { label: 'ITF', cls: 'bg-[#1B3A2A]/10 text-[#1B3A2A]' };
  if (categoria === 'Abierta')
    return { label: 'UTR', cls: 'bg-[#8B4513]/10 text-[#8B4513]' };
  return { label: 'AMTP', cls: 'bg-[#2D5A3D]/10 text-[#2D5A3D]' };
};

export default function Torneos() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[340px] bg-[#1B3A2A] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M-1 5L5-1M3 9L9 3' stroke='white' stroke-width='0.6'/%3E%3C/svg%3E")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B3A2A]/60" />
        <div className="relative z-10 text-center px-6">
          <p className="uppercase text-xs tracking-[3px] text-[#8B4513] mb-4">
            Circuito competitivo
          </p>
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white text-center">
            Resultados y calendario
          </h1>
          <p className="text-gray-300 mt-3 text-sm tracking-wide">
            Resultados del circuito AMTP &middot; UTR &middot; ITF Junior
          </p>
        </div>
      </section>

      {/* Resultados recientes */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1B3A2A] mb-12">
            Resultados recientes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {torneosPublicos.map((torneo) => {
              const badge = typeBadge(torneo.categoria);
              return (
                <div
                  key={torneo.id}
                  className="bg-white rounded-none border border-gray-200 p-6 flex flex-col"
                >
                  <h3 className="font-bold text-lg text-[#1B3A2A] mb-3">
                    {torneo.nombre}
                  </h3>

                  <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {torneo.fecha}
                    </span>
                    <span
                      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <MapPin size={14} />
                    {torneo.ubicacion}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-[#1B3A2A] mb-1">
                      Resultados TTPA:
                    </p>
                    <p className="text-sm text-[#8B4513] font-medium mb-2">
                      {torneo.resultadoEquipo.resumen}
                    </p>
                    <ul className="space-y-1">
                      {torneo.resultadoEquipo.destacados.map((d, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <ImagePlaceholder
                      description="Foto del torneo"
                      aspectRatio="aspect-[16/9]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Próximos torneos */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#1B3A2A] mb-12">
            Pr&oacute;ximos torneos
          </h2>
          <div className="divide-y divide-gray-200 border-t border-gray-200">
            {proximosTorneos.map((torneo) => (
              <div
                key={torneo.id}
                className="py-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="shrink-0 md:w-36">
                  <p className="font-['Playfair_Display'] text-2xl font-bold text-[#1B3A2A] leading-tight">
                    {torneo.fecha}
                  </p>
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-[#1B3A2A] text-base mb-1">
                    {torneo.nombre}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {torneo.ubicacion}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={13} />
                      {torneo.categoria}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 md:text-right shrink-0">
                  <p>
                    Cierre de inscripci&oacute;n:{' '}
                    <span className="font-medium text-[#1B3A2A]">
                      {torneo.inscripcionCierre}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
