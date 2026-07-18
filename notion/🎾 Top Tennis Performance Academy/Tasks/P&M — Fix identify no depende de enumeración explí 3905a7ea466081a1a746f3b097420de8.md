# P&M — Fix: identify no depende de enumeración explícita en el dump

Category: Dev
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 4 (Caso Emilio, narrow): con el dump enumerado ('Uno:'/'Dos:') identify detectaba las 2 sub-dimensiones bien; sin los marcadores, solo detectaba una (perdía manejo_riesgo). Fix (pm-v2.4): regla explícita en IDENTIFY_SYSTEM de leer por contenido, no por marcadores de estructura. Caso de regresión agregado como Caso 2b en docs/http://dumps-test-planning-edge-cases.md. Desplegado v8. Ref docs/http://scope-planning-measurement.md §17.
Priority: High
Status: Done
Type: Bug