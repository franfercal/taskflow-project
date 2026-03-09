/* estado global*/

const State = {
  proyectos: ["Desarrollo Web", "FrontEnd", "BackEnd", "JS", "Python"],
  tareas: [],
  filtroActivo: "todas",
  busqueda: "",
  siguienteId: 1,

  existeProyecto(nombre) {
    return this.proyectos.includes(nombre);
  },
};