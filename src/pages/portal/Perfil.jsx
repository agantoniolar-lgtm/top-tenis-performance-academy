import { useAuth } from '../../hooks/useAuth';
import { alumnos, balancePartidos, torneoCarlos } from '../../data/dummy';
import { User, Trophy, TrendingUp, MapPin, Clock, Users } from 'lucide-react';

export default function Perfil() {
  const { user } = useAuth();
  const alumno = alumnos.find((a) => a.nombre === user?.nombre) || alumnos[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-[#1B3A2A]/10 flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-[#1B3A2A]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{alumno.nombre}</h2>
            <p className="text-sm text-gray-500">{alumno.edad} años</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3A2A] text-white">
                UTR {alumno.utr}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8B4513]/10 text-[#8B4513]">
                AMTP {alumno.ranking}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Información</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Turno</p>
              <p className="text-sm font-medium text-gray-800">{alumno.horario}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Coach</p>
              <p className="text-sm font-medium text-gray-800">{alumno.coach}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Sede</p>
              <p className="text-sm font-medium text-gray-800">Top Tenis Performance Academy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Estadísticas</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#1B3A2A]">{torneoCarlos.length}</p>
            <p className="text-xs text-gray-500 mt-1">Torneos recientes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{balancePartidos.total.victorias}</p>
            <p className="text-xs text-gray-500 mt-1">Victorias</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{balancePartidos.total.derrotas}</p>
            <p className="text-xs text-gray-500 mt-1">Derrotas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
