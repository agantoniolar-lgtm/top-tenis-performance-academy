# Repensar liderazgo (score -2..+2 en report_character) y physical como dimensión de P&M

Category: Team
Priority: Medium
Status: Backlog
Type: Feature

Surgió al construir el cierre de plan trimestral (14 Jul 2026, `docs/scope-close-quarterly-plan.md` §4/§10). Dos huecos de datos que bloquean la asistencia LLM del cierre (sugerir `outcome` con base en la trayectoria de scores del periodo):

1. **Liderazgo sin score.** `report_character` tiene `etica_trabajo` y `coachabilidad` como columnas -2..+2, pero `liderazgo` solo tiene `liderazgo_nota` (texto libre) — nunca se agregó el score numérico. Marco confirmó (14 Jul 2026): liderazgo sí debería tener su -2..+2 propio, además de la nota.
2. **Physical no se conecta bien como dimensión dentro de planes.** `report_physical` guarda valores numéricos crudos (segundos, cm, nivel) por test, no un score -2..+2 por sub-dimensión, y el catálogo de baselines/targets nunca se construyó (ver §11/§16 de `docs/scope-planning-measurement.md`, bloqueante ya conocido). Marco (14 Jul 2026): "quitarlo de los planes porque no se conecta bien" — posible que physical salga del modelo de focos/anclas de P&M tal como está, o se rediseñe. Necesita conversación aparte, no es solo un fix de columna.

Ambos bloquean la trayectoria de "3 scores del periodo" que el cierre de plan (`P&M v2 — close-quarterly-plan...`) necesitaría para sugerir `outcome`/`final_assessment` con LLM — esa asistencia se recortó de la primera rebanada de close-quarterly-plan justo por esto. Cuando esto se resuelva, retomar esa asistencia como segunda rebanada.

Necesita su propio doc de scoping antes de construirse — empieza por la conversación de producto/filosofía sobre qué es physical dentro de P&M, no por el schema.