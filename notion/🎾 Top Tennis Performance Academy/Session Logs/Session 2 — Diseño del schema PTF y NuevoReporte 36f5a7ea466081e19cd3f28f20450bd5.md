# Session 2 — Diseño del schema PTF y NuevoReporte

Date: May 29, 2026
Key decisions: 1. El PTF se reduce a 8 preguntas, todas obligatorias — no hay versión parcial. La pregunta 7 (¿Con qué te quedas de este partido?) es la más importante del formulario para medir madurez deportiva.
2. El modo voz del PTF es iteración 2 — el MVP es formulario escrito. El schema de BD no cambia entre iteraciones.
3. Physical no tiene componente observacional — solo evaluación formal con pruebas medibles una vez al mes.
4. Composición corporal vive en Nutrición, no en Physical.
5. Transferencia al partido vive en On-Court, no en Mental.
6. Mental y Nutrición quedan open ended hasta recibir formatos de psicóloga y nutrióloga.
7. Athlete Voice es un vis-a-vis sub-dimensión por sub-dimensión con la evaluación del coach.
Open items / follow-ups: 1. Conseguir formato de reporte de la psicóloga para definir campos de Mental.
2. Conseguir formato de reporte de la nutrióloga para definir campos de Nutrición.
3. Definir visibilidad por dimensión (qué ve el atleta, qué ven los padres) — quedó pendiente dimensión por dimensión.
4. Coaches deben decidir: ¿game plan escrito pre-partido?, ¿checklist de situaciones mínimas de observación táctica?, ¿formato estándar para notas cualitativas?, ¿anclajes para escala 1-5 en valores 2 y 4?
5. Fisio/preparador físico debe definir prueba de movilidad y validar el resto de las pruebas físicas.
6. Investigar API de UTR.
7. Evaluar integración Swing Vision (post-MVP).
8. Diseñar schema de BD en Supabase — siguiente paso técnico una vez cerrados los campos.
Status: Complete
What we did: Sesión enfocada en diseñar los schemas del PTF y del NuevoReporte de manera propositiva, sin depender de que los coaches definan todo. Se revisó el formato Post-Match existente y se rediseñó completamente: de 18 preguntas abiertas y compuestas a 8 preguntas limpias con una respuesta cada una, todas obligatorias, con metadata estructurada del partido. Se escribió el framing del PTF para los coaches explicando los dos objetivos del formulario y el valor para recruiters. Se definió el modo voz (ElevenLabs Conversational AI) como iteración 2 del PTF, y se agregó al kanban en Backlog.

Para el NuevoReporte se trabajó dimensión por dimensión. On-Court quedó con tres bloques: Técnica (6 objetos de evaluación obligatorios mensualmente), Táctica con dos secciones (observacional para MVP, Swing Vision para post-MVP), y Transferencia al partido con escala propia. Physical quedó como evaluación formal mensual con pruebas medibles, sin componente observacional, y composición corporal se movió a Nutrición. Mental y Nutrición quedaron open ended hasta recibir los formatos de la psicóloga y la nutrióloga. Character & Leadership definió 4 campos con conducta y liderazgo como internos del coach. Athlete Voice quedó como vis-a-vis con el coach en cada sub-dimensión evaluable.

Se crearon dos tareas en el kanban de Notion: investigar API de UTR y evaluar integración de Swing Vision. Se produjeron dos documentos: http://ptf-post-tournament-form.md y http://nuevoreporte-schema.md.