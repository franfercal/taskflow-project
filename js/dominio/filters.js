const Filtros = {
  // Hoy en YYYY-MM-DD (UTC)
  _obtenerHoyISO() {
    return new Date().toISOString().split("T")[0];
  },

  _porPrioridad(prioridad) {
    return (tareas) => tareas.filter((tarea) => tarea.prioridad === prioridad);
  },

  // Mapa nombre de vista → función (tareas) => tareas filtradas
  definiciones: {
    todas: (tareas) => tareas,
    alta(tareas) { return Filtros._porPrioridad("alta")(tareas); },
    media(tareas) { return Filtros._porPrioridad("media")(tareas); },
    baja(tareas) { return Filtros._porPrioridad("baja")(tareas); },
    hoy: (tareas) => {
      const hoy = Filtros._obtenerHoyISO();
      return tareas.filter((tarea) => !tarea.hecha && tarea.fecha?.startsWith(hoy));
    },
    semana: (tareas) => {
      const ahora = new Date();
      const inicioSemana = new Date(ahora);
      inicioSemana.setDate(ahora.getDate() - ((ahora.getDay() + 6) % 7));
      inicioSemana.setHours(0, 0, 0, 0);
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);
      return tareas.filter((tarea) => {
        if (!tarea.fecha || tarea.fecha === State.SIN_FECHA) return false;
        const fechaTarea = new Date(tarea.fecha.split(" ")[0] + "T00:00:00");
        return fechaTarea >= inicioSemana && fechaTarea <= finSemana;
      });
    },
    mes: (tareas) => {
      const ahora = new Date();
      const anio = ahora.getFullYear();
      const mes = String(ahora.getMonth() + 1).padStart(2, "0");
      const prefijo = `${anio}-${mes}`;
      return tareas.filter((tarea) => tarea.fecha && tarea.fecha.startsWith(prefijo));
    },
    pendientes: (tareas) => tareas.filter((tarea) => !tarea.hecha),
    "completadas-vista": (tareas) => tareas.filter((tarea) => tarea.hecha),
  },

  // Filtro activo + búsqueda por título; si filtroActivo es nombre de proyecto filtra por eso.
  obtenerVisibles() {
    const { tareas, filtroActivo, busqueda } = State;
    const aplicarFiltro = this.definiciones[filtroActivo];
    let tareasFiltradas = aplicarFiltro
      ? aplicarFiltro(tareas)
      : tareas.filter((tarea) => State.proyectosDeTarea(tarea).includes(filtroActivo));
    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase();
      tareasFiltradas = tareasFiltradas.filter((tarea) => tarea.titulo.toLowerCase().includes(textoBusqueda));
    }
    return tareasFiltradas;
  },

  init() {
    const campoBusqueda = Utils.getElement("input-busqueda");
    if (!campoBusqueda) return;

    campoBusqueda.addEventListener(
      "input",
      Utils.debounce(() => {
        State.busqueda = campoBusqueda.value.trim();
        Render.renderizarTareas();
      }, 200)
    );
  },

  cambiarFiltro(nuevoFiltro) {
    State.filtroActivo = nuevoFiltro;
    this.actualizarUIFiltros();
    Render.renderizarTareas();
  },

  // Chips de prioridad + ítems del nav marcan .active según State.filtroActivo.
  actualizarUIFiltros() {
    const filtroActual = State.filtroActivo;
    Utils.getElements(".filter-chip").forEach((elemento) => Utils.toggleClass(elemento, "active", elemento.dataset.filtro === filtroActual));
    Utils.getElements(".nav-item[data-vista]").forEach((elemento) => Utils.toggleClass(elemento, "active", elemento.dataset.vista === filtroActual));
  },

};
