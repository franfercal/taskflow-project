/* actualiza contadores y barra progreso */

const Estadisticas = {
  /* actualiza todas estadisticas */
  actualizar() {
    const total = State.tareas.length;
    const completadas = State.tareas.filter((t) => t.hecha).length;
    const pendientes = total - completadas;
    // actualizar valor principales
    this.actualizarElemento("est-completadas", completadas);
    this.actualizarElemento("est-pendientes", pendientes);

    // actualiza contadores
    this.actualizarContadores(completadas, pendientes);

    // act. sub.
    this.actualizarSubtitulo(pendientes);
  },

  /* actualiza un elemento */
  actualizarElemento(id, valor) {
    Utils.setText(Utils.getElement(id), valor);
  },

  /* actualiza contadores barra lateral */
  actualizarContadores(completadas, pendientes) {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split("T")[0];
    const prefMes = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;

    const hoy = State.tareas.filter((t) => !t.hecha && t.fecha?.startsWith(hoyStr)).length;
    const mes = State.tareas.filter((t) => t.fecha?.startsWith(prefMes)).length;
    const semana = Filtros.definiciones.semana(State.tareas).length;

    this.actualizarElemento("cnt-todas", State.tareas.length);
    this.actualizarElemento("cnt-hoy", hoy);
    this.actualizarElemento("cnt-semana", semana);
    this.actualizarElemento("cnt-mes", mes);
    this.actualizarElemento("cnt-pendientes", pendientes);
    this.actualizarElemento("cnt-completadas", completadas);
  },

  /* actualiza sub*/
  actualizarSubtitulo(pendientes) {
    const fecha = Utils.formatearFecha({
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const texto = `${fecha} · ${pendientes} pendiente${
      pendientes !== 1 ? "s" : ""
    }`;

    this.actualizarElemento("subtitle-pendientes", texto);
  },

};