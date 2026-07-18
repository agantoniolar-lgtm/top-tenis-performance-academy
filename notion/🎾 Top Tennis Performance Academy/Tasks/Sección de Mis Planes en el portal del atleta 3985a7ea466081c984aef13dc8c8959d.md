# Sección de "Mis Planes" en el portal del atleta

Category: Dev
Priority: High
Status: Done
Type: Feature

Hoy no existe una pantalla dedicada donde el atleta vea su plan trimestral (objetivos, diagnóstico, dimensión). Solo hay un uso contextual: `src/pages/portal/atleta/AthleteVoice.jsx` consulta `quarterly_plans` + `quarterly_plan_objectives` (filtrado por `status = 'active'`) para mostrar el `objective_text` como contexto mientras el atleta llena su auto-evaluación — no es una vista de "mi plan" en sí.

La capa de datos ya está lista para esto: RLS en `quarterly_plans` y `quarterly_plan_objectives` ya permite al atleta leer (`SELECT`) su propio plan, solo cuando `status = 'active'` (los borradores en `draft` quedan invisibles para el atleta por diseño). `objective_generation_log` (historial crudo de generación/regeneración) es y debe seguir siendo exclusivo del coach — no exponer esa tabla al atleta.

Alcance sugerido: pantalla nueva (ej. `/portal/mi-plan`) que muestre los objetivos del plan activo del atleta — dimensión, diagnóstico, objetivo, estándar usado — reusando el patrón de query ya validado en `AthleteVoice.jsx`. Pendiente de scopear con Marco: qué tan detallado (¿incluye anchors -2/+2?), si se muestran planes cerrados/históricos o solo el activo actual, y dónde vive en la navegación del sidebar del atleta.