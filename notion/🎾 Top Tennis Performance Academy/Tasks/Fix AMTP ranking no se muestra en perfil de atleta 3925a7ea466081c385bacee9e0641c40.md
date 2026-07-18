# Fix: AMTP ranking no se muestra en perfil de atleta ni en Equipo

Category: Dev
Epic: Phase 2 — Analytics
Notes: Commiteado en 6cd064e. AlumnoDetalle.jsx: setAmtp ya no se salta cuando el atleta no tiene reportes. Equipo.jsx: conectado a amtp_rankings (cards + tabla), mismo patron que Alumnos.jsx. Lint + test (65/65) verdes antes del commit. Pendiente: git push desde terminal de Marco.
Priority: Medium
Status: Done
Type: Bug