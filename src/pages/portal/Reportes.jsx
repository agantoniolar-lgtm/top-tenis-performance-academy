import { useState } from 'react';
import { reporteCarlos } from '../../data/dummy';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { FileText, Download, ChevronLeft, X, Loader2 } from 'lucide-react';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Reportes() {
  const [showDetail, setShowDetail] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('PDF descargado (simulación).');
    }, 1500);
  };

  const radarData = {
    labels: reporteCarlos.dimensiones.map((d) => d.nombre),
    datasets: [
      {
        label: 'Puntaje',
        data: reporteCarlos.dimensiones.map((d) => d.puntaje),
        backgroundColor: 'rgba(27, 58, 42, 0.2)',
        borderColor: '#1B3A2A',
        borderWidth: 2,
        pointBackgroundColor: '#1B3A2A',
        pointRadius: 4,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2 },
        pointLabels: { font: { size: 13 } },
      },
    },
    plugins: { legend: { display: false } },
  };

  if (showDetail) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => setShowDetail(false)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a reportes
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Reporte Mensual — {reporteCarlos.periodo}</h1>
              <p className="text-sm text-gray-500 mt-1">Alumno: {reporteCarlos.alumno}</p>
              <p className="text-sm text-gray-500">Coach: {reporteCarlos.coach}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1B3A2A]/10 text-[#1B3A2A]">
              {reporteCarlos.periodo}
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{reporteCarlos.resumenCoach}</p>
        </div>

        {/* Radar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center">
          <h3 className="font-semibold text-gray-800 mb-4 self-start">Perfil multidimensional</h3>
          <div className="w-72">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Dimension notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-800">Notas por dimensión</h3>
          {reporteCarlos.dimensiones.map((d) => (
            <div key={d.nombre} className="border-b border-gray-100 pb-3 last:border-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800 text-sm">{d.nombre}</span>
                <span className="text-sm font-bold text-[#1B3A2A]">{d.puntaje}/10</span>
              </div>
              <p className="text-sm text-gray-600">{d.nota}</p>
            </div>
          ))}
        </div>

        {/* Areas & objectives */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Áreas de oportunidad</h3>
            <ul className="space-y-2">
              {reporteCarlos.areasDeOportunidad.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Próximos objetivos</h3>
            <ul className="space-y-2">
              {reporteCarlos.proximosObjetivos.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Coach signature */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Elaborado por</p>
          <p className="text-lg font-semibold text-[#1B3A2A]">{reporteCarlos.coach}</p>
          <p className="text-xs text-gray-400 mt-1">Coach — Top Tenis Performance Academy</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-500">Reportes periódicos del coach.</p>
      </div>

      {/* Report card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#1B3A2A]/10">
              <FileText className="w-5 h-5 text-[#1B3A2A]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Reporte Mensual — {reporteCarlos.periodo}</h3>
              <p className="text-sm text-gray-500">Coach: {reporteCarlos.coach}</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1B3A2A]/10 text-[#1B3A2A]">
            {reporteCarlos.periodo}
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{reporteCarlos.resumenCoach}</p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowDetail(true)}
            className="px-4 py-2 bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Ver reporte
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Descargando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Descargar PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
