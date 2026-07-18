# P&M — agregar outcome 'deprioritized' + deprioritized_at

Category: Dev
Epic: Phase 2 — Analytics
Notes: Gap detectado por Marco en revisión de scope (2 Jul 2026, ver docs/http://scope-planning-measurement.md §21): ninguno de los 3 outcomes existentes (logrado/parcial/continua) cubre el caso de un foco que el coach decide NO llevar a carryover al cerrar el periodo, sin que haya sido logrado ni esté parcial. Se agrega 4to valor 'deprioritized' al enum de outcome + columna deprioritized_at (timestamptz, nullable). Confirmado por Marco (2 Jul 2026): deprioritized NO requiere final_assessment, a diferencia de los otros 3 outcomes — basta con deprioritized_at. Ya reflejado en §3, §9 y §21 del scope doc.
Priority: Medium
Status: Backlog
Type: Feature