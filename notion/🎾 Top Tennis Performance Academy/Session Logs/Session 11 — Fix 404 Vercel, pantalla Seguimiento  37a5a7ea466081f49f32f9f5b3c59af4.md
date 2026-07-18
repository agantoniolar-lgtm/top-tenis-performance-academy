# Session 11 — Fix 404 Vercel, pantalla Seguimiento de reportes, coach Tlaca y bugs de RLS/timezone

Date: June 9, 2026
Key decisions: La política RLS para atletas en sub-secciones del reporte requiere completed_at IS NOT NULL — consistente con el patrón de report_on_court y report_physical. Los datos de carácter no se muestran al atleta hasta que el coach marque la sección como completa.

La pantalla de Rendimiento del atleta siempre muestra el reporte más reciente, sin selector de período — la selección de período es una feature del coach en Seguimiento, no del atleta.
Open items / follow-ups: Commit + push pendiente (Marco lo hace desde su terminal con el fix de index.lock).
Conectar PTF a Supabase + APIs de AMTP/ITF.
Warning pre-existente en Reclutamiento.jsx línea 47 (useEffect con http://user.id faltante en deps) — no bloquea, pero debería corregirse.
Para que Técnica y Táctica muestren datos en la vista de Marco atleta, se necesita llenar report_on_court para su reporte de junio.
Status: Complete
What we did: Sesión densa de infraestructura y bugs. Se arrancó resolviendo el 404 que aparecía al abrir URLs del portal directo en el browser (ej. /portal/inicio): se agregó un rewrite en vercel.json para que Vercel sirva index.html en cualquier ruta, lo que habilita que el SPA maneje el routing sin que el servidor devuelva 404.

Se construyó la pantalla 'Seguimiento' para coaches en /portal/reportes: muestra todos los atletas del coach con su estado por período (On-court, Physical, Character, Athlete Voice), con checkmarks verdes para secciones completadas, círculos vacíos para pendientes y badge naranja para Athlete Voice sin entregar. Incluye un selector de período con navegación mes a mes. Se conectó al sidebar como nuevo ítem de navegación y se agregó la ruta en App.jsx.

Se creó la cuenta dummy del coach 'Tlaca' en Supabase, lo que requirió varias rondas de debugging por errores de GoTrue: cost factor incorrecto en bcrypt, falta del registro en auth.identities, provider_id incorrecto (UUID en lugar de email), y campo email_change con NULL en vez de string vacío. Finalmente funcionó y se ligaron cuatro atletas (Marco, Sofía, Andrés, Sergio Vera) al coach_id de Tlaca, incluyendo actualizar http://reports.coach_id porque RLS lo requiere.

Se encontraron y resolvieron dos bugs en la vista de Rendimiento del atleta: (1) La política RLS en report_character era coaches_only — los atletas no podían leer su propia evaluación de carácter aunque los datos existían en la BD (etica_trabajo: 5, coachabilidad: 4 para Marco). Se agregó la política athletes_select_completed_character siguiendo el mismo patrón de report_on_court y report_physical. (2) La función fmtPeriod parseaba '2026-06-01' con new Date() que toma la fecha como UTC midnight, resultando en mayo en zona horaria México (UTC-6). Se corrigió parseando año y mes manualmente. Se agregaron 4 tests para fmtPeriod, quedando en 32 tests pasando.

También se corrigió que TalentCard no cargaba athlete_recruitment_profile porque select('*') en athletes no hace join automático — se agregó query paralela explícita.