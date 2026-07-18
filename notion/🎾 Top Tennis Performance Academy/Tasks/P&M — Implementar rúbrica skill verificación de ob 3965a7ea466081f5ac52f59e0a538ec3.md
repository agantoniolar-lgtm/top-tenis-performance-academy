# P&M — Implementar rúbrica/skill: verificación de observaciones por dimensión

Category: Dev
Epic: Phase 2 — Analytics
Priority: High
Status: Done
Type: Feature

Implementación del scoping ya aprobado en `docs/scope-rubrica-observaciones.md`. Depende de / continúa el task Team "P&M — Rúbrica/skill: verificación de observaciones por dimensión".

Alcance:

- Constante de rúbrica (anatomía de 5 componentes, regla de granularidad por dimensión, convención de tono, regla de fusión de menciones duplicadas, piso de cobertura de `read_corto`) interpolada en `IDENTIFY_SYSTEM`.
- Nuevo campo `observacion_suficiente` (booleano) en el output de `identify`, por sub-dimensión.
- Merge defensivo de sub-dimensiones duplicadas en el post-procesamiento del handler (además de la instrucción al modelo).
- Cambio de contrato: `read_corto` viaja de `identify` → selección de UI → payload de `generate` (hoy se descarta). `GENERATE_SYSTEM` deriva el `diagnóstico` del `read_corto` provisto, no releyendo el dump completo desde cero.
- UI (`PlanesCoach.jsx`): aviso por dimensión individual cuando `observacion_suficiente: false` (reemplaza el banner global `dumpQuality` que evaluaba todo el dump como una unidad).
- Bump de `PROMPT_VERSION`.
- Validación de regresión contra los 5 casos sintéticos de `docs/dumps-test-planning-edge-cases.md` (tabla de aceptación en §11 del doc de scoping).

nn**Actualización (6 Jul 2026):** implementado y comiteado (`2307af2`) por Marco desde su terminal. Lint limpio, 65 tests existentes en verde. Merge de duplicados verificado con datos sintéticos (Caso Kevin). Falta `git push` y que Marco revise el output real en la siguiente sesión antes de pasar a Done.

**Actualización (7 Jul 2026):** corrida la regresión completa contra los 5 casos sintéticos (deploy inicial pm-v2.5, v9) — 2 de 5 casos fallaban: Caso 4 (Diego, el caso motivador del proyecto) pasaba 5/5 como "suficiente" cuando debía fallar las 5, y Caso 2/2b tenían violación de tono (read_corto repetía el nombre del atleta). Se aplicaron 3 fixes iterativos, cada uno deployado y re-corrido contra la regresión completa antes de avanzar al siguiente:

1. Ejemplos de calibración calcados del Caso 4 (volea/devolución/fuerza_inferior) — pm-v2.6.
2. Ejemplos de manejo_riesgo y liderazgo, tras confirmar con un caso sintético nuevo (Valeria, wording nunca visto) que el hueco era de categoría completa y no overfit a las frases de Diego — pm-v2.7.
3. Reestructuración de la convención de tono (quitar ejemplo incorrecto explícito, agregar autochequeo obligatorio) — pm-v2.8 no fue confiable (1/4 corridas), pm-v2.9 sí (4/4 corridas).

Regresión final contra pm-v2.9-2026-07-07 (v13, deployado en producción): sin regresiones en los 5 casos + Emilio (2/2b). Quedan 2 frentes abiertos no bloqueantes: variabilidad de muestreo en `manejo_riesgo` de Diego específicamente (temperature 0.3, no determinista), y una nota de Marco de que la rúbrica va a necesitar ejemplos reales de producción (no solo sintéticos) para seguir afinándose. Detalle completo en `docs/scope-rubrica-observaciones.md` §14-§19.

Se mueve a Done.