# [Post-MVP] Recordatorio automático de actualizar grado escolar en agosto

Category: Dev
Epic: Phase 2 — Analytics
Notes: Cada agosto, enviar notificación al atleta/padre para que actualicen el grado escolar manualmente. NO hacer update automático: si el atleta reprueba un ciclo, el sistema lo subiría de grado igualmente. El update lo debe confirmar una persona. Requiere: canal de notificación definido (email o WhatsApp, ver task de 2FA/WA) + scheduled task via Supabase Edge Function + pg_cron.
Priority: Low
Status: Backlog
Type: Feature