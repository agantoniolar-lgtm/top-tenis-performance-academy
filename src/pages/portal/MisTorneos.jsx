import { Link } from 'react-router-dom';
import { torneoCarlos } from '../../data/dummy';
import { Trophy, Clock, CheckCircle, Plus } from 'lucide-react';

export default function MisTorneos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Torneos</h1>
        <p className="text-gray-500">Historial de torneos y formularios post-torneo.</p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Torneo</th>
              <th className="text-left px-5 py-3 font-medium">Fecha</th>
              <th className="text-left px-5 py-3 font-medium">Ronda</th>
              <th className="text-left px-5 py-3 font-medium">Resultado</th>
              <th className="text-left px-5 py-3 font-medium">PTF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {torneoCarlos.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#8B4513]" />
                    <span className="font-medium text-gray-800">{t.nombre}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-gray-600">{t.fecha}</td>
                <td className="px-5 py-4 text-gray-600">{t.ronda}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block text-xs font-semibold px-2.5 py-1 rounded ${
                      t.victoria ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t.resultado}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {t.ptf.completado ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3" /> Completado
                    </span>
                  ) : (
                    <Link
                      to={`/portal/post-torneo/${t.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-700 animate-pulse hover:bg-amber-200 transition-colors"
                    >
                      <Clock className="w-3 h-3" /> Pendiente
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {torneoCarlos.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-[#8B4513]" />
              <span className="font-medium text-gray-800">{t.nombre}</span>
            </div>
            <p className="text-xs text-gray-400">{t.fecha} — {t.ronda}</p>
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded ${
                  t.victoria ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {t.victoria ? 'Victoria' : 'Derrota'}
              </span>
              {t.ptf.completado ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" /> PTF Completado
                </span>
              ) : (
                <Link
                  to={`/portal/post-torneo/${t.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-700 animate-pulse"
                >
                  <Clock className="w-3 h-3" /> PTF Pendiente
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <Link
        to="/portal/torneos/nuevo"
        className="fixed bottom-8 right-8 bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white rounded-full p-4 shadow-lg transition-colors flex items-center gap-2 z-10"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Subir resultado</span>
      </Link>
    </div>
  );
}
