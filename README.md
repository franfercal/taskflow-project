# TaskFlow

Aplicación web para gestionar tareas y proyectos con prioridades, fechas límite y filtros. Las tareas se sincronizan con un servidor a través de una API REST.

## Qué hace

Las tareas tienen título, prioridad (Alta, Media o Baja), fecha y hora límite, y cada tarjeta muestra cuánto tiempo queda hasta que venza (o "Vencida" si ya pasó). Se pueden crear, marcar como hechas y eliminar.

Las tareas se organizan en proyectos, y puedes asignarle más de uno a la vez.

Para encontrar lo que buscas hay varios filtros: vistas por tiempo (Hoy, Esta semana, Este mes), por estado (Sin completar, Completadas), por prioridad, por proyecto y búsqueda por texto en el título.

La interfaz tiene tema claro y oscuro, guarda tu preferencia en el navegador, es responsive con sidebar colapsable en móvil y valida los formularios con mensajes de error.

## Tecnologías

En el frontend: HTML5, Tailwind CSS 4 y JavaScript vanilla con módulos. En el backend: un servidor Express minimalista. Como librerías adicionales usa Flatpickr para el selector de fecha y hora, y SweetAlert2 para los modales de confirmación.

Para desarrollo: Playwright para tests E2E y HTTPie para probar la API desde la terminal.

## Estructura del proyecto
```
taskflow-project/
├── index.html          # Página principal
├── app.js              # Punto de entrada (App.init)
├── styles/
│   ├── input.css       # Fuente de Tailwind
│   └── output.css      # CSS generado
├── js/
│   ├── api/            # Cliente HTTP
│   ├── core/           # Estado y utilidades
│   ├── dominio/        # Filtros y estadísticas
│   ├── controladores/  # Lógica de tareas y proyectos
│   └── ui/             # Renderizado, modales, navegación, tema
├── server/             # Express: API + estáticos
├── tests/              # Tests E2E (Playwright)
└── docs/               # Documentación y referencias
```

El detalle de cada módulo y su responsabilidad está en [js/README.md](js/README.md).

## Cómo empezar

Necesitas Node.js y pnpm (o npm).
```bash
git clone <url-del-repositorio>
cd taskflow-project
pnpm install
pnpm run build
cd server && pnpm install
pnpm dev
```

Abre http://localhost:3000 y ya está.

## API y documentación

Con el servidor corriendo (`cd server && pnpm dev`) tienes disponible:

- Swagger UI en `http://127.0.0.1:PUERTO/api-docs`
- OpenAPI en `/openapi.json` y `/openapi.yaml`
- Guía de uso de Swagger: [docs/api-swagger.md](docs/api-swagger.md)
- Ejemplos con HTTPie y respuestas de error: [server/README.md](server/README.md)

## Documentación ampliada

Todo está en la carpeta [docs/](docs/):

- [docs/README.md](docs/README.md) — Índice general.
- [docs/desarrollo.md](docs/desarrollo.md) — Convenciones y guía para contribuir.
- [docs/api-swagger.md](docs/api-swagger.md) — API REST y Swagger.
- [docs/testing.md](docs/testing.md) — Tests E2E con Playwright.
- [server/README.md](server/README.md) — Documentación del servidor.
- [server/PRUEBAS_API](server/PRUEBAS_API.md) — Pruebas y documentación de la API.

## Autor

Francisco J. Fernández Cala