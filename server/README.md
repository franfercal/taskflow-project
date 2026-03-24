# TaskFlow — Servidor API

Backend Node.js + Express. Documentación interactiva con Swagger UI.

## Estructura del código
```
server/
├── openapi.yaml
├── .env.example
├── package.json
└── src/
    ├── index.js                       # App, middlewares, Swagger, estáticos
    ├── config/env.js                  # dotenv + validación PUERTO (PORT)
    ├── routes/
    │   ├── task.routes.js
    │   └── test-sandbox.routes.js     # Solo con ENABLE_API_TEST_ROUTES
    ├── controllers/task.controller.js
    └── services/task.service.js
```

## Arranque rápido

```bash
cd server
pnpm install
cp .env.example .env  
pnpm dev
```

Con el servidor funcionando está disponible:

- Aplicación web + API: `http://127.0.0.1:PORT/`
- Recurso tareas: `http://127.0.0.1:PORT/api/v1/tasks`
- Swagger UI: `http://127.0.0.1:PORT/api-docs`
- OpenAPI JSON: `http://127.0.0.1:PORT/openapi.json`
- OpenAPI YAML: `http://127.0.0.1:PORT/openapi.yaml`

La URL de Swagger también aparece en la consola al iniciar.

## Documentación OpenAPI

La fuente está en `server/openapi.yaml` (OpenAPI 3.0). Desde `/api-docs` puedes ver e interactuar con los endpoints directamente en el navegador.

## Convenciones de respuesta

Las respuestas exitosas devuelven JSON según la operación: `200`, `201` o `204` en DELETE por id.

Los errores siguen este patrón:

- `400` — error de validación: `{ "error": "mensaje" }`
- `404` — recurso no encontrado: `{ "error": "NOT_FOUND" }`
- `500` — error no controlado: `{ "error": "INTERNAL_SERVER_ERROR", "mensaje": "Error interno del servidor" }`