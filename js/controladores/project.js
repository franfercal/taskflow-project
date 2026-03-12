/**
 * Controlador de proyectos: crear, eliminar y contar tareas pendientes por proyecto.
 * Al eliminar un proyecto se borran también todas sus tareas y se corrige el filtro activo si era ese proyecto.
 */

const ProyectosController = {
  /**
   * Añade un nuevo proyecto si el nombre no está vacío y no existe ya.
   * @param {string} nombre - Nombre del proyecto
   * @returns {boolean} true si se añadió, false si está vacío o duplicado
   */
  agregar(nombre) {
    const nombreLimpio = nombre?.trim();

    if (Utils.estaVacio(nombreLimpio)) {
      console.warn("Nombre de proyecto vacío");
      return false;
    }

    if (State.existeProyecto(nombreLimpio)) {
      console.warn("El proyecto ya existe");
      return false;
    }

    State.proyectos.push(nombreLimpio);
    this.actualizarUI();
    Persistencia.guardar();
    return true;
  },

  /**
   * Elimina el proyecto: lo quita de la lista y de los proyectos de cada tarea (no borra tareas).
   * Si el filtro activo era ese proyecto, se cambia a "todas".
   * @param {string} nombre - Nombre del proyecto a eliminar
   * @returns {boolean} true si existía y se eliminó
   */
  eliminar(nombre) {
    const indice = State.proyectos.indexOf(nombre);
    if (indice > -1) {
      State.proyectos.splice(indice, 1);
      // Quitar este proyecto de la lista de proyectos de cada tarea (no eliminar la tarea)
      State.tareas.forEach((tarea) => {
        if (Array.isArray(tarea.proyectos)) {
          const indiceProyecto = tarea.proyectos.indexOf(nombre);
          if (indiceProyecto !== -1) tarea.proyectos.splice(indiceProyecto, 1);
        }
      });
      if (State.filtroActivo === nombre) State.filtroActivo = "todas";
      this.actualizarUI();
      Render.renderizarTareas();
      Persistencia.guardar();
      return true;
    }
    return false;
  },

  /**
   * Cuenta cuántas tareas pendientes (no hechas) tiene el proyecto dado (tarea puede estar en varios proyectos).
   * @param {string} proyecto - Nombre del proyecto
   * @returns {number}
   */
  obtenerPendientesPorProyecto(proyecto) {
    return State.tareas.filter(
      (tarea) => State.proyectosDeTarea(tarea).includes(proyecto) && !tarea.hecha
    ).length;
  },

  /**
   * Actualiza la barra lateral de proyectos, los chips de filtros y el select de proyectos del modal.
   * @returns {void}
   */
  actualizarUI() {
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Modal.sincronizarSelectProyecto();
  },
};