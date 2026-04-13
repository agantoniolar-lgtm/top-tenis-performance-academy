import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  alumnos,
  torneoCarlos,
  balancePartidos,
  reporteCarlos,
  ejerciciosCarlos,
} from '../../../data/dummy';
import {
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  PlusCircle,
  Dumbbell,
  FileText,
  User,
  CheckCircle,
  Clock,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-[#1B3A2A]/10 shrink-0">
        <Icon className="w-5 h-5 text-[#1B3A2A]" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AlumnoDetalle() {
  const { id } = useParams();
  const alumno = alumnos.find((a) => a.id === Number(id)) || alumnos[0];
  const [tab, setTab] = useState('torneos');

  const tabs = [
    { key: 'torneos', label: 'Historial de torneos' },
    { key: 'ptf', label: 'Formularios post-torneo' },
    { key: 'reportes', label: 'Historial de reportes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#1B3A2A]/10 flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-[#1B3A2A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{alumno.nombre}</h1>
            <p className="text-sm text-gray-500">{alumno.edad} años — {alumno.horario} — Coach: {alumno.coach}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#1B3A2A] text-white">UTR {alumno.utr}</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#8B4513]/10 text-[#8B4513]">{alumno.ranking}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/portal/reportes/nuevo"
            className="flex items-center gap-1.5 bg-[#1B3A2A] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#2D5A3D] transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Crear reporte periódico
          </Link>
          <button className="flex items-center gap-1.5 border border-[#1B3A2A] text-[#1B3A2A] text-sm px-4 py-2 rounded-lg hover:bg-[#1B3A2A]/5 transition-colors">
            <Dumbbell className="w-4 h-4" /> Asignar ejercicio
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="UTR actual" value={alumno.utr} sub="↑ 0.2" />
        <StatCard icon={Trophy} label="Torneos este año" value={torneoCarlos.length} />
        <StatCard icon={Target} label="Balance" value={`${balancePartidos.total.victorias}V / ${balancePartidos.total.derrotas}D`} />
        <StatCard icon={Calendar} label="Próximo torneo" value="AMTP Bajío" sub="3 mayo" />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'text-[#1B3A2A] border-b-2 border-[#1B3A2A]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === 'torneos' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Torneo</th>
                <th className="text-left px-5 py-3 font-medium">Fecha</th>
                <th className="text-left px-5 py-3 font-medium">Ronda</th>
                <th className="text-left px-5 py-3 font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {torneoCarlos.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{t.nombre}</td>
                  <td className="px-5 py-3 text-gray-600">{t.fecha}</td>
                  <td className="px-5 py-3 text-gray-600">{t.ronda}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.victoria ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.resultado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'ptf' && (
        <div className="space-y-3">
          {torneoCarlos.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 text-sm">{t.nombre}</p>
                <p className="text-xs text-gray-400">{t.fecha}</p>
              </div>
              {t.ptf.completado ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3" /> Completado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-700 animate-pulse">
                  <Clock className="w-3 h-3" /> Pendiente
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'reportes' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#1B3A2A]" />
            <div>
              <p className="font-semibold text-gray-800">Reporte Mensual — {reporteCarlos.periodo}</p>
              <p className="text-xs text-gray-400">Coach: {reporteCarlos.coach}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{reporteCarlos.resumenCoach}</p>
          <Link to="/portal/reportes" className="text-sm text-[#8B4513] font-medium mt-2 inline-block hover:underline">
            Ver reporte completo
          </Link>
        </div>
      )}
    </div>
  );
}
