# Estructura del código JavaScript

El código está dividido en subcarpetas según lo que hace cada parte.


## `core/` — Base de todo

Aquí está el estado global y las utilidades que usa la app.

- **`state.js`** — Guarda todo el estado de la aplicación: las tareas, los proyectos, el filtro activo, la búsqueda, el siguiente ID disponible y si el servidor es alcanzable.
- **`utils.js`** — Manipulación del DOM, formateo de fechas, clases CSS, escape de HTML, debounce y focus trap.


## `api/` — Comunicación con el servidor

Toda la lógica de red para no mezclarla con la UI.

- **`client.js`** — Se encarga de las peticiones asíncronas con `fetch`. Define `TaskflowApiClient` (con el alias `ApiTareas`) y funciones como `fetchListarTareas`. Por defecto apunta a `http://localhost:3000/api/v1/tasks`.


## `dominio/` — Reglas

Aquí está la lógica que decide qué tareas mostrar y qué números aparecen en la interfaz.

- **`filters.js`** — Filtra las tareas por prioridad, fecha, proyecto, estado y búsqueda. Objeto `Filtros`.
- **`statistics.js`** — Calcula los contadores del sidebar (vistas y progreso) y el subtítulo dinámico. Objeto `Estadisticas`.


## `controladores/` — Acciones del usuario

Se procesa lo que el usuario hace.

- **`task.js`** — CRUD completo de tareas a través de la API. Objeto `TareasController`.
- **`project.js`** — Crear y eliminar proyectos, además de contar cuántas tareas pendientes tiene cada uno. Objeto `ProyectosController`.


## `ui/` — Todo lo visual

Lo que el usuario ve y con lo que interactúa.

- **`render.js`** — Hace la lista de tareas, los filtros y la barra de proyectos. También maneja la delegación de eventos. Objeto `Render`.
- **`modal.js`** — El modal de nueva tarea. Objeto `Modal`.
- **`modal-proyectos.js`** — Modal específico para gestionar los proyectos asociados a una tarea. Objeto `ModalProyectos`.
- **`nav.js`** — Sidebar y menú móvil. Objeto `Navegacion`.
- **`theme.js`** — Tema claro por defecto, con soporte para modo oscuro via clase `.dark` en `<html>`. Objeto `Tema`.


## Punto de entrada

- **`../app.js`** — punto de inicio. `App.init()` inicializa los módulos y la primera renderización.