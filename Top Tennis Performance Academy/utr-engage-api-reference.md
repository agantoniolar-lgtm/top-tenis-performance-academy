# UTR Engage API — Referencia Técnica

**Fuente oficial:** https://www.utrsports.net/pages/engage-api-documentation  
**Última actualización del doc UTR:** March 31, 2025  
**Swagger (explorar endpoints):** https://prod-utr-engage-api-data-azapp.azurewebsites.net/swagger/index.html  
_(Para entrar a Swagger: dejar usuario y contraseña vacíos — es público)_

---

## ¿Qué hace esta API?

Permite que plataformas externas conecten sus usuarios con sus cuentas de UTR Sports y accedan a:

- **Rating UTR** del jugador (singles/doubles)
- **Perfil** del jugador
- **Resultados** — postear resultados desde la plataforma externa hacia UTR

---

## Prerequisitos

Para usar la API necesitas obtener de UTR Sports:

| Credencial | Descripción |
|---|---|
| `client_id` | ID de tu aplicación (UTR lo asigna) |
| `client_secret` | Secreto de tu aplicación (nunca compartir) |
| `redirect_uri` | URL de tu plataforma a donde UTR redirige después del OAuth |
| Tenant (opcional) | Solo necesario para tokens de nivel cliente (para `POST /results`) |

**Contacto para registro:** api-developers@utrsports.com

---

## Autenticación — OAuth 2.0

UTR usa OAuth2. Hay dos tipos de access token:

### 1. Token de nivel usuario (user-level)
Para leer ratings y perfil de un jugador específico. Requiere que el jugador haya autorizado la app.

### 2. Token de nivel cliente (client-level)
Para `POST /results` — no es específico de un usuario. Se obtiene con `client_credentials`.

---

## Flujo OAuth — paso a paso

### Paso 1: Redirigir al usuario a UTR para autorizar

```
GET https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/oauth/authorize
```

**Parámetros:**

| Parámetro | Requerido | Descripción |
|---|---|---|
| `client_id` | ✅ | ID de tu aplicación |
| `redirect_uri` | ✅ | URL de retorno en tu plataforma |
| `third_party_user_id` | ✅ | ID único del usuario en TU plataforma |
| `scope` | ✅ | Permisos a pedir: `ratings`, `profile`, `results` (separados por coma) |
| `approval_prompt` | | `auto` (default) o `force` (siempre mostrar pantalla de autorización) |
| `state` | | String opcional que se devuelve en el redirect — útil para contexto |

**Ejemplo completo:**
```
https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&third_party_user_id={third_party_user_id}&approval_prompt=force&scope=ratings,profile,results
```

### Paso 2: El usuario autoriza en UTR

UTR redirige al usuario de vuelta a tu `redirect_uri` con:
- `?code=abc123...` — código de autorización (de un solo uso, de corta vida)
- `?error=access_denied` — si el usuario rechazó

### Paso 3: Intercambiar el código por tokens

```
POST https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/oauth/token
```

**Body:**
```json
{
  "client_id": "{client_id}",
  "client_secret": "{client_secret}",
  "code": "<authorization_code>",
  "grant_type": "authorization_code"
}
```

**Respuesta:**

| Campo | Tipo | Descripción |
|---|---|---|
| `access_token` | string | Token para hacer requests (expira en 6 horas) |
| `refresh_token` | string | Token para renovar el access_token |
| `expires_in` | integer | Segundos hasta que expira el access_token |
| `expires_at` | integer | Epoch timestamp de expiración |
| `player` | object | Info básica del jugador |

### Paso 4: Hacer requests a la API

```http
Authorization: Bearer <access_token>
```

---

## Renovar tokens (Refresh)

Los access tokens expiran a las **6 horas**. Para renovar:

```
POST https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/oauth/token
```

**Parámetros:**

| Parámetro | Requerido | Descripción |
|---|---|---|
| `client_id` | ✅ | ID de tu aplicación |
| `client_secret` | ✅ | Secreto de tu aplicación |
| `grant_type` | ✅ | Siempre `refresh_token` |
| `refresh_token` | ✅ | El refresh token más reciente del usuario |

**Reglas importantes:**
- Si el access_token tiene más de 1 hora de vida restante → devuelve el mismo token
- Si tiene menos de 1 hora o ya expiró → devuelve nuevo access_token Y nuevo refresh_token
- **El refresh_token anterior queda invalidado inmediatamente** al recibir uno nuevo
- Siempre guardar el refresh_token más reciente

---

## Token de nivel cliente (para POST /results)

```bash
curl --request POST \
  --url https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data grant_type=client_credentials \
  --data client_id={client_id} \
  --data client_secret={client_secret} \
  --data scope={scope}
```

_(El tenant y scope para esto los provee UTR — contactar api-developers@utrsports.com)_

---

## Endpoints disponibles

### GET /api/v1/members/ratings
Obtiene el rating UTR del jugador. Requiere scope `ratings`.

```bash
curl --request GET \
  --url https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/members/ratings \
  --header 'Authorization: Bearer <access_token>'
```

### GET /api/v1/members/profile
Obtiene el perfil del jugador. Requiere scope `profile`.

```bash
curl --request GET \
  --url https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/members/profile \
  --header 'Authorization: Bearer <access_token>'
```

### POST /api/v1/results
Postea resultados en nombre del atleta. Requiere scope `results` y **token de nivel cliente**.

```bash
curl --request POST \
  --url https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/results \
  --header 'Authorization: Bearer <access_token>' \
  --header 'Content-Type: application/json-patch+json' \
  --header 'accept: application/json' \
  --data <Data>
```

**Importante:** Por defecto los resultados se postean como **no verificados** (no cuentan para el rating verificado). Para que cuenten, hay que solicitarlo a UTR.

**Códigos de respuesta para lote de resultados:**

| Código | Status | Descripción |
|---|---|---|
| 1 | Accepted | Todos los resultados válidos y procesados |
| 2 | PartiallyAccepted | Algunos válidos, otros con errores |
| 3 | Denied | Ningún resultado fue aceptado |

**Errores por resultado individual:**

| Código | Error |
|---|---|
| 1 | PlayersConsentPending |
| 2 | MissingSecondPlayerDetails |
| 3 | InvalidScore |
| 4 | InvalidTieBreakScore |
| 5 | InvalidCountryCode |
| 6 | InvalidAddress |
| 7 | PlayerRecordMissing |
| 8 | InvalidGender |
| 9 | EventEndDateNotBeforeStartDate |
| 10 | DuplicatePlayerIdsInMatch |
| 11 | InvalidResultDate |

---

## Deauthorización

Para revocar el acceso de un usuario:

```
POST https://prod-utr-engage-api-data-azapp.azurewebsites.net/api/v1/oauth/deauthorize
```

Parámetro `scope`: los scopes a revocar, o vacío para revocar todos.

---

## Rate Limits

**1,000 requests por minuto** (rolling window, todos los endpoints combinados).  
Exceder el límite devuelve `429 Too Many Requests`.

---

## URLs de entornos

| Entorno | Base URL |
|---|---|
| **Producción** | `https://prod-utr-engage-api-data-azapp.azurewebsites.net` |
| **QA / Dev** | `https://qa-utr-engage-api-data-azapp.azurewebsites.net` |

---

## Scopes disponibles (desde Q1 2025)

| Scope | Acceso |
|---|---|
| `ratings` | Rating UTR del jugador |
| `profile` | Información de perfil |
| `results` | Postear resultados en nombre del jugador |

---

## Recomendaciones de implementación (de UTR)

- Guardar los scopes que cada jugador autorizó (para debuggear por qué no llegan datos)
- Guardar access tokens y refresh tokens en **tablas separadas** en la BD
- Antes de hacer un request, verificar si el access token está próximo a expirar (< 1 hora). Si sí, refrescarlo primero

---

## Gaps identificados — pendiente con rep UTR (lunes)

La Engage API **no expone** (hasta donde está documentado) los siguientes datos que necesita la plataforma:

- Historial de ranking UTR del jugador
- Historial de torneos y partidos
- W/L record y resultados por torneo

Los únicos endpoints disponibles son rating actual, perfil, y posteo de resultados. **Preguntar al rep:**
1. ¿Existen endpoints privados para leer historial de partidos/torneos de un jugador?
2. ¿Qué devuelve exactamente `GET /api/v1/members/ratings` — solo el número actual o también histórico?
3. Si no hay endpoints de lectura de historial, ¿cuál es el camino oficial para acceder a esos datos?

---

## Contacto

- **Registro / credenciales:** api-developers@utrsports.com
- **Swagger (prod):** https://prod-utr-engage-api-data-azapp.azurewebsites.net/swagger/index.html
- **Página de desarrolladores:** https://www.utrsports.net/pages/engage-api
