/**
 * Controlador de proyectos: crear, eliminar y contar tareas pendientes por proyecto.
 * Los nombres del sidebar viven en memoria; las tareas se sincronizan con la API (`js/api/client.js`).
 */

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
        // Formato antiguo (`proyecto` string): alinear memoria con el borrado lateral.
        delete tarea.proyecto;
      }
    });
    if (State.filtroActivo === nombre) State.filtroActivo = "todas";

    try {
      await TareasController.conIndicadorMutacion(() =>
        Promise.all(
          State.tareas.map((tarea) =>
            ApiTareas.actualizar(tarea.id, {
              // `proyectosDeTarea` cubre array y legacy; nunca hacer spread de `undefined`.
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
