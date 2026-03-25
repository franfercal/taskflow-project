// Estado global proyectos, tareas, filtro, búsqueda y cómo va la carga con el servidor

const State = {
  // Texto cuando la tarea no tiene fecha
  SIN_FECHA: "Sin fecha",

  // Nombres del sidebar empiezan con ejemplos hasta que lleguen datos del api
  proyectos: ["Desarrollo Web", "FrontEnd", "BackEnd", "JS", "Python"],
  tareas: [],

  // Soporta tareas viejas con un solo `proyecto` string o el array `proyectos`
  proyectosDeTarea(tarea) {
    if (!tarea) return [];
    if (Array.isArray(tarea.proyectos)) return tarea.proyectos;
    if (tarea.proyecto) return [tarea.proyecto];
    return [];
  },
  // Vista activa: todas, prioridad, fechas, pendientes, completadas o nombre de proyecto
  filtroActivo: "todas",
  busqueda: "",

  estadoRedLista: "cargando",

  errorRedLista: null,

  peticionesMutacionEnCurso: 0,

  existeProyecto(nombre) {
    return this.proyectos.includes(nombre);
  },
};
