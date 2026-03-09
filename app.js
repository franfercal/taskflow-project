/* punto entrada app */

const App = {
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

      this.mostrarBienvenida();
    } catch (error) {
      console.error("Error al inicializar", error);
    }
  },

  configurarFecha() {
    const el = Utils.getElement("fecha-actual");
    if (el) Utils.setText(el, Utils.formatearFecha({ weekday: "short", day: "numeric", month: "short", year: "numeric" }));
  },

  mostrarBienvenida() {
    const toast = Utils.getElement("welcome-toast");
    const msgEl = Utils.getElement("welcome-toast-msg");
    const iconEl = Utils.getElement("welcome-toast-icon");
    const closeEl = Utils.getElement("welcome-toast-close");
    if (!toast || !msgEl || !iconEl || !closeEl) return;

    const pendientes = State.tareas.filter((t) => !t.hecha).length;
    const plural = pendientes !== 1 ? "s" : "";
    msgEl.textContent = pendientes > 0
      ? `¡¡¡Tienes ${pendientes} tarea${plural} pendiente${plural}!!!`
      : "¡¡No tienes tareas pendientes!!!";
    iconEl.textContent = pendientes > 0 ? "⚠" : "✓";
    iconEl.classList.toggle("con-pendientes", pendientes > 0);
    iconEl.classList.toggle("sin-pendientes", pendientes === 0);

    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("visible")));
    const ocultar = () => toast.classList.remove("visible");
    const timer = setTimeout(ocultar, 3000);
    closeEl.addEventListener("click", () => { clearTimeout(timer); ocultar(); }, { once: true });
  },
};

// iniciar app cuando el DOM este cargado
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});