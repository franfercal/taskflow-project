/** Tiene los datos que se comparten entre los módulos */

const State = {
  proyectos: ["Desarrollo Web", "FrontEnd", "BackEnd", "JS", "Python"],
  tareas: [],
  filtroActivo: "todas",
  busqueda: "",
  siguienteId: 1,

  /** obtiene todas las tareas */
  obtenerTareas() {
    return [...this.tareas];
  },

  /** proyecto por nombre */
  existeProyecto(nombre) {
    return this.proyectos.includes(nombre);
  },

  /** tareas por proyecto */
  obtenerTareasPorProyecto(proyecto) {
    return this.tareas.filter((t) => t.proyecto === proyecto);
  },

  /** tareas pendientes */
  obtenerTareasPendientes() {
    return this.tareas.filter((t) => !t.hecha);
  },

  /**tareas completadas */
  obtenerTareasCompletadas() {
    return this.tareas.filter((t) => t.hecha);
  },

  /** reset del estado a inicio */
  reset() {
    this.tareas = [];
    this.filtroActivo = "todas";
    this.busqueda = "";
    this.siguienteId = 1;
  },
};