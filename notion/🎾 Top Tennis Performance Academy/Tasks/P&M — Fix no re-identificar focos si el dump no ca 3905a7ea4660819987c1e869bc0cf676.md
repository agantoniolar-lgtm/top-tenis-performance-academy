# P&M — Fix: no re-identificar focos si el dump no cambió

Category: Dev
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 3 (Caso Mariana): volver al paso 2 sin editar el dump forzaba una nueva llamada a identify, perdiendo/reordenando la selección de focos ya revisada. Fix: se cachea el texto del dump identificado (lastIdentifiedObs); si coincide, navega directo al paso 3 sin llamar al modelo. Ref docs/http://scope-planning-measurement.md §16.
Priority: Medium
Status: Done
Type: Bug