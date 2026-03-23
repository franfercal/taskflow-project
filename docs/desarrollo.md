# Guía de desarrollo — TaskFlow

Convenciones de código, estructura del proyecto y cómo contribuir o extender la aplicación.

---

## Convenciones de código

- **Variables y parámetros**: en **español** (por ejemplo `tarea`, `listaFiltrada`, `siguienteId`).
- **Objetos globales de módulo**: **PascalCase** (`State`, `Utils`, `TaskflowApiClient`, `ApiTareas`, `Filtros`, `TareasController`, `ProyectosController`, `Estadisticas`, `Modal`, `ModalProyectos`, `Render`, `Navegacion`, `Tema`).
- **Comentarios**: el código debe estar **bien comentado**; en especial JSDoc en funciones públicas y bloques con lógica no obvia.
- **Orden de scripts**: no cambiar el orden de carga en `index.html` sin comprobar dependencias (ver [Arquitectura](arquitectura.md)).

---

## Estructura de módulos

Resumen; detalle en [js/README.md](../js/README.md).

| Carpeta | Uso |
|---------|-----|
| `js/core/` | Estado global (`state.js`) y utilidades DOM/fechas (`utils.js`). |
| `js/api/` | Cliente HTTP hacia `/api/v1/tasks` (`client.js`). |
| `js/dominio/` | Lógica de filtrado (`filters.js`) y estadísticas del sidebar (`statistics.js`). |
| `js/controladores/` | CRUD de tareas vía API (`task.js`) y de proyectos en memoria (`project.js`). |
| `js/ui/` | Renderizado y delegación de eventos (`render.js`), modales (`modal.js`, `modal-proyectos.js`), navegación lateral (`nav.js`), tema (`theme.js`). |
| `app.js` | Punto de entrada: `App.init()` orquesta sincronización con la API, init de módulos y primera renderización. |
| `server/` | API Express que sirve estáticos y rutas bajo `/api/v1` (detalle en el README raíz del repo). |

Al añadir un nuevo módulo:

1. Colocarlo en la carpeta que corresponda (core, dominio, controladores, ui).
2. Añadir el `<script>` en `index.html` en el orden correcto (después de sus dependencias).
3. Exponer un objeto global si otros módulos deben usarlo (y documentarlo en `js/README.md`).

---

## Estilos (Tailwind)

- Fuente de estilos: `styles/input.css` (directivas de Tailwind y estilos propios).
- Salida: `styles/output.css` (generado; **no editar a mano**).
- Comandos:
  - `pnpm run build`: compila una vez.
  - `pnpm run dev`: watch y recompilación al guardar.

---

## Tests E2E (Playwright)

- El paquete `@playwright/test` puede estar en `devDependencies` del proyecto raíz; los scripts `test:e2e` y el spec de ejemplo no vienen configurados por defecto en todos los clones.
- Para probar a mano: en `server/` ejecuta `pnpm dev` y abre la URL que indique el servidor (por defecto API + front en el mismo puerto).
- Si restauras `playwright.config.js` y `tests/*.spec.js`, define en `package.json` los scripts que arranquen el servidor correcto y consulta [Testing](testing.md).

---

## Flujo recomendado al cambiar código

1. Hacer cambios en el módulo correspondiente (y en `index.html` si añades scripts).
2. Comentar las funciones o bloques que lo requieran.
3. Probar en navegador con el servidor de `server/` (y tests E2E si los tienes configurados).
4. Revisar que los nombres sigan las convenciones (español para variables, PascalCase para objetos de módulo).

---

## Documentación a actualizar al cambiar comportamiento

- **Modelo de datos o flujo**: [docs/arquitectura.md](arquitectura.md).
- **Nuevos IDs o secciones en el DOM**: lista de IDs en arquitectura y, si afecta al usuario, [guia-usuario.md](guia-usuario.md).
- **Nuevos módulos o responsabilidades**: [js/README.md](../js/README.md).
- **Comandos o cobertura de tests**: [docs/testing.md](testing.md).
- **Rutas o cuerpos de la API REST / OpenAPI**: [server/openapi.yaml](../server/openapi.yaml) y [docs/api-swagger.md](api-swagger.md).

---

## Enlaces útiles

- [README del proyecto](../README.md)
- [Índice de documentación](README.md)
- [Arquitectura](arquitectura.md)
- [API y Swagger](api-swagger.md)
- [Guía de usuario](guia-usuario.md)
- [Testing](testing.md)
- [Estructura JS](../js/README.md)
- [README del servidor](../server/README.md)
