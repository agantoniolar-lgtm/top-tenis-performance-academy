# Session 17 — Scraper de rankings AMTP

Date: June 23, 2026
Status: Complete

## What we did

Sesión adicional del 23 de junio. Antes de arrancar el scraper, auditamos el kanban completo: encontramos 4 tasks marcados como Backlog que ya estaban hechos (Diseñar schema de BD, Configurar Supabase, Completar formulario NuevoReporte, Coach Summary View) y los marcamos como Done. El backlog real quedó limpio con 7 tasks pendientes.

Después construimos el scraper de rankings AMTP de punta a punta. Inspeccionamos [amtp.mx](http://amtp.mx) con Chrome (sitio Next.js client-rendered sobre Supabase propio de AMTP). Identificamos el endpoint `/rest/v1/rankings?select=*&order=points.desc` en `supabase-amtp.servers.ssmusic.group`. El scraper extrae el anon key del JS bundle en runtime (sin hardcodear), llama la API directamente para el ranking completo —no solo el top 10 que muestra la home—, con fallback a Playwright DOM scraping si la API falla. Incluye `lookup_player()` para búsqueda fuzzy por nombre, y flag `--upsert` para guardar el snapshot en nuestra Supabase.

Creamos la tabla `amtp_rankings` en nuestra Supabase con RLS, índices GIN para búsqueda por nombre, y la función SQL `buscar_ranking_amtp()`. Configuramos un GitHub Actions cron que corre el día 1 de cada mes y hace el upsert automáticamente. Marco agregó `SUPABASE_SERVICE_KEY` al `.env` local y corrió el scraper exitosamente — su nombre apareció en el ranking.

## Key decisions

- El scraper extrae el anon key de AMTP dinámicamente en lugar de hardcodearlo, para sobrevivir rotaciones de key.
- La tabla `amtp_rankings` vive en nuestra Supabase (no consultamos AMTP en tiempo real), para protegernos del downtime del sitio (ya observamos un 503 durante la sesión).
- El cron es mensual vía GitHub Actions, sin depender de la máquina de Marco.

## Open items / follow-ups

- **Similarity search para matching de nombres**: Marco aparece en AMTP como 'Marco A. Damián Aguilar' y en la plataforma como 'Marco Damián'. El `lookup_player()` actual no va a matchear. Próxima sesión: implementar pg_trgm o similitud trigram en `buscar_ranking_amtp()`.
- **Widget de ranking en perfil del atleta**: mostrar '#N Varonil/Femenil AMTP' en el perfil. Task creado en el kanban. Prerequisito: similarity search resuelto.
- **Push del commit**: el `.git/HEAD.lock` bloqueó el commit en el sandbox. Marco debe correr `rm .git/HEAD.lock && git add -A && git commit -m 'feat: scraper AMTP + cron mensual' && git push` desde su terminal.