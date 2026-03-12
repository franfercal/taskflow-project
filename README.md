# TaskFlow

Aplicación web para **gestionar tareas y proyectos**: prioridades, fechas límite, filtros por vista y por proyecto, y persistencia en el navegador.

---

## Características

- **Tareas**: crear, marcar como hecha/pendiente y eliminar. Título, prioridad (Alta, Media, Baja), fecha y hora límite, y **tiempo restante** visible en cada tarjeta.
- **Proyectos**: organizar tareas en varios proyectos; una tarea puede pertenecer a varios. Crear y eliminar proyectos desde el sidebar o al crear una tarea.
- **Vistas y filtros**: Todas, Hoy, Esta semana, Este mes, Sin completar, Completadas; filtro por prioridad (chips) y por proyecto; búsqueda por texto en el título.
- **Fecha y hora**: selector de fecha (Flatpickr) y reloj para la hora; cada tarjeta muestra días/horas restantes hasta la fecha límite (o "Vencida" si ya pasó).
- **Interfaz**: tema claro/oscuro (guardado en localStorage), diseño responsive con sidebar colapsable en móvil, validación de formularios con mensajes de error.
- **Persistencia**: todo se guarda en **localStorage** (tareas, proyectos, tema, siguiente ID).

---

## Tecnologías

- **Frontend**: HTML5, CSS (Tailwind CSS 4), JavaScript (vanilla, módulos vía scripts).
- **Dependencias de interfaz**: [Flatpickr](https://flatpickr.js.org/) (selector de fecha).
- **Herramientas**: Tailwind CLI (estilos), Playwright (tests E2E en navegador).

---

## Estructura del proyecto

```
taskflow-project/
├── index.html          # Página única; carga de estilos y scripts
├── app.js              # Punto de entrada (App.init)
├── styles/
│   ├── input.css       # Fuente de Tailwind
│   └── output.css      # CSS generado (no editar a mano)
├── js/
│   ├── core/           # Estado, utilidades, persistencia
│   ├── dominio/        # Filtros y estadísticas
│   ├── controladores/  # Lógica de tareas y proyectos
│   └── ui/             # Renderizado, modales, navegación, tema
├── tests/              # Tests E2E (Playwright)
└── docs/               # Documentación y referencias
```

Detalle de módulos y responsabilidades: **[js/README.md](js/README.md)**.

---

## Cómo empezar

### Requisitos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [pnpm](https://pnpm.io/) (o npm)

## Ejemplos de uso

### Ejemplo 1: Primera puesta en marcha

Clonar, instalar dependencias, generar estilos y abrir la app en el navegador:

```bash
git clone <url-del-repositorio>
cd taskflow-project
pnpm install
pnpm run build
pnpm run serve
```

Abre **http://localhost:3000** y ya puedes crear tareas, proyectos y usar los filtros.

---

### Ejemplo 2: Desarrollo con estilos en vivo

Si vas a tocar CSS (Tailwind en `styles/input.css`), deja Tailwind en modo watch en una terminal y el servidor en otra:

**Terminal 1** — recompila CSS al guardar:

```bash
pnpm run dev
```

**Terminal 2** — sirve la app:

```bash
pnpm run serve
```

Cualquier cambio en `input.css` se refleja al recargar la página en http://localhost:3000.

---

### Ejemplo 3: Comprobar que todo funciona (tests E2E)

Antes de hacer commit o tras cambiar lógica de tareas/proyectos/modales:

```bash
pnpm exec playwright install chromium   # solo la primera vez
pnpm run test:e2e
```

Si algo falla, puedes depurar con el navegador visible o con la UI de Playwright:

```bash
pnpm run test:e2e:headed
# o
pnpm run test:e2e:ui
```

Para ver el último reporte HTML de Playwright:

```bash
pnpm exec playwright show-report
```

---

### Ejemplo 4: Usar npm en lugar de pnpm

Si prefieres npm, los mismos pasos con `npm run` y `npx`:

```bash
npm install
npm run build
npm run serve
npm run test:e2e
npx playwright install chromium
npx playwright show-report
```

---

## Documentación del proyecto

En la carpeta **[docs/](docs/)** tienes la documentación ampliada:

- **[docs/README.md](docs/README.md)** — Índice de toda la documentación.
- **[docs/arquitectura.md](docs/arquitectura.md)** — Modelo de datos, flujo de la app y orden de carga.
- **[docs/guia-usuario.md](docs/guia-usuario.md)** — Cómo usar la aplicación (tareas, proyectos, filtros, tema).
- **[docs/desarrollo.md](docs/desarrollo.md)** — Convenciones de código y guía para contribuir.
- **[docs/testing.md](docs/testing.md)** — Tests E2E con Playwright.

---

## Documentación y referencias externas

- **HTML / estructura**: [MDN – Estructuración de contenido](https://developer.mozilla.org/es/docs/Learn_web_development/Core/Structuring_content)
- **JavaScript**: [JavaScript.info](https://es.javascript.info/), [MDN JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)
- **localStorage**: [MDN Window.localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- **Flatpickr**: [Documentación oficial](https://flatpickr.js.org/getting-started/)
- **Tailwind CSS**: [Documentación](https://tailwindcss.com/docs)
- **Playwright**: [Documentación](https://playwright.dev/docs/intro)

---

## Autor

Francisco J. Fernández Cala
