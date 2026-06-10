import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Save } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { TIPOS_TORNEO, CATEGORIAS_TORNEO } from '../../../data/torneoOpciones';

export default function NuevoTorneoCoach() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [atletas, setAtletas] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    categoria: '',
    fecha: '',
    sede: '',
  });

  useEffect(() => {
    supabase
      .from('athletes')
      .select('id, nombre, apellido')
      .eq('activo', true)
      .order('apellido')
      .then(({ data }) => setAtletas(data || []));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAtleta = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === atletas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(atletas.map((a) => a.id)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.size === 0) { setSaveError('Selecciona al menos un atleta.'); return; }
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

    // 2. Registrar un athlete_tournament por cada atleta seleccionado
    const rows = [...selectedIds].map((aid) => ({
      athlete_id: aid,
      tournament_id: tournament.id,
      // Los campos de resultado (ronda, resultado, victoria, modalidad)
      // los llena el atleta desde su PTF
    }));

    const { error: atError } = await supabase.from('athlete_tournaments').insert(rows);
    setSaving(false);
    if (atError) { setSaveError(atError.message); return; }

    navigate('/portal/torneos');
  };

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A2A]/40 focus:border-[#1B3A2A]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const allSelected = atletas.length > 0 && selectedIds.size === atletas.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-[#8B4513]" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar torneo</h1>
          <p className="text-gray-500 text-sm">El atleta llenará su resultado y PTF desde su portal.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Datos del torneo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Torneo</p>

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
        </div>

        {/* Checklist de atletas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Atletas que participan
              {selectedIds.size > 0 && (
                <span className="ml-2 text-[#1B3A2A] normal-case">({selectedIds.size} seleccionados)</span>
              )}
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-medium text-[#1B3A2A] hover:underline"
            >
              {allSelected ? 'Ninguno' : 'Seleccionar todos'}
            </button>
          </div>

          {atletas.length === 0 ? (
            <p className="text-sm text-gray-400">Cargando atletas…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {atletas.map((a) => (
                <label
                  key={a.id}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedIds.has(a.id)
                      ? 'border-[#1B3A2A] bg-[#1B3A2A]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(a.id)}
                    onChange={() => toggleAtleta(a.id)}
                    className="w-4 h-4 accent-[#1B3A2A] shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    {a.apellido}, {a.nombre}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {saveError && <p className="text-sm text-red-600 px-1">{saveError}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#1B3A2A] hover:bg-[#2D5A3D] disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Registrando…' : 'Registrar torneo'}
        </button>
      </form>
    </div>
  );
}
