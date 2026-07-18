# Redesign — política de merge cuando una dimensión se menciona 2+ veces en el dump

Category: Team
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 7 (Caso Kevin, 1 Jul 2026): identify devolvió dos entradas separadas de 'liderazgo' (una mencionada al inicio del dump, otra a la mitad). Pregunta abierta: ¿se destilan en una sola entrada (intuición de Marco), o se decide cuál mención tiene mayor impacto en el juego (requeriría su propia rúbrica, overkill por ahora)? Bug técnico asociado: la UI usa focoKey(dimension, sub_dimension) como key de React Y como llave del Set de selección — dos entradas con la misma sub-dimensión colisionan (seleccionar una selecciona ambas visualmente). El fix correcto es que identify nunca devuelva dos entradas para la misma sub-dimensión (mergear en el prompt), no un parche de UI. Ref docs/http://scope-planning-measurement.md §20.
Priority: Medium
Status: Backlog
Type: Feature