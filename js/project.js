/* proyecto - agregar - eliminar - contar pendiente */

const ProyectosController = {
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

  eliminar(nombre) {
    const indice = State.proyectos.indexOf(nombre);
    if (indice > -1) {
      State.proyectos.splice(indice, 1);
      State.tareas = State.tareas.filter((t) => t.proyecto !== nombre);
      if (State.filtroActivo === nombre) State.filtroActivo = "todas";
      this.actualizarUI();
      Render.renderizarTareas();
      Persistencia.guardar();
      return true;
    }
    return false;
  },

  obtenerPendientesPorProyecto(proyecto) {
    return State.tareas.filter(
      (t) => t.proyecto === proyecto && !t.hecha
    ).length;
  },

  actualizarUI() {
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Modal.sincronizarSelectProyecto();
  },
};