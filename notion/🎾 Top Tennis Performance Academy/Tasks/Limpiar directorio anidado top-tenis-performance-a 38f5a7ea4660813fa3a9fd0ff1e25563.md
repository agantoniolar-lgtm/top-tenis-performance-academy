# Limpiar directorio anidado top-tenis-performance-academy/ (leftover de movimiento de archivos)

Category: Dev
Notes: Diagnosticado y verificado. El sandbox de Cowork no puede borrar archivos en el mount (unlink = Operation not permitted), así que Marco debe correr la limpieza local: rm .git/index.lock && git rm -r top-tenis-performance-academy && git commit -m 'chore: eliminar dir anidado top-tenis-performance-academy/ sobrante de movimiento de archivos'. Confirmado: nada importa de ese path, lint+tests pasan, el src/ vivo es el de la raíz. Cerrado (13 Jul 2026) — Marco confirmó que ya borró el directorio anidado localmente.
Priority: Low
Status: Done
Type: Chore