# Bug: AMTP Rankings Scraper falla en GH Actions (exit code 1)

Category: Dev
Epic: Phase 2 — Analytics
Notes: Primera corrida programada (1 Jul 2026, run #1) del cron mensual falló: job completo en ~8s, step "Run scraper" terminó con exit code 1. Hay también una anotación de "Node.js 20 is deprecated" (actions/checkout@v4, actions/setup-python@v5 forzados a Node 24) pero es un warning de plataforma no relacionado al fallo — no bloquea el run por sí solo. Causa real sin confirmar: no se pudo leer el log completo (requiere sign-in). Hipótesis por duración corta + código del scraper (scripts/amtp_http://scraper.py): la primera llamada a http://amtp.mx en get_anon_key() no está en try/except y puede estar fallando rápido (403/timeout/cambio de estructura del sitio). Pendiente: Marco revisa el log completo en GitHub (run 28507947517) y lo comparte, o se agrega manejo de errores más claro al script para el próximo run.
Priority: Medium
Status: Done
Type: Bug