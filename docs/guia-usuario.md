# Guía de usuario — TaskFlow

Cómo usar la aplicación para gestionar tareas y proyectos desde el navegador.

---

## Primer uso

1. Abre la aplicación en el navegador (por ejemplo `http://localhost:3000` si la sirves con `pnpm run serve`).
2. La primera vez no hay tareas; puedes crear proyectos desde el sidebar o al crear una tarea.
3. Los datos se guardan automáticamente en tu navegador (localStorage); no hace falta cuenta ni servidor.

---

## Crear una tarea

1. Pulsa **"+ Nueva tarea"** (arriba a la derecha del área principal).
2. Se abre un modal. **Título** es obligatorio; si intentas guardar sin título, aparecerá un mensaje de error.
3. Opcionalmente:
   - **Proyectos**: elige uno en el desplegable y pulsa "Añadir" para asociar la tarea a uno o varios proyectos. Puedes crear un proyecto nuevo desde el mismo modal (opción "Nuevo proyecto" y nombre).
   - **Prioridad**: Alta, Media o Baja.
   - **Fecha y hora**: usa el selector de fecha y el reloj para fijar la fecha y hora límite. Si no eliges nada, la tarea queda "Sin fecha".
4. Pulsa **"Guardar"** para crear la tarea. Verás la tarjeta en la lista; cada tarjeta muestra el tiempo restante hasta la fecha límite (o "Vencida" si ya pasó).

---

## Gestionar tareas en la lista

- **Marcar como hecha / pendiente**: haz clic en la casilla (checkbox) de la tarjeta. La tarea pasa a completada o pendiente y los contadores del sidebar se actualizan.
- **Eliminar**: usa el botón de eliminar en la tarjeta (normalmente una papelera o similar).
- **Cambiar proyectos de una tarea**: desde la tarjeta suele haber un acceso para abrir el modal "Proyectos de esta tarea", donde puedes añadir o quitar proyectos asociados.

---

## Vistas y filtros

En el **sidebar** (izquierda):

- **Vistas**: Todas, Hoy, Esta semana, Este mes, Sin completar, Completadas. Al hacer clic en una vista, la lista muestra solo las tareas que corresponden (por fecha o por estado).
- **Proyectos**: cada proyecto tiene un contador. Al hacer clic en un proyecto, la lista se filtra por ese proyecto.
- **Progreso**: las tarjetas "Terminadas" y "Sin Terminar" muestran totales y al hacer clic aplican el filtro de completadas o pendientes.

En el **área principal**:

- **Chips de prioridad**: puedes filtrar además por Alta, Media o Baja (se combina con la vista activa).
- **Buscador**: escribe en el campo de búsqueda para filtrar por texto en el título de las tareas.

---

## Proyectos

- **Crear**: desde el sidebar (si hay opción "Nuevo proyecto") o al crear/editar una tarea en el modal (campo "Nuevo proyecto" y nombre).
- **Eliminar**: desde el sidebar suele haber un botón o menú para eliminar un proyecto (ten en cuenta que las tareas que estaban solo en ese proyecto pueden quedar "sin proyecto" o reasignarse según la lógica de la app).
- Una misma tarea puede pertenecer a **varios proyectos**; se gestiona en el modal "Proyectos de esta tarea".

---

## Tema claro / oscuro

- En la cabecera hay un botón (sol/luna) para **cambiar entre tema claro y oscuro**.
- La preferencia se guarda en el navegador y se mantiene en la próxima visita.

---

## Fecha y hora en la interfaz

- En la cabecera se muestra la **fecha actual** (formato corto).
- En cada tarjeta con fecha límite se muestra el **tiempo restante** (días/horas) o "Vencida" si la fecha/hora ya pasó.
- Al crear una tarea, la **hora** se elige con un reloj en el modal (campo "Elegir hora"); la fecha con el selector de calendario (Flatpickr).

---

## Mensajes y validación

- Si intentas guardar una tarea sin título, verás un **mensaje de error** bajo el campo (y no se guardará).
- Al abrir la app puede mostrarse un **toast de bienvenida** con el número de tareas pendientes; se cierra solo a los pocos segundos o al pulsar la X.

---

## Datos y privacidad

- Todo se guarda **solo en tu navegador** (localStorage). No se envían datos a ningún servidor.
- Si borras los datos del sitio o usas otro navegador/dispositivo, no verás las mismas tareas a menos que la app ofrezca exportar/importar en el futuro.
