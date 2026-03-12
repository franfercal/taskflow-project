/**
 * Lógica de filtrado: por prioridad, por fecha (hoy/semana/mes), por proyecto, por estado y por texto de búsqueda.
 * También actualiza la UI de chips y elementos de navegación para marcar el filtro activo.
 */

const Filtros = {
  /**
   * Devuelve la fecha de hoy en formato ISO (YYYY-MM-DD). Centraliza el cálculo para filtros por fecha.
   * @returns {string} Fecha en formato "YYYY-MM-DD"
   */
  _obtenerHoyISO() {
    return new Date().toISOString().split("T")[0];
  },

  /**
   * Devuelve un filtro que mantiene solo las tareas con la prioridad dada.
   * @param {string} prioridad - "alta" | "media" | "baja"
   * @returns {function(Array): Array} Función que recibe tareas y devuelve las filtradas por prioridad
   */
  _porPrioridad(prioridad) {
    return (tareas) => tareas.filter((tarea) => tarea.prioridad === prioridad);
  },

  /**
   * Cada clave es un tipo de filtro; el valor es una función que recibe la lista de tareas
   * y devuelve la sublista que cumple el criterio.
   * - todas, alta, media, baja: prioridad
   * - hoy: pendientes cuya fecha es hoy (YYYY-MM-DD)
   * - semana: fecha dentro de la semana actual (lunes–domingo)
   * - mes: fecha en el mes actual
   * - pendientes / completadas-vista: por estado hecha
   */
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

  /**
   * Devuelve las tareas que deben mostrarse: primero se aplica el filtro activo
   * (o filtro por proyecto si el valor es un nombre de proyecto) y luego el texto de búsqueda sobre el título.
   * @returns {Object[]} Lista de tareas visibles según State.filtroActivo y State.busqueda
   */
  obtenerVisibles() {
    const { tareas, filtroActivo, busqueda } = State;
    const aplicarFiltro = this.definiciones[filtroActivo];
    // Filtro por proyecto: tarea visible si tiene ese proyecto en su lista
    let tareasFiltradas = aplicarFiltro
      ? aplicarFiltro(tareas)
      : tareas.filter((tarea) => State.proyectosDeTarea(tarea).includes(filtroActivo));
    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase();
      tareasFiltradas = tareasFiltradas.filter((tarea) => tarea.titulo.toLowerCase().includes(textoBusqueda));
    }
    return tareasFiltradas;
  },

  /**
   * Inicializa el campo de búsqueda: con debounce de 200 ms actualiza State.busqueda y vuelve a renderizar la lista.
   * @returns {void}
   */
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

  /**
   * Cambia el filtro activo, actualiza chips y nav y re-renderiza la lista de tareas.
   * @param {string} nuevoFiltro - "todas", "alta", "media", "baja", "hoy", "semana", "mes", "pendientes", "completadas-vista" o nombre de proyecto
   * @returns {void}
   */
  cambiarFiltro(nuevoFiltro) {
    State.filtroActivo = nuevoFiltro;
    this.actualizarUIFiltros();
    Render.renderizarTareas();
  },

  /**
   * Marca como activos los chips y los ítems del sidebar cuyo data-filtro / data-vista coincide con el filtro activo.
   * @returns {void}
   */
  actualizarUIFiltros() {
    const filtroActual = State.filtroActivo;
    Utils.getElements(".filter-chip").forEach((elemento) => Utils.toggleClass(elemento, "active", elemento.dataset.filtro === filtroActual));
    Utils.getElements(".nav-item[data-vista]").forEach((elemento) => Utils.toggleClass(elemento, "active", elemento.dataset.vista === filtroActual));
  },

};