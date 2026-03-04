/* actualiza contadores y barra progreso */

const Estadisticas = {
  /* actualiza todas estadisticas */
  actualizar() {
    const total = State.tareas.length;
    const completadas = State.tareas.filter((t) => t.hecha).length;
    const pendientes = total - completadas;
    const porcentaje = total ? Math.round((completadas / total) * 100) : 0;

    // actualizar valor principales
    this.actualizarElemento("est-total", total);
    this.actualizarElemento("est-completadas", completadas);
    this.actualizarElemento("est-porcentaje", `${porcentaje}%`);

    // actualiza barra progreso
    const fillElement = Utils.getElement("est-fill");
    if (fillElement) {
      fillElement.style.width = `${porcentaje}%`;
    }

    // actualiza contadores 
    this.actualizarContadores(completadas, pendientes);

    // act. sub.
    this.actualizarSubtitulo(pendientes);
  },

  /* actualiza un elemento */
  actualizarElemento(id, valor) {
    Utils.setText(Utils.getElement(id), valor);
  },

  /*actualiza contadorbarra lateral */
  actualizarContadores(completadas, pendientes) {
    const hoy = State.tareas.filter(
      (t) => !t.hecha && t.fecha.toLowerCase().includes("hoy")
    ).length;

    this.actualizarElemento("cnt-todas", State.tareas.length);
    this.actualizarElemento("cnt-hoy", hoy);
    this.actualizarElemento("cnt-semana", pendientes);
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

  /* resumen estadisticas */
  obtenerResumen() {
    const total = State.tareas.length;
    const completadas = State.tareas.filter((t) => t.hecha).length;
    const pendientes = total - completadas;
    const porcentaje = total ? Math.round((completadas / total) * 100) : 0;

    return {
      total,
      completadas,
      pendientes,
      porcentaje,
    };
  },
};