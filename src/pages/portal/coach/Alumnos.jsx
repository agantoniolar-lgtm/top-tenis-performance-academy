import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { alumnos, torneoCarlos } from '../../../data/dummy';
import { User, Eye } from 'lucide-react';

export default function Alumnos() {
  const { user } = useAuth();

  const lista =
    user?.rol === 'Admin'
      ? alumnos
      : alumnos.filter((a) => a.coach === user?.nombre);

  const pendingPTFs = torneoCarlos.filter((t) => !t.ptf.completado);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alumnos</h1>
        <p className="text-gray-500">
          {user?.rol === 'Admin' ? 'Todos los alumnos de la academia.' : 'Tus alumnos asignados.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lista.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1B3A2A]/10 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-[#1B3A2A]" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{a.nombre}</p>
                <p className="text-xs text-gray-400">
                  {a.edad} años — {a.horario}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#1B3A2A]/10 text-[#1B3A2A]">
                UTR {a.utr}
              </span>
              {pendingPTFs.length > 0 && a.nombre === 'Carlos Mendoza' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-700 animate-pulse">
                  PTF pendiente
                </span>
              )}
            </div>

            <Link
              to={`/portal/alumnos/${a.id}`}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#1B3A2A] text-[#1B3A2A] text-sm font-medium rounded-lg hover:bg-[#1B3A2A]/5 transition-colors"
            >
              <Eye className="w-4 h-4" /> Ver perfil
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
