# Documentación de TaskFlow

Índice de la documentación del proyecto. TaskFlow es una aplicación web para gestionar tareas y proyectos con prioridades, fechas límite y filtros; las **tareas** persisten en el **servidor** (API REST). La **documentación interactiva de la API** está disponible con **Swagger UI** cuando el backend está en marcha.

---

## Documentos principales

| Documento | Descripción |
|-----------|-------------|
| [**Arquitectura**](arquitectura.md) | Modelo de datos, flujo de la aplicación, orden de carga de scripts e IDs del DOM. Para entender cómo está construida la app. |
| [**Guía de usuario**](guia-usuario.md) | Cómo usar la aplicación: crear tareas, gestionar proyectos, filtros, búsqueda, tema claro/oscuro. |
| [**Desarrollo**](desarrollo.md) | Convenciones de código, estructura de módulos y guía para contribuir o extender el proyecto. |
| [**Testing**](testing.md) | Tests E2E con Playwright: comandos, qué cubren y cómo depurar. |
| [**API y Swagger (OpenAPI)**](api-swagger.md) | Dónde abrir **Swagger UI** (`/api-docs`), ficheros `openapi.yaml` / `openapi.json` y enlaces al README del servidor con ejemplos HTTPie. |

---

## Documentación de código

- **Estructura JavaScript**: [../js/README.md](../js/README.md) — Responsabilidades de cada módulo (`core/`, `dominio/`, `controladores/`, `ui/`).

---

## Documentación adicional (IA y experimentos)

En la carpeta `docs/ai/` se encuentran notas sobre uso de IA, comparativas y flujo de trabajo con Cursor:

- [ai/experiments.md](ai/experiments.md)
- [ai/cursor-workflow.md](ai/cursor-workflow.md)
- [ai/ai-comparison.md](ai/ai-comparison.md)
- [ai/prompt-engineering.md](ai/prompt-engineering.md)
- [ai/reflection.md](ai/reflection.md)

---

## Enlaces rápidos

- [README principal del proyecto](../README.md) — Descripción, tecnologías, cómo empezar, **Swagger** (`/api-docs`).
- [README del servidor](../server/README.md) — API REST, OpenAPI, ejemplos **HTTPie** (request/response).
- [package.json](../package.json) — Scripts y dependencias del proyecto (raíz).
