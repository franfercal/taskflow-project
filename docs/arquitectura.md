# Arquitectura de TaskFlow

Visión técnica de cómo está construida la aplicación: modelo de datos, flujo de ejecución, orden de carga y referencias del DOM.

---

## Modelo de datos

### Estado global (`State`)

Todo el estado vive en el objeto global `State` (en `js/core/state.js`):

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `tareas` | `Array` | Lista de objetos tarea. |
| `proyectos` | `Array<string>` | Nombres de proyectos (por defecto: Desarrollo Web, FrontEnd, BackEnd, JS, Python). |
| `filtroActivo` | `string` | Vista/filtro actual: `"todas"`, `"hoy"`, `"semana"`, `"mes"`, `"pendientes"`, `"completadas-vista"`, `"alta"`/`"media"`/`"baja"`, o nombre de proyecto. |
| `busqueda` | `string` | Texto del buscador; se combina con el filtro para filtrar por título. |
| `siguienteId` | `number` | Siguiente ID numérico para nuevas tareas (auto-incremento). |
| `servidorAlcanzable` | `boolean` | Indica si la última petición a la API respondió bien; si al arrancar falla, la lista queda vacía en memoria (sin copia local en el navegador). |
| `SIN_FECHA` | `string` | Constante `"Sin fecha"` cuando la tarea no tiene fecha límite. |

- `State.proyectosDeTarea(tarea)` devuelve el array de nombres de proyectos de una tarea (soporta legacy `proyecto` string).
- `State.existeProyecto(nombre)` indica si ya existe un proyecto con ese nombre.

### Objeto tarea

Cada elemento de `State.tareas` tiene esta forma:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador único. |
| `titulo` | `string` | Título de la tarea. |
| `proyectos` | `string[]` | Nombres de proyectos a los que pertenece (una tarea puede estar en varios). |
| `prioridad` | `string` | `"Alta"`, `"Media"` o `"Baja"`. |
| `fecha` | `string` | Fecha límite en formato ISO (YYYY-MM-DD) o `State.SIN_FECHA`. |
| `hora` | `string` | Hora límite (ej. `"14:30"`) o vacío. |
| `hecha` | `boolean` | Si está completada o no. |

### Persistencia

- **Servidor (API REST)**: las **tareas** se crean, listan, actualizan y eliminan vía `fetch` contra `/api/v1/tasks` (implementación en `js/api/client.js`: `TaskflowApiClient` y alias `ApiTareas`). El backend (Express en `server/`) mantiene los datos en memoria mientras el proceso siga en ejecución.
- **Proyectos en el cliente**: la lista `State.proyectos` vive solo en memoria en esta sesión; no se persiste en el servidor salvo que se amplíe la API.
- **Tema**: por defecto **claro**; la elección del usuario se guarda en **localStorage** (`taskflow_tema_preferido`: `claro` u `oscuro`) y se aplica en la siguiente visita (clase `dark` en `<html>`).
- El cliente puede seguir recibiendo tareas con el campo legacy `proyecto` (string); `State.proyectosDeTarea` normaliza a `proyectos[]`.

---

## Flujo de la aplicación

### Arranque (`App.init()` en `app.js`)

1. **Sincronizar con el servidor**: `TareasController.sincronizarConServidorAlInicio()` llama a la API (`ApiTareas.listar()`); si tiene éxito, rellena `State.tareas` y ajusta `siguienteId` y `servidorAlcanzable`. Si falla, deja la lista vacía y `servidorAlcanzable` en `false`.
2. **Configuración**: se muestra la fecha actual en el header y se inicializa el tema (`Tema.init()`).
3. **Inicialización de módulos**: `Modal.init()`, `ModalProyectos.init()`, `Navegacion.init()`, `Render.init()`, `Filtros.init()` (registran listeners y preparan UI).
4. **Primera renderización**: `Render.renderizarFiltros()`, `Render.renderizarProyectosLateral()`, `Render.renderizarTareas()`.
5. **Toast de bienvenida**: se muestra el número de tareas pendientes (o mensaje de “sin pendientes”) y se oculta a los 3 s o al cerrar.

### Flujo típico al crear/editar una tarea

1. Usuario hace clic en “Nueva tarea” → se abre el modal (`Modal`).
2. Rellena título, proyectos, prioridad, fecha/hora y guarda.
3. `TareasController` envía la tarea a la API (`crear`), actualiza `State.tareas` y `siguienteId` con la respuesta del servidor.
4. `Render.renderizarTareas()` (y filtros/proyectos si aplica) actualiza la lista y el sidebar.

Los filtros y la búsqueda no modifican `State.tareas`; solo cambian `State.filtroActivo` y `State.busqueda`. La lista visible se obtiene aplicando `Filtros` (dominio) sobre `State.tareas` y pintando el resultado en `Render`.

---

## Orden de carga de scripts

El orden en `index.html` respeta dependencias (los módulos usan objetos globales definidos en scripts anteriores):

1. **Flatpickr** y **SweetAlert2** (CDN) — fecha y diálogos.
2. **Core**: `state.js` → `utils.js`.
3. **Red**: `js/api/client.js` (`TaskflowApiClient`, `ApiTareas`).
4. **Dominio**: `filters.js`.
5. **Controladores**: `task.js` → `project.js`.
6. **Dominio**: `statistics.js`.
7. **UI**: `modal-proyectos.js` → `render.js` → `modal.js` → `nav.js` → `theme.js`.
8. **Entrada**: `app.js`.

No hay sistema de módulos ES; todo son scripts en el global, con objetos como `State`, `Utils`, `ApiTareas`, `TaskflowApiClient`, `Filtros`, `TareasController`, `ProyectosController`, `Estadisticas`, `Modal`, `ModalProyectos`, `Render`, `Navegacion`, `Tema`.

---

## IDs del DOM (referencia rápida)

- **Cabecera**: `fecha-actual`, `btn-tema`, `btn-menu`.
- **Sidebar**: `sidebar`, `nav-proyectos`; contadores de vistas: `cnt-todas`, `cnt-hoy`, `cnt-semana`, `cnt-mes`, `cnt-pendientes`, `cnt-completadas`; progreso: `est-completadas`, `est-pendientes`.
- **Área principal**: `subtitle-pendientes`, `input-busqueda`, `filters`, `task-list`.
- **Modal nueva tarea**: `modal-backdrop`, `modal-nueva-tarea`, `btn-close-modal`, `field-titulo`, `error-titulo`, `field-proyecto`, `btn-anadir-proyecto-modal`, `modal-proyectos-seleccionados`, `field-prioridad`, `field-nuevo-proyecto`, `field-nombre-proyecto`, `btn-confirmar-proyecto`, `field-fecha-dia`, `field-fecha-hora`, `reloj-display`, `reloj-popover`, `btn-cancelar-modal`, `btn-guardar-tarea`.
- **Modal proyectos de tarea**: `modal-proyectos-backdrop`, `modal-proyectos-dialog`, `btn-close-modal-proyectos`, `modal-proyectos-chips`, `modal-proyectos-select`, `btn-anadir-proyecto-tarea`, `btn-cerrar-modal-proyectos`.
- **Toast bienvenida**: `welcome-toast`, `welcome-toast-msg`, `welcome-toast-icon`, `welcome-toast-close`.

Los elementos de la lista de tareas y del menú de proyectos se generan dinámicamente; los listeners se asignan por delegación de eventos en los contenedores (`task-list`, `nav-proyectos`, etc.).
