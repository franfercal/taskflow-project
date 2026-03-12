/**
 * Actualiza todos los contadores del sidebar (Vistas, Progreso) y el subtítulo de la sección "Mis Tareas".
 * Se invoca tras cada renderizado de la lista de tareas.
 */

const Estadisticas = {
  /**
   * Recalcula y escribe en el DOM:
   * - est-completadas / est-pendientes (Progreso)
   * - cnt-todas, cnt-hoy, cnt-semana, cnt-mes, cnt-pendientes, cnt-completadas (Vistas)
   * - subtitle-pendientes (ej. "jueves, 12 de marzo · 3 pendientes")
   * @returns {void}
   */
  actualizar() {
    const completadas = State.tareas.filter((tarea) => tarea.hecha).length;
    const pendientes = State.tareas.length - completadas;
    this.set("est-completadas", completadas);
    this.set("est-pendientes", pendientes);

    const ahora = new Date();
    const prefijoMes = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;
    this.set("cnt-todas", State.tareas.length);
    this.set("cnt-hoy", State.tareas.filter((tarea) => !tarea.hecha && tarea.fecha?.startsWith(Filtros._obtenerHoyISO())).length);
    this.set("cnt-semana", Filtros.definiciones.semana(State.tareas).length);
    this.set("cnt-mes", State.tareas.filter((tarea) => tarea.fecha?.startsWith(prefijoMes)).length);
    this.set("cnt-pendientes", pendientes);
    this.set("cnt-completadas", completadas);

    const fechaFormateada = Utils.formatearFecha({ weekday: "long", day: "numeric", month: "long" });
    const plural = Utils.plural(pendientes);
    this.set("subtitle-pendientes", `${fechaFormateada} · ${pendientes} pendiente${plural}`);
  },

  /**
   * Asigna el texto de un elemento por id.
   * @param {string} id - id del elemento en el DOM
   * @param {string|number} valor - valor a mostrar (se convierte a string)
   * @returns {void}
   */
  set(id, valor) {
    const elemento = Utils.getElement(id);
    if (elemento) Utils.setText(elemento, String(valor));
  },
};