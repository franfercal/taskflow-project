# Testing — TaskFlow

## Prueba manual

La forma más directa de probar la app es arrancando el backend y abriendo el navegador.

1. En la raíz del repo: `pnpm run build` para compilar los estilos.
2. En `server/`: `pnpm install` si es la primera vez, luego `pnpm dev`.
3. Abre `http://127.0.0.1:3000/` en el navegador.

Sin servidor activo la lista de tareas quedará vacía y las operaciones fallarán.

## Playwright (opcional)

Si el proyecto incluye Playwright como dependencia, puedes recuperar los tests añadiendo `playwright.config.js`, los scripts en `package.json` y los specs bajo `tests/`.

Para instalar los navegadores la primera vez:
```bash
pnpm exec playwright install chromium
```

Los comandos típicos, una vez los definas en `package.json`:
```bash
pnpm test:e2e           # ejecutar la suite E2E
pnpm test:e2e:ui        # interfaz de depuración
pnpm test:e2e:headed    # con navegador visible
```

Los escenarios suelen cubrir la carga de página, el modal de nueva tarea, la validación del título y la aparición de tareas en la lista. Cuando termina una ejecución puedes ver el reporte con:
```bash
pnpm exec playwright show-report
```