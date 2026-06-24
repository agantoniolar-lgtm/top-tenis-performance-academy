import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { TIPOS_TORNEO, CATEGORIAS_TORNEO, RONDAS_TORNEO } from '../../data/torneoOpciones';

export default function NuevoTorneo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [form, setForm] = useState({
    nombre: '', tipo: '', categoria: '', fecha: '', sede: '',
    modalidad: 'Individual', ronda: '', resultado: '', victoria: '', notas: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    const { data: tournament, error: tError } = await supabase
      .from('tournaments')
      .insert({
        nombre:    form.nombre,
        tipo:      form.tipo || null,
        categoria: form.categoria || null,
        fecha:     form.fecha,
        sede:      form.sede || null,
        created_by: user?.id,
      })
      .select('id')
      .single();

    if (tError) { setSaveError(tError.message); setSaving(false); return; }

    const { data: athleteTournament, error: atError } = await supabase
      .from('athlete_tournaments')
      .insert({
        athlete_id:    user?.athlete_id,
        tournament_id: tournament.id,
        modalidad:     form.modalidad,
        ronda:         form.ronda || null,
        resultado:     form.resultado || null,
        victoria:      form.victoria === 'true' ? true : form.victoria === 'false' ? false : null,
        notas:         form.notas || null,
      })
      .select('id')
      .single();

    setSaving(false);
    if (atError) { setSaveError(atError.message); return; }

    navigate(`/portal/post-torneo/${athleteTournament.id}`);
  };

  return (
    <Shell>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h1 className="font-display font-extrabold text-[28px] leading-none mb-1">Subir resultado</h1>
        <p className="text-[12px] mb-8" style={{ color: 'var(--ink-mute)' }}>
          Registra los detalles de tu participación en el torneo.
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

        {/* ── Resultado ────────────────────────────────────────────────── */}
        <SectionHeader label="Tu participación" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Modalidad" wide>
            <div className="flex gap-6 pt-1">
              {['Individual', 'Dobles', 'Ambas'].map((m) => (
                <label key={m} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="radio" name="modalidad" value={m}
                         checked={form.modalidad === m} onChange={handleChange}
                         style={{ accentColor: 'var(--accent)' }} />
                  {m}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Ronda alcanzada *">
            <select name="ronda" value={form.ronda} onChange={handleChange} required className={input}>
              <option value="">— seleccionar —</option>
              {RONDAS_TORNEO.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>

          <Field label="Resultado último partido">
            <input name="resultado" value={form.resultado} onChange={handleChange}
                   placeholder="6-4 3-6 6-3" className={input} />
          </Field>

          <Field label="¿Ganaste el último partido? *" wide>
            <div className="flex gap-6 pt-1">
              {[{ value: 'true', label: 'Sí, gané' }, { value: 'false', label: 'No, perdí' }].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input type="radio" name="victoria" value={value}
                         checked={form.victoria === value} onChange={handleChange}
                         required style={{ accentColor: 'var(--accent)' }} />
                  {label}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Notas (opcional)" wide>
            <textarea name="notas" value={form.notas} onChange={handleChange}
                      rows={3} className={`${input} resize-none`} />
          </Field>
        </div>

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
                  className="px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60 hover:opacity-90 transition"
                  style={{ background: 'var(--accent)' }}>
            {saving ? 'Guardando…' : 'Guardar resultado'}
          </button>
          <button type="button" onClick={() => navigate('/portal/mis-torneos')}
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
