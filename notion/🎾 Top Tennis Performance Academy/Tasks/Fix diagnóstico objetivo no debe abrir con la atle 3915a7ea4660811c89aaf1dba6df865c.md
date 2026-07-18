# Fix: diagnóstico/objetivo no debe abrir con "la atleta/el atleta"

Category: Dev
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): el diagnóstico generado abre con "la atleta presenta..." en vez de ir directo a la conducta observada ("presenta una fuerza inferior que podría ser más completa..."). Ajustar GENERATE_SYSTEM (regla de tono, junto al fix de nombre del atleta) para prohibir abrir con el sustantivo del atleta. Ref docs/http://scope-planning-measurement.md §18.
Priority: Medium
Status: Backlog
Type: Bug