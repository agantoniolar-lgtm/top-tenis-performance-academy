# Bug: focos identificados no persisten al volver (Caso 3)

Category: Dev
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): en el UI los focos identificados parecieron regenerarse en vez de reusar el cache, pese al fix de re-identificación del mismo día (pm-v2.4, §16). Necesita repro: confirmar si el texto del dump cambió entre pasos, o si el cache (lastIdentifiedObs) se invalida de más al recargar o retomar un draft. Ref §18.
Priority: High
Status: Backlog
Type: Bug