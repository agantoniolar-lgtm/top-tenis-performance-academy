# Investigar y definir 2FA + notificaciones por WhatsApp

Category: Team
Epic: Phase 1 — Core Features
Notes: Dos objetivos ligados: (1) 2FA en el login — evaluar si se hace por email (Supabase lo soporta nativo) o por WhatsApp/SMS (requiere API externa). (2) Notificaciones a atletas por WhatsApp — ej: 'tu coach subió un nuevo reporte', 'tienes un PTF pendiente'. 

APIs a investigar:
- WhatsApp Business API (Meta oficial) — requiere cuenta de business verificada, buena para volúmenes altos
- Twilio — soporta WA + SMS + 2FA en un solo SDK, fácil de integrar con Supabase Edge Functions
- MessageBird / http://Bird.com — alternativa a Twilio con precios más flexibles en LatAm
- http://Respond.io / Wati — más orientados a CRM sobre WA, no tanto para notificaciones programmáticas

Preguntas clave a responder:
- ¿Qué tipos de mensajes permite WA Business sin ser bloqueado? (solo plantillas aprobadas para outbound)
- ¿La academia tiene número de WA Business ya registrado?
- ¿Qué volumen de mensajes se espera? (determina si Twilio vs Meta directo)
- ¿El 2FA es bloqueante o solo recomendado?

Decisión esperada: servicio elegido + estimado de costo por mensaje + plan de integración con Supabase Edge Functions. Trabajar antes de abrir el registro a usuarios reales.
Priority: Medium
Status: Backlog
Type: Feature