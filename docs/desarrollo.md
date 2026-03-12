# Guía de desarrollo — TaskFlow

Convenciones de código, estructura del proyecto y cómo contribuir o extender la aplicación.

---

## Convenciones de código

- **Variables y parámetros**: en **español** (por ejemplo `tarea`, `listaFiltrada`, `siguienteId`).
- **Objetos globales de módulo**: **PascalCase** (`State`, `Utils`, `Persistencia`, `Filtros`, `TareasController`, `ProyectosController`, `Estadisticas`, `Modal`, `ModalProyectos`, `Render`, `Navegacion`, `Tema`).
- **Comentarios**: el código debe estar **bien comentado**; en especial JSDoc en funciones públicas y bloques con lógica no obvia.
- **Orden de scripts**: no cambiar el orden de carga en `index.html` sin comprobar dependencias (ver [Arquitectura](arquitectura.md)).

---

## Estructura de módulos

Resumen; detalle en [js/README.md](../js/README.md).

| Carpeta | Uso |
|---------|-----|
| `js/core/` | Estado global (`state.js`), utilidades DOM/fechas (`utils.js`), persistencia (`storage.js`). |
| `js/dominio/` | Lógica de filtrado (`filters.js`) y estadísticas del sidebar (`statistics.js`). |
| `js/controladores/` | CRUD de tareas (`task.js`) y de proyectos (`project.js`). |
| `js/ui/` | Renderizado y delegación de eventos (`render.js`), modales (`modal.js`, `modal-proyectos.js`), navegación lateral (`nav.js`), tema (`theme.js`). |
| `app.js` | Punto de entrada: `App.init()` orquesta carga, init de módulos y primera renderización. |

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

- Tests en `tests/taskflow.spec.js`.
- Al ejecutar `pnpm run test:e2e` se arranca un servidor estático en el puerto 3000 y se lanzan los tests.
- Detalle de comandos y cobertura: [Testing](testing.md).

Para añadir tests:

1. Instalar navegadores si hace falta: `pnpm exec playwright install chromium`.
2. Añadir casos en `tests/taskflow.spec.js` (por ejemplo nuevos flujos de modal, filtros o proyectos).
3. Ejecutar `pnpm run test:e2e` y, si es necesario, `pnpm run test:e2e:ui` o `test:e2e:headed` para depurar.

---

## Flujo recomendado al cambiar código

1. Hacer cambios en el módulo correspondiente (y en `index.html` si añades scripts).
2. Comentar las funciones o bloques que lo requieran.
3. Ejecutar tests E2E para comprobar que no se rompe el flujo principal.
4. Revisar que los nombres sigan las convenciones (español para variables, PascalCase para objetos de módulo).

---

## Documentación a actualizar al cambiar comportamiento

- **Modelo de datos o flujo**: [docs/arquitectura.md](arquitectura.md).
- **Nuevos IDs o secciones en el DOM**: lista de IDs en arquitectura y, si afecta al usuario, [guia-usuario.md](guia-usuario.md).
- **Nuevos módulos o responsabilidades**: [js/README.md](../js/README.md).
- **Comandos o cobertura de tests**: [docs/testing.md](testing.md).

---

## Enlaces útiles

- [README del proyecto](../README.md)
- [Índice de documentación](README.md)
- [Arquitectura](arquitectura.md)
- [Guía de usuario](guia-usuario.md)
- [Testing](testing.md)
- [Estructura JS](../js/README.md)
