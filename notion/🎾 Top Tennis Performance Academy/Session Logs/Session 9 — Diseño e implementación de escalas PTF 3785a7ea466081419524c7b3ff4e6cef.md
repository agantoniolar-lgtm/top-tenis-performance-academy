# Session 9 — Diseño e implementación de escalas PTF

Date: June 7, 2026
Key decisions: El PTF usa vocabulario de percepción del atleta (no de evaluación de progreso como el reporte del coach). La escala es siempre relativa al plan de torneo, aunque ese plan sea verbal — el atleta tiene la referencia interna.

Las preguntas del PTF no deben predisponer la respuesta ni en dirección positiva ni negativa, y deben abrirse al torneo completo, no a un partido específico.

Los placeholders rotan aleatoriamente por sesión para no sesgar las respuestas de los atletas con un único ejemplo.

Conexión a DB del PTF queda bloqueada hasta tener auth de atletas.
Open items / follow-ups: Talent Card (MVP entregable #3) — no depende de auth de atletas, es la siguiente prioridad.
Pantalla de reportes pendientes por periodo (coach-side, usa auth de coach que ya existe).
Renombrar columna return → resto en report_on_court (migración pendiente de sesiones anteriores).
Flujo de unlock de Athlete Voice en el reporte mensual.
Conexión de PostTorneo.jsx a Supabase — bloqueada por auth de atletas.
Status: Complete
What we did: Arrancamos la sesión con el objetivo de implementar las escalas del PTF en PostTorneo.jsx, que habían quedado definidas en Session 8 pero sin código.

Antes de codear, revisamos el estado de la DB en Supabase y confirmamos que no existe tabla para el PTF — el formulario actual solo hace setSubmitted(true) sin guardar nada. También confirmamos que athletes.user_id es nullable y ningún atleta tiene cuenta de auth todavía. Decidimos implementar las escalas solo en la UI por ahora, y dejar la conexión a DB para cuando exista auth de atletas.

Definimos las escalas de percepción del PTF: todas van de 1 a 5 relativas al plan de torneo (verbal por ahora, documentado post-MVP con Swing Vision). 1 = muy por debajo del plan, 5 = superó expectativas. Técnica usa «No lo ejecuté → Superé mis expectativas», Mental usa «No lo manejé → En mi mejor nivel», Físico usa «Sin energía → Excelente condición». Satisfacción general usa escala 1-10 con 4 rangos en primera persona («No di lo que tenía» → «Superé mis expectativas»).

Implementamos el componente ScaleButtons como cuadros interactivos con gradiente de color: rojo (1) → gris neutro (3) → verde (5), espejando el ScaleLegend de NuevoReporte. Se eliminaron las burbujas circulares — los cuadros son el único control.

Reescribimos todas las preguntas de texto del formulario siguiendo tres criterios: (1) una sola pregunta por campo, (2) sin predisponer a respuesta negativa ni cerrada, (3) scope de torneo completo, no de un partido individual. Ejemplos: «¿Qué diferencia notaste entre cómo ejecutas tus golpes en entrenamiento y cómo lo hiciste en este torneo?» en vez de preguntas que asumían que algo salió mal.

Agregamos placeholders aleatorios: 3 opciones por campo de texto, elegidas al azar con Math.random() en el useState initializer al montar el componente. Costo computacional mínimo, evita sesgar respuestas con el mismo ejemplo siempre.

Agregamos checkboxes de zonas corporales para el campo de dolor: condicional a «Sí», muestra 16 zonas en grilla de 2 columnas (hombro, codo, muñeca, espalda, cadera, rodilla, tobillo, etc.). El estado guarda un array de zonas seleccionadas, útil para que la fisio focalice la siguiente sesión.

Cerramos con un diagnóstico del estado MVP del lado del coach: falta Talent Card (entregable #3 del MVP), vista de respuestas PTF para el coach (bloqueada por auth de atletas), pantalla de reportes pendientes por periodo, y flujo de unlock de Athlete Voice.