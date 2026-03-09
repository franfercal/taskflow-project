/* crud tareas agregar-marcar hecha-eliminar - actualiza UI - persistencia */

const TareasController = {
  agregar(titulo, proyecto, prioridad, fecha) {
    if (Utils.estaVacio(titulo)) {
      console.warn("Imposible añadir tarea sin título");
      return false;
    }

    const nuevaTarea = {
      id: State.siguienteId++,
      titulo: titulo.trim(),
      proyecto,
      prioridad,
      fecha: fecha?.trim() || "Sin fecha",
      hecha: false,
    };

    State.tareas.unshift(nuevaTarea);
    this.actualizarUI();
    Persistencia.guardar();
    return true;
  },

  alternarHecha(id) {
    const tarea = State.tareas.find((t) => t.id === id);
    if (tarea) {
      tarea.hecha = !tarea.hecha;
      this.actualizarUI();
      Persistencia.guardar();
    }
  },

  eliminar(id) {
    State.tareas = State.tareas.filter((t) => t.id !== id);
    this.actualizarUI();
    Persistencia.guardar();
  },

  actualizarUI() {
    Render.renderizarTareas();
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
  },
};