# P&M — Evaluar consistencia (determinismo) de identify entre corridas repetidas

Category: Team
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): corriendo identify varias veces sobre el mismo dump, el número de focos varió (3→2) y coachabilidad reapareció de forma inconsistente entre corridas. Con temperature 0.3 hay variación esperada, pero conviene medir consistencia como parte del framework de evals (Tier B, docs/http://skills-backlog.md #1) antes de exponer a coaches. Ref §18.
Priority: Medium
Status: Backlog
Type: Feature