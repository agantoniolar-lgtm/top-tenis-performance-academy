// Helpers puros para el Content Delivery System (CMS) público.
// Las funciones aquí no tienen side effects y se testean en content.test.js.

// Construye la llave canónica page::slot usada en content_blocks y media_assets.
export function contentKey(page, slot) {
  return `${page}::${slot}`;
}

// Extrae el ID de 11 caracteres de una URL de YouTube (watch, youtu.be o embed).
// Devuelve null si la URL es vacía o no es de YouTube.
export function youTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Convierte un arreglo de filas {page, slot, value|url} en un mapa indexado por page::slot.
export function indexBySlot(rows, valueField = 'value') {
  const map = {};
  (rows ?? []).forEach((r) => {
    map[contentKey(r.page, r.slot)] = valueField === '*' ? r : r[valueField];
  });
  return map;
}
