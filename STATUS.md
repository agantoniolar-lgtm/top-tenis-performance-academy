# Project status — Top Tennis Performance Academy

maturity: live-users

<!-- Cambiado de pre-users a live-users el 2026-07-20 (confirmado por Marco): 10 atletas ya se subieron a la plataforma. -->

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplica. Ver CLAUDE.md.
-->

## Last session (2026-07-22)
Sesión centrada en **T161** (notificaciones de onboarding incompleto), llevada de punta a punta: Parte 1 (flags en-app para el coach en `Equipo.jsx`/`AlumnoDetalle.jsx`, con `onboardingGaps()` como función pura única de verdad en `src/lib/athletics.js`, fusionando también T166) confirmada visualmente en mobile por Marco y cerrada. Parte 2 (digest semanal por email, `scripts/onboarding_digest.mjs` + `.github/workflows/onboarding-digest-cron.yml`) construida y verificada con un envío real por Resend — pero Resend está en modo sandbox (sin dominio verificado) y solo deja mandar a la cuenta dueña, así que el cron semanal automático a todos los coaches sigue sin activar (ver T172 abajo).

En el camino se resolvieron varios hallazgos reales, no planeados: **T168** (bug de RLS — `report_physical` nunca recibió la policy cross-coach que sí tienen sus tablas hermanas desde T140, aplicado en sandbox y producción); un gap de seguridad serio en `.env.local` (la service key de producción vivía emparejada por error con la URL del sandbox, ya reorganizado con la convención de sufijos `_SANDBOX`); **T167** (migración de `generate-quarterly-plan` a la taxonomía RAC real de `physical`, deployado v18, verificado con llamadas sintéticas reales contra un slug temporal ya que no existe sandbox de Edge Functions); un deploy roto por un test con bug de timezone (producción nunca se vio afectada, Vercel no promueve builds fallidos); y **T170** (el cron de AMTP Rankings Scraper fallaba por un `on_conflict` faltante en el upsert — de paso se encontró y desactivó un duplicado real de "Ian Kleiman" en `athletes`, que no era la causa pero sí un problema real aparte).

Cambio de proceso importante: el skill `commit` ahora verifica el deploy remoto después de cada push (nuevo script `.claude/skills/commit/scripts/check-deploy-status.sh`) — un fallo se trata como bloqueante antes de seguir con otra tarea, para que lo que pasó hoy (push roto sin notar hasta después) no se repita. Todo el trabajo quedó pusheado a `main` (9 commits, cada uno verificado en verde). Detalle completo en `/logs/session-2026-07-22.md`.

## Pending / next session priority
1. **T172** (backlog, Medium): verificar un dominio propio en Resend — bloquea activar el digest semanal de onboarding a todos los coaches (hoy solo corre manual, `workflow_dispatch`).
2. **T169** (backlog, High): revisar el modelo de anclas de `physical` en `generate-quarterly-plan` — no encaja con el baseline fijo y permanente de T152; Marco pidió resolverlo pronto.
3. Marco: borrar a mano el slug temporal `generate-quarterly-plan-test` en producción (Supabase Dashboard → proyecto de producción → Edge Functions → `generate-quarterly-plan-test` → menú `···` → Delete function) — no hay tooling MCP para hacerlo desde acá.
4. T116 (CMS↔sitio público, backlog) sigue en pausa hasta la junta con marketing — confirmar si ya sucedió.
5. No bloqueante: `SUPABASE_DB_PASSWORD_SANDBOX` no está en `.env.local` — solo hace falta si Marco quiere correr el CLI de Supabase localmente contra el sandbox (hoy no hizo falta, todo vía MCP).
6. No bloqueante: check "Supabase Preview" en GitHub sigue en rojo (`Remote migration versions not found in local migrations directory`) — preexistente desde el 21 Jul, no bloquea el deploy de Vercel, sin task todavía.
7. Backlog no bloqueante, sin fecha: 8 warnings de Supabase Advisors, decisión de branch-per-task, decisión de typing (JSDoc/PropTypes vs. dejarlo como está) — ver `SETUP_CHECKLIST.md`.
8. Backlog no bloqueante, sin fecha: evaluar si `TASKS.md` necesita separar "backlog de largo plazo" en un archivo aparte antes de que `BACKLOG.md` crezca demasiado.

## Decided / deferred
- El kit de skills se auto-orquesta (cada skill declara a quién le entrega después) — se descarta un skill "director" central; `feature-build-flow` ya no se referencia desde ningún archivo activo (decisión de Marco, 2026-07-18).
- `feature-build-flow/SKILL.md` y `schema-rls-verification/SKILL.md` se borraron del repo — superseded por el kit genérico y por `verify-rls` respectivamente (decisión explícita de Marco, 2026-07-18).
- `TASKS.md` es la fuente de verdad de tasks de aquí en adelante (decisión explícita de Marco, 2026-07-17) — reemplaza al kanban de Notion, que queda como archivo histórico.
- Warnings de Supabase Advisors, branch-per-task, y decisión de typing quedan como backlog de seguridad/proceso sin fecha — documentados en `SETUP_CHECKLIST.md`, a propósito no convertidos en tasks de `TASKS.md` todavía (decisión explícita de Marco, 2026-07-17).
- T152 (physical + liderazgo) se deja deliberadamente en backlog esta sesión pese a que Marco ya tiene la info para arrancarlo — se priorizó terminar la limpieza del backlog antes de abrir trabajo nuevo (decisión de Marco, 2026-07-18).
- T078 (SwingVision) confirmado depriorizado por Marco (2026-07-18) — sin acción esperada, solo documentado.
- Migraciones de Supabase son solo-schema (DDL) de aquí en adelante — un fix de datos de una sola vez va como script aparte, nunca mezclado en una migración versionada; se hace cumplir con `scripts/check-migrations-schema-only.mjs`, no solo con la instrucción escrita (decisión de Marco, 2026-07-20, ver `T160`).
- `gitleaks-action` queda pinneado a la versión `8.30.1` explícitamente en `.github/workflows/gitleaks.yml` — el default silencioso del action (8.24.3) tiene un bug real con allowlists globales (2026-07-20).
- `maturity` cambia de `pre-users` a `live-users` (2026-07-20, confirmado por Marco) — 10 atletas ya en la plataforma.
- T152 no toca `generate-quarterly-plan` (2026-07-21, decisión explícita de Marco) — la Edge Function sigue generando objetivos de `physical` con el esquema de sub-dimensiones viejo (sprint_20m, beep_test, etc.) hasta que se actualice en un task aparte; los labels en `MiPlan.jsx`/`PlanesCoach.jsx`/`NuevoReporte.jsx` soportan ambos esquemas mientras tanto.
- Los campos `sentadillas_1min`, `lagartijas_1min`, `beep_test_nivel`, `beep_test_rep` y los 5 de FMS se eliminaron (`DROP COLUMN`) de `report_physical` (2026-07-21, T152) — no forman parte del protocolo real de pruebas físicas de la academia; los datos que tenían en producción eran dummy, confirmado por Marco.
- Técnica para sembrar cuentas de coach en sandbox sin chocar con el rate limit de email de Supabase (2026-07-21): insertar directo por SQL en `auth.users`+`auth.identities` con `pgcrypto`, `email_confirmed_at` ya seteado, sin pasar por GoTrue. Usada para la cuenta de prueba `tlaca@toptenis.mx`, que Marco pidió mantener viva en sandbox.
- Notificaciones directas a padres quedan fuera de alcance del digest de onboarding (2026-07-22, decisión explícita de Marco) — rompería la confianza atleta-coach. El digest es de equipo, no personalizado por coach individual (no hay ownership real desde T140).
- Notificaciones WhatsApp/2FA (T043) siguen sin prioridad (reconfirmado 2026-07-22) — no hay cuenta de WhatsApp Business todavía.
- Wiring numérico real de baseline/target en las anclas de `physical` dentro de `generate-quarterly-plan` queda deliberadamente fuera de T167 (2026-07-22) — es un rediseño aparte del modelo de anclas completo, ver T169 en backlog.
- Convención de sufijos `_SANDBOX` en `.env.local`/`.env.example` aplicada de una vez (2026-07-22) — los nombres sin sufijo (`SUPABASE_URL`/`SUPABASE_SERVICE_KEY`) quedan vacíos a propósito, reservados solo para uso transitorio y deliberado contra producción, nunca guardados de forma permanente.
- El skill `commit` verifica el deploy/CI remoto después de cada push antes de seguir a otra tarea (2026-07-22, a partir del incidente de deploy roto de esta sesión) — script dedicado `.claude/skills/commit/scripts/check-deploy-status.sh`, primer script de ese skill (decisión de Marco: que fuera script, no prosa embebida en el `.md`).
- Duplicado de "Ian Kleiman" en `athletes` (producción, 2026-07-22): desactivada (`activo=false`) la fila vacía sin datos, nunca `DELETE` — mismo patrón que T140. La fila con datos reales (2 quarterly_plans + ranking) se conservó intacta.
