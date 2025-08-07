# CleanUpTETrackerSheets_V2

Un script de Google Apps Script para limpiar y archivar automáticamente las hojas de cálculo de seguimiento (TE Trackers), optimizando su rendimiento y manteniendo un historial de respaldos.

## Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Autores y Agradecimientos](#autores-y-agradecimientos)
- [Contacto](#contacto)

## Características

- **Automatización de Limpieza:** Elimina registros antiguos (más de 3 meses) de las hojas de cálculo para mantenerlas ágiles y eficientes.
- **Archivado Automático:** Crea copias de seguridad mensuales de las hojas de cálculo en una carpeta designada de Google Drive.
- **Registro de Operaciones:** Mantiene un registro de cada archivado en una hoja dedicada ("ArchiveLogs") dentro de la misma hoja de cálculo, con enlaces directos a los respaldos.
- **Configuración Flexible:** Permite especificar fácilmente qué archivos y hojas procesar a través de una configuración centralizada en el código.
- **Disparador Mensual:** Incluye una función para crear un disparador (trigger) que ejecuta el proceso de limpieza automáticamente el primer día de cada mes.

## Instalación

1.  **Clonar el Repositorio:**

    ```bash
    git clone https://github.com/amadonunez/CleanUpTETrackerSheets_V2.git
    cd CleanUpTETrackerSheets_V2
    ```

2.  **Instalar `clasp`:** Si no tienes `clasp` (la herramienta de línea de comandos para Apps Script), instálala globalmente:

    ```bash
    npm install -g @google/clasp
    ```

3.  **Iniciar Sesión en `clasp`:**

    ```bash
    clasp login
    ```

4.  **Subir el Proyecto a Google Apps Script:**

    ```bash
    clasp push
    ```

## Uso

1.  **Configurar el Script:**

    Abre el archivo `Code.js` y modifica las siguientes constantes para adaptarlas a tus necesidades:

    -   `ARCHIVE_FOLDER_ID`: El ID de la carpeta de Google Drive donde se guardarán las copias de seguridad.
    -   `VERBOSE_LOGGING`: Establécelo en `true` para ver registros detallados durante la ejecución.
    -   `TETRACKERS_FILES_TO_PROCESS`: Un array de objetos que define los archivos de Google Sheets a procesar. Asegúrate de que los `fileId` y los nombres de las hojas (`sheetName`) sean correctos.

2.  **Ejecución Manual:**

    Puedes ejecutar el script manualmente desde el editor de Google Apps Script seleccionando la función `runCleanupForAllTETrackers` y haciendo clic en "Ejecutar".

3.  **Configurar el Disparador Automático:**

    Para que el script se ejecute automáticamente cada mes, ejecuta la función `createMonthlyTrigger` una vez desde el editor. Esto creará un disparador que ejecutará la limpieza el primer día de cada mes.

## Estructura del Proyecto

```
.
├── appsscript.json
├── Code.js
└── README.md
```

-   **`Code.js`**: Contiene toda la lógica del script, incluyendo las funciones de archivado, limpieza y configuración.
-   **`appsscript.json`**: El manifiesto del proyecto de Apps Script, que define las dependencias y permisos necesarios.
-   **`README.md`**: La documentación del proyecto.

## Tecnologías Utilizadas

-   **Google Apps Script:** La plataforma de desarrollo para crear aplicaciones que se integran con los servicios de Google.
-   **JavaScript:** El lenguaje de programación utilizado para escribir el script.

## Contribución

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor, sigue estos pasos:

1.  **Haz un Fork** del repositorio.
2.  **Crea una nueva Rama** (`git checkout -b feature/nueva-funcionalidad`).
3.  **Haz tus Cambios** y haz commit de ellos (`git commit -m 'Añadir nueva funcionalidad'`).
4.  **Haz Push** a la rama (`git push origin feature/nueva-funcionalidad`).
5.  **Abre un Pull Request**.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## Autores y Agradecimientos

-   **Mario Estrella** - *Autor principal*

## Contacto

Para cualquier pregunta o sugerencia, por favor, abre un *issue* en este repositorio de GitHub.
