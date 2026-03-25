// Proyectos en el sidebar (memoria) + sync de tareas al api cuando borras uno.

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
    return true;
  },


  async eliminar(nombre) {
    const indice = State.proyectos.indexOf(nombre);
    if (indice === -1) {
      return false;
    }

    State.proyectos.splice(indice, 1);
    State.tareas.forEach((tarea) => {
      if (Array.isArray(tarea.proyectos)) {
        const indiceProyecto = tarea.proyectos.indexOf(nombre);
        if (indiceProyecto !== -1) tarea.proyectos.splice(indiceProyecto, 1);
      } else if (tarea.proyecto === nombre) {
        // Tarea vieja con un solo string proyecto: lo quitamos a mano.
        delete tarea.proyecto;
      }
    });
    if (State.filtroActivo === nombre) State.filtroActivo = "todas";

    try {
      await TareasController.conIndicadorMutacion(() =>
        Promise.all(
          State.tareas.map((tarea) =>
            ApiTareas.actualizar(tarea.id, {
              // Sin [...undefined]: legacy y array van por proyectosDeTarea.
              proyectos: State.proyectosDeTarea(tarea).filter((nombreProyecto) => nombreProyecto !== nombre),
            })
          )
        )
      );
    } catch (error) {
      console.error(error);
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "error",
          title: "Error al sincronizar",
          text: error?.message || "No se pudo actualizar todas las tareas en el servidor.",
        });
      }
    }

    this.actualizarUI();
    Render.renderizarTareas();
    return true;
  },

  obtenerPendientesPorProyecto(proyecto) {
    return State.tareas.filter(
      (tarea) => State.proyectosDeTarea(tarea).includes(proyecto) && !tarea.hecha
    ).length;
  },

  actualizarUI() {
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Modal.sincronizarSelectProyecto();
  },
};
