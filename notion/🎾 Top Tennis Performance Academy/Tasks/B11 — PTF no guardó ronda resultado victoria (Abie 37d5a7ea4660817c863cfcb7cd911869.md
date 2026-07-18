# B11 — PTF no guardó ronda/resultado/victoria (Abierto La Hacienda)

Category: Dev
Notes: QA 11-jun (2a ronda). El PTF guardó las secciones A–E pero el bloque de resultado quedó null. Fix: ronda/victoria/resultado obligatorios cuando el PTF está ligado a un torneo, manejar el error del update (antes se ignoraba), y reenvío de PTF actualiza en vez de duplicar fila.
Priority: High
Status: Done
Type: Bug