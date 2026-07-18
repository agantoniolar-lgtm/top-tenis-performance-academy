# Revisar scope-planning-measurement.md incorporando lo construido en Mi Plan

Category: Dev
Priority: High
Status: Done
Type: Chore

Retomar `docs/scope-planning-measurement.md` a la luz de lo ya construido en la sección "Mis Planes" del portal del atleta (`src/pages/portal/atleta/MiPlan.jsx`, commit ab4b430). Evaluar en particular si `athlete_retrospective` queda vacío en la práctica por falta de mecanismo de captura del lado del atleta — ¿la UI actual le da al atleta un punto de entrada para dejar su retrospectiva, o solo existe el campo en schema sin flujo que lo llene? Archivos relevantes: `docs/scope-planning-measurement.md`, `src/pages/portal/coach/PlanesCoach.jsx`, `src/pages/portal/atleta/MiPlan.jsx`, `docs/db-schema.md`. Foco heredado de Next Session (Session 31, 13 Jul 2026).

Completado (14 Jul 2026, commit `7939b05`): agregado §22 a [scope-planning-measurement.md](http://scope-planning-measurement.md). Confirmado que el vacío de athlete_retrospective/coach_retrospective no es bug de Mi Plan — es que close-quarterly-plan (cierre del loop) nunca se construyó, ni siquiera del lado del coach. No requiere cambio de modelo; el siguiente paso vive en el task Backlog "P&M v2 — close-quarterly-plan + retrospectives + handoff periodo→periodo".