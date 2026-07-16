# Project status — Top Tennis Performance Academy

maturity: pre-users

<!--
Solo Marco cambia el campo de arriba, y solo cuando el estado real del proyecto cambia.
Cada skill lee este campo para decidir cuánto rigor de sandbox/evals aplicar. Ver CLAUDE.md.
-->

## Last session (2026-07-16)
Retrofit de `/setup`: se detectó y remedió una exposición de secreto (`SUPABASE_SERVICE_KEY` real commiteado en `.env` desde el commit `7cacbd4`, sin necesidad — el cron de GitHub Actions ya usa Secrets). Se reforzó `.gitignore`, se generó `.env.example` a la medida, y se levantó `SETUP_CHECKLIST.md` reflejando el estado real del proyecto (sin sandbox Supabase, sin branch-per-task, JS puro sin strict typing, 8 warnings abiertos en Supabase Advisors). Se decidió mantener el `CLAUDE.md` existente (kanban de Notion + skills a medida) en vez de reemplazarlo por el genérico del kit — el tracking de tasks local (`TASKS.md`/`STATUS.md`) arranca vacío, la migración del historial de Notion queda como decisión aparte.

## Pending / next session priority
1. Rotar `SUPABASE_SERVICE_KEY` en Supabase Dashboard y sacar `.env` del tracking de git (bloqueado por `.git/index.lock` — requiere que Marco lo borre manualmente primero).
2. Decidir estrategia de sandbox Supabase (segundo proyecto vs. Preview Branches).
3. Decidir si y cuándo migrar el contenido del kanban de Notion a `TASKS.md`/`TASKS_ARCHIVE.md`.
4. Pegar `COWORK_PROJECT_INSTRUCTIONS.md` en Cowork Settings → Project Instructions.

## Decided / deferred
- CLAUDE.md se mantiene con el flujo de Notion como fuente de verdad de tasks, por decisión explícita de Marco (2026-07-16) — no se reemplazó por el template genérico de `/setup`.
- Warnings de Supabase Advisors (search_path mutable, bucket público, security definer expuesto, leaked password protection) se dejan como backlog de seguridad, no bloquean el cierre de este setup.
