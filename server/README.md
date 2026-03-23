# TaskFlow — Servidor API (Express)

Backend **Node.js + Express** que expone la API REST de tareas, sirve el frontend estático del monorepo y ofrece **documentación interactiva con Swagger UI**.

---

## Arranque rápido

```bash
cd server
pnpm install
cp .env.example .env   # edita PORT si hace falta
pnpm dev
```

- **Aplicación web + API (mismo origen):** `http://127.0.0.1:PORT/`
- **Recurso tareas:** `http://127.0.0.1:PORT/api/v1/tasks`
- **Swagger UI:** `http://127.0.0.1:PORT/api-docs`
- **Especificación OpenAPI (JSON dinámico):** `http://127.0.0.1:PORT/openapi.json`
- **Especificación YAML estática:** `http://127.0.0.1:PORT/openapi.yaml` (fichero `server/openapi.yaml`)

---

## Documentación OpenAPI (Swagger)

| Recurso | Descripción |
|---------|-------------|
| `server/openapi.yaml` | Fuente **OpenAPI 3.0**
| `/api-docs` | **Swagger UI**
| `/openapi.json`

Al iniciar, la consola imprime la URL de Swagger.



## Convenciones de respuesta

- **Éxito:** cuerpo JSON según operación (`200`, `201`, `204` en DELETE por id).
- **400:** validación del controlador → `{ "error": "mensaje en español" }`.
- **404:** recurso inexistente → `{ "error": "NOT_FOUND" }` (y en algunos flujos del middleware, también `mensaje`).
- **500:** error no controlado → `{ "error": "INTERNAL_SERVER_ERROR", "mensaje": "Error interno del servidor" }`.

---

## Ejemplos HTTPie (request → response)

Los siguientes comandos usan la sintaxis de **[HTTPie](https://httpie.io/)** (`http` / `https`). Sustituye el puerto si no usas `3000`.

### Variables útiles (bash)

```bash
export HOST=http://127.0.0.1:3000
export API=$HOST/api/v1/tasks
```

---

### GET listar — éxito `200`

**Request**

```bash
http GET "$API" Accept:application/json
```

**Response (ejemplo)**

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
[
  {
    "id": 1,
    "titulo": "Ejemplo",
    "proyectos": ["Demo"],
    "prioridad": "media",
    "fecha": "Sin fecha",
    "hecha": false
  }
]
```

---

### POST crear — éxito `201`

**Request**

```bash
http POST "$API" \
  Content-Type:application/json \
  titulo="Tarea HTTPie" \
  proyectos:='["API","Docs"]' \
  prioridad=alta \
  fecha="2026-06-01" \
  hecha:=false
```

**Response (ejemplo)**

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "id": 2,
  "titulo": "Tarea HTTPie",
  "proyectos": ["API", "Docs"],
  "prioridad": "alta",
  "fecha": "2026-06-01",
  "hecha": false
}
```

---

### POST crear — error validación **`400`** (título vacío)

**Request**

```bash
printf '%s' '{"titulo":"   ","prioridad":"media"}' \
  | http POST "$API" Content-Type:application/json
```

**Response (ejemplo)**

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
  "error": "El campo titulo no puede estar vacío"
}
```

---

### POST crear — error validación **`400`** (prioridad inválida)

**Request**

```bash
printf '%s' '{"titulo":"Test","prioridad":"urgente"}' \
  | http POST "$API" Content-Type:application/json
```

**Response (ejemplo)**

```json
{
  "error": "El campo prioridad debe ser alta, media o baja"
}
```

---

### PATCH actualizar — error **`404`** (id inexistente)

**Request**

```bash
printf '%s' '{"hecha":true}' \
  | http PATCH "$API/999999" Content-Type:application/json
```

**Response (ejemplo)**

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "error": "NOT_FOUND"
}
```

---

### PATCH actualizar — error **`400`** (campo no permitido)

**Request**

```bash
printf '%s' '{"id":1,"hecha":true}' \
  | http PATCH "$API/1" Content-Type:application/json
```

**Response (ejemplo)**

```json
{
  "error": "Campo no permitido: id"
}
```

---

### DELETE por id — éxito **`204`**

**Request**

```bash
http DELETE "$API/1"
```

**Response (ejemplo)**

```http
HTTP/1.1 204 No Content
```

(cuerpo vacío)

---

### DELETE por id — error **`404`**

**Request**

```bash
http DELETE "$API/999999"
```

**Response (ejemplo)**

```json
{
  "error": "NOT_FOUND"
}
```

---

### DELETE completadas — éxito `200`

**Request**

```bash
http DELETE "$HOST/api/v1/tasks/completed" Accept:application/json
```

**Response (ejemplo)**

```json
{
  "eliminadas": 0
}
```

---

### Forzar error **`500`** (sandbox, solo desarrollo)

1. En `server/.env` añade:

   ```env
   ENABLE_API_TEST_ROUTES=true
   ```

2. Reinicia el servidor.

3. **Request**

   ```bash
   http GET "$HOST/api/v1/_sandbox/force-500" Accept:application/json
   ```

4. **Response (ejemplo)**

   ```http
   HTTP/1.1 500 Internal Server Error
   Content-Type: application/json
   ```

   ```json
   {
     "error": "INTERNAL_SERVER_ERROR",
     "mensaje": "Error interno del servidor"
   }
   ```

## Estructura del código

```
server/
├── openapi.yaml              # Especificación OpenAPI 3.0 (Swagger)
├── .env.example
├── package.json
└── src/
    ├── index.js              # App, middlewares, Swagger, estáticos
    ├── config/env.js         # dotenv + validación PORT
    ├── routes/
    │   ├── task.routes.js
    │   └── test-sandbox.routes.js   # Solo con ENABLE_API_TEST_ROUTES
    ├── controllers/task.controller.js
    └── services/task.service.js
```


## Referencias

- [README del monorepo](../README.md)
