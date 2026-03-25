# Despliegue en Vercel

Resumen de los cambios introducidos en el repositorio para publicar TaskFlow en Vercel. La interfaz y la API Express tienen en el mismo punto de inicio que en el desarrollo local.

## Enfoque técnico

Vercel ejecuta las Serverless Functions desde la carpeta `/api` del proyecto. La idea es exportar la instancia de Express y redirigir todo el tráfico hacia esa función, de modo que Express resuelva tanto los archivos estáticos como los endpoints REST.

En TaskFlow esto funciona gracias a `vercel.json` que redirige cualquier ruta hacia `/api`, donde corre el mismo `server/src/index.js` que en local.

Referencia: [Using Express.js with Vercel](https://vercel.com/kb/guide/using-express-with-vercel)

## Cambios por archivo

**`vercel.json`** — define el comando de build (`pnpm run build` para generar `styles/output.css` con Tailwind). El comando de instalación (`pnpm install`). El framework como `null` para que sea como proyecto genérico, y el rewrite `/(.*)  /api` para que todo pase por Express.

**`api/index.js`** — archivo nuevo que Vercel usa como punto de entrada de la función serverless.

**`package.json` de la raíz** — se añadieron las dependencias del servidor (`cors`, `dotenv`, `express`, `swagger-ui-express`, `yaml`). El `package.json` dentro de `server/` sigue sirviendo para desarrollo local.

**`server/src/config/env.js`** — en local sigue lanzando error si no hay `PORT` definido. En Vercel, cuando detecta las variables `VERCEL` o `VERCEL_URL`, asigna un valor por defecto sin exigirlo.

**`server/src/index.js`** — en `cargarDocumentoOpenapi()`, el campo `servers` del documento OpenAPI usa `VERCEL_URL` cuando existe  o `http://127.0.0.1:${PORT}` en local.

## Qué no cambia

El flujo de desarrollo local es el mismo de siempre: `pnpm run build` para los estilos, `cd server && pnpm install && pnpm dev`, y abrir el puerto configurado en `server/.env`. Las rutas de la API tampoco cambian,

## Cómo desplegar

1. Importa el repositorio en Vercel o usa la CLI con `npx vercel`.
2. Deja que use la configuración de `vercel.json`, no hace falta tocar nada más.
3. Si necesitas las rutas del sandbox para pruebas, añade `ENABLE_API_TEST_ROUTES=true` en las variables de entorno del panel de Vercel.

## Limitaciones

La API guarda las tareas en memoria del proceso Node. En serverless hay varias instancias y bastantes reinicios, así que los datos no son fiables entre peticiones ni entre despliegues. Para producción real haría falta una base de datos o un backend persistente.

Al redirigir todo el sitio a Express en `/api`, la primera carga puede verse afectada algo que no ocurriría sirviendo los estáticos desde un CDN directamente.

Para el índice general de documentación consulta [docs/README.md](README.md).