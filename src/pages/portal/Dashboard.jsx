import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  alumnos,
  torneoCarlos,
  utrHistorico,
  balancePartidos,
  reporteCarlos,
  ejerciciosCarlos,
  actividadReciente,
  proximosTorneos,
} from '../../data/dummy';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  FileText,
  Dumbbell,
  Users,
  Activity,
  PlusCircle,
  Eye,
  Clock,
  Video,
  ClipboardList,
  UserPlus,
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, RadialLinearScale, Filler, Tooltip, Legend);

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, sub, color = 'text-[#1B3A2A]' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg bg-[#1B3A2A]/10 shrink-0">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ═══════════════ ALUMNO ═══════════════ */
function VistaAlumno({ user }) {
  const pendingExercises = ejerciciosCarlos.filter((e) => e.estado === 'Pendiente');

  const utrData = {
    labels: utrHistorico.meses,
    datasets: [
      {
        label: 'UTR',
        data: utrHistorico.valores,
        borderColor: '#1B3A2A',
        backgroundColor: 'rgba(27,58,42,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#1B3A2A',
      },
    ],
  };

  const utrOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { min: 7, max: 9, ticks: { stepSize: 0.5 } },
    },
  };

  const donutData = {
    labels: ['Victorias', 'Derrotas'],
    datasets: [
      {
        data: [balancePartidos.total.victorias, balancePartidos.total.derrotas],
        backgroundColor: ['#16A34A', '#DC2626'],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    cutout: '65%',
    plugins: { legend: { position: 'bottom' } },
  };

  const last3 = torneoCarlos.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hola, {user.nombre}.</h1>
        <p className="text-gray-500">Aquí está tu resumen de la semana.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="UTR actual" value="8.4" sub="↑ 0.2" />
        <StatCard icon={Trophy} label="Torneos este año" value="6" />
        <StatCard icon={Target} label="Balance" value="14V / 8D" />
        <StatCard icon={Calendar} label="Próximo torneo" value="AMTP Bajío" sub="3 mayo" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Progreso UTR</h3>
          <Line data={utrData} options={utrOptions} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center">
          <h3 className="font-semibold text-gray-800 mb-4 self-start">Balance de partidos</h3>
          <div className="w-56">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>
      </div>

      {/* Last 3 tournaments */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Últimos torneos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {last3.map((t) => (
            <div key={t.id} className="border border-gray-100 rounded-lg p-4">
              <p className="font-medium text-gray-800 text-sm">{t.nombre}</p>
              <p className="text-xs text-gray-400 mt-1">{t.fecha} — {t.ronda}</p>
              <span
                className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded ${
                  t.victoria ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {t.victoria ? 'Victoria' : 'Derrota'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Last coach report preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-2">Último reporte del coach</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Reporte mensual — {reporteCarlos.periodo}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Coach: {reporteCarlos.coach}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{reporteCarlos.resumenCoach}</p>
        <Link to="/portal/reportes" className="text-sm text-[#8B4513] font-medium mt-2 inline-block hover:underline">
          Ver reporte completo
        </Link>
      </div>

      {/* Pending exercises */}
      {pendingExercises.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Ejercicios pendientes</h3>
          </div>
          <p className="text-sm text-amber-700">
            Tienes {pendingExercises.length} ejercicio(s) pendiente(s) de video.
          </p>
          <Link to="/portal/ejercicios" className="text-sm text-[#8B4513] font-medium mt-2 inline-block hover:underline">
            Ver ejercicios
          </Link>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ COACH ═══════════════ */
function VistaCoach({ user }) {
  const misAlumnos = alumnos.filter((a) => a.coach === user.nombre);
  const pendingPTFs = torneoCarlos.filter((t) => !t.ptf.completado);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hola, {user.nombre}.</h1>
          <p className="text-gray-500">Panel del coach — tus alumnos y actividad reciente.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/portal/reportes/nuevo"
            className="flex items-center gap-1.5 bg-[#1B3A2A] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#2D5A3D] transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Crear reporte
          </Link>
          <Link
            to="/portal/alumnos"
            className="flex items-center gap-1.5 border border-[#1B3A2A] text-[#1B3A2A] text-sm px-4 py-2 rounded-lg hover:bg-[#1B3A2A]/5 transition-colors"
          >
            <Users className="w-4 h-4" /> Ver alumnos
          </Link>
        </div>
      </div>

      {/* Student cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {misAlumnos.map((a) => (
          <Link
            key={a.id}
            to={`/portal/alumnos/${a.id}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3A2A]/10 flex items-center justify-center text-[#1B3A2A] font-bold text-sm">
                {a.nombre.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{a.nombre}</p>
                <p className="text-xs text-gray-400">{a.edad} años — {a.horario}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#1B3A2A]/10 text-[#1B3A2A]">
                UTR {a.utr}
              </span>
              {pendingPTFs.length > 0 && a.nombre === 'Carlos Mendoza' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-700 animate-pulse">
                  PTF pendiente
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Actividad reciente
        </h3>
        <div className="space-y-3">
          {actividadReciente.map((act) => {
            const icons = { video: Video, ptf: ClipboardList, ejercicio: Dumbbell, inscripcion: UserPlus, reporte: FileText };
            const ActIcon = icons[act.tipo] || Activity;
            return (
              <div key={act.id} className="flex items-start gap-3 text-sm">
                <div className="p-1.5 bg-gray-100 rounded-lg mt-0.5">
                  <ActIcon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-700">{act.mensaje}</p>
                  <p className="text-xs text-gray-400">{act.fecha} — {act.hora}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ PADRE ═══════════════ */
function VistaPadre({ user }) {
  const carlos = alumnos.find((a) => a.nombre === 'Carlos Mendoza');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user.nombre}.</h1>
        <p className="text-gray-500">Resumen del progreso de Carlos Mendoza. <span className="text-xs text-gray-400">(solo lectura)</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="UTR actual" value={carlos.utr} sub="↑ 0.2" />
        <StatCard icon={Trophy} label="Torneos este año" value="6" />
        <StatCard icon={Target} label="Balance" value="14V / 8D" />
        <StatCard icon={Calendar} label="Próximo torneo" value="AMTP Bajío" sub="3 mayo" />
      </div>

      {/* Last reports */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-2">Último reporte del coach</h3>
        <p className="text-sm text-gray-600 font-medium">Reporte mensual — {reporteCarlos.periodo}</p>
        <p className="text-xs text-gray-400 mt-1">Coach: {reporteCarlos.coach}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{reporteCarlos.resumenCoach}</p>
        <Link to="/portal/reportes" className="text-sm text-[#8B4513] font-medium mt-2 inline-block hover:underline">
          Ver reporte completo
        </Link>
      </div>

      {/* Upcoming tournaments */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Próximos torneos</h3>
        <div className="space-y-3">
          {proximosTorneos
            .filter((t) => t.inscritos.includes('Carlos Mendoza'))
            .map((t) => (
              <div key={t.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.nombre}</p>
                  <p className="text-xs text-gray-400">{t.fecha} — {t.ubicacion}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1B3A2A]/10 text-[#1B3A2A] font-medium">
                  {t.categoria}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ ADMIN ═══════════════ */
function VistaAdmin({ user }) {
  const pendingPTFs = torneoCarlos.filter((t) => !t.ptf.completado);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
          <p className="text-gray-500">Vista completa de todos los alumnos y actividad.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/portal/reportes/nuevo"
            className="flex items-center gap-1.5 bg-[#1B3A2A] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#2D5A3D] transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Crear reporte
          </Link>
          <Link
            to="/portal/alumnos"
            className="flex items-center gap-1.5 border border-[#1B3A2A] text-[#1B3A2A] text-sm px-4 py-2 rounded-lg hover:bg-[#1B3A2A]/5 transition-colors"
          >
            <Users className="w-4 h-4" /> Ver alumnos
          </Link>
        </div>
      </div>

      {/* ALL student cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alumnos.map((a) => (
          <Link
            key={a.id}
            to={`/portal/alumnos/${a.id}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B3A2A]/10 flex items-center justify-center text-[#1B3A2A] font-bold text-sm">
                {a.nombre.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{a.nombre}</p>
                <p className="text-xs text-gray-400">{a.edad} años — {a.horario} — Coach: {a.coach}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#1B3A2A]/10 text-[#1B3A2A]">
                UTR {a.utr}
              </span>
              {pendingPTFs.length > 0 && a.nombre === 'Carlos Mendoza' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-700 animate-pulse">
                  PTF pendiente
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Actividad reciente
        </h3>
        <div className="space-y-3">
          {actividadReciente.map((act) => {
            const icons = { video: Video, ptf: ClipboardList, ejercicio: Dumbbell, inscripcion: UserPlus, reporte: FileText };
            const ActIcon = icons[act.tipo] || Activity;
            return (
              <div key={act.id} className="flex items-start gap-3 text-sm">
                <div className="p-1.5 bg-gray-100 rounded-lg mt-0.5">
                  <ActIcon className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-gray-700">{act.mensaje}</p>
                  <p className="text-xs text-gray-400">{act.fecha} — {act.hora}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.rol) {
    case 'Alumno':
      return <VistaAlumno user={user} />;
    case 'Coach':
      return <VistaCoach user={user} />;
    case 'Padre':
      return <VistaPadre user={user} />;
    case 'Admin':
      return <VistaAdmin user={user} />;
    default:
      return <p className="p-8 text-gray-500">Rol no reconocido.</p>;
  }
}
