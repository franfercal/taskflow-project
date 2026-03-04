/* Inicializa y coordina los módulos */

const App = {
  /* Inicializa aplicacion */
  init() {
    console.log("Iniciando TaskFlow");

    try {
      // 1. Cargar datos
      Persistencia.cargar();

      // 2. header
      this.configurarFecha();

      // 3. componentes
      Modal.init();
      Navegacion.init();
      Render.init();
      Filtros.init();

      // 4. render UI inicial
      Render.renderizarFiltros();
      Render.renderizarProyectosLateral();
      Render.renderizarTareas();
      Estadisticas.actualizar();

      console.log("TaskFlow iniciado correctamente");
      console.log(`Tareas: ${State.tareas.length} | Proyectos: ${State.proyectos.length}`);
    } catch (error) {
      console.error("Error al inicializar", error);
    }
  },

  /* fecha header */
  configurarFecha() {
    const fechaElement = Utils.getElement("fecha-actual");

    if (fechaElement) {
      const fecha = Utils.formatearFecha({
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      Utils.setText(fechaElement, fecha);
      console.log("Fecha ok");
    } else {
      console.warn("Error en elemento fecha-actual");
    }
  },

  /* destruye app */
  destroy() {
    Persistencia.limpiar();
    State.reset();
    console.log("✓ TaskFlow destruido");
  },
};

// iniciar app cuando el DOM este
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});