import { torneosPublicos, proximosTorneos } from '../../data/dummy';
import ImagePlaceholder from '../../components/shared/ImagePlaceholder';
import { MapPin, Calendar, Tag } from 'lucide-react';

const typeBadge = (categoria) => {
  if (categoria.includes('ITF'))
    return { label: 'ITF', cls: 'bg-blue-100 text-blue-800' };
  if (categoria === 'Abierta')
    return { label: 'UTR', cls: 'bg-purple-100 text-purple-800' };
  return { label: 'AMTP', cls: 'bg-green-100 text-green-800' };
};

export default function Torneos() {
  return (
    <div>
      {/* Hero */}
      <section className="h-[300px] bg-[#1B3A2A] flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-6">
          Resultados y calendario
        </h1>
      </section>

      {/* Resultados recientes */}
      <section className="py-20 bg-[#F8F6F2]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#1B3A2A] mb-12">
            Resultados recientes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {torneosPublicos.map((torneo) => {
              const badge = typeBadge(torneo.categoria);
              return (
                <div
                  key={torneo.id}
                  className="bg-white rounded-xl shadow-sm p-6 flex flex-col"
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
          <h2 className="text-3xl font-bold text-[#1B3A2A] mb-12">
            Próximos torneos
          </h2>
          <div className="space-y-4">
            {proximosTorneos.map((torneo) => (
              <div
                key={torneo.id}
                className="bg-[#F8F6F2] rounded-xl p-6 border-l-4 border-[#8B4513] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-[#1B3A2A] text-lg">
                    {torneo.nombre}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {torneo.fecha}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {torneo.ubicacion}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      {torneo.categoria}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-500 md:text-right shrink-0">
                  <p>
                    Cierre de inscripción:{' '}
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
