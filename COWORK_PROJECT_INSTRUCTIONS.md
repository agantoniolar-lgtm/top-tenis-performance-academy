# Cowork project instructions — Top Tennis Performance Academy

Este archivo no se lee automáticamente por nada — Cowork no escanea una carpeta conectada. Copia el bloque de abajo en el campo Project Instructions de este proyecto en Cowork, una sola vez. Cowork recarga las project instructions en cada sesión, que es lo que hace que esto funcione sin necesidad de escanear el repo.

---

Este proyecto sigue las reglas de trabajo en `CLAUDE.md` (raíz del repo) — el tracking de tasks vive en archivos locales del repo (`TASKS.md`/`TASKS_ARCHIVE.md`/`STATUS.md`/`/logs/`) desde el 2026-07-17, migrado desde un kanban de Notion que queda solo como respaldo histórico en `notion/`, sin actualizarse más.

Al abrir cualquier sesión de trabajo:
1. Leer `CLAUDE.md` completo antes de hacer cualquier otra cosa.
2. Para abrir/cerrar sesión, usar el skill `session-log`. Para comitear a media sesión, usar `commit`. Para construir una feature, seguir la secuencia `scope → design → build → verify → commit` (ver `CLAUDE.md` → Skills para el detalle, incluida la particularidad de este proyecto de verificar RLS antes de construir la UI).
3. Si `SETUP_CHECKLIST.md` tiene casillas sin marcar, tratarlas como prioridad antes de otro trabajo — especialmente la sección 4b (secrets) si sigue pendiente.
4. No saltarse el paso de mobile-first (~375px) en UI nueva — regla 6 de CLAUDE.md.

---

Volver a pegar este bloque si la ubicación de `CLAUDE.md` o de `.claude/skills` cambia alguna vez — de lo contrario esta instrucción nunca necesita cambiar aunque las reglas del proyecto evolucionen, porque solo apunta a archivos en vez de repetir su contenido.
