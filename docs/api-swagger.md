# API REST y Swagger

TaskFlow expone la API de tareas bajo `/api/v1/tasks`.

## Requisito previo

El backend tiene que estar ejecutado:
```bash
cd server
pnpm install
.env   # define PORT, por ejemplo 3000
pnpm dev
```

En las URLs de abajo sustituye `PUERTO` por el valor de `PORT`.

## Swagger UI

Abre `http://127.0.0.1:PUERTO/api-docs` en el navegador. Ahí tienes todos los endpoints documentados con sus esquemas, y el botón "Try it out" para enviar peticiones reales al servidor sin salir del navegador. La interfaz la monta el paquete `swagger-ui-express` desde `server/src/index.js`.

## Especificación OpenAPI

La fuente principal es `server/openapi.yaml` en el repo. Desde el servidor también está disponible en dos formatos:

- `http://127.0.0.1:PUERTO/openapi.json`
- `http://127.0.0.1:PUERTO/openapi.yaml`


## Relación con el código

- Rutas HTTP: `server/src/routes/task.routes.js`
- Validación y respuestas: `server/src/controllers/task.controller.js`
- Lógica en memoria: `server/src/services/task.service.js`

## URLs de desarrollo
```
http://127.0.0.1:PUERTO/              → aplicación web
http://127.0.0.1:PUERTO/api-docs      → Swagger UI
http://127.0.0.1:PUERTO/openapi.json  → OpenAPI 3.0 (JSON)
http://127.0.0.1:PUERTO/openapi.yaml  → OpenAPI 3.0 (YAML)
http://127.0.0.1:PUERTO/api/v1/tasks  → recurso de tareas
```