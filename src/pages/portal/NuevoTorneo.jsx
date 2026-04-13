import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Save } from 'lucide-react';

export default function NuevoTorneo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    categoria: '',
    fecha: '',
    sede: '',
    modalidad: 'Individual',
    ronda: '',
    resultado: '',
    notas: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('ttpa_torneos') || '[]');
    const newTorneo = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    existing.push(newTorneo);
    localStorage.setItem('ttpa_torneos', JSON.stringify(existing));
    navigate('/portal/post-torneo/new');
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-[#8B4513]" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subir resultado de torneo</h1>
          <p className="text-gray-500 text-sm">Registra los detalles de tu participación.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className={labelClass}>Nombre del torneo</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} className={inputClass} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Tipo</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccionar...</option>
              <option value="AMTP">AMTP</option>
              <option value="ITF Junior">ITF Junior</option>
              <option value="UTR">UTR</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccionar...</option>
              <option value="U12">U12</option>
              <option value="U14">U14</option>
              <option value="U16">U16</option>
              <option value="U18">U18</option>
              <option value="Open">Open</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fecha</label>
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Ciudad / Sede</label>
            <input name="sede" value={form.sede} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        <div>
          <label className={labelClass}>Modalidad</label>
          <div className="flex gap-4 mt-1">
            {['Individual', 'Dobles', 'Ambas'].map((m) => (
              <label key={m} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="modalidad"
                  value={m}
                  checked={form.modalidad === m}
                  onChange={handleChange}
                  className="accent-[#1B3A2A]"
                />
                {m}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Ronda alcanzada</label>
          <select name="ronda" value={form.ronda} onChange={handleChange} className={inputClass} required>
            <option value="">Seleccionar...</option>
            <option value="Primera ronda">Primera ronda</option>
            <option value="Segunda ronda">Segunda ronda</option>
            <option value="Tercera ronda">Tercera ronda</option>
            <option value="Cuartos de final">Cuartos de final</option>
            <option value="Semifinal">Semifinal</option>
            <option value="Final">Final</option>
            <option value="Campeón">Campeón</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Resultado último partido</label>
          <input
            name="resultado"
            value={form.resultado}
            onChange={handleChange}
            className={inputClass}
            placeholder="6-4 3-6 6-3"
          />
        </div>

        <div>
          <label className={labelClass}>Notas (opcional)</label>
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar resultado
        </button>
      </form>
    </div>
  );
}
