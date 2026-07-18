# Fix: carryover incluye planes archivados (falta filtro de status)

Category: Dev
Epic: Phase 2 — Analytics
Notes: Encontrado en live test 5 (Caso Sofía, 1 Jul 2026): salió 'ética de trabajo' como foco de carryover del periodo anterior sin explicación clara en el dump sintético.

Actualización (live test 6, Caso Diego, 1 Jul 2026): se repite el patrón con 'devolución'.

CONFIRMADO por SQL (live test 7, Caso Kevin, 1 Jul 2026): la query de carryover en handleIdentify (PlanesCoach.jsx) NO filtra por status — solo hace .eq('athlete_id', selAthlete).lt('period_start', periodStart).order('period_start', desc).limit(1). El único atleta real en BD tiene un plan ARCHIVADO (id 2581c5b1…, creado 27 Jun) con focos serve/backhand/devolucion/seleccion_golpe/etica_trabajo — coincide exacto con los dos misterios anteriores. No es un bug de matching ni un artefacto del dump: el carryover toma el plan más reciente por period_start sin importar si está archivado. Cada caso sintético guardado contamina el carryover del siguiente. Fix concreto: agregar .eq('status','active') (o .in(['active','completed'])) a la query. Bug bien entendido, no depende del redesign — candidato a fix inmediato. Ref docs/http://scope-planning-measurement.md §20.
Priority: High
Status: Done
Type: Bug