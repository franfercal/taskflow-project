# TaskFlow

Una aplicación web de **gestión de tareas y proyectos**

## Características Principales

- **Crear, completar y eliminar tareas** - Gestión completa del ciclo de vida de las tareas
- **Múltiples proyectos** - Organiza tus tareas por proyectos personalizados
- **Prioridades** - Asigna niveles de prioridad (Alta, Media, Baja)
- **Fechas** - Añade fechas a tus tareas para mejor planificación
- **Filtros** - Filtra tareas por:
  - Todas las tareas, Tareas de alta prioridad,Tareas para hoy, Tareas de esta semana, Tareas completadas, Tareas por proyecto específico.
- **Persistencia de datos** - Elige entre:
  - **LocalStorage** (app.js) - Para navegadores estándar (No recomendado)
  - **IndexedDB** (app-indexdb.js) - Para mayor capacidad de almacenamiento

##  Estructura de Datos

### Tarea
```javascript
{
  id: 1,
  titulo: "Diseñar interfaz",
  proyecto: "Diseño",
  prioridad: "alta",      // "alta" | "media" | "baja"
  fecha: "Hoy",
  hecha: false
}
```

### Proyecto
```javascript
"Diseño"
"Front End"
"Base de Datos"
```

## Documentación y Referencias:

### Para LocalStorage
  - **https://developer.mozilla.org/es/docs/Web/API/Window/localStorage**
  - **https://es.javascript.info/localstorage**

### Para IndexDB
  - **https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API**
  - **https://es.javascript.info/indexeddb**

### CSS y Media Query
  - **https://www.w3schools.com/css/default.asp**
  - **https://www.w3schools.com/css/css_rwd_mediaqueries.asp**
