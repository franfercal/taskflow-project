/**
 * Controlador de tareas: alta, marcar/desmarcar como hecha y borrado.
 * Todas las operaciones actualizan State, refrescan la UI y persisten en localStorage.
 */

const TareasController = {
  /**
   * Normaliza el argumento proyecto (string o array) a un array de nombres no vacíos.
   * @param {string|string[]} proyecto - Nombre o lista de nombres
   * @returns {string[]}
   */
  _normalizarProyectos(proyecto) {
    if (Array.isArray(proyecto)) return proyecto.filter((nombreProyecto) => nombreProyecto && String(nombreProyecto).trim());
    if (proyecto) return [String(proyecto).trim()];
    return [];
  },

  /**
   * Busca una tarea por id en State.tareas.
   * @param {number} id
   * @returns {Object|undefined}
   */
  _buscarTarea(id) {
    return State.tareas.find((tarea) => tarea.id === id);
  },

  /**
   * Crea una nueva tarea y la inserta al inicio de State.tareas.
   * @param {string} titulo - Texto de la tarea (obligatorio)
   * @param {string|string[]} proyecto - Nombre del proyecto o array de nombres (varios proyectos)
   * @param {string} prioridad - "alta" | "media" | "baja"
   * @param {string} fecha - "YYYY-MM-DD", "YYYY-MM-DD HH:mm" o "Sin fecha"
   * @returns {boolean} true si se añadió, false si el título está vacío
   */
  agregar(titulo, proyecto, prioridad, fecha) {
    if (Utils.estaVacio(titulo)) {
      console.warn("Imposible añadir tarea sin título");
      return false;
    }

    const proyectosArray = this._normalizarProyectos(proyecto);

    const nuevaTarea = {
      id: State.siguienteId++,
      titulo: titulo.trim(),
      proyectos: proyectosArray,
      prioridad: prioridad || "media",
      fecha: fecha?.trim() || State.SIN_FECHA,
      hecha: false,
    };

    State.tareas.unshift(nuevaTarea);
    this.actualizarUI();
    Persistencia.guardar();
    return true;
  },

  /**
   * Añade un proyecto a la tarea (si no está ya). Actualiza UI y persistencia.
   * @param {number} id - id de la tarea
   * @param {string} nombreProyecto - Nombre del proyecto a añadir
   * @returns {boolean} true si se añadió, false si la tarea no existe o el proyecto ya estaba
   */
  añadirAProyecto(id, nombreProyecto) {
    const nombre = nombreProyecto?.trim();
    if (!nombre) return false;
    const tarea = this._buscarTarea(id);
    if (!tarea || !Array.isArray(tarea.proyectos)) return false;
    if (tarea.proyectos.includes(nombre)) return false;
    tarea.proyectos.push(nombre);
    this.actualizarUI();
    Persistencia.guardar();
    return true;
  },

  /**
   * Quita un proyecto de la tarea. Actualiza UI y persistencia.
   * @param {number} id - id de la tarea
   * @param {string} nombreProyecto - Nombre del proyecto a quitar
   * @returns {boolean} true si se quitó, false si la tarea no existe o no tenía ese proyecto
   */
  quitarDeProyecto(id, nombreProyecto) {
    const tarea = this._buscarTarea(id);
    if (!tarea || !Array.isArray(tarea.proyectos)) return false;
    const indice = tarea.proyectos.indexOf(nombreProyecto);
    if (indice === -1) return false;
    tarea.proyectos.splice(indice, 1);
    this.actualizarUI();
    Persistencia.guardar();
    return true;
  },

  /**
   * Cambia el estado "hecha" de la tarea con el id dado (toggle completada/pendiente).
   * @param {number} id - id de la tarea
   * @returns {void}
   */
  alternarHecha(id) {
    const tarea = this._buscarTarea(id);
    if (tarea) {
      tarea.hecha = !tarea.hecha;
      this.actualizarUI();
      Persistencia.guardar();
    }
  },

  /**
   * Elimina la tarea con el id indicado de State.tareas y guarda en localStorage.
   * @param {number} id - id de la tarea a eliminar
   * @returns {void}
   */
  eliminar(id) {
    State.tareas = State.tareas.filter((tarea) => tarea.id !== id);
    this.actualizarUI();
    Persistencia.guardar();
  },

  /**
   * Refresca en pantalla la lista de tareas, la barra lateral de proyectos y los chips de filtros.
   * @returns {void}
   */
  actualizarUI() {
    Render.renderizarTareas();
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
  },
};