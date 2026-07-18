# P&M — Fix: diagnóstico/objetivo nunca usan nombre del atleta ni tono crítico

Category: Dev
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 4 (Caso Emilio): el dump nombraba al atleta y fraseaba una observación como juicio directo ('Emilio no tiene término medio'), con riesgo de que el diagnóstico generado heredara ese tono al discutirse con el atleta. Fix (pm-v2.4): regla nueva en GENERATE_SYSTEM — nunca usar el nombre del atleta en diagnóstico/objetivo, traducir crítica directa a conducta observable sin inventar. Desplegado v8. Relacionado con el task de rúbrica/skill de verificación de observaciones (convención de tono pendiente del lado del coach). Ref docs/http://scope-planning-measurement.md §17.
Priority: High
Status: Done
Type: Bug