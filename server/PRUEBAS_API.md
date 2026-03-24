# TaskFlow — API REST: Pruebas con HTTPie


## Herramientas

- OpenAPI JSON (URL del servidor al arrancar): `GET /openapi.json`
- OpenAPI YAML: `GET /openapi.yaml`
- Swagger UI: `GET /api-docs`
- Fuente en el repositorio: `server/openapi.yaml`

HTTPie se instala como paquete `httpie` en la mayoría de distribuciones Linux.


## Modelo Task

- `id` — entero, solo aparece en respuestas.
- `titulo` — string, obligatorio al crear, no puede estar vacío ni ser solo espacios.
- `proyectos` — array de strings, opcional.
- `prioridad` — `alta`, `media` o `baja`. Por defecto `media`.
- `fecha` — string, opcional. Si se omite el servidor guarda `"Sin fecha"`
- `hecha` — boolean, por defecto `false`

En PATCH solo se aceptan las claves `titulo`, `prioridad`, `proyectos`, `fecha` y `hecha`. Otra devuelve 400.

## Endpoints

`GET /api/v1/tasks` — devuelve array de tareas. Responde 200.

`POST /api/v1/tasks` — crea una tarea. Responde 201 con la tarea creada, o 400 si hay error de validación.

`PATCH /api/v1/tasks/:id` — actualización parcial. Responde 200, 400 si hay campo inválido o id no numérico, 404 si el id no existe.

`DELETE /api/v1/tasks/:id` — elimina una tarea. Responde 204, 400 si el id no es numérico, 404 si no existe.

`DELETE /api/v1/tasks/completed` — elimina todas las completadas. Responde 200 con `{ "eliminadas": n }`.

`GET /api/v1/_sandbox/force-500` — solo disponible con `ENABLE_API_TEST_ROUTES=true`.


## Mensajes 400

Mensajes devueltos por `task.controller.js`:

- `El cuerpo de la petición es obligatorio` — POST/PATCH sin cuerpo
- `El cuerpo debe ser un objeto JSON` — cuerpo que no es un objeto
- `El campo titulo debe ser una cadena de texto` — `titulo` ausente o tipo incorrecto en POST
- `El campo titulo no puede estar vacío` — `titulo` vacío o solo espacios
- `El campo prioridad debe ser una cadena (alta, media o baja)` — `prioridad` presente pero no es string
- `El campo prioridad debe ser alta, media o baja` — string inválida
- `El campo proyectos debe ser un array de cadenas` — `proyectos` no es array
- `Cada elemento de proyectos debe ser una cadena de texto` — elemento del array no string
- `El campo fecha debe ser una cadena de texto` — `fecha` no string
- `El campo hecha debe ser un valor booleano (true o false)` — `hecha` presente y no boolean
- `El identificador debe ser un número válido` — `:id` no numérico en PATCH/DELETE
- `Campo no permitido: <clave>` — PATCH con clave fuera de la lista permitida
- `Envía al menos un campo a actualizar` — PATCH con objeto vacío

## Pruebas

Las pruebas se ejecutaron contra una instancia en el puerto 3000 con datos ya presentes en memoria. Si repites los comandos sobre una base vacía, ajusta los ids según tu lista (`GET /api/v1/tasks`).


## HTTPie
```bash
export BASE=http://127.0.0.1:3000
```

### Lecturas
```bash
http --ignore-stdin --print=HhBb GET "$BASE/api/v1/tasks"
# 200, array JSON de tareas

http --ignore-stdin --print=H GET "$BASE/openapi.json"
# 200
```

### POST — crear tarea
```bash
# Creación mínima válida — 201
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"Solo titulo"'
# proyectos: [], prioridad: "media", fecha: "Sin fecha"

# Creación completa — 201
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" \
  titulo:='"Full"' prioridad:='"baja"' proyectos:='["A","B"]' fecha:='"2026-01-02"' hecha:=true

# Sin titulo — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" prioridad:='"media"'
# {"error":"El campo titulo debe ser una cadena de texto"}

# titulo vacío — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='""'
# {"error":"El campo titulo no puede estar vacío"}

# titulo solo espacios — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"   "'

# titulo numérico — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:=123
# {"error":"El campo titulo debe ser una cadena de texto"}

# Sin cuerpo — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks"
# {"error":"El cuerpo de la petición es obligatorio"}

# Cuerpo array raíz — 400 (sin --ignore-stdin, cuerpo por stdin)
echo '[]' | http --print=HhBb POST "$BASE/api/v1/tasks"
# {"error":"El cuerpo debe ser un objeto JSON"}

# prioridad numérica — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"x"' prioridad:=1
# {"error":"El campo prioridad debe ser una cadena (alta, media o baja)"}

# prioridad texto inválido — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"x"' prioridad:='"urgente"'
# {"error":"El campo prioridad debe ser alta, media o baja"}

# proyectos no array — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"x"' proyectos:='"uno"'
# {"error":"El campo proyectos debe ser un array de cadenas"}

# proyectos con no-strings — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"x"' proyectos:='[1,2]'
# {"error":"Cada elemento de proyectos debe ser una cadena de texto"}

# fecha no string — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"x"' fecha:=2026
# {"error":"El campo fecha debe ser una cadena de texto"}

# hecha no boolean — 400
http --ignore-stdin --print=HhBb POST "$BASE/api/v1/tasks" titulo:='"x"' hecha:='"true"'
# {"error":"El campo hecha debe ser un valor booleano (true o false)"}
```

### DELETE /api/v1/tasks/completed
```bash
http --ignore-stdin --print=HhBb DELETE "$BASE/api/v1/tasks/completed"
# 200, {"eliminadas":1} si había completadas, {"eliminadas":0} si no
```

### PATCH — actualizar tarea

Sustituye `1` por un id existente en tu lista.
```bash
# Actualizar hecha — 200
http --ignore-stdin --print=HhBb PATCH "$BASE/api/v1/tasks/1" hecha:=true

# Campo prohibido — 400
http --ignore-stdin --print=HhBb PATCH "$BASE/api/v1/tasks/1" foo:='"bar"'
# {"error":"Campo no permitido: foo"}

# Sin cuerpo — 400
http --ignore-stdin --print=HhBb PATCH "$BASE/api/v1/tasks/1"
# {"error":"El cuerpo de la petición es obligatorio"}

# titulo vacío — 400
http --ignore-stdin --print=HhBb PATCH "$BASE/api/v1/tasks/1" titulo:='""'
# {"error":"El campo titulo no puede estar vacío"}

# id no numérico — 400
http --ignore-stdin --print=HhBb PATCH "$BASE/api/v1/tasks/xyz" hecha:=true
# {"error":"El identificador debe ser un número válido"}

# Id inexistente — 404
http --ignore-stdin --print=HhBb PATCH "$BASE/api/v1/tasks/999998" hecha:=false
# {"error":"NOT_FOUND"}

# Cuerpo array raíz — 400
echo '[]' | http --print=HhBb PATCH "$BASE/api/v1/tasks/1"
# {"error":"El cuerpo debe ser un objeto JSON"}

# prioridad inválida — 400
http --ignore-stdin --print=HhBb PATCH "$BASE/api/v1/tasks/2" 'prioridad:="x"'
# {"error":"El campo prioridad debe ser alta, media o baja"}
```

### DELETE — eliminar tarea
```bash
# Borrado OK — 204
http --ignore-stdin --print=HhBb DELETE "$BASE/api/v1/tasks/1"

# Id no numérico — 400
http --ignore-stdin --print=HhBb DELETE "$BASE/api/v1/tasks/nan"
# {"error":"El identificador debe ser un número válido"}

# Id inexistente — 404
http --ignore-stdin --print=HhBb DELETE "$BASE/api/v1/tasks/999997"
# {"error":"NOT_FOUND"}
```

### Sandbox 500

Sin `ENABLE_API_TEST_ROUTES`:
```bash
http --ignore-stdin --print=HhBb GET "$BASE/api/v1/_sandbox/force-500"
# 404, HTML de Express
```

Con la variable activa (ejemplo en puerto 3001):
```bash
cd server && ENABLE_API_TEST_ROUTES=true PORT=3001 node src/index.js
```
```bash
http --ignore-stdin --print=HhBb GET http://127.0.0.1:3001/api/v1/_sandbox/force-500
# 500, {"error":"INTERNAL_SERVER_ERROR","mensaje":"Error interno del servidor"}
```


## Códigos HTTP

- `200` — GET tareas, GET openapi.json, DELETE.
- `201` — POST crear tarea válida.
- `204` — DELETE tarea existente.
- `400` — validación POST/PATCH, id no numérico.
- `404` — id inexistente, sandbox sin activar.
- `500` — sandbox con `ENABLE_API_TEST_ROUTES=true`.

## Referencias

- `server/openapi.yaml` — OpenAPI 3.
- `server/src/index.js` — rutas, Swagger, middleware, montaje sandbox.
- `server/src/controllers/task.controller.js` — validación y mensajes 400.
- `server/src/services/task.service.js` — persistencia en memoria y valores por defecto.
- `docs/api-swagger.md` — uso de Swagger UI.