# Guía de desarrollo — TaskFlow

Estructura del proyecto.

## Estructura de módulos

El detalle completo está en [js/README.md](../js/README.md):

- `js/core/` — estado global y utilidades DOM/fechas
- `js/api/` — cliente HTTP hacia `/api/v1/tasks`
- `js/dominio/` — lógica de filtrado y estadísticas del sidebar
- `js/controladores/` — CRUD de tareas vía API y gestión de proyectos en memoria
- `js/ui/` — renderizado, delegación de eventos, modales, navegación lateral y tema
- `app.js` — punto de entrada; `App.init()`
- `server/` — API Express que sirve estáticos y rutas bajo `/api/v1`

## Estilos (Tailwind)

La fuente es `styles/input.css` y la salida compilada es `styles/output.css`.
```bash
pnpm run build   
pnpm run dev     
```

## Flujo al cambiar código

1. Haz los cambios en el módulo que corresponda y en `index.html` si añades scripts.
2. Comenta las funciones o bloques que lo necesiten.
3. Prueba en el navegador con el servidor corriendo, y con los tests E2E si los tienes configurados.

## Qué documentar al cambiar comportamiento

- Módulos nuevos → [js/README.md](../js/README.md)
- Comandos o cobertura de tests → [testing.md](testing.md)
- Rutas o cuerpos de la API → [server/openapi.yaml](../server/openapi.yaml) y [api-swagger.md](api-swagger.md)