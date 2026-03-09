/* actualiza contadores del sidebar y sub. de seccion tareas */

const Estadisticas = {
  actualizar() {
    const completadas = State.tareas.filter((t) => t.hecha).length;
    const pendientes = State.tareas.length - completadas;
    this.set("est-completadas", completadas);
    this.set("est-pendientes", pendientes);

    const ahora = new Date();
    const hoyStr = ahora.toISOString().split("T")[0];
    const prefMes = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;
    this.set("cnt-todas", State.tareas.length);
    this.set("cnt-hoy", State.tareas.filter((t) => !t.hecha && t.fecha?.startsWith(hoyStr)).length);
    this.set("cnt-semana", Filtros.definiciones.semana(State.tareas).length);
    this.set("cnt-mes", State.tareas.filter((t) => t.fecha?.startsWith(prefMes)).length);
    this.set("cnt-pendientes", pendientes);
    this.set("cnt-completadas", completadas);

    const fecha = Utils.formatearFecha({ weekday: "long", day: "numeric", month: "long" });
    const plural = pendientes !== 1 ? "s" : "";
    this.set("subtitle-pendientes", `${fecha} · ${pendientes} pendiente${plural}`);
  },

  set(id, valor) {
    const el = Utils.getElement(id);
    if (el) Utils.setText(el, String(valor));
  },
};