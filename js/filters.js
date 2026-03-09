/* filtros - fecha - proyecto - busqueda - actualización de chips/nav */

const Filtros = {
  definiciones: {
    todas: (tareas) => tareas,
    alta: (tareas) => tareas.filter((t) => t.prioridad === "alta"),
    media: (tareas) => tareas.filter((t) => t.prioridad === "media"),
    baja: (tareas) => tareas.filter((t) => t.prioridad === "baja"),
    hoy: (tareas) => {
      const hoy = new Date().toISOString().split("T")[0];
      return tareas.filter((t) => !t.hecha && t.fecha?.startsWith(hoy));
    },
    semana: (tareas) => {
      const ahora = new Date();
      const inicioSemana = new Date(ahora);
      inicioSemana.setDate(ahora.getDate() - ((ahora.getDay() + 6) % 7));
      inicioSemana.setHours(0, 0, 0, 0);
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      finSemana.setHours(23, 59, 59, 999);
      return tareas.filter((t) => {
        if (!t.fecha || t.fecha === "Sin fecha") return false;
        const fecha = new Date(t.fecha.split(" ")[0] + "T00:00:00");
        return fecha >= inicioSemana && fecha <= finSemana;
      });
    },
    mes: (tareas) => {
      const ahora = new Date();
      const anio = ahora.getFullYear();
      const mes = String(ahora.getMonth() + 1).padStart(2, "0");
      const prefijo = `${anio}-${mes}`;
      return tareas.filter((t) => t.fecha && t.fecha.startsWith(prefijo));
    },
    pendientes: (tareas) => tareas.filter((t) => !t.hecha),
    "completadas-vista": (tareas) => tareas.filter((t) => t.hecha),
  },

  /** tareas visibles por filtro activo y texto de busqueda */
  obtenerVisibles() {
    const { tareas, filtroActivo, busqueda } = State;
    const fn = this.definiciones[filtroActivo];
    let lista = fn ? fn(tareas) : tareas.filter((t) => t.proyecto === filtroActivo);
    if (busqueda) {
      const texto = busqueda.toLowerCase();
      lista = lista.filter((t) => t.titulo.toLowerCase().includes(texto));
    }
    return lista;
  },

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

  cambiarFiltro(nuevoFiltro) {
    State.filtroActivo = nuevoFiltro;
    this.actualizarUIFiltros();
    Render.renderizarTareas();
  },

  actualizarUIFiltros() {
    const activo = State.filtroActivo;
    Utils.getElements(".filter-chip").forEach((el) => Utils.toggleClass(el, "active", el.dataset.filtro === activo));
    Utils.getElements(".nav-item[data-vista]").forEach((el) => Utils.toggleClass(el, "active", el.dataset.vista === activo));
  },

};