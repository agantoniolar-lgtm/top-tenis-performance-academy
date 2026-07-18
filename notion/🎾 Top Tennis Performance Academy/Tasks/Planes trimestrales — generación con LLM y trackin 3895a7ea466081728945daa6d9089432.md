# Planes trimestrales — generación con LLM y tracking en reportes mensuales

Category: Dev
Notes: Cerrado en barrido de kanban (15 Jul 2026, confirmado por Marco) — task genérico sin scope propio, superado por los sub-tasks específicos de P&M v2 (guardrail dump quality, draft persistente, guard un plan/atleta/periodo, schema v2, rúbrica de objetivos, UI PlanesCoach, close-quarterly-plan) ya construidos o en In Review.
Priority: High
Status: Done
Type: Feature

## Qué hay que construir

- Tablas `quarterly_plans` y `quarterly_plan_objectives` en Supabase
- Edge Function `generate-quarterly-plan` que recibe observaciones del coach en texto libre y las transforma en objetivos por sub-dimensión usando OpenAI GPT-4o-mini
- Sección "Planes" nueva en el sidebar del coach (lista + generador)
- Integración en NuevoReporte y AthleteVoice: cada sub-dimensión muestra el objetivo trimestral activo como contexto

## Flujo

1. Coach va a "Planes" → selecciona atleta → elige fecha de inicio del trimestre → pega sus observaciones en lenguaje natural
2. Clic en "Generar" → Edge Function llama a GPT-4o-mini → devuelve objetivos estructurados por sub-dimensión
3. Coach revisa/edita los objetivos → guarda el plan
4. Al llenar NuevoReporte o AthleteVoice, cada campo muestra el objetivo trimestral activo encima del score