---
name: schema-rls-verification
description: Usa este skill cada vez que se crea o modifica una tabla de Supabase en el proyecto Top Tennis Performance Academy, o cuando se agregan/cambian políticas RLS (Row Level Security). También actívalo cuando Marco reporte síntomas de que las policies no se comportan como deberían — "un atleta ve datos de otro atleta", "un coach no puede ver a sus atletas", datos que aparecen o desaparecen según quién los mira. Los bugs de RLS son silenciosos, no truenan, así que trátalos con la misma seriedad que un bug de seguridad. Cubre tanto el diseño de las políticas (quién ve/edita qué por rol) como la verificación activa corriendo queries reales como cada rol — no basta con que la policy "se vea bien".
---

# Verificación de Schema + RLS — Top Tennis Performance Academy

Companion del skill de "rebanada de feature" (`session-open-close` es otro companion, para apertura/cierre): ese skill invoca a este en sus pasos de schema y RLS. Este skill es el módulo profundo — el modelo de roles, los patrones de RLS del proyecto, y sobre todo, la **verificación activa** de que las políticas hacen lo que dicen, no solo lo que parecen decir.

## Por qué este skill existe

Los bugs de RLS son silenciosos y peligrosos: un atleta viendo datos de otro atleta no genera un error, simplemente pasa. Un coach bloqueado de ver a su propio atleta tampoco truena — el coach solo ve una lista vacía y asume que no hay datos, no que hay un bug. Ya mordió una vez con timezone (Session 11). Es el tipo de cosa que a mano se olvida verificar, porque "compiló y no tronó" no es lo mismo que "es seguro".

## Modelo de roles del proyecto

Dos roles con acceso a datos de reportes: **coach** y **atleta**. (Admin existe como concepto pero hoy no tiene RLS granular documentada — si aparece en una tabla nueva, documéntalo aquí y en `docs/db-schema.md`.)

El patrón de acceso vigente, tabla por tabla, vive en `docs/db-schema.md` bajo "RLS — Row Level Security (resumen)" — **esa tabla es la fuente de verdad, revísala siempre**, esto de aquí es solo el patrón general para orientarte:

| Tabla | Coach | Atleta |
|---|---|---|
| `athletes` | Lee y edita los suyos | Lee su propio perfil |
| `reports` | Lee y crea los de sus atletas | Lee el suyo |
| `report_character` | Lee y edita los de sus atletas | **Sin acceso** |
| `report_athlete_voice` | Lee los de sus atletas | Lee y edita el suyo, solo si `athlete_voice_unlocked_at IS NOT NULL` |

**Patrón general:** un coach solo debe ver/editar filas donde `coach_id` (directo o vía FK a `athletes`) coincide con su propio `auth.uid()`. Un atleta solo debe ver/editar filas donde `athlete_id` (directo o vía `athletes.user_id`) coincide con su propio `auth.uid()`. Cualquier excepción a este patrón — como `report_character` sin acceso al atleta, o `report_athlete_voice` con el gate de `unlocked_at` — debe estar documentada explícitamente. No asumas el patrón general sin revisar la tabla real de la tabla que estás tocando.

## Al diseñar RLS para una tabla nueva o modificada

1. Antes de escribir la policy, contesta: ¿quién debe leer esta fila? ¿quién debe poder editarla? ¿hay un estado (como `unlocked_at`) que condiciona el acceso más allá del rol?
2. Escribe la policy siguiendo el patrón de la tabla (`auth.uid()` contra el owner directo o vía FK).
3. Actualiza la tabla de RLS en `docs/db-schema.md` — si el resumen no refleja la tabla nueva, la próxima sesión (tuya o de Marco) va a asumir que esa tabla no tiene RLS documentada, y eso es peor que no tener la tabla.

## Verificación activa — el paso que no se debe saltar

Después de crear o cambiar una policy, no asumas que funciona porque el SQL se ve correcto: corre queries reales como cada rol para confirmarlo. Usa el MCP de Supabase (`execute_sql`, o un cliente autenticado como cada usuario de prueba) para simular:

1. **Como el coach dueño** — ¿puede leer/editar sus propias filas? (positivo esperado)
2. **Como un coach distinto** — ¿puede leer/editar filas que no son suyas? (debe fallar — si no falla, ahí está el bug silencioso)
3. **Como el atleta dueño** — ¿puede leer/editar lo que le corresponde según la tabla de RLS?
4. **Como un atleta distinto** — ¿puede leer/editar filas de otro atleta? (debe fallar)
5. Si la tabla tiene un gate de estado (como `athlete_voice_unlocked_at`), prueba explícitamente el caso "antes de desbloquear" y "después de desbloquear" — los gates de estado son donde más se esconden los bugs, porque la policy "se ve bien" en ambos estados por separado pero falla en la transición.

Si algún caso "debe fallar" en realidad pasa, o algún caso "debe pasar" en realidad falla, la tabla no está lista para commit — sin importar qué tan simple parezca la policy a simple vista.

## La trampa de timezone

Ya mordió una vez (Session 11): comparaciones de fecha/hora en policies o en queries pueden comportarse distinto según la zona horaria del cliente vs. la del servidor de Supabase (que corre en UTC). Si una policy o una query depende de un rango de fechas (ej. "reportes de este mes", "torneos de esta semana"), verifica explícitamente el comportamiento cerca de la medianoche en horario de México (UTC-6) — es justo el borde donde el bug se esconde, porque funciona bien el resto del día.

## Qué hacer si encuentras un caso roto

No lo dejes para después "porque ya casi terminas". Un caso de RLS roto bloquea el commit igual que un test que falla. Si el fix no es trivial y no se puede resolver en el momento, créalo como bug en el kanban de Notion (Category: Dev, Type: Bug) para no perderlo — no confíes en la memoria de la sesión.
