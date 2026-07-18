# Conectar el CMS (Content Delivery System) con el sitio público

Category: Dev
Notes: El panel de contenido escribe en content_blocks/media_assets/athlete_media pero ninguna página pública lee esas tablas: todo el contenido del sitio está hardcodeado. Además los slots del CMS no coinciden con la estructura real de las páginas (p.ej. video en camino-usa, hero_imagen en home no tienen destino) y ya hay 3 fotos de coaches subidas que no se muestran. Crear capa de lectura (usePublicContent) y cablear Home/Nosotros/Programas/CaminoUSA + perfiles/highlights, con RLS para lectura anónima. Movido a Backlog (13 Jul 2026, Marco) — en espera de junta con el equipo de marketing el 20 Jul 2026 antes de retomar. Nota: el git log ya muestra commits relevantes conectando CMS con landing/coaches (402585b, eed1e7d, 1dd1a21) — confirmar con Marco el alcance real pendiente vs. lo ya resuelto al retomar.
Priority: High
Status: Backlog
Type: Bug