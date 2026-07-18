# Mejorar CLAUDE.md y flujo de skills (apertura/cierre de sesión, backlog)

Category: Dev
Priority: Medium
Status: Done
Type: Chore

Trabajo de proceso, no de producto:

1. Agregar sección "Al abrir sesión" a [CLAUDE.md](http://CLAUDE.md) (no existía).
2. Restructurar cierre de sesión (Last Session / Next Session / Session Logs) para incluir campo explícito "Dónde" (archivos/carpetas/módulos tocados) — hoy Last Session dice qué se hizo pero no dónde, y Next Session no hereda esa ubicación.
3. Diseñar/construir skill de apertura/cierre de sesión.
4. Revisar docs/[skills-backlog.md](http://skills-backlog.md): marcar #3 (QA e2e), #5 (escalas) y #6 (scraper AMTP) como descartados; agregar nota a #1 (rebanada de feature) sobre requisito de definir dónde vive la doc de scoping de cada feature nueva.
5. Explicar a Marco los skills #2 (schema+RLS) y #4 (design polish/mobile-first) para que decida si se construyen.