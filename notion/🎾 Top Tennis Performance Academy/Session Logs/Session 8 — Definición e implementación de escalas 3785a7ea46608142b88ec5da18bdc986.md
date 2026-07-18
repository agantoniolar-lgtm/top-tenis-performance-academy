# Session 8 — Definición e implementación de escalas

Date: June 6, 2026
Key decisions: La escala on-court está anclada al plan trimestral del atleta, no a un absoluto. El 0 es éxito — significa que el atleta va en línea con lo planeado. Esto es intencional para evitar que los coaches inflen o deflen scores sin referencia.

Character y on-court tienen escalas distintas porque miden cosas distintas: one measures progress toward an objective, the other measures behavioral consistency.

El PTF usa vocabulario de percepción porque lo llena el atleta sobre su propia experiencia post-torneo, no un coach evaluando progreso técnico.

DB guarda valores numéricos; los labels son solo capa de presentación.
Open items / follow-ups: Implementar escalas del PTF en PostTorneo.jsx (próxima sesión).
Renombrar columna return → resto en report_on_court (migración pendiente de sesiones anteriores).
Flujo de Athlete Voice para atletas.
Pantalla de reportes pendientes por periodo.
Marco debe llenar el formulario de developer de UTR Sports (task en Notion: Solicitud de acceso a API de UTR Sports).
Status: Complete
What we did: Arrancamos agregando 6 tasks al kanban de Notion: 3 para el plan trimestral del atleta (post-MVP, Phase 3 Academy Tools), 1 para solicitar acceso a la API de UTR Sports, 1 para integrar esa API, y 1 para el scraper de rankings AMTP.

Después definimos las escalas de todas las dimensiones numéricas del sistema.

Para el reporte del coach, diseñamos dos escalas distintas. On-court (técnica y táctica) usa -2 a +2 anclada al objetivo trimestral del atleta: el 0 significa "por buen camino" y es un resultado de éxito, no de mediocridad. Los labels son Estancado (-2), Rezagado (-1), Por buen camino (0), Adelantado (+1), Superado (+2). Character usa 1-5 con vocabulario conductual: Ausente, Inconsistente, Por buen camino, Proactivo, Consolidado.

Implementamos ambas escalas en NuevoReporte.jsx: el componente ScoreRow se parametrizó para recibir el arreglo de valores, se agregó un ScaleLegend visible arriba de cada sección, y los defaults se ajustaron a 0 para on-court y 3 para character. En la DB, aplicamos check constraints -2/+2 en report_on_court y 1-5 en report_character, y eliminamos los constraints originales de 1-5 en on-court que estaban causando conflicto.

Actualizamos AlumnoDetalle.jsx para que las métricas headline, el grid de strokes y la tabla de historial muestren labels en lugar de promedios numéricos. Los valores numéricos se mantienen en la DB; la conversión a label es solo de presentación.

Para el PTF, definimos escalas de percepción (no de objetivo): Técnica 1-5 va de "No funcionó" a "Mi mejor versión", Mental de "No lo manejé" a "Me sentí sólido", Físico de "Sin energía" a "Excelente condición", y Satisfacción general en 1-10 con 4 rangos. La implementación en código quedó pendiente para la siguiente sesión.