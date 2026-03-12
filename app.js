/**
 * Punto de entrada de la aplicación TaskFlow.
 * Orquesta la carga de datos, la inicialización de módulos y la primera renderización.
 */

const App = {
  /**
   * Inicializa la aplicación completa:
   * 1. Carga datos desde localStorage
   * 2. Configura fecha actual y tema (claro/oscuro)
   * 3. Inicializa modal, navegación, render y filtros
   * 4. Pinta filtros, proyectos y tareas
   * 5. Muestra el toast de bienvenida
   * @returns {void}
   */
  init() {
    try {
      Persistencia.cargar();

      this.configurarFecha();
      Tema.init();

      Modal.init();
      ModalProyectos.init();
      Navegacion.init();
      Render.init();
      Filtros.init();

      Render.renderizarFiltros();
      Render.renderizarProyectosLateral();
      Render.renderizarTareas();

      this.mostrarBienvenida();
    } catch (error) {
      console.error("Error al inicializar", error);
    }
  },

  /**
   * Escribe en el header la fecha actual formateada (ej: "jue 12 mar 2025").
   * @returns {void}
   */
  configurarFecha() {
    const elementoFecha = Utils.getElement("fecha-actual");
    if (elementoFecha) Utils.setText(elementoFecha, Utils.formatearFecha({ weekday: "short", day: "numeric", month: "short", year: "numeric" }));
  },

  /**
   * Muestra un toast de bienvenida con el número de tareas pendientes.
   * Se oculta solo a los 3 segundos o al hacer clic en cerrar.
   * @returns {void}
   */
  mostrarBienvenida() {
    const toast = Utils.getElement("welcome-toast");
    const elementoMensaje = Utils.getElement("welcome-toast-msg");
    const elementoIcono = Utils.getElement("welcome-toast-icon");
    const elementoCerrar = Utils.getElement("welcome-toast-close");
    if (!toast || !elementoMensaje || !elementoIcono || !elementoCerrar) return;

    const pendientes = State.tareas.filter((tarea) => !tarea.hecha).length;
    const plural = Utils.plural(pendientes);
    elementoMensaje.textContent = pendientes > 0
      ? `¡¡¡Tienes ${pendientes} tarea${plural} pendiente${plural}!!!`
      : "¡¡No tienes tareas pendientes!!!";
    elementoIcono.textContent = pendientes > 0 ? "⚠" : "✓";
    elementoIcono.classList.toggle("con-pendientes", pendientes > 0);
    elementoIcono.classList.toggle("sin-pendientes", pendientes === 0);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("visible")));
    const ocultar = () => toast.classList.remove("visible");
    const temporizador = setTimeout(ocultar, 3000);
    elementoCerrar.addEventListener("click", () => { clearTimeout(temporizador); ocultar(); }, { once: true });
  },
};

// Arranque: cuando el DOM está listo se ejecuta App.init()
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});