import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { TIPOS_TORNEO, CATEGORIAS_TORNEO, RONDAS_TORNEO } from '../../data/torneoOpciones';

export default function NuevoTorneo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    categoria: '',
    fecha: '',
    sede: '',
    modalidad: 'Individual',
    ronda: '',
    resultado: '',
    victoria: '',
    notas: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    // 1. Insertar el torneo en el catálogo
    const { data: tournament, error: tError } = await supabase
      .from('tournaments')
      .insert({
        nombre: form.nombre,
        tipo: form.tipo || null,
        categoria: form.categoria || null,
        fecha: form.fecha,
        sede: form.sede || null,
        created_by: user?.id,
      })
      .select('id')
      .single();

    if (tError) { setSaveError(tError.message); setSaving(false); return; }

    // 2. Registrar la participación del atleta
    const { data: athleteTournament, error: atError } = await supabase
      .from('athlete_tournaments')
      .insert({
        athlete_id: user?.athlete_id,
        tournament_id: tournament.id,
        modalidad: form.modalidad,
        ronda: form.ronda || null,
        resultado: form.resultado || null,
        victoria: form.victoria === 'true' ? true : form.victoria === 'false' ? false : null,
        notas: form.notas || null,
      })
      .select('id')
      .single();

    setSaving(false);
    if (atError) { setSaveError(atError.message); return; }

    // 3. Redirigir al PTF vinculado a este registro
    navigate(`/portal/post-torneo/${athleteTournament.id}`);
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
              {TIPOS_TORNEO.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={handleChange} className={inputClass} required>
              <option value="">Seleccionar...</option>
              {CATEGORIAS_TORNEO.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fecha de inicio del torneo</label>
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
            {RONDAS_TORNEO.map(r => <option key={r} value={r}>{r}</option>)}
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
          <label className={labelClass}>¿Ganaste el último partido?</label>
          <div className="flex gap-6 mt-1">
            {[{ value: 'true', label: 'Sí, gané' }, { value: 'false', label: 'No, perdí' }].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="victoria"
                  value={value}
                  checked={form.victoria === value}
                  onChange={handleChange}
                  className="accent-[#1B3A2A]"
                  required
                />
                {label}
              </label>
            ))}
          </div>
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

        {saveError && <p className="text-sm text-red-600">{saveError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando…' : 'Guardar resultado'}
        </button>
      </form>
    </div>
  );
}
