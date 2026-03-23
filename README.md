# TaskFlow

Aplicación web para **gestionar tareas y proyectos**: prioridades, fechas límite, filtros por vista y por proyecto; las **tareas** persisten en el **servidor** (API).
---

## Características

- **Tareas**: crear, marcar como hecha/pendiente y eliminar. Título, prioridad (Alta, Media, Baja), fecha y hora límite, y **tiempo restante** visible en cada tarjeta.
- **Proyectos**: organizar tareas en varios proyectos; una tarea puede pertenecer a varios. Crear y eliminar proyectos desde el sidebar o al crear una tarea.
- **Vistas y filtros**: Todas, Hoy, Esta semana, Este mes, Sin completar, Completadas; filtro por prioridad (chips) y por proyecto; búsqueda por texto en el título.
- **Fecha y hora**: selector de fecha (Flatpickr) y reloj para la hora; cada tarjeta muestra días/horas restantes hasta la fecha límite (o "Vencida" si ya pasó).
- **Interfaz**: tema claro por defecto; claro/oscuro con preferencia guardada en el navegador (`localStorage`), diseño responsive con sidebar colapsable en móvil, validación de formularios con mensajes de error.
- **Red**: capa `js/api/client.js` (`TaskflowApiClient` / `ApiTareas`) hacia `/api/v1/tasks`. Arranca el backend en `server/` para usar la app.

---

## Tecnologías

- **Frontend**: HTML5, CSS (Tailwind CSS 4), JavaScript (vanilla, módulos vía scripts).
- **Dependencias de interfaz**: [Flatpickr](https://flatpickr.js.org/) (selector de fecha).
- **Herramientas**: Tailwind CLI (estilos), Playwright (tests E2E en navegador).

---

## Estructura del proyecto

```
taskflow-project/
├── index.html          # Página única; carga de estilos y scripts
├── app.js              # Punto de entrada (App.init)
├── styles/
│   ├── input.css       # Fuente de Tailwind
│   └── output.css      # CSS generado (no editar a mano)
├── js/
│   ├── api/            # Cliente HTTP (client.js)
│   ├── core/           # Estado y utilidades
│   ├── dominio/        # Filtros y estadísticas
│   ├── controladores/  # Lógica de tareas y proyectos
│   └── ui/             # Renderizado, modales, navegación, tema
├── server/             # Express: API + estáticos (opcional en tu despliegue)
├── tests/              # Tests E2E (Playwright)
└── docs/               # Documentación y referencias
```

Detalle de módulos y responsabilidades: **[js/README.md](js/README.md)**.

## Cómo empezar

### Requisitos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [pnpm](https://pnpm.io/) (o npm)

## Ejemplos de uso

### Ejemplo 1: Primera puesta en marcha

Clonar, instalar dependencias, generar estilos y abrir la app en el navegador:

```bash
git clone <url-del-repositorio>
cd taskflow-project
pnpm install
pnpm run build
pnpm run serve
```

Abre **http://localhost:3000** y ya puedes crear tareas, proyectos y usar los filtros.

## API REST y Swagger

Con el servidor en marcha (`cd server && pnpm dev`):

- **Swagger UI (documentación interactiva):** `http://127.0.0.1:PUERTO/api-docs`
- **OpenAPI JSON:** `/openapi.json` · **YAML:** `/openapi.yaml`
- **Guía Swagger en `docs/`:** **[docs/api-swagger.md](docs/api-swagger.md)** (URLs, OpenAPI, “Try it out”).
- **Guía con ejemplos HTTPie** (request/response, errores 400/404/500): **[server/README.md](server/README.md)**
- **Arquitectura ampliada del monorepo:** **[README2.md](README2.md)**

---

## Documentación del proyecto

En la carpeta **[docs/](docs/)** tienes la documentación ampliada:

- **[docs/README.md](docs/README.md)** — Índice de toda la documentación.
- **[docs/arquitectura.md](docs/arquitectura.md)** — Modelo de datos, flujo de la app y orden de carga.
- **[docs/guia-usuario.md](docs/guia-usuario.md)** — Cómo usar la aplicación (tareas, proyectos, filtros, tema).
- **[docs/desarrollo.md](docs/desarrollo.md)** — Convenciones de código y guía para contribuir.
- **[docs/testing.md](docs/testing.md)** — Tests E2E con Playwright.

## Autor

Francisco J. Fernández Cala
