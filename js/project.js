/* Creación y eliminación de proyectos */

const ProyectosController = {
  /* añade nuevo proyecto */
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
    Persistencia.autoguardar();
    return true;
  },

  /* elimina proyecto */
  eliminar(nombre) {
    const indice = State.proyectos.indexOf(nombre);
    if (indice > -1) {
      State.proyectos.splice(indice, 1);
      //elimina tareas de proyecto
      State.tareas = State.tareas.filter((t) => t.proyecto !== nombre);
      this.actualizarUI();
      Persistencia.autoguardar();
      return true;
    }
    return false;
  },

  /* obtiene todos los proyectos */
  obtenerTodos() {
    return [...State.proyectos];
  },

  /* obtiene tareas pend de proeycto */
  obtenerPendientesPorProyecto(proyecto) {
    return State.tareas.filter(
      (t) => t.proyecto === proyecto && !t.hecha
    ).length;
  },

  /* actualiza todos los comp de proyectos*/
  actualizarUI() {
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Modal.sincronizarSelectProyecto();
  },
};