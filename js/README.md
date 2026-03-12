# Estructura del código JavaScript (TaskFlow)

Organización en subcarpetas. El orden de carga en `index.html` respeta las dependencias.

## `core/` — Núcleo (estado, utilidades, persistencia)

| Archivo        | Responsabilidad |
|----------------|-----------------|
| `state.js`     | Estado global: tareas, proyectos, filtro activo, búsqueda, siguienteId. Objeto `State`. |
| `utils.js`     | Utilidades: DOM, fechas, clases CSS, escape HTML, debounce, focus trap. Objeto `Utils`. |
| `storage.js`   | Persistencia en localStorage (guardar/cargar). Objeto `Persistencia`. |

## `dominio/` — Filtros y estadísticas

| Archivo         | Responsabilidad |
|-----------------|-----------------|
| `filters.js`    | Lógica de filtrado por prioridad, fecha, proyecto, estado y búsqueda. Objeto `Filtros`. |
| `statistics.js` | Contadores del sidebar (vistas, progreso) y subtítulo. Objeto `Estadisticas`. |

## `controladores/` — Lógica de negocio

| Archivo     | Responsabilidad |
|-------------|-----------------|
| `task.js`   | CRUD de tareas: agregar, alternar hecha, eliminar, proyectos de una tarea. Objeto `TareasController`. |
| `project.js`| Crear/eliminar proyectos y contar pendientes por proyecto. Objeto `ProyectosController`. |

## `ui/` — Interfaz y modales

| Archivo             | Responsabilidad |
|---------------------|-----------------|
| `render.js`         | Pintar lista de tareas, filtros, barra de proyectos; delegación de eventos. Objeto `Render`. |
| `modal.js`          | Modal nueva tarea: formulario, flatpickr, reloj, proyectos seleccionados. Objeto `Modal`. |
| `modal-proyectos.js`| Modal para gestionar proyectos de una tarea. Objeto `ModalProyectos`. |
| `nav.js`            | Sidebar y menú móvil (vistas, abrir/cerrar). Objeto `Navegacion`. |
| `theme.js`          | Tema claro/oscuro (clase .dark, localStorage). Objeto `Tema`. |

## Entrada

| Archivo  | Responsabilidad |
|----------|-----------------|
| `../app.js` | Punto de entrada: `App.init()` orquesta carga, inicialización y primera renderización. |

---

**Convención de nombres:** variables y parámetros en español; objetos globales de módulo en PascalCase (`State`, `Utils`, `Filtros`, etc.).
