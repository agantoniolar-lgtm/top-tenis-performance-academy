# B1 — W/L record no se actualiza en expediente ni talent card

Category: Dev
Notes: Detectado en QA 11-jun. Fixed: W/L ahora es por partidos — el PTF pregunta cuántos partidos jugó (partidos_jugados en athlete_tournaments); si ganó el último gana todos, si no, pierde solo el último. Subtítulo mantiene 'x torneos con resultado'. Se reemplazará con data de UTR/ITF cuando se integren.
Priority: High
Status: Done
Type: Bug