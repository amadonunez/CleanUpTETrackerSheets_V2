/**
 * Script de limpieza y archivado de archivos TE Tracker.
 *
 * Este script está diseñado para realizar un proceso de limpieza y archivado
 * en múltiples archivos de Google Sheets identificados como TE Trackers.
 * El proceso se ejecuta en función de los archivos y hojas definidos en
 * la estructura TETRACKERS_FILES_TO_PROCESS.
 *
 * Este proceso elimina la necesidad de hacer esto manualmente y mantiene
 * estos archivos de un tamaño manejable de forma que no tardan en cargar desde
 * el punto de vista de los usuarios.
 *
 * Adicionalmente se obtiene el beneficio de crear mensualmente archivos de respaldo
 * que pueden ser usados después para recuperar cualquier información de estos.
 *  
 * El proceso incluye los siguientes pasos:
 * 1. Crear una copia de seguridad del archivo en Google Drive con un formato de nombre
 *    'YYYY.MM.DD Backup of [nombre original del archivo]'.
 * 2. Registrar la operación de respaldo en una hoja llamada "ArchiveLogs" dentro del archivo.
 * 3. Procesar cada hoja especificada, limpiando los datos antiguos:
 *    - Mantener las filas de encabezado y las filas iniciales sin fechas válidas.
 *    - Iniciar la limpieza desde la primera fila con una fecha válida.
 *    - Incluir las filas con fechas dentro de los últimos 3 meses o con la columna de fecha vacía.
 *    - Detener el procesamiento al encontrar una fecha más antigua que 3 meses, ya que los datos están ordenados.
 *    - Eliminar todas las filas después de la última fila procesada.
 * 4. Eliminar las filas vacías al final de cada hoja procesada.
 *
 * Función principal:
 * - runCleanupForAllTETrackers(): Recorre todos los archivos definidos en TETRACKERS_FILES_TO_PROCESS
 *   y ejecuta el proceso de limpieza y archivado en cada uno.
 *
 * Configuración del disparador:
 * - Este script puede configurarse para ejecutarse automáticamente mediante un disparador de tiempo
 *   (por ejemplo, a principios de cada mes) utilizando las herramientas de Google Apps Script.
 *
 * Autor: Mario Estrella
 * Fecha: 12-Ago-2024
 * 
 * Documentación: https://docs.google.com/document/d/1WLHninX3WpSLB8BEtO5MzTe_e7VTx5lTUIq7gmZ_wIw/edit?tab=t.0
 */

const ARCHIVE_FOLDER_ID = '1fxG5YB9GhrBUu1gycoSnUD861QY1zNLl';
const VERBOSE_LOGGING = true;

const TETRACKERS_FILES_TO_PROCESS = [
  {
    fileId: '1iWUIvA9lw8uor6TlIfH2sZT8oTZSDvlGGPhZLBpvHjQ', // TE Tracker Empalme
    sheets: [
      { sheetName: 'EXPO', dateColumnIndex: 0 },
      { sheetName: 'IMPO', dateColumnIndex: 0 }
    ]
  },
  {
    fileId: '1bkEMNvJV-cs4j8Ftz79V-3s7UcfhTnMiPoac7uMkvUQ', // TE Tracker Hermosillo
    sheets: [
      { sheetName: 'EXPO', dateColumnIndex: 1 },
      { sheetName: 'IMPO', dateColumnIndex: 0 }
    ]
  }


];

function log(message) {
  if (VERBOSE_LOGGING) {
    Logger.log(message);
  }
}

function runCleanupForAllTETrackers() {
  TETRACKERS_FILES_TO_PROCESS.forEach(file => {
    try {
      log(`Starting cleanup for file ID: ${file.fileId}`);
      archiveAndCleanUpTETracker(file.fileId, file.sheets);
    } catch (e) {
      log(`Error processing file ID ${file.fileId}: ${e.message}`);
    }
  });
  log('Cleanup process completed for all TE Trackers.');
}

function archiveAndCleanUpTETracker(fileId, sheetsToProcess) {
  try {
    const ss = SpreadsheetApp.openById(fileId);
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const originalFileName = ss.getName();
    log(`Starting archive and cleanup process for file: ${originalFileName}`);

    // Commenting out the backup creation for testing purposes
    log('Creating a backup copy of the spreadsheet...');
    const file = DriveApp.getFileById(fileId);
    const formattedDateTime = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy.MM.dd HH.mm');
    const backupFileName = `${formattedDateTime} Backup of ${originalFileName}`;
    const copy = file.makeCopy(backupFileName, DriveApp.getFolderById(ARCHIVE_FOLDER_ID));
    const copyUrl = copy.getUrl();
    log(`Created backup copy: ${backupFileName}, URL: ${copyUrl}`);

    log('Logging the backup operation in ArchiveLogs...');
    let logSheet = ss.getSheetByName('ArchiveLogs');
    if (!logSheet) {
      logSheet = ss.insertSheet('ArchiveLogs');
      logSheet.appendRow(['Date & Time', 'File Copy & Link']);
      log('Created ArchiveLogs sheet.');
    }

    logSheet.appendRow([Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'), `=HYPERLINK("${copyUrl}", "${backupFileName}")`]);
    log('Logged the backup operation in ArchiveLogs.');

    sheetsToProcess.forEach(sheetInfo => {
      const sheet = ss.getSheetByName(sheetInfo.sheetName);
      if (sheet) {
        log(`Processing sheet: ${sheetInfo.sheetName}`);
        const dateColumnIndex = sheetInfo.dateColumnIndex;

        const data = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
        const rowsToDelete = [];

        let dateSectionStarted = false;

        for (let j = 0; j < data.length; j++) {
          const cellValue = data[j][dateColumnIndex];
          const rowDate = new Date(cellValue);

          if (!dateSectionStarted) {
            if (isValidDate(rowDate)) {
              dateSectionStarted = true;
            }
          } else {
            if (!isNaN(rowDate.getTime()) && rowDate < threeMonthsAgo) {
              rowsToDelete.push(j + 1); // Store the row index to delete later
            }
          }
        }

        log(`Found ${rowsToDelete.length} rows to delete in sheet: ${sheetInfo.sheetName}.`);
        log(`Rows that would have been deleted: ${rowsToDelete.join(', ')}`);

        // Delete rows from bottom to top to avoid index shifting issues
        for (let i = rowsToDelete.length - 1; i >= 0; i--) {
          log(`Deleting row index: ${rowsToDelete[i]}`);
          sheet.deleteRow(rowsToDelete[i]);
        }

        log(`Deleted ${rowsToDelete.length} rows from sheet: ${sheetInfo.sheetName}.`);
      } else {
        log(`Sheet not found: ${sheetInfo.sheetName}. Skipping.`);
      }
    });

    log('Archive and cleanup process completed for this TE Tracker.');
  } catch (e) {
    log(`Error in archiveAndCleanUpTETracker for file ID ${fileId}: ${e.message}`);
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

function createMonthlyTrigger() {
  ScriptApp.newTrigger('runCleanupForAllTETrackers')
    .timeBased()
    .onMonthDay(1)
    .atHour(1)
    .create();
  log('Monthly trigger created to run runCleanupForAllTETrackers at the beginning of each month.');
}