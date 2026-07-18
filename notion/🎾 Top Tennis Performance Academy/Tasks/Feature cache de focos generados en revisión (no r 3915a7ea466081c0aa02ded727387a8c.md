# Feature: cache de focos generados en revisión (no regenerar todo al cambiar selección)

Category: Dev
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 7 (Caso Kevin, 1 Jul 2026): si el coach ya generó/revisó objetivos y anclas para varios focos y vuelve al paso 3 a cambiar la selección (quitar uno, agregar otro), el botón 'Generar' vuelve a llamar al modelo para TODOS los focos seleccionados, no solo el que cambió — se pierde lo ya revisado y se reintroduce variabilidad (no determinismo, §18). Esperado: quitar una selección solo la quita de revisión; agregar una nueva selección solo genera esa, sin tocar lo ya generado. Relacionado con el bug de cache de identify de §18 (mismo problema de fondo: el wizard no distingue 'cambió el input' de 'cambió la selección'). Ref §20.
Priority: Medium
Status: Backlog
Type: Feature