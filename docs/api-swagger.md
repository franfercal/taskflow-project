# API REST y documentación Swagger (OpenAPI)

TaskFlow expone la API de tareas bajo **`/api/v1/tasks`**. La documentación de contrato está en formato **OpenAPI 3.0** y se puede explorar con **Swagger UI** cuando el servidor Express está en marcha.

---

## Requisito

El backend debe estar ejecutándose (desde la carpeta `server/`):

```bash
cd server
pnpm install
cp .env.example .env   # define PORT, p. ej. 3000
pnpm dev
```

Sustituye `PUERTO` en las URLs siguientes por el valor de `PORT` (por defecto suele ser `3000`).

---

## Swagger UI (documentación interactiva)

**URL:** `http://127.0.0.1:PUERTO/api-docs`

Qué ofrece:

- Lista de **endpoints** (GET, POST, PATCH, DELETE) con descripción y esquemas.
- Esquemas JSON (**Task**, cuerpos de creación/actualización, respuestas de error).
- Botón **“Try it out”** para enviar peticiones reales al mismo servidor (útil en desarrollo).

La interfaz gráfica la sirve el paquete **`swagger-ui-express`**, montado en Express en `server/src/index.js`.

---

## Ficheros y endpoints de especificación

| Recurso | Ubicación / URL | Uso |
|---------|-----------------|-----|
| **Fuente YAML** | [`server/openapi.yaml`](../server/openapi.yaml) en el repo | Editar el contrato; es la fuente principal del documento. |
| **JSON en runtime** | `http://127.0.0.1:PUERTO/openapi.json` | Misma especificación con `servers[0].url` ajustado a tu `PORT` (útil para importar en Postman, Insomnia, generadores de cliente). |
| **YAML vía HTTP** | `http://127.0.0.1:PUERTO/openapi.yaml` | Descarga el YAML tal como está en disco (sin sustitución de puerto en el cuerpo). |

---

## Relación con el código

- **Rutas HTTP:** `server/src/routes/task.routes.js`
- **Validación y respuestas:** `server/src/controllers/task.controller.js`
- **Lógica en memoria:** `server/src/services/task.service.js`

Si cambias rutas o cuerpos de respuesta, actualiza **`server/openapi.yaml`** para que Swagger siga siendo fiel al comportamiento real.

---

## Ejemplos desde terminal (HTTPie)

En **[server/README.md](../server/README.md)** tienes comandos **HTTPie** con **request/response** (incluidos errores **400**, **404** y **500** con la ruta sandbox opcional).

---

## Resumen de URLs (desarrollo local)

```
http://127.0.0.1:PUERTO/              → aplicación web (estáticos)
http://127.0.0.1:PUERTO/api-docs      → Swagger UI
http://127.0.0.1:PUERTO/openapi.json  → OpenAPI 3.0 (JSON)
http://127.0.0.1:PUERTO/openapi.yaml  → OpenAPI 3.0 (YAML)
http://127.0.0.1:PUERTO/api/v1/tasks  → recurso principal de tareas
```

---

## Véase también

- [README del servidor](../server/README.md) — arranque, tabla de códigos HTTP, ejemplos HTTPie detallados.
- [README2.md](../README2.md) — arquitectura del monorepo y pipeline de middlewares Express.
