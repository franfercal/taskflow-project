/* Inicializa y coordina los módulos */

const App = {
  /* Inicializa aplicacion */
  init() {
    try {
      Persistencia.cargar();

      this.configurarFecha();
      Tema.init();

      Modal.init();
      Navegacion.init();
      Render.init();
      Filtros.init();

      Render.renderizarFiltros();
      Render.renderizarProyectosLateral();
      Render.renderizarTareas();
      Estadisticas.actualizar();

      this.mostrarBienvenida();
    } catch (error) {
      console.error("Error al inicializar", error);
    }
  },

  /* fecha header */
  configurarFecha() {
    Utils.setText(
      Utils.getElement("fecha-actual"),
      Utils.formatearFecha({ weekday: "short", day: "numeric", month: "short", year: "numeric" })
    );
  },

  /* bienvenida */
  mostrarBienvenida() {
    const toast   = Utils.getElement("welcome-toast");
    const msgEl   = Utils.getElement("welcome-toast-msg");
    const iconEl  = Utils.getElement("welcome-toast-icon");
    const closeEl = Utils.getElement("welcome-toast-close");

    if (!toast || !msgEl) return;

    const pendientes = State.tareas.filter((t) => !t.hecha).length;
    const hayPendientes = pendientes > 0;

    msgEl.textContent  = hayPendientes
      ? `¡¡¡Tienes ${pendientes} tarea${pendientes === 1 ? "" : "s"} pendiente${pendientes === 1 ? "" : "s"}!!!`
      : "¡¡No tienes tareas pendientes!!!";
    iconEl.textContent = hayPendientes ? "⚠" : "✓";
    iconEl.classList.toggle("con-pendientes", hayPendientes);
    iconEl.classList.toggle("sin-pendientes", !hayPendientes);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("visible")));

    const ocultar = () => toast.classList.remove("visible");
    const timer   = setTimeout(ocultar, 4500);
    closeEl.addEventListener("click", () => { clearTimeout(timer); ocultar(); }, { once: true });
  },
};

// iniciar app cuando el DOM este cargado
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});