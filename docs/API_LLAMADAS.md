# Dónde están las llamadas a la API
 
Este documento detalla en qué archivos y líneas se realizan las llamadas a la API.
 
## js/api/client.js - [js/api/client.js](js/api/client.js)
 
La línea 1 define la URL base de desarrollo en local (`http://localhost:3000/api/v1/tasks`).
 
Luego está la función `urlAPI()`, que decide a qué URL conectarse según el entorno.
 
Luego la función `peticionHttpJson()` es la función central. Es la única que llama a `fetch()`. Es la que pone las cabeceras, lee la respuesta, parsea el JSON y lanza un error si el servidor devuelve algo que no sea 2xx.
 
El objeto `TaskflowApiClient` contiene los cinco métodos de operación de la API:
 
- `listarTareas()` — hace un `GET /tasks`
- `crearTarea(cuerpo)` — hace un `POST /tasks`
- `eliminarTarea(idTarea)` — hace un `DELETE /tasks/:id`
- `actualizarTarea(idTarea, parches)` — hace un `PATCH /tasks/:id`
- `eliminarTareasCompletadas()` — hace un `DELETE /tasks/completed`
 
Luego se define `ApiTareas`, que es el alias de todo lo anterior. Es lo que importan los controladores, para no depender de `TaskflowApiClient`.

Lo demás son funnciones exportables sueltas (`fetchListarTareas`, `fetchCrearTarea`, etc.) por si se necesita usar el cliente como módulo independiente.
 
## js/controladores/task.js - [js/controladores/task.js](js/controladores/task.js)
 
Aquí es donde la interfaz llama a la API cada vez que el usuario hace algo.
 
- Línea 43: `await ApiTareas.listar()` — carga todas las tareas al iniciar
- Línea 101: `await ApiTareas.crear(cuerpo)` — crea una tarea nueva
- Línea 119: `await ApiTareas.actualizar(id, { proyectos })` — añade un proyecto a una tarea
- Línea 136: `await ApiTareas.actualizar(id, { proyectos })` — elimina un proyecto de una tarea
- Línea 151: `await ApiTareas.actualizar(id, { hecha })` — marca/desmarca una tarea como hecha
- Línea 161: `await ApiTareas.eliminar(id)` — elimina una tarea por su ID
- Línea 171: `await ApiTareas.eliminarCompletadas()` — borra todas las tareas completadas
 
## js/controladores/project.js - [js/controladores/project.js](js/controladores/project.js)
 
Solo hay una llamada a la API. `ApiTareas.actualizar(tarea.id, {...})`. Se ejecuta cuando se renombra o elimina un proyecto, porque hay que actualizar todas las tareas que lo tenían asignado.
 
## Lado del servidor
 
### server/src/routes/task.routes.js - [server/src/routes/task.routes.js](server/src/routes/task.routes.js)
 
Aquí se registran los cinco endpoints de tareas:
 
- Línea 9: `GET /` → `listarTareas`
- Línea 12: `POST /` → `crearTarea`
- Línea 15: `DELETE /completed` → `eliminarTodasCompletadas`
- Línea 18: `PATCH /:id` → `actualizarTarea`
- Línea 21: `DELETE /:id` → `eliminarTarea`
 
### server/src/index.js - [server/src/index.js](server/src/index.js)
 
- Registro condicional de las rutas de prueba del sandbox, solo si `ENABLE_API_TEST_ROUTES=true`
- `aplicacion.use("/api/v1/tasks", rutasTareas)` — monta todas las rutas de tareas
- Swagger UI en `/api-docs`, el esquema en `/openapi.json` y el YAML en `/openapi.yaml`
 
### server/src/routes/test-sandbox.routes.js [server/src/routes/test-sandbox.routes.js](server/src/routes/test-sandbox.routes.js)
 
Hay un único endpoint: `GET /_sandbox/force-500`. Solo existe para pruebas, fuerza un error 500 a propósito y solo está activo si se pone `ENABLE_API_TEST_ROUTES=true` en el `.env`.
 
## Flujo de una petición
 
Cuando el usuario hace algo en la interfaz, el controlador llama a `ApiTareas`, que delega en `TaskflowApiClient`, que ejecuta `peticionHttpJson()` con `fetch()`. Esa petición llega al servidor, donde `task.routes.js` la enruta al método correspondiente de `task.controller.js`, que valida los datos y llama a `task.service.js`, que es donde realmente se leen o modifican las tareas.