# Revisar MFA / email confirmation para atletas y coaches

Category: Dev
Epic: Phase 1 — Core Features
Notes: El flow de signup de atletas asume session inmediata (email confirmation deshabilitado). Si se habilita email confirmation, el INSERT del atleta falla porque está después del check de sesión. Fix: guardar datos del atleta en user_metadata durante signUp y hacer el INSERT via onAuthStateChange cuando el usuario confirma. También evaluar Supabase MFA (TOTP) para coaches.
Priority: Low
Status: Backlog
Type: Feature