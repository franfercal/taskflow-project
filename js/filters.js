/* logica y visualizacion de filtros */

const Filtros = {
  /* filtros disponibles */
  definiciones: {
    todas: (tareas) => tareas,
    alta: (tareas) => tareas.filter((t) => t.prioridad === "alta"),
    hoy: (tareas) =>
      tareas.filter((t) => !t.hecha && t.fecha.toLowerCase().includes("hoy")),
    semana: (tareas) => tareas.filter((t) => !t.hecha),
    "completadas-vista": (tareas) => tareas.filter((t) => t.hecha),
  },

  /* tareas segun filtro activo */
  obtenerVisibles() {
    const { tareas } = State;
    const filtro = State.filtroActivo;

    // si es un filtro definido, usa la definicion
    if (this.definiciones[filtro]) {
      return this.definiciones[filtro](tareas);
    }

    // si no asume que es un proyecto
    return tareas.filter((t) => t.proyecto === filtro);
  },

  /* cambia filtro activo y actualiza */
  cambiarFiltro(nuevoFiltro) {
    State.filtroActivo = nuevoFiltro;
    this.actualizarUIFiltros();
    Render.renderizarTareas();
  },

  /* Actualiza visualmente los botones de filtro */
  actualizarUIFiltros() {    
    // actualizar chips filtro
    Utils.getElements(".filter-chip").forEach((chip) => {
      const esActivo = chip.dataset.filtro === State.filtroActivo;
      Utils.toggleClass(chip, "active", esActivo);
    });

    // actualizar items navegacion
    Utils.getElements(".nav-item[data-vista]").forEach((item) => {
      const esActivo = item.dataset.vista === State.filtroActivo;
      Utils.toggleClass(item, "active", esActivo);
    });
  },

  /* comprobar filtro existe */
  existeFiltro(filtro) {
    return (
      this.definiciones[filtro] || State.existeProyecto(filtro)
    );
  },

  /* filtros bases disponibles */
  obtenerFiltrosBase() {
    return [
      { etiqueta: "Todas", valor: "todas" },
      { etiqueta: "Alta prioridad", valor: "alta" },
    ];
  },
};