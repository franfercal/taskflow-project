# Testing — TaskFlow

## Prueba manual (recomendada)

La aplicación espera el **backend** que sirve la API y los estáticos:

1. En la raíz del repo: `pnpm run build` (CSS de Tailwind).
2. En `server/`: `pnpm install` si hace falta, luego `pnpm dev`.
3. Abre en el navegador la URL base (por defecto `http://127.0.0.1:3000/`).

Sin servidor activo, la lista de tareas puede quedar vacía y las operaciones fallarán.

---

## Playwright (opcional)

Si el proyecto incluye [Playwright](https://playwright.dev/) como dependencia, puedes añadir de nuevo `playwright.config.js`, scripts en `package.json` (por ejemplo `test:e2e`) y specs bajo `tests/`.

**Requisitos habituales**

- Node.js y pnpm
- Navegadores de Playwright (solo la primera vez):

```bash
pnpm exec playwright install chromium
```

**Comandos típicos** (solo aplican si los defines en `package.json`)

| Comando | Descripción |
|--------|-------------|
| `pnpm test:e2e` | Ejecutar suite E2E |
| `pnpm test:e2e:ui` | Interfaz de depuración de Playwright |
| `pnpm test:e2e:headed` | Navegador visible |

Los escenarios suelen cubrir carga de página, modal de nueva tarea, validación de título obligatorio y aparición de tareas en la lista. Tras una ejecución, el reporte HTML se abre con `pnpm exec playwright show-report`.
