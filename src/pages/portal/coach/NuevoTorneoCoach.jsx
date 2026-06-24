import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    nombre: '', tipo: '', categoria: '', fecha: '', sede: '',
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
    setSelectedIds(
      selectedIds.size === atletas.length
        ? new Set()
        : new Set(atletas.map((a) => a.id))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.size === 0) { setSaveError('Selecciona al menos un atleta.'); return; }
    setSaving(true);
    setSaveError('');

    const { data: tournament, error: tError } = await supabase
      .from('tournaments')
      .insert({
        nombre:     form.nombre,
        tipo:       form.tipo || null,
        categoria:  form.categoria || null,
        fecha:      form.fecha,
        sede:       form.sede || null,
        created_by: user?.id,
      })
      .select('id')
      .single();

    if (tError) { setSaveError(tError.message); setSaving(false); return; }

    const rows = [...selectedIds].map((aid) => ({
      athlete_id:    aid,
      tournament_id: tournament.id,
    }));

    const { error: atError } = await supabase.from('athlete_tournaments').insert(rows);
    setSaving(false);
    if (atError) { setSaveError(atError.message); return; }

    navigate('/portal/torneos');
  };

  const allSelected = atletas.length > 0 && selectedIds.size === atletas.length;

  return (
    <Shell>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h1 className="font-display font-extrabold text-[28px] leading-none mb-1">Registrar torneo</h1>
        <p className="text-[12px] mb-8" style={{ color: 'var(--ink-mute)' }}>
          El atleta llenará su resultado y PTF desde su portal.
        </p>

        {saveError && (
          <div className="p-3 mb-6 text-[12px] text-red-700 hairline" style={{ background: 'rgba(220,38,38,.06)' }}>
            {saveError}
          </div>
        )}

        {/* ── Datos del torneo ─────────────────────────────────────────── */}
        <SectionHeader label="Torneo" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Nombre del torneo *" wide>
            <input name="nombre" value={form.nombre} onChange={handleChange}
                   required className={input} />
          </Field>
          <Field label="Tipo *">
            <select name="tipo" value={form.tipo} onChange={handleChange} required className={input}>
              <option value="">— seleccionar —</option>
              {TIPOS_TORNEO.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Categoría *">
            <select name="categoria" value={form.categoria} onChange={handleChange} required className={input}>
              <option value="">— seleccionar —</option>
              {CATEGORIAS_TORNEO.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Fecha de inicio *">
            <input type="date" name="fecha" value={form.fecha} onChange={handleChange}
                   required className={input} />
          </Field>
          <Field label="Ciudad / Sede *">
            <input name="sede" value={form.sede} onChange={handleChange}
                   required className={input} />
          </Field>
        </div>

        {/* ── Atletas ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-3">
          <p className="eyebrow !text-[10px] pb-2 hairline-b flex-1" style={{ color: 'var(--ink-mute)' }}>
            Atletas que participan
            {selectedIds.size > 0 && (
              <span className="ml-2 normal-case font-mono" style={{ color: 'var(--ink)' }}>
                · {selectedIds.size} seleccionados
              </span>
            )}
          </p>
          <button type="button" onClick={toggleAll}
                  className="text-[11px] font-mono ml-4 mb-2 hover:underline"
                  style={{ color: 'var(--ink-mute)' }}>
            {allSelected ? 'Ninguno' : 'Todos'}
          </button>
        </div>

        {atletas.length === 0 ? (
          <p className="text-[12px] mb-6" style={{ color: 'var(--ink-mute)' }}>Cargando atletas…</p>
        ) : (
          <div className="hairline bg-[var(--paper)] mb-8">
            {atletas.map((a, i) => (
              <label
                key={a.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${i > 0 ? 'hairline-t' : ''} ${
                  selectedIds.has(a.id) ? 'bg-[var(--cream)]' : 'hover:bg-[var(--cream)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(a.id)}
                  onChange={() => toggleAtleta(a.id)}
                  className="shrink-0"
                  style={{ accentColor: 'var(--accent)', width: 14, height: 14 }}
                />
                <span className="text-[13px]">{a.apellido}, {a.nombre}</span>
                {selectedIds.has(a.id) && (
                  <span className="ml-auto tag text-[9px]"
                        style={{ background: 'rgba(var(--accent-rgb),.1)', color: 'var(--accent)' }}>
                    ✓
                  </span>
                )}
              </label>
            ))}
          </div>
        )}

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
                  className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60 hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
            {saving ? 'Registrando…' : 'Registrar torneo'}
          </button>
          <button type="button" onClick={() => navigate('/portal/torneos')}
                  className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] hairline hover:bg-[var(--cream)] transition">
            Cancelar
          </button>
        </div>
      </form>
    </Shell>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const input = 'w-full hairline px-3 py-2 text-[13px] bg-[var(--paper)] outline-none';

function SectionHeader({ label }) {
  return (
    <p className="eyebrow !text-[10px] mb-3 pb-2 hairline-b" style={{ color: 'var(--ink-mute)' }}>
      {label}
    </p>
  );
}

function Field({ label, children, wide }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <label className="eyebrow !text-[10px] block mb-1.5" style={{ color: 'var(--ink-mute)' }}>{label}</label>
      {children}
    </div>
  );
}

function Shell({ children }) {
  return <div className="flex-1 min-w-0 p-4 md:p-8 portal-layout">{children}</div>;
}
