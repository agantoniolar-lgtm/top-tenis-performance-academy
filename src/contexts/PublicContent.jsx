import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { contentKey, indexBySlot } from '../lib/content';

// Capa de lectura del Content Delivery System para el sitio público.
// Hace UNA sola carga de content_blocks + media_assets y la comparte con
// todas las páginas públicas. Si una llave no existe (o falla la red), las
// páginas usan su contenido por defecto (fallback), así que el sitio nunca
// se rompe ni queda en blanco.

const PublicContentContext = createContext({
  text: (_page, _slot, fallback = '') => fallback,
  asset: () => null,
  ready: false,
});

export function PublicContentProvider({ children }) {
  const [blocks, setBlocks] = useState({});
  const [assets, setAssets] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [{ data: blockRows }, { data: assetRows }] = await Promise.all([
          supabase.from('content_blocks').select('page, slot, value'),
          supabase.from('media_assets').select('page, slot, url, type'),
        ]);
        if (!alive) return;
        setBlocks(indexBySlot(blockRows, 'value'));
        setAssets(indexBySlot(assetRows, '*'));
      } catch {
        // Silencioso: las páginas caen a su contenido por defecto.
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Texto editable: devuelve el valor del CMS si existe y no está vacío,
  // de lo contrario el fallback (el texto actual de la página).
  function text(page, slot, fallback = '') {
    const v = blocks[contentKey(page, slot)];
    return v != null && v !== '' ? v : fallback;
  }

  // Asset de media: devuelve la fila { url, type } o null si no hay nada subido.
  function asset(page, slot) {
    return assets[contentKey(page, slot)] ?? null;
  }

  return (
    <PublicContentContext.Provider value={{ text, asset, ready }}>
      {children}
    </PublicContentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePublicContent() {
  return useContext(PublicContentContext);
}
