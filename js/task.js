/* Creación, actualización y eliminación de tareas */

const TareasController = {
  /* añade nueva tarea al estado */
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
    Persistencia.autoguardar();
    return true;
  },

  /* alterna estado tarea */
  alternarHecha(id) {
    const tarea = State.tareas.find((t) => t.id === id);
    if (tarea) {
      tarea.hecha = !tarea.hecha;
      this.actualizarUI();
      Persistencia.autoguardar();
    }
  },

  /* elimina tarea */
  eliminar(id) {
    State.tareas = State.tareas.filter((t) => t.id !== id);
    this.actualizarUI();
    Persistencia.autoguardar();
  },

  /* edita tarea */
  editar(id, actualizaciones) {
    const tarea = State.tareas.find((t) => t.id === id);
    if (tarea) {
      Object.assign(tarea, actualizaciones);
      this.actualizarUI();
      Persistencia.autoguardar();
      return true;
    }
    return false;
  },

  /* actualiza todo rela con tareas */
  actualizarUI() {
    Render.renderizarTareas();
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Estadisticas.actualizar();
  },
};