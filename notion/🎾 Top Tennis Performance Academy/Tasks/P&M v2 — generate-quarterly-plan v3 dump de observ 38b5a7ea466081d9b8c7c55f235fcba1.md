# P&M v2 — generate-quarterly-plan v3: dump de observaciones → dimensiones + anclas

Category: Dev
Epic: Phase 2 — Analytics
Notes: DESPLEGADA v4 (mode identify + generate + regenerate, legacy preservado). Fuente versionada en supabase/functions/generate-quarterly-plan/index.ts. Pendiente: test en vivo (necesita JWT/UI) y wiring de objective_generation_log al llamar. PRIMERA REBANADA. EF v3 con dos modos: (a) identificar sub-dimensiones + read corto + candidata_a_foco; (b) generar diagnostico + objetivo (gramatica §4) + 5 anclas con semantica corregida (0=por buen camino, -2=estancado, NO estado actual). Contrato con bundle previo (cold-start=null). Ref §10 y §13. Cerrado en barrido de kanban (13 Jul 2026, confirmado por Marco) — superado por el trabajo de rúbrica P&M (commits 2307af2, 7a7212f, 15bc341, b441eaa) ya Done.
Priority: High
Status: Done
Type: Feature