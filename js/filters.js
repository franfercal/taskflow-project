/* logica y visualizacion de filtros */

const Filtros = {
  /* filtros disponibles */
  definiciones: {
    todas: (tareas) => tareas,
    alta: (tareas) => tareas.filter((t) => t.prioridad === "alta"),
    hoy: (tareas) => {
      const hoy = new Date().toISOString().split("T")[0];
      return tareas.filter((t) => !t.hecha && t.fecha.startsWith(hoy));
    },
    semana: (tareas) => tareas.filter((t) => !t.hecha),
    "completadas-vista": (tareas) => tareas.filter((t) => t.hecha),
  },

  /* tareas segun filtro activo */
  obtenerVisibles() {
    const { tareas } = State;
    const filtro = State.filtroActivo;

    let resultado;
    if (this.definiciones[filtro]) {
      resultado = this.definiciones[filtro](tareas);
    } else {
      resultado = tareas.filter((t) => t.proyecto === filtro);
    }

    // aplica búsqueda de texto sobre el resultado
    if (State.busqueda) {
      const texto = State.busqueda.toLowerCase();
      resultado = resultado.filter((t) =>
        t.titulo.toLowerCase().includes(texto)
      );
    }

    return resultado;
  },

  /* inicializa el listener del input de búsqueda */
  init() {
    const input = Utils.getElement("input-busqueda");
    if (!input) return;

    input.addEventListener(
      "input",
      Utils.debounce(() => {
        State.busqueda = input.value.trim();
        Render.renderizarTareas();
      }, 200)
    );
  },

  /* cambia filtro activo y actualiza */
  cambiarFiltro(nuevoFiltro) {
    State.filtroActivo = nuevoFiltro;
    this.actualizarUIFiltros();
    Render.renderizarTareas();
  },

  /* atualiza botones filtro */
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