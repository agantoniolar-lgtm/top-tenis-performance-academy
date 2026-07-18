---
name: feature-build-flow
description: Retirado el 2026-07-18 — reemplazado por la secuencia genérica scope → design → build → verify → commit (kit AE v0.7), documentada en CLAUDE.md → Skills. Usa esa secuencia para construir o cambiar cualquier feature.
---

# Retirado — usa la secuencia genérica scope → design → build → verify → commit

Los 9 pasos de este skill mapeaban casi 1:1 contra la secuencia genérica del kit: task en TASKS.md → `scope`; doc de scoping → `scope`/`design`; schema → `design`; RLS → `verify-rls`; componente React → `build`; función pura + test → `build`/`verify-tests`; rama LLM/agent → `verify-evals`; lint+test → `verify-tests`; commit → `commit`. Se escribió antes de que esa secuencia existiera como parte genérica y reusable del kit.

Nada genuinamente específico de este proyecto se perdió al retirarlo:
- El ruteo de ubicación de docs (`docs/` vs. `Top Tennis Performance Academy/`) ya vive en `CLAUDE.md` → "Dónde guardar cada tipo de archivo".
- El check de mobile-first ahora apunta directo al paso `build` (`CLAUDE.md` regla 6), no a un número de paso de este skill retirado.
- El orden más estricto de este proyecto (verificar RLS *antes* de construir la UI que depende de esos datos, no solo al final) está documentado en `CLAUDE.md` → Skills → "Secuencia de trabajo".
- La convención de evals Tier B, todavía sin definir (dónde viven, formato del dataset, grader), se sigue trackeando como `T150` en `BACKLOG.md`, no se perdió en silencio.

Si esta carpeta sigue aquí es porque una sesión de Cowork no puede borrar una carpeta de skill. Bórrala (`.claude/skills/feature-build-flow/`) la próxima vez que se abra este proyecto en Claude Code o una terminal nativa.
