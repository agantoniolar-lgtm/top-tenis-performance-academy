# Auditar y blindar la capa de display de escalas (-2/+2 vs 1-5)

Category: Dev
Status: Backlog

## Contexto

Todo el sistema de evaluación usa escala -2/+2 (on-court, character, Athlete Voice). La capa de display (funciones en athletics.js, componentes de Rendimiento y Seguimiento) fue escrita originalmente para 1-5 y tiene 6 bugs latentes.

## Bugs identificados

**1. `score5Color()` y `Sparkline` aceptan valores fuera de escala sin validar**

Ambas funciones esperan 1-5 (post `ocTo5()`). Si alguien pasa un valor -2/+2 crudo, producen colores incorrectos sin error. Ej: `score5Color(2)` = rojo, pero +2 debería ser verde.

**2. Dos funciones `avg()` con APIs distintas coexisten**

`athletics.js`: recibe `(obj, keys[])`. `ReportesPorPeriodo.jsx`: recibe `(vals[])`. Misma semántica, distintas firmas — confusión silenciosa al importar la equivocada.

**3. `CHAR_LABEL` sigue exportada con nombre engañoso**

Fue actualizada para mostrar labels de on-court, pero el nombre sugiere escala de carácter 1-5. Cualquier import futuro asume semántica incorrecta.

**4. `AlumnoDetalle.jsx` y `Expediente.jsx` no auditados**

Probablemente tienen lógica de display de carácter con escala vieja (1-5 thresholds, labels incorrectos). Son vistas frecuentes del coach.

**5. Tests no cubren el pipeline de conversión de escala**

`ocTo5()` tiene tests, pero no hay test que valide el pipeline completo: valor -2/+2 → `ocTo5()` → `score5Color()` → color correcto. Un refactor parcial de `ocTo5()` pasaría CI sin romper visiblemente.

**6. Sin validación de rango en runtime**

Un valor fuera de rango (ej: 4, residuo de antes de la migración) pasa silencioso: `ocTo5(4)` = `min(5, round(7))` = 5. El dato incorrecto aparece como "Superado" sin warning.

## Acciones sugeridas

- Unificar `avg()` en `athletics.js` y eliminar la local de `ReportesPorPeriodo`
- Deprecar/renombrar `CHAR_LABEL` o eliminarla
- Agregar guard en `score5Color()` que valide rango
- Auditar `AlumnoDetalle.jsx` y `Expediente.jsx`
- Agregar tests de pipeline en `athletics.test.js`