# Testing con el navegador (Playwright)

Los tests E2E se ejecutan en un navegador real (Chromium, Firefox) con [Playwright](https://playwright.dev/).

## Requisitos

- Node.js y pnpm (o npm)
- Tras instalar dependencias, instalar los navegadores de Playwright (solo la primera vez):

```bash
pnpm exec playwright install chromium
# Opcional: pnpm exec playwright install   # instala Chromium, Firefox y WebKit
```

## Comandos

| Comando | Descripción |
|--------|-------------|
| `pnpm test:e2e` | Ejecuta todos los tests E2E (arranca servidor estático en el puerto 3000) |
| `pnpm test:e2e:ui` | Abre la interfaz de Playwright para ver y depurar tests |
| `pnpm test:e2e:headed` | Ejecuta los tests con el navegador visible |
| `pnpm serve` | Sirve la app en http://localhost:3000 (útil para probar a mano) |

## Qué cubren los tests

- Carga de la página y título "Gestión de Tareas"
- Header con TaskFlow y botón "Nueva tarea"
- Apertura del modal al hacer clic en "Nueva tarea"
- Presencia del campo título y del select de proyectos
- Cierre del modal con "Cancelar"
- Validación: no se puede guardar sin título (mensaje de error)
- Creación de una tarea con título y proyecto, y comprobación de que aparece en la lista
- Lista de tareas y sidebar con secciones Vistas y Proyectos

Los tests están en `tests/taskflow.spec.js`.

Se puede abrir el index.html del reporte ejecutando: "pnpm exec playwright show-report"
