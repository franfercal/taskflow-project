/**
 * Estado global de la aplicación
 * listas de proyectos/tareas, filtro activo, texto de búsqueda y el contador de IDs.
 */

const State = {
  /** Valor por defecto cuando una tarea no tiene fecha límite (evita strings mágicos en el código). */
  SIN_FECHA: "Sin fecha",

  /** Lista de nombres de proyectos (por defecto algunos de ejemplo). */
  proyectos: ["Desarrollo Web", "FrontEnd", "BackEnd", "JS", "Python"],
  /** Lista de tareas; cada una tiene id, titulo, proyectos (array de nombres), prioridad, fecha, hecha. */
  tareas: [],

  /**
   * Devuelve el array de nombres de proyectos de una tarea (compatible con formato antiguo proyecto string).
   * @param {Object} tarea - Objeto tarea con proyectos[] o proyecto (legacy)
   * @returns {string[]}
   */
  proyectosDeTarea(tarea) {
    if (!tarea) return [];
    if (Array.isArray(tarea.proyectos)) return tarea.proyectos;
    if (tarea.proyecto) return [tarea.proyecto];
    return [];
  },
  /** Filtro actual: "todas", "alta", "media", "baja", "hoy", "semana", "mes", "pendientes", "completadas-vista" o nombre de proyecto. */
  filtroActivo: "todas",
  /** Texto del buscador; se aplica además del filtro para filtrar por título. */
  busqueda: "",
  /** Siguiente id numérico a asignar a una nueva tarea (auto-incremento). */
  siguienteId: 1,

  /**
   * true si la última petición a la API tuvo éxito.
   * Si false al iniciar, la lista de tareas quedó vacía (sin respaldo en disco en el cliente).
   */
  servidorAlcanzable: false,

  estadoRedLista: "cargando",

  errorRedLista: null,

  peticionesMutacionEnCurso: 0,

  existeProyecto(nombre) {
    return this.proyectos.includes(nombre);
  },
};