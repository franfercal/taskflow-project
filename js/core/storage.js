/**
 * Persistencia en localStorage.
 * Guarda y carga: lista de tareas, lista de proyectos y el siguiente id de tarea.
 * Las claves usadas evitan colisiones con otras apps en el mismo origen.
 */

const Persistencia = {
  /** Claves bajo las que se guardan los datos en localStorage. */
  KEYS: {
    TAREAS: "taskflow_tareas",
    PROYECTOS: "taskflow_proyectos",
    SIGUIENTE_ID: "taskflow_siguiente_id",
  },

  /**
   * Escribe en localStorage el estado actual: tareas, proyectos y siguienteId.
   * Ante error (p. ej. almacenamiento lleno o privado), solo se registra en consola.
   * @returns {void}
   */
  guardar() {
    try {
      localStorage.setItem(this.KEYS.TAREAS, JSON.stringify(State.tareas));
      localStorage.setItem(this.KEYS.PROYECTOS, JSON.stringify(State.proyectos));
      localStorage.setItem(this.KEYS.SIGUIENTE_ID, String(State.siguienteId));
    } catch (error) {
      console.error("Error al guardar", error);
    }
  },

  /**
   * Migración: tareas antiguas con "proyecto" (string) pasan a "proyectos" (array).
   * Modifica el array in situ.
   * @param {Array} tareas - Lista de tareas de State
   */
  _migrarTareasProyectoLegacy(tareas) {
    tareas.forEach((tarea) => {
      if (!Array.isArray(tarea.proyectos)) {
        tarea.proyectos = tarea.proyecto ? [tarea.proyecto] : [];
        delete tarea.proyecto;
      }
    });
  },

  /**
   * Lee desde localStorage y actualiza State (tareas, proyectos, siguienteId).
   * Si no hay datos guardados o hay error al parsear, State mantiene sus valores por defecto.
   * @returns {void}
   */
  cargar() {
    try {
      const tareas = localStorage.getItem(this.KEYS.TAREAS);
      const proyectos = localStorage.getItem(this.KEYS.PROYECTOS);
      const id = localStorage.getItem(this.KEYS.SIGUIENTE_ID);
      if (tareas) State.tareas = JSON.parse(tareas);
      if (proyectos) State.proyectos = JSON.parse(proyectos);
      if (id) {
        const siguienteIdParseado = parseInt(id, 10);
        if (!Number.isNaN(siguienteIdParseado)) State.siguienteId = siguienteIdParseado;
      }
      this._migrarTareasProyectoLegacy(State.tareas);
    } catch (error) {
      console.error("Error al cargar", error);
    }
  },
};