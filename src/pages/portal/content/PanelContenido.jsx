import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Tabs, Card, Btn, Icon } from '../../../components/portal/ui';

// ─── Slot definitions ─────────────────────────────────────────────────────────

const VIDEO_SLOTS = [
  { page: 'home',       slot: 'video_principal', label: 'Home — Video principal' },
  { page: 'camino-usa', slot: 'video_proceso',   label: 'Camino USA — Video del proceso' },
];

const IMAGE_SLOTS = [
  { page: 'home',       slot: 'hero_imagen',   label: 'Home — Imagen hero',         hint: '1920×1080 px mín.' },
  { page: 'nosotros',   slot: 'foto_academia', label: 'Nosotros — Foto hero',       hint: '1920×600 px mín.'  },
  { page: 'nosotros',   slot: 'foto_coaches',  label: 'Nosotros — Foto del equipo', hint: '1920×600 px mín.'  },
  { page: 'programas',  slot: 'foto_programa', label: 'Programas — Foto hero',      hint: '1920×600 px mín.'  },
  { page: 'camino-usa', slot: 'foto_hero',     label: 'Camino USA — Imagen hero',   hint: '1920×600 px mín.'  },
];

const TEXT_SLOTS = [
  { page: 'home',       slot: 'hero_titulo',    label: 'Home — Título hero',             multiline: false },
  { page: 'home',       slot: 'hero_subtitulo', label: 'Home — Subtítulo hero',          multiline: true  },
  { page: 'nosotros',   slot: 'descripcion',    label: 'Nosotros — Descripción',         multiline: true  },
  { page: 'nosotros',   slot: 'mision',         label: 'Nosotros — Misión',              multiline: true  },
  { page: 'programas',  slot: 'titulo',         label: 'Programas — Título',             multiline: false },
  { page: 'programas',  slot: 'descripcion',    label: 'Programas — Descripción',        multiline: true  },
  { page: 'camino-usa', slot: 'titulo',         label: 'Camino USA — Título',            multiline: false },
  { page: 'camino-usa', slot: 'descripcion',    label: 'Camino USA — Descripción intro', multiline: true  },
];

const STROKE_SLOTS = [
  { category: 'forehand',    label: 'Forehand'    },
  { category: 'backhand',    label: 'Backhand'    },
  { category: 'servicio',    label: 'Servicio'    },
  { category: 'volea',       label: 'Volea'       },
  { category: 'devolucion',  label: 'Devolución'  },
];

const PHOTO_SLOTS = ['photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5'];

const TABS = [
  { id: 'perfiles',   label: 'Perfiles',   icon: 'users'  },
  { id: 'highlights', label: 'Highlights', icon: 'racket' },
  { id: 'videos',     label: 'Videos',     icon: 'play'   },
  { id: 'imagenes',   label: 'Imágenes',   icon: 'eye'    },
  { id: 'texto',      label: 'Texto',      icon: 'edit'   },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildKey(page, slot) { return `${page}::${slot}`; }

function isYouTubeUrl(url) { return /youtube\.com|youtu\.be/.test(url); }

function extractYouTubeId(url) {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ─── shared components ────────────────────────────────────────────────────────

function SaveStatus({ status }) {
  if (!status) return null;
  const map = {
    saving: { color: 'var(--ink-mute)', text: 'Guardando…' },
    saved:  { color: '#15803d',         text: 'Guardado'   },
    error:  { color: '#b91c1c',         text: 'Error al guardar' },
  };
  const s = map[status];
  return <span className="text-[11px] font-medium" style={{ color: s.color }}>{s.text}</span>;
}

// ─── Tab: Perfiles ────────────────────────────────────────────────────────────

function ProfileCard({ id, nombre, fotoUrl, table, onUploaded }) {
  const inputRef   = useRef(null);
  const [preview,  setPreview]  = useState(fotoUrl ?? null);
  const [status,   setStatus]   = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    setStatus('saving');
    try {
      const ext  = file.name.split('.').pop();
      const path = `profiles/${table}/${id}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('public-media')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from('public-media').getPublicUrl(path);
      const url = data.publicUrl;

      const { error: dbErr } = await supabase.from(table).update({ foto_url: url }).eq('id', id);
      if (dbErr) throw dbErr;

      setPreview(url);
      onUploaded(id, url);
      setStatus('saved');
      setTimeout(() => setStatus(null), 2500);
    } catch {
      setStatus('error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 group">
      {/* Photo */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          width: 96, height: 128,
          background: 'var(--cream)',
          border: '1px solid var(--line)',
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview
          ? <img src={preview} alt={nombre} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <Icon name="users" size={28} style={{ color: 'var(--ink-mute)', opacity: 0.35 }} />
            </div>
        }
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <Icon name="plus" size={20} style={{ color: '#fff' }} />
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[10px]" style={{ color: 'var(--ink-mute)' }}>Subiendo…</span>
          </div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
             className="hidden" onChange={e => handleFile(e.target.files?.[0])} />

      <div className="text-center">
        <div className="text-[11px] font-semibold leading-tight truncate max-w-[96px]">{nombre}</div>
        <SaveStatus status={status} />
      </div>
    </div>
  );
}

function CoachFields({ coach, onSaved }) {
  const [rol,        setRol]        = useState(coach.rol ?? '');
  const [credencial, setCredencial] = useState(coach.credencial ?? '');
  const [bio,        setBio]        = useState(coach.bio ?? '');
  const [orden,      setOrden]      = useState(coach.orden ?? 100);
  const [visible,    setVisible]    = useState(coach.visible_en_sitio ?? true);
  const [status,     setStatus]     = useState(null);

  const dirty =
    rol !== (coach.rol ?? '') ||
    credencial !== (coach.credencial ?? '') ||
    bio !== (coach.bio ?? '') ||
    Number(orden) !== (coach.orden ?? 100) ||
    visible !== (coach.visible_en_sitio ?? true);

  async function save() {
    setStatus('saving');
    const patch = {
      rol: rol || null,
      credencial: credencial || null,
      bio: bio || null,
      orden: Number(orden) || 100,
      visible_en_sitio: visible,
    };
    const { error } = await supabase.from('coaches').update(patch).eq('id', coach.id);
    if (error) { setStatus('error'); return; }
    onSaved(coach.id, patch);
    setStatus('saved');
    setTimeout(() => setStatus(null), 2500);
  }

  const inputCls =
    'w-full border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513]';

  return (
    <div className="flex-1 min-w-[240px] space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <input className={inputCls} placeholder="Rol (ej. Head Coach)"
               value={rol} onChange={e => setRol(e.target.value)} />
        <input className={inputCls} placeholder="Credencial (ej. UTR 12.07)"
               value={credencial} onChange={e => setCredencial(e.target.value)} />
      </div>
      <textarea rows={3} className={`${inputCls} resize-y`} placeholder="Bio / descripción"
                value={bio} onChange={e => setBio(e.target.value)} />
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-[11px] flex items-center gap-1" style={{ color: 'var(--ink-mute)' }}>
          Orden
          <input type="number" className={`${inputCls} w-16 py-1`}
                 value={orden} onChange={e => setOrden(e.target.value)} />
        </label>
        <label className="text-[11px] flex items-center gap-1.5" style={{ color: 'var(--ink-mute)' }}>
          <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} />
          Visible en el sitio
        </label>
        <Btn variant={dirty ? 'primary' : 'default'} onClick={save} disabled={!dirty}>Guardar</Btn>
        <SaveStatus status={status} />
      </div>
    </div>
  );
}

function TabPerfiles({ athletes, coaches, onAthletePhotoUploaded, onCoachPhotoUploaded, onCoachUpdated }) {
  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>
        Haz clic en cualquier foto para subir o reemplazar. Formato recomendado: <strong>600×800 px</strong> (portrait, JPG o WebP).
      </p>

      <Card title="Atletas" label={`${athletes.length} perfiles`}>
        <div className="flex flex-wrap gap-5">
          {athletes.map(a => (
            <ProfileCard
              key={a.id} id={a.id}
              nombre={`${a.nombre} ${a.apellido}`}
              fotoUrl={a.foto_url}
              table="athletes"
              onUploaded={onAthletePhotoUploaded}
            />
          ))}
        </div>
      </Card>

      <Card title="Coaches" label={`${coaches.length} perfiles`}>
        <p className="text-xs mb-4" style={{ color: 'var(--ink-mute)' }}>
          La foto, el rol, la credencial y la bio se publican en la página <strong>Nosotros</strong>. El orden controla la posición; desmarca “Visible” para ocultar un coach del sitio.
        </p>
        <div className="space-y-6">
          {coaches.map(c => (
            <div key={c.id} className="flex flex-col sm:flex-row gap-5 pb-6 last:pb-0 hairline-b last:border-b-0">
              <ProfileCard
                id={c.id}
                nombre={`${c.nombre} ${c.apellido}`}
                fotoUrl={c.foto_url}
                table="coaches"
                onUploaded={onCoachPhotoUploaded}
              />
              <CoachFields coach={c} onSaved={onCoachUpdated} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Tab: Highlights ──────────────────────────────────────────────────────────

function HighlightPhotoSlot({ athleteId, slotKey, url, onUploaded }) {
  const inputRef    = useRef(null);
  const [preview,   setPreview]   = useState(url ?? null);
  const [status,    setStatus]    = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    setStatus('saving');
    try {
      const ext  = file.name.split('.').pop();
      const path = `highlights/${athleteId}/${slotKey}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('public-media')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from('public-media').getPublicUrl(path);
      const publicUrl = data.publicUrl;

      const { error: dbErr } = await supabase.from('athlete_media').upsert(
        { athlete_id: athleteId, type: 'photo', category: slotKey, url: publicUrl },
        { onConflict: 'athlete_id,type,category' }
      );
      if (dbErr) throw dbErr;

      setPreview(publicUrl);
      onUploaded(slotKey, publicUrl);
      setStatus('saved');
      setTimeout(() => setStatus(null), 2500);
    } catch {
      setStatus('error');
    } finally {
      setUploading(false);
    }
  }

  const n = slotKey.split('_')[1]; // '1'..'5'

  return (
    <div className="flex flex-col gap-1">
      <div
        className="relative overflow-hidden cursor-pointer group"
        style={{
          width: 120, height: 90,
          background: 'var(--cream)',
          border: '1px solid var(--line)',
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
      >
        {preview
          ? <img src={preview} alt={`Foto ${n}`} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-1">
              <Icon name="plus" size={18} style={{ color: 'var(--ink-mute)', opacity: 0.5 }} />
              <span className="text-[9px]" style={{ color: 'var(--ink-mute)' }}>Foto {n}</span>
            </div>
        }
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <Icon name="edit" size={16} style={{ color: '#fff' }} />
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[10px]" style={{ color: 'var(--ink-mute)' }}>Subiendo…</span>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
             className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
      <SaveStatus status={status} />
    </div>
  );
}

function StrokeVideoSlot({ athleteId, category, label, url, onSaved }) {
  const [draft,  setDraft]  = useState(url ?? '');
  const [status, setStatus] = useState(null);
  const ytId = draft && isYouTubeUrl(draft) ? extractYouTubeId(draft) : null;
  const dirty = draft !== (url ?? '');

  async function save() {
    setStatus('saving');
    try {
      const { error } = await supabase.from('athlete_media').upsert(
        { athlete_id: athleteId, type: 'video', category, url: draft },
        { onConflict: 'athlete_id,type,category' }
      );
      if (error) throw error;
      onSaved(category, draft);
      setStatus('saved');
      setTimeout(() => setStatus(null), 2500);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em]"
           style={{ color: 'var(--ink-mute)' }}>{label}</div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513] font-mono"
          placeholder="https://youtu.be/..."
          value={draft}
          onChange={e => setDraft(e.target.value)}
        />
        <Btn variant={dirty ? 'primary' : 'default'} onClick={save} disabled={!dirty}>
          Guardar
        </Btn>
      </div>
      <SaveStatus status={status} />
      {ytId && (
        <div className="aspect-video w-full max-w-xs bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen title={label}
          />
        </div>
      )}
      {draft && !ytId && (
        <p className="text-xs" style={{ color: '#b91c1c' }}>URL no reconocida como YouTube.</p>
      )}
    </div>
  );
}

function TabHighlights({ athletes }) {
  const [selectedId, setSelectedId] = useState('');
  const [media,      setMedia]      = useState({});   // { 'photo_1': url, 'forehand': url, ... }
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('athlete_media')
        .select('type, category, url')
        .eq('athlete_id', selectedId);
      const map = {};
      (data ?? []).forEach(r => { map[r.category] = r.url; });
      setMedia(map);
      setLoading(false);
    }
    load();
  }, [selectedId]);

  function handlePhotoUploaded(slot, url) { setMedia(m => ({ ...m, [slot]: url })); }
  function handleVideoSaved(category, url) { setMedia(m => ({ ...m, [category]: url })); }

  const selected = athletes.find(a => a.id === selectedId);

  return (
    <div className="space-y-5">
      {/* Athlete selector */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--ink-soft)' }}>
          Atleta
        </label>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 w-full max-w-xs"
        >
          <option value="">Selecciona un atleta…</option>
          {athletes.map(a => (
            <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>
          ))}
        </select>
      </div>

      {!selectedId && (
        <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>
          Selecciona un atleta para gestionar sus highlights.
        </p>
      )}

      {selectedId && loading && (
        <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>Cargando…</p>
      )}

      {selectedId && !loading && (
        <>
          {/* Fotos curadas */}
          <Card title={`Fotos — ${selected?.nombre} ${selected?.apellido}`}
                label="Máx. 5 fotos · 1200×900 px mín. · drag & drop o clic">
            <div className="flex flex-wrap gap-4">
              {PHOTO_SLOTS.map(slot => (
                <HighlightPhotoSlot
                  key={slot}
                  athleteId={selectedId}
                  slotKey={slot}
                  url={media[slot] ?? null}
                  onUploaded={handlePhotoUploaded}
                />
              ))}
            </div>
          </Card>

          {/* Videos por golpe */}
          <Card title="Videos por golpe" label="URL de YouTube · No listado recomendado">
            <div className="space-y-5">
              {STROKE_SLOTS.map(({ category, label }) => (
                <StrokeVideoSlot
                  key={category}
                  athleteId={selectedId}
                  category={category}
                  label={label}
                  url={media[category] ?? ''}
                  onSaved={handleVideoSaved}
                />
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// ─── Tab: Videos (sitio público) ─────────────────────────────────────────────

function TabVideos({ assets, onSaveAsset }) {
  const [drafts,   setDrafts]   = useState({});
  const [statuses, setStatuses] = useState({});

  function setDraft(key, val) { setDrafts(d => ({ ...d, [key]: val })); }

  async function save(page, slot) {
    const key = buildKey(page, slot);
    setStatuses(s => ({ ...s, [key]: 'saving' }));
    const ok = await onSaveAsset(page, slot, drafts[key] ?? '', 'video');
    setStatuses(s => ({ ...s, [key]: ok ? 'saved' : 'error' }));
    if (ok) setTimeout(() => setStatuses(s => ({ ...s, [key]: null })), 2500);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>
        Pega la URL de YouTube. Usa <strong>No listado</strong> para que el video no aparezca en búsquedas.
      </p>
      {VIDEO_SLOTS.map(({ page, slot, label }) => {
        const key     = buildKey(page, slot);
        const current = assets[key]?.url ?? '';
        const value   = drafts[key] ?? current;
        const ytId    = value && isYouTubeUrl(value) ? extractYouTubeId(value) : null;
        const dirty   = value !== current;
        return (
          <Card key={key} title={label}>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513] font-mono"
                  placeholder="https://youtu.be/..."
                  value={value}
                  onChange={e => setDraft(key, e.target.value)}
                />
                <Btn variant={dirty ? 'primary' : 'default'} onClick={() => save(page, slot)} disabled={!dirty}>
                  Guardar
                </Btn>
              </div>
              <SaveStatus status={statuses[key]} />
              {ytId && (
                <div className="aspect-video w-full max-w-md bg-black">
                  <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen title={label} />
                </div>
              )}
              {value && !ytId && (
                <p className="text-xs" style={{ color: '#b91c1c' }}>URL no reconocida como YouTube.</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Tab: Imágenes (sitio público) ───────────────────────────────────────────

function TabImagenes({ assets, onSaveAsset }) {
  const [statuses,  setStatuses]  = useState({});
  const [previews,  setPreviews]  = useState({});
  const [uploading, setUploading] = useState({});
  const inputRefs = useRef({});

  async function handleFile(page, slot, file) {
    const key = buildKey(page, slot);
    if (!file) return;
    setUploading(u => ({ ...u, [key]: true }));
    setStatuses(s => ({ ...s, [key]: 'saving' }));
    try {
      setPreviews(p => ({ ...p, [key]: URL.createObjectURL(file) }));
      const ext  = file.name.split('.').pop();
      const path = `${page}/${slot}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('public-media').upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('public-media').getPublicUrl(path);
      const ok = await onSaveAsset(page, slot, data.publicUrl, 'image');
      setStatuses(s => ({ ...s, [key]: ok ? 'saved' : 'error' }));
      if (ok) setTimeout(() => setStatuses(s => ({ ...s, [key]: null })), 2500);
    } catch {
      setStatuses(s => ({ ...s, [key]: 'error' }));
    } finally {
      setUploading(u => ({ ...u, [key]: false }));
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>
        Sube imágenes JPG, PNG o WebP. Las dimensiones recomendadas se indican en cada slot.
      </p>
      {IMAGE_SLOTS.map(({ page, slot, label, hint }) => {
        const key     = buildKey(page, slot);
        const current = assets[key]?.url ?? '';
        const preview = previews[key] ?? current;
        const busy    = uploading[key];
        return (
          <Card key={key} title={label} label={hint}>
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 shrink-0 flex items-center justify-center overflow-hidden"
                   style={{ background: 'var(--cream)', border: '1px solid var(--line)' }}>
                {preview
                  ? <img src={preview} alt={label} className="w-full h-full object-cover" />
                  : <Icon name="eye" size={24} style={{ color: 'var(--ink-mute)', opacity: 0.4 }} />
                }
              </div>
              <div className="flex-1 space-y-2">
                {current && (
                  <p className="text-[11px] font-mono truncate" style={{ color: 'var(--ink-mute)' }}>{current}</p>
                )}
                <div className="flex items-center gap-2">
                  <input ref={el => (inputRefs.current[key] = el)} type="file"
                         accept="image/jpeg,image/png,image/webp" className="hidden"
                         onChange={e => handleFile(page, slot, e.target.files?.[0])} />
                  <Btn variant="default" icon="plus" disabled={busy}
                       onClick={() => inputRefs.current[key]?.click()}>
                    {busy ? 'Subiendo…' : current ? 'Reemplazar' : 'Subir imagen'}
                  </Btn>
                  <SaveStatus status={statuses[key]} />
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Tab: Texto ───────────────────────────────────────────────────────────────

function TabTexto({ blocks, onSaveBlock }) {
  const [drafts,   setDrafts]   = useState({});
  const [statuses, setStatuses] = useState({});

  function setDraft(key, val) { setDrafts(d => ({ ...d, [key]: val })); }

  async function save(page, slot) {
    const key   = buildKey(page, slot);
    const value = drafts[key] ?? '';
    setStatuses(s => ({ ...s, [key]: 'saving' }));
    const ok = await onSaveBlock(page, slot, value);
    setStatuses(s => ({ ...s, [key]: ok ? 'saved' : 'error' }));
    if (ok) setTimeout(() => setStatuses(s => ({ ...s, [key]: null })), 2500);
  }

  return (
    <div className="space-y-4">
      {TEXT_SLOTS.map(({ page, slot, label, multiline }) => {
        const key     = buildKey(page, slot);
        const current = blocks[key]?.value ?? '';
        const value   = drafts[key] ?? current;
        const dirty   = value !== current;
        return (
          <Card key={key} title={label}>
            <div className="space-y-2">
              {multiline
                ? <textarea rows={4} value={value} onChange={e => setDraft(key, e.target.value)}
                    className="w-full border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513] resize-y" />
                : <input type="text" value={value} onChange={e => setDraft(key, e.target.value)}
                    className="w-full border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513]" />
              }
              <div className="flex items-center gap-3">
                <Btn variant={dirty ? 'primary' : 'default'} onClick={() => save(page, slot)} disabled={!dirty}>
                  Guardar
                </Btn>
                {dirty && <Btn variant="ghost" onClick={() => setDraft(key, current)}>Descartar</Btn>}
                <SaveStatus status={statuses[key]} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function PanelContenido() {
  const { user }  = useAuth();
  const [tab,     setTab]     = useState('perfiles');
  const [blocks,  setBlocks]  = useState({});
  const [assets,  setAssets]  = useState({});
  const [athletes, setAthletes] = useState([]);
  const [coaches,  setCoaches]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [
        { data: blockRows },
        { data: assetRows },
        { data: athleteRows },
        { data: coachRows },
      ] = await Promise.all([
        supabase.from('content_blocks').select('page, slot, value'),
        supabase.from('media_assets').select('page, slot, url, type'),
        supabase.from('athletes').select('id, nombre, apellido, foto_url').eq('activo', true).order('nombre'),
        supabase.from('coaches').select('id, nombre, apellido, foto_url, rol, credencial, bio, orden, visible_en_sitio').order('orden').order('nombre'),
      ]);

      const bMap = {};
      (blockRows ?? []).forEach(r => { bMap[buildKey(r.page, r.slot)] = r; });
      const aMap = {};
      (assetRows ?? []).forEach(r => { aMap[buildKey(r.page, r.slot)] = r; });

      setBlocks(bMap);
      setAssets(aMap);
      setAthletes(athleteRows ?? []);
      setCoaches(coachRows ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function saveBlock(page, slot, value) {
    const { error } = await supabase.from('content_blocks')
      .upsert({ page, slot, value, updated_by: user.id }, { onConflict: 'page,slot' });
    if (!error) setBlocks(b => ({ ...b, [buildKey(page, slot)]: { page, slot, value } }));
    return !error;
  }

  async function saveAsset(page, slot, url, type) {
    const { error } = await supabase.from('media_assets')
      .upsert({ page, slot, url, type, updated_by: user.id }, { onConflict: 'page,slot' });
    if (!error) setAssets(a => ({ ...a, [buildKey(page, slot)]: { page, slot, url, type } }));
    return !error;
  }

  function handleAthletePhotoUploaded(id, url) {
    setAthletes(list => list.map(a => a.id === id ? { ...a, foto_url: url } : a));
  }
  function handleCoachPhotoUploaded(id, url) {
    setCoaches(list => list.map(c => c.id === id ? { ...c, foto_url: url } : c));
  }
  function handleCoachUpdated(id, patch) {
    setCoaches(list => list.map(c => c.id === id ? { ...c, ...patch } : c));
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-6 pt-6 pb-4 hairline-b bg-[var(--paper)]">
        <div className="eyebrow mb-1">Content Delivery System</div>
        <h1 className="font-display font-bold text-[22px]" style={{ letterSpacing: '-0.02em' }}>
          Gestión de contenido
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ink-mute)' }}>
          Los cambios se publican de inmediato en el sitio.
        </p>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>Cargando contenido…</p>
        ) : (
          <>
            {tab === 'perfiles'   && (
              <TabPerfiles
                athletes={athletes} coaches={coaches}
                onAthletePhotoUploaded={handleAthletePhotoUploaded}
                onCoachPhotoUploaded={handleCoachPhotoUploaded}
                onCoachUpdated={handleCoachUpdated}
              />
            )}
            {tab === 'highlights' && <TabHighlights athletes={athletes} />}
            {tab === 'videos'     && <TabVideos  assets={assets}  onSaveAsset={saveAsset} />}
            {tab === 'imagenes'   && <TabImagenes assets={assets}  onSaveAsset={saveAsset} />}
            {tab === 'texto'      && <TabTexto   blocks={blocks}  onSaveBlock={saveBlock} />}
          </>
        )}
      </div>
    </div>
  );
}
