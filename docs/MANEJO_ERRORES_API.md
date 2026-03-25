# Seguimiento y manejo de errores

Esto documenta dónde y cómo se gestionan los errores en el proyecto.

## js/api/client.js — [js/api/client.js](js/api/client.js)

Llíneas 36–40 cubre el caso de que el servidor devuelva algo que no es JSON válido. El `catch` lo captura y lo convierte en un objeto `{ error: textoCuerpo }`.

Las líneas 43–50 manejan las respuestas HTTP que no son 2xx. Se hace un objeto `Error` con el mensaje que haya en `datosParseados.mensaje` o `datosParseados.error`, o como fallback el `statusText` del navegador. Antes de lanzarlo se le adjunta el código HTTP con `errorRed.status = respuesta.status`, para saber si es un 404, un 500, etc.

## js/controladores/project.js — [js/controladores/project.js](js/controladores/project.js)

Las líneas 52–58 manejan el caso de que falle la actualización de las tareas al renombrar o eliminar un proyecto. El `catch` imprime el error con `console.error`. Muestra un modal con SweetAlert2 con el título "Error al sincronizar".

## server/src/services/task.service.js — [server/src/services/task.service.js](server/src/services/task.service.js)

Las líneas 60 y 65 están dentro de `eliminarTarea()`. Si el ID no es un número válido o no existe ninguna tarea con ese ID, se muestra `new Error('NOT_FOUND')`.

Las líneas 75 y 79 hacen lo mismo pero en `actualizarTarea()`.

## server/src/controllers/task.controller.js — [server/src/controllers/task.controller.js](server/src/controllers/task.controller.js)

Las líneas 91–96 están en `eliminarTarea()`. El `catch` comprueba si el error es `NOT_FOUND` y responde con 404.

Las líneas 183–188 hacen exactamente lo mismo pero en `actualizarTarea()`.

El resto del controlador son validaciones de campos que devuelven 400 directamente. Están repartidas en las líneas 14, 19, 24, 29, 35, 39, 46, 52, 60, 66, 79, 85, 110, 116, 120, 127, 133, 139, 143, 150, 157, 162, 170 y 176.

## server/src/index.js — Middleware global de errores

Las líneas 90–108 definen `manejadorErrores`. Cualquier error que no haya sido capturado antes llega aquí. Si el mensaje del error coincide con alguno de los errores, como `NOT_FOUND`, responde con su código y cuerpo definido. Si no lo reconoce, imprime en consola un mensaje y devuelve un 500.

La línea 110 registra ese middleware al final de toda la cadena con `aplicacion.use(manejadorErrores)`.

Las líneas 38–39 si no se puede leer `openapi.yaml` al arrancar, se imprime el problema en consola y Swagger UI se deshabilita, pero el servidor sigue funcionando con normalidad.