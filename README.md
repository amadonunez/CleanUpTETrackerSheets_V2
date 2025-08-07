# CleanUpTETrackerSheets_V2

Este es el repositorio del proyecto de Google Apps Script diseñado para la limpieza y optimización de hojas de cálculo de seguimiento.

## Funcionalidad Principal

El script está diseñado para automatizar la limpieza y el mantenimiento de las hojas de cálculo de seguimiento, como "TETrackerSheets". Su objetivo es eliminar datos obsoletos, reorganizar la información y aplicar formatos estandarizados para asegurar que la hoja de cálculo sea precisa, eficiente y fácil de usar para el seguimiento continuo.

El proceso de limpieza y archivado incluye los siguientes pasos:

1.  **Copia de Seguridad:** Crea una copia de seguridad del archivo en una carpeta de Google Drive especificada. El nombre del archivo de respaldo sigue el formato `YYYY.MM.DD Backup of [nombre original del archivo]`.
2.  **Registro de Archivo:** Registra la operación de respaldo en una hoja llamada "ArchiveLogs" dentro de la hoja de cálculo original, incluyendo un enlace al archivo de respaldo.
3.  **Limpieza de Datos:** Procesa hojas específicas (ej. 'EXPO', 'IMPO') y elimina las filas con más de 3 meses de antigüedad.
4.  **Eliminación de Filas Vacías:** Elimina las filas vacías al final de cada hoja procesada.

## Configuración

El script se configura a través de las siguientes constantes en el archivo `Code.js`:

*   `ARCHIVE_FOLDER_ID`: El ID de la carpeta de Google Drive donde se guardarán las copias de seguridad.
*   `VERBOSE_LOGGING`: Habilita o deshabilita los registros detallados en la consola de Apps Script.
*   `TETRACKERS_FILES_TO_PROCESS`: Un array de objetos que define los archivos de Google Sheets a procesar. Cada objeto contiene:
    *   `fileId`: El ID del archivo de Google Sheets.
    *   `sheets`: Un array de objetos que especifica las hojas a procesar dentro del archivo, junto con el índice de la columna que contiene la fecha.

## Uso

Para utilizar este script, sigue estos pasos:

1.  **Configura las constantes:** Modifica las constantes en `Code.js` para que coincidan con tus archivos y carpetas.
2.  **Ejecuta el script:** Ejecuta la función `runCleanupForAllTETrackers()` desde el editor de Apps Script.
3.  **Configura el disparador (opcional):** Puedes configurar un disparador de tiempo para que el script se ejecute automáticamente. La función `createMonthlyTrigger()` crea un disparador que ejecuta el script el primer día de cada mes.

## Autor

*   **Mario Estrella**