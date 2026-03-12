## Atajos de teclado más usados

### Atajos Generales

Ctrl+Shift+P  ---> Menú de comandos
Ctrl+I        ---> Mostrar/Ocultar panel lateral derecho.
Ctrl+.        ---> Menú de Modos.
Ctrl+S        ---> Guardar cambios

### Atajos para el Chat/Agente/Composer

Ctrl+Enter              ---> Poner Mensaje en cola
Ctrl+Shift+Backspace    ---> Cancelar generación
Ctrl+Shift+L            ---> Añadir código seleccionado como contexto
Ctrl+N                  ---> Nuevo Chat
Ctrl+T                  ---> Nueva Pestaña
Ctrl+[                  ---> Chat anterior
Ctrl+]                  ---> Chat siguiente
Ctrl+W                  ---> Cerrar chat

### Edición en línea

Ctrl+K                  ---> Abrir

### Selección de Código y Contexto

@                       ---> Menciones
/                       ---> Comandos rápidos
Ctrl+Shift+L            ---> Agregar selección al chat
Ctrl+Shift+K            ---> Agregar selección a Edit
Ctrl+L                  ---> Agregar selección a un chat nuevo

## Mejoras en el código

Tras pedirle que mejoras podría hacerle al proyecto sin perder funcionalidad, encontró varios puntos en los que se podría mejorar el código. Estos son los puntos que encontró a mejorar:

- HTML largo en render.js: Las cadenas de clases Tailwind en tarjetas y chips son muy largas. Puedes extraer constantes o helpers (por ejemplo clasesTarjetaCompletada, clasesTarjetaPendiente) para mejorar lectura y mantenimiento.

- En index.html: Los ítems de navegación (Vistas) repiten muchas clases. Podrías usar una sola clase común (por ejemplo .nav-item-vista) y aplicar estilos desde CSS en lugar de duplicar las mismas clases en cada elemento.

Posteriormente le pedí que procediera a mejorar el código en esos puntos. Aplicó varios cambios en el código de manera correcta.

1. HTML largo en render.js: Constantes de clases al inicio del módulo:
CLASES_TARJETA_BASE, CLASES_TARJETA_COMPLETADA
CLASES_TITULO_HECHA, CLASES_TITULO_PENDIENTE
CLASES_CHECKBOX_HECHA, CLASES_CHECKBOX_PENDIENTE
CLASES_CHIP_PROYECTO, CLASES_SIN_PROYECTO, CLASES_FECHA_HORA
CLASES_BTN_GESTIONAR, CLASES_BTN_ELIMINAR
CLASES_EMPTY_STATE, CLASES_GRUPO_TITULO
CLASES_FILTER_CHIP_BASE
CLASES_NAV_PROYECTO_ITEM, CLASES_NAV_PROYECTO_BTN, CLASES_NAV_PROYECTO_CONTADOR
Uso en funciones: renderizarFiltros, renderizarProyectosLateral, renderizarTareas, renderizarGrupo y renderizarTarjeta usan estas constantes en lugar de cadenas largas, para que el HTML generado sea más legible y fácil de mantener.

2. Index.html – vistas del sidebar
Clase común en styles/input.css: .nav-item-vista con @apply para todas las utilidades que antes se repetían en cada ítem (flex, gap, padding, colores, hover, focus).
HTML: cada ítem de “Vistas” pasa a tener class="nav-item nav-item-vista" (el primero mantiene también active). Se elimina la repetición de muchas clases en cada <div>.
Accesibilidad: el <nav> de vistas tiene aria-label="Vistas de tareas".

### Refactorización de Código

En conjunto: se eliminó duplicación (enfocables, focus trap, fecha “hoy”, búsqueda de tarea, cierre del sidebar), y se extrajeron responsabilidades (migración, lectura del formulario, normalización de proyectos) y se mantuvo la misma funcionalidad.

### Mejorar nombres variables y Estructura de archivos

Ha resuelto el un problema en el nombres de las variables, ya que algunas estaban en español y otras estaaban declaradas en ingles. Ahora todas están en el mismo idioma. La estructura ha cambiado haciendo una subdivision en los archivos javascript dependiendo de su uso.

### Validaciones adicionales al formulario

Ha encotrado varias cosas que mejorar: 

1. Mensajes de error visibles
Título: se muestra "El título es obligatorio." o "Máximo 80 caracteres." debajo del campo.
Proyectos: "Añade al menos un proyecto." si se guarda sin ningún proyecto.
Nuevo proyecto: "Escribe un nombre para el proyecto.", "Máximo 30 caracteres." o "Ese proyecto ya existe." según el caso.

2. Validación centralizada
_validarFormulario() devuelve { valido, errores } y comprueba título (obligatorio y longitud ≤ 80) y al menos un proyecto.
_mostrarErrores(errores) y _limpiarErrores() unifican borde rojo, aria-invalid y el texto del mensaje.

3. Validación al crear proyecto
Nombre vacío → mensaje y borde rojo.
Longitud > 30 → mensaje "Máximo 30 caracteres.".
Proyecto duplicado → "Ese proyecto ya existe." (sin depender solo del console.warn del controlador)

4. Al guardar
Se limpian todos los errores antes de validar.
Si hay errores, se muestran y el foco va al primer campo inválido (título o select de proyecto).

### Simplificar funciones largas o repetitivas

1. modal.js – Errores del formulario
_establecerMensajeError(span, mensaje): Muestra u oculta el mensaje en el span (vacío = ocultar).
_marcarCampoInvalido(input, invalido): Aplica o quita borde rojo y aria-invalid.
_marcarContenedorProyectosInvalido(invalido): Aplica o quita el ring de error en el contenedor de proyectos.
Con esto se ha unificado la lógica que antes se repetía en _mostrarErrores, _limpiarErrores, _limpiarErrorTitulo, _limpiarErrorProyectos y en el listener del nombre de proyecto. Esas funciones ahora solo llaman a estos helpers.

_mostrarErrorNombreProyecto(mensaje): Centraliza “mensaje + marcar inválido + focus” para el campo de nuevo proyecto.
crearProyecto() pasa a tener un único bloque por caso (vacío, longitud, duplicado) que llama a _mostrarErrorNombreProyecto(...) y hace return, en lugar de repetir varias veces el mismo código.

2. modal.js – Reloj
_pintarBotonesReloj(caraReloj, centro, radio, valores, valorSeleccionado, claseBase, alClic): Pinta los botones en círculo (horas 0–23 o minutos 0,5,…,55), reutilizando la misma lógica para ambos.
iniciarReloj() deja de duplicar ~50 líneas entre pintarHoras y pintarMinutos: cada una se reduce a una llamada a _pintarBotonesReloj con el array de valores y el callback adecuado. Las horas se generan con Array.from({ length: 24 }, (_, i) => i).

3. filters.js – Filtros por prioridad
_porPrioridad(prioridad): Devuelve la función filtro (tareas) => tareas.filter(t => t.prioridad === prioridad).
Las definiciones alta, media y baja pasan a usar este helper en lugar de repetir el mismo filter tres veces.

4. render.js – Tarjeta de tarea
_obtenerClasesTarjeta(tarea): Calcula y devuelve { clasesTarjeta, clasesTitulo, clasesCheckbox, clasesBadge } según tarea.hecha y tarea.prioridad, usando siempre PRIORIDAD_CLASES (con fallback a baja).
renderizarTarjeta() delega en este método la decisión de clases y se centra en montar el HTML con esas clases y el resto de datos de la tarea, reduciendo longitud y repetición.

## Guía e instalación de servidor MCP y Pruebas

### ¿Qué son los MCP? 

El Model Context Protocol (MCP) es un estándar abierto y de código abierto introducido por Anthropic en noviembre de 2024 para estandarizar la forma en que los sistemas de inteligencia artificial se integran y comparten datos con herramientas externas, sistemas y fuentes de datos.

### Instalación en Cursor

Los MCP se configuran en el apartado de configuracion de cursor, pestaña Tools&MPC. En ella podemos hacer click en New MPC Server y, nos aparecerá un archivo .json en el cual debemos introducir, primero el nombre del mpc, en segundo lugar el comando que va a ejecutar el mpc y sus argumentos. De tal manera que el archivo queda así despues de instalar dos MPC, en este caso filsystem y puppeteer.
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/home/franfercal/Escritorio/Proyectos",
        "${workspaceFolder}"
      ]
    },
    "puppeteer": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-puppeteer"
      ]
    }
  }
}

### Funcionamiento, usos y utilidad de estos MPC

El funcionamiento es simple, ya que al instalar un MPC lo que pasa es que dotamos de capacidades extra a la ia de cursor. Por ejemplo Puppeteer dota a la ia de cursor poder hacer testing de la aplicacion web en segundo plano, abriendo un navegador chrominium y simular acciones de un usuario. Por lo tanto permite controloar el navegador para hacer pruebas automáticas.

Filesystem en cambio interactúa con archivos y carpetas que tú permitas en su configuración. 

Su principal utilidad es la ejecución de acciones en Agentes que no se podrían ejecutar o usar de otra manera.





## Reglas del proyecto

## Usso del Composer o Chat

## Gestión de contexto

## Configuración recomendada (.cursorrules)