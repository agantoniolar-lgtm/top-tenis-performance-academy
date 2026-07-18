# P&M — Rúbrica/skill: verificación de observaciones por dimensión

Category: Team
Epic: Phase 2 — Analytics
Notes: Hueco compañero del anterior: la observación del coach a veces ya trae la solución implícita en vez de describir el síntoma/causa observable, lo que deja al LLM sin material real para prescribir (mismo ejemplo de transferencia_partido). Contraste bueno: 'juega con mucha energía y confianza en su derecha en entrenamiento, pero en partidos pierde esa energía y solo pasa la bola sin proponer' — sí trae algo concreto y accionable. Se necesita rúbrica/skill para verificar que cada dimensión identificada traiga algo concreto para trabajar, no solo la etiqueta del síntoma. Doc de scoping propio. Ref docs/http://scope-planning-measurement.md §16.

Actualización (live test 4, Caso Emilio, 1 Jul 2026): agregar convención de TONO a la rúbrica — el dump del coach a veces frasea observaciones como crítica directa a la persona y usa el nombre del atleta. La rúbrica debe incluir cómo escribir constructivamente (conducta observable, no juicio de carácter) y evitar nombrar al atleta. Ya hay un fix parcial del lado de generación (pm-v2.4), pero la convención de cómo el coach redacta la observación en primer lugar sigue pendiente de definir. Ref §17.

Actualización (live test 5, Caso Sofía, 1 Jul 2026): el guardrail actual (dump_quality vago/detallado a nivel de dump completo) NO se disparó pese a observaciones sin mecánica ni dirección de mejora. Falta granularidad por dimensión + una vía de intervención cuando la observación es ambigua. Ref §18.

Actualización (live test 7, Caso Kevin, 1 Jul 2026): el read_corto que resume cada sub-dimensión en el paso de identify puede perder parte del mensaje en observaciones compuestas. Ejemplo: obs original 'no ajusta el plan cuando el rival le cambia el ritmo del partido — sigue con el mismo patrón aunque no le esté funcionando' quedó truncada en read_corto a solo la primera cláusula, perdiendo 'sigue con el mismo patrón…'. generate sí recuperó el texto completo porque vuelve a leer el dump entero. La rúbrica debe ponerle un piso al read_corto para que no pierda cláusulas relevantes de una observación compuesta. Ref §20.

Actualización (revisión de scope, 2 Jul 2026, §21): estructura preliminar de Marco para una observación bien formada — 5 componentes: (1) Dimensión clara, (2) Enfoque/patrón/mecanismo (nombre pendiente), (3) Intensidad, (4) Context clarifier, (5) Adicional opcional. Ref §21.

Actualización (4 Jul 2026): doc de scoping completo en docs/http://scope-rubrica-observaciones.md — anatomía de 5 componentes (nombre propuesto para el componente 2: 'Mecanismo', pendiente de confirmar), regla de granularidad por dimensión (no por dump completo), guardrail no-bloqueante, convención de tono, piso de cobertura para read_corto, regla de fusión para dimensiones repetidas, ubicación como skill modular en el pipeline (per agentic-fit-check-pm §5.1), y tabla de validación contra los 5 casos sintéticos. Listo para revisión de Marco antes de mover a build.
Priority: High
Status: Done
Type: Feature