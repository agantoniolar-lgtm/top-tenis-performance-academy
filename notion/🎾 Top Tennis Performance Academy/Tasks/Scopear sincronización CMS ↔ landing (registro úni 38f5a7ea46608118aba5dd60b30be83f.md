# Scopear sincronización CMS ↔ landing (registro único de slots editables)

Category: Dev
Notes: DECISIÓN (Marco): el CMS se queda en modelo de slots ESTÁTICOS con deploys ad hoc — meter/quitar slots o páginas = cambio de código + deploy (lo hacemos Marco + Claude), NO page-builder dinámico. El scoping del registro único de slots lo vemos juntos después.

Problema raíz: los slots editables se definen en DOS lugares (constantes del panel PanelContenido + llamadas text()/asset() en cada página), que pueden desincronizarse (ya pasó: slots sin destino y labels equivocados). Objetivo del scoping: (a) registro único de slots (src/lib/contentSlots.js) como fuente de verdad que importen tanto el panel como las páginas; el panel genera sus tabs desde ahí. (b) Auditar TODA la landing y registrar cada pieza editable (textos/imágenes/videos hoy hardcodeados) para que exista en el CMS. (c) Flujo: la ESTRUCTURA la edita Marco con Claude (código+deploy); el CONTENIDO ya en prod debe existir en el CMS.
Priority: High
Status: Backlog
Type: Feature