# Session — CDS completo: Content Delivery System · 23 Jun 2026

Date: June 23, 2026
Key decisions: Rol Content aislado: la content manager no tiene acceso a datos de atletas ni reportes. Videos: YouTube no listado, no Supabase Storage (costo y performance). Fotos de highlights: curadas, sin periodos — 5 fotos totales por atleta, la content manager elige las mejores. Dimensiones de imagen definidas desde los layouts reales del sitio. Múltiples content managers pueden usar el mismo código de invitación.
Open items / follow-ups: Bloque 4 pendiente: conectar páginas públicas (Home, CaminoUSA, Nosotros, Programas) a content_blocks y media_assets para que lean de DB en lugar de texto hardcodeado. Vista del atleta para ver sus propios highlights (pendiente hasta después del Bloque 4). Coach Summary View en backlog. El .git/HEAD.lock se genera desde el sandbox — Marco debe hacer rm y git push desde su terminal local.
Status: Complete
What we did: Sesión enfocada en construir el CDS (Content Delivery System) de punta a punta — el panel de administración de contenido para la content manager de Top Tennis, sin tocar código.

Antes de arrancar se agregó al backlog la task de Coach Summary View (vista de todos los atletas para coaches: editable los suyos, viewable todos).

Se definió la arquitectura completa del CDS en conversación con Marco: rol 'Content' aislado de coaches/atletas (no ve datos de atletas), imágenes a Supabase Storage, videos vía YouTube no listado (no Supabase), fotos de highlights curadas por la content manager sin concepto de periodos.

Bloque 1 — DB + Storage: se crearon las tablas content_managers, content_blocks y media_assets con RLS completo. Bucket public-media en Supabase Storage con lectura pública y escritura solo para Content.

Bloque 2 — Auth: useAuth.jsx actualizado para detectar content_managers y asignar rol 'Content'. Nueva página /registro-content con código de invitación (VITE_CONTENT_INVITE_CODE). Sidebar actualizado con navegación propia para Content. Dashboard redirige a /portal/contenido. App.jsx con rutas nuevas.

Bloque 3 — Panel de contenido: PanelContenido.jsx con 5 tabs funcionales — Perfiles (mosaico de fotos), Highlights (por atleta), Videos (YT URLs para sitio público), Imágenes (upload con hints de dimensiones), Texto (editor inline por slot y página).

Bloque 5 — Perfiles: migration para agregar foto_url a coaches. Tabla athlete_media para highlights. RLS para que content manager pueda leer todos los atletas y actualizar foto_url. Tab Perfiles: grid de atletas y coaches con clic para subir/reemplazar foto (600×800 px portrait).

Bloque 6 — Highlights: Tab Highlights con selector de atleta, 5 slots de foto con drag & drop (1200×900 px mín.) y 5 slots de video por golpe (forehand, backhand, servicio, volea, devolución) vía YouTube URL.

Se detectó y corrigió un bug de ruta: los archivos escritos iban a una carpeta duplicada (top-tenis-performance-academy/top-tenis-performance-academy/src) en lugar del src real. Se corrigió copiando al path correcto.