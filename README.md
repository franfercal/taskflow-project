# TaskFlow

Aplicación web para gestionar tareas y proyectos con prioridades, fechas límite y filtros. Las tareas se sincronizan con un servidor a través de una API REST.

## Qué hace

Las tareas tienen título, prioridad (Alta, Media o Baja), fecha y hora límite, y cada tarjeta muestra cuánto tiempo queda hasta que venza (o "Vencida" si ya pasó). Se pueden crear, marcar como hechas y eliminar.

Las tareas se organizan en proyectos, y puedes asignarle más de uno a la vez.

Para encontrar lo que buscas hay varios filtros: vistas por tiempo (Hoy, Esta semana, Este mes), por estado (Sin completar, Completadas), por prioridad, por proyecto y búsqueda por texto en el título.

La interfaz tiene tema claro y oscuro, guarda tu preferencia en el navegador, es responsive con sidebar colapsable en móvil y valida los formularios con mensajes de error.

## Cómo está organizado el código
 
El cliente HTTP está en `js/api/client.js`. Es el archivo que construye las peticiones y convierte la respuesta a JSON. Se compone de una función central 'peticionHttpson' ejecuta el 'fetch'. La función 'TaskflowApiClient' tiene los cinco mñtodos que se usan en la app. Luego se hace un alias `ApiTareas` para el controlador de taress.
 
Los controladores están en `js/controladores/`. `task.js`. Es el que llama a la API cada vez que el usuario hace algo.
`project.js` también usa la API cuando hay que renombrar o eliminar un proyecto.
 
El backend es un servidor Express en `server/src/`. Tiene tres capas: las rutas en `routes/task.routes.js` definen los endpoints, el controlador en `controllers/task.controller.js` que valida los datos, y el servicio en `services/task.service.js` que es donde se manipulan las tareas (en memoria, sin base de datos).
 
Los endpoints disponibles son:
 
- `GET /api/v1/tasks` para listar todas las tareas
- `POST /api/v1/tasks` para crear una
- `PATCH /api/v1/tasks/:id` para actualizar campos concretos
- `DELETE /api/v1/tasks/:id` para eliminar una
- `DELETE /api/v1/tasks/completed` para eliminar todas las completadas de golpe
 
Hay un endpoint extra `/_sandbox/force-500` que solo se activa si pones `ENABLE_API_TEST_ROUTES=true` en el `.env`, sirve para probar que el manejo de errores funciona bien.

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
git clone <https://github.com/franfercal/taskflow-project.git>
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
- Manejos de errores API: [docs/MANEJO_ERRORES_API.md](docs/MANEJO_ERRORES_API.md)
- LLamadas de la API: [docs/API_LLAMADAS.md](docs/API_LLAMADAS.md)

## Documentación ampliada

Todo está en la carpeta [docs/](docs/):

- [docs/README.md](docs/README.md) — Índice general.
- [docs/desarrollo.md](docs/desarrollo.md) — Convenciones y guía para contribuir.
- [docs/api-swagger.md](docs/api-swagger.md) — API REST y Swagger.
- [docs/testing.md](docs/testing.md) — Tests E2E con Playwright.
- [docs/README_VERCEL.md](docs/README_VERCEL.md) — Cambios realizados para despliegue en Vercel.
- [server/README.md](server/README.md) — Documentación del servidor.
- [server/PRUEBAS_API](server/PRUEBAS_API.md) — Pruebas y documentación de la API.


## Autor

Francisco J. Fernández Cala