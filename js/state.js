/** Tiene los datos que se comparten entre los módulos */

const State = {
  proyectos: ["Desarrollo Web", "FrontEnd", "BackEnd", "JS", "Python"],
  tareas: [],
  filtroActivo: "todas",
  busqueda: "",
  siguienteId: 1,

  /** proyecto por nombre */
  existeProyecto(nombre) {
    return this.proyectos.includes(nombre);
  },

  /** reset del estado a inicio */
  reset() {
    this.tareas = [];
    this.filtroActivo = "todas";
    this.busqueda = "";
    this.siguienteId = 1;
  },
};