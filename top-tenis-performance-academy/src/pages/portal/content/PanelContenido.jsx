import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';
import { Tabs, Card, Btn, Icon } from '../../../components/portal/ui';

// ─── Slot definitions ─────────────────────────────────────────────────────────
// Agrega aquí nuevos slots a medida que las páginas públicas se conecten a DB.

const VIDEO_SLOTS = [
  { page: 'home',       slot: 'video_principal',  label: 'Home — Video principal' },
  { page: 'camino-usa', slot: 'video_proceso',    label: 'Camino USA — Video del proceso' },
];

const IMAGE_SLOTS = [
  { page: 'home',       slot: 'hero_imagen',       label: 'Home — Imagen hero' },
  { page: 'nosotros',   slot: 'foto_academia',     label: 'Nosotros — Foto de la academia' },
  { page: 'nosotros',   slot: 'foto_coaches',      label: 'Nosotros — Foto del equipo de coaches' },
  { page: 'programas',  slot: 'foto_programa',     label: 'Programas — Foto del programa' },
  { page: 'camino-usa', slot: 'foto_hero',         label: 'Camino USA — Imagen hero' },
];

const TEXT_SLOTS = [
  { page: 'home',       slot: 'hero_titulo',       label: 'Home — Título hero',              multiline: false },
  { page: 'home',       slot: 'hero_subtitulo',    label: 'Home — Subtítulo hero',           multiline: true  },
  { page: 'nosotros',   slot: 'descripcion',       label: 'Nosotros — Descripción',          multiline: true  },
  { page: 'nosotros',   slot: 'mision',            label: 'Nosotros — Misión',               multiline: true  },
  { page: 'programas',  slot: 'titulo',            label: 'Programas — Título',              multiline: false },
  { page: 'programas',  slot: 'descripcion',       label: 'Programas — Descripción',         multiline: true  },
  { page: 'camino-usa', slot: 'titulo',            label: 'Camino USA — Título',             multiline: false },
  { page: 'camino-usa', slot: 'descripcion',       label: 'Camino USA — Descripción intro',  multiline: true  },
];

const TABS = [
  { id: 'videos',    label: 'Videos',    icon: 'play'     },
  { id: 'imagenes',  label: 'Imágenes',  icon: 'eye'      },
  { id: 'texto',     label: 'Texto',     icon: 'edit'     },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildKey(page, slot) { return `${page}::${slot}`; }

function isYouTubeUrl(url) {
  return /youtube\.com|youtu\.be/.test(url);
}

function extractYouTubeId(url) {
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function SaveStatus({ status }) {
  if (!status) return null;
  const map = {
    saving:  { color: 'var(--ink-mute)', text: 'Guardando…' },
    saved:   { color: '#15803d',         text: 'Guardado'   },
    error:   { color: '#b91c1c',         text: 'Error al guardar' },
  };
  const s = map[status];
  return (
    <span className="text-[11px] font-medium" style={{ color: s.color }}>{s.text}</span>
  );
}

// ─── Tab: Videos ─────────────────────────────────────────────────────────────

function TabVideos({ assets, onSaveAsset }) {
  const [drafts,    setDrafts]   = useState({});
  const [statuses,  setStatuses] = useState({});

  function setDraft(key, val) {
    setDrafts(d => ({ ...d, [key]: val }));
  }

  async function save(page, slot) {
    const key = buildKey(page, slot);
    const url = drafts[key] ?? '';
    setStatuses(s => ({ ...s, [key]: 'saving' }));
    const ok = await onSaveAsset(page, slot, url, 'video');
    setStatuses(s => ({ ...s, [key]: ok ? 'saved' : 'error' }));
    if (ok) setTimeout(() => setStatuses(s => ({ ...s, [key]: null })), 2500);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--ink-mute)' }}>
        Pega la URL de YouTube del video (ej. <code className="text-xs bg-[var(--cream)] px-1 py-0.5">https://youtu.be/xxxx</code>).
        Usa <strong>No listado</strong> en YouTube para que el video no aparezca en búsquedas.
      </p>

      {VIDEO_SLOTS.map(({ page, slot, label }) => {
        const key      = buildKey(page, slot);
        const current  = assets[key]?.url ?? '';
        const value    = drafts[key] ?? current;
        const ytId     = value && isYouTubeUrl(value) ? extractYouTubeId(value) : null;
        const dirty    = value !== current;

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
                <Btn
                  variant={dirty ? 'primary' : 'default'}
                  onClick={() => save(page, slot)}
                  disabled={!dirty}
                >
                  Guardar
                </Btn>
              </div>
              <SaveStatus status={statuses[key]} />

              {ytId && (
                <div className="aspect-video w-full max-w-md bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={label}
                  />
                </div>
              )}

              {value && !ytId && (
                <p className="text-xs" style={{ color: '#b91c1c' }}>
                  URL no reconocida como YouTube. Verifica que sea un link válido de YouTube.
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Tab: Imágenes ────────────────────────────────────────────────────────────

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
      // Preview local mientras sube
      const localUrl = URL.createObjectURL(file);
      setPreviews(p => ({ ...p, [key]: localUrl }));

      // Subir a Supabase Storage
      const ext      = file.name.split('.').pop();
      const path     = `${page}/${slot}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('public-media')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (upErr) throw upErr;

      // URL pública permanente
      const { data } = supabase.storage.from('public-media').getPublicUrl(path);
      const publicUrl = data.publicUrl;

      const ok = await onSaveAsset(page, slot, publicUrl, 'image');
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
        Sube imágenes JPG, PNG o WebP. Máximo 10 MB por archivo. La imagen reemplaza la anterior en esa posición del sitio.
      </p>

      {IMAGE_SLOTS.map(({ page, slot, label }) => {
        const key      = buildKey(page, slot);
        const current  = assets[key]?.url ?? '';
        const preview  = previews[key] ?? current;
        const busy     = uploading[key];

        return (
          <Card key={key} title={label}>
            <div className="flex gap-4 items-start">
              {/* Thumbnail */}
              <div
                className="w-24 h-24 shrink-0 flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--cream)', border: '1px solid var(--line)' }}
              >
                {preview
                  ? <img src={preview} alt={label} className="w-full h-full object-cover" />
                  : <Icon name="eye" size={24} style={{ color: 'var(--ink-mute)', opacity: 0.4 }} />
                }
              </div>

              <div className="flex-1 space-y-2">
                {current && (
                  <p className="text-[11px] font-mono truncate" style={{ color: 'var(--ink-mute)' }}>
                    {current}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <input
                    ref={el => (inputRefs.current[key] = el)}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={e => handleFile(page, slot, e.target.files?.[0])}
                  />
                  <Btn
                    variant="default"
                    icon="plus"
                    onClick={() => inputRefs.current[key]?.click()}
                    disabled={busy}
                  >
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

  function setDraft(key, val) {
    setDrafts(d => ({ ...d, [key]: val }));
  }

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
                ? (
                  <textarea
                    rows={4}
                    className="w-full border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513] resize-y"
                    value={value}
                    onChange={e => setDraft(key, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full border border-[#E0DED8] rounded-[2px] px-3 py-2 text-sm bg-[#FAFAF7] focus:outline-none focus:ring-1 focus:ring-[#8B4513]/30 focus:border-[#8B4513]"
                    value={value}
                    onChange={e => setDraft(key, e.target.value)}
                  />
                )
              }
              <div className="flex items-center gap-3">
                <Btn
                  variant={dirty ? 'primary' : 'default'}
                  onClick={() => save(page, slot)}
                  disabled={!dirty}
                >
                  Guardar
                </Btn>
                {dirty && (
                  <Btn
                    variant="ghost"
                    onClick={() => setDraft(key, current)}
                  >
                    Descartar
                  </Btn>
                )}
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
  const { user } = useAuth();
  const [tab,    setTab]    = useState('videos');
  const [blocks, setBlocks] = useState({});   // { 'page::slot': { value } }
  const [assets, setAssets] = useState({});   // { 'page::slot': { url, type } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: blockRows }, { data: assetRows }] = await Promise.all([
        supabase.from('content_blocks').select('page, slot, value'),
        supabase.from('media_assets').select('page, slot, url, type'),
      ]);

      const bMap = {};
      (blockRows ?? []).forEach(r => { bMap[buildKey(r.page, r.slot)] = r; });

      const aMap = {};
      (assetRows ?? []).forEach(r => { aMap[buildKey(r.page, r.slot)] = r; });

      setBlocks(bMap);
      setAssets(aMap);
      setLoading(false);
    }
    load();
  }, []);

  async function saveBlock(page, slot, value) {
    const { error } = await supabase
      .from('content_blocks')
      .upsert({ page, slot, value, updated_by: user.id }, { onConflict: 'page,slot' });
    if (!error) {
      setBlocks(b => ({ ...b, [buildKey(page, slot)]: { page, slot, value } }));
    }
    return !error;
  }

  async function saveAsset(page, slot, url, type) {
    const { error } = await supabase
      .from('media_assets')
      .upsert({ page, slot, url, type, updated_by: user.id }, { onConflict: 'page,slot' });
    if (!error) {
      setAssets(a => ({ ...a, [buildKey(page, slot)]: { page, slot, url, type } }));
    }
    return !error;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
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
            {tab === 'videos'   && <TabVideos   assets={assets}  onSaveAsset={saveAsset} />}
            {tab === 'imagenes' && <TabImagenes  assets={assets}  onSaveAsset={saveAsset} />}
            {tab === 'texto'    && <TabTexto     blocks={blocks}  onSaveBlock={saveBlock} />}
          </>
        )}
      </div>
    </div>
  );
}
