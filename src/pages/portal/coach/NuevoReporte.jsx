import { useState } from 'react';
import { alumnos } from '../../../data/dummy';
import { FileText, CheckCircle } from 'lucide-react';

const dimensiones = ['Técnica', 'Táctica', 'Físico', 'Mental', 'Torneos'];

export default function NuevoReporte() {
  const [alumnoId, setAlumnoId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [resumen, setResumen] = useState('');
  const [scores, setScores] = useState(
    Object.fromEntries(dimensiones.map((d) => [d, { puntaje: 5, nota: '' }]))
  );
  const [areas, setAreas] = useState('');
  const [objetivos, setObjetivos] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (dim, field, value) => {
    setScores((prev) => ({
      ...prev,
      [dim]: { ...prev[dim], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Reporte publicado exitosamente</h2>
        <p className="text-gray-500 text-sm">El alumno y su familia podrán verlo en su portal.</p>
      </div>
    );
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-[#8B4513]" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear reporte periódico</h1>
          <p className="text-gray-500 text-sm">Evalúa el progreso del alumno en todas las dimensiones.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alumno & period */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className={labelClass}>Alumno</label>
            <select value={alumnoId} onChange={(e) => setAlumnoId(e.target.value)} className={inputClass} required>
              <option value="">Seleccionar alumno...</option>
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>{a.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Periodo — Desde</label>
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Periodo — Hasta</label>
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={inputClass} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Resumen general</label>
            <textarea value={resumen} onChange={(e) => setResumen(e.target.value)} className={`${inputClass} resize-none`} rows={4} required />
          </div>
        </div>

        {/* Dimensions */}
        {dimensiones.map((dim) => (
          <div key={dim} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{dim}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Puntaje:</span>
                <span className="text-sm font-bold text-[#1B3A2A]">{scores[dim].puntaje}</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={scores[dim].puntaje}
              onChange={(e) => handleScoreChange(dim, 'puntaje', Number(e.target.value))}
              className="w-full accent-[#1B3A2A]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
            <div>
              <label className={labelClass}>Notas sobre {dim.toLowerCase()}</label>
              <textarea
                value={scores[dim].nota}
                onChange={(e) => handleScoreChange(dim, 'nota', e.target.value)}
                className={`${inputClass} resize-none`}
                rows={3}
              />
            </div>
          </div>
        ))}

        {/* Areas & objectives */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className={labelClass}>Áreas de oportunidad <span className="text-gray-400 font-normal">(una por línea)</span></label>
            <textarea value={areas} onChange={(e) => setAreas(e.target.value)} className={`${inputClass} resize-none`} rows={4} />
          </div>
          <div>
            <label className={labelClass}>Próximos objetivos <span className="text-gray-400 font-normal">(uno por línea)</span></label>
            <textarea value={objetivos} onChange={(e) => setObjetivos(e.target.value)} className={`${inputClass} resize-none`} rows={4} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Publicar reporte
        </button>
      </form>
    </div>
  );
}
