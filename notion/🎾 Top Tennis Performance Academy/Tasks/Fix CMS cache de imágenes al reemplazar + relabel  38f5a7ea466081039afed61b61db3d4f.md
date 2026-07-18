# Fix CMS: cache de imágenes al reemplazar + relabel slot sede en Programas

Category: Dev
Notes: (1) Fotos de perfil/coach usaban ruta fija en storage → misma URL → navegador servía la imagen vieja al reemplazar. Fix: cache-busting ?v=timestamp en ProfileCard y HighlightPhotoSlot. (2) Slot foto_programa estaba etiquetado 'Foto hero' pero la única imagen de Programas es la sede; renombrado a foto_sede / 'Foto de la sede (canchas)'. Cerrado en apertura de sesión (14 Jul 2026, confirmado por Marco) — el commit pendiente por .git/index.lock se resolvió sin reportarse por texto, confirmado vía git log (commits eed1e7d, 1dd1a21).
Priority: Medium
Status: Done
Type: Bug