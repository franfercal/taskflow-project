// Tareas: crud vía api, barra de “estoy guardando” y sync al arrancar.

const TareasController = {
  _normalizarProyectos(proyecto) {
    if (Array.isArray(proyecto)) return proyecto.filter((nombreProyecto) => nombreProyecto && String(nombreProyecto).trim());
    if (proyecto) return [String(proyecto).trim()];
    return [];
  },

  // Enciende la barra azul mientras dura el fetch de crear/patch/delete.
  async _conIndicadorMutacion(operacion) {
    State.peticionesMutacionEnCurso += 1;
    Render.actualizarBarraActividadRed();
    try {
      return await operacion();
    } finally {
      State.peticionesMutacionEnCurso -= 1;
      Render.actualizarBarraActividadRed();
    }
  },

  // Igual que _conIndicadorMutacion pero público para ProyectosController.eliminar.
  conIndicadorMutacion(operacion) {
    return this._conIndicadorMutacion(operacion);
  },

  _notificarErrorRed(error, titulo) {
    console.error(error);
    if (typeof Swal !== "undefined") {
      const codigo = typeof error?.status === "number" ? error.status : null;
      Swal.fire({
        icon: "error",
        title: titulo,
        text: error?.message || "No se pudo completar la operación en el servidor.",
        footer: codigo != null ? `Código HTTP: ${codigo}` : "Sin código HTTP (posible fallo de red o CORS).",
      });
    }
  },

  // GET inicial; no pinta solo: quien llama hace render después.
  async sincronizarConServidorAlInicio() {
    try {
      const lista = await ApiTareas.listar();
      if (!Array.isArray(lista)) {
        throw Object.assign(new Error("La API no devolvió una lista de tareas"), { status: 400 });
      }
      State.tareas = lista;
      const nombresProyecto = new Set(State.proyectos);
      lista.forEach((tarea) => {
        State.proyectosDeTarea(tarea).forEach((nombre) => nombresProyecto.add(nombre));
      });
      State.proyectos = [...nombresProyecto];
      State.estadoRedLista = "exito";
      State.errorRedLista = null;
    } catch (error) {
      console.warn("TaskFlow: API no disponible al iniciar.", error);
      State.tareas = [];
      const codigoHttp = typeof error?.status === "number" ? error.status : undefined;
      State.estadoRedLista = "error";
      State.errorRedLista = {
        codigoHttp,
        mensaje: error instanceof Error ? error.message : String(error),
        esErrorRed: codigoHttp === undefined,
      };
    }
  },

  async reintentarCargaLista() {
    State.estadoRedLista = "cargando";
    State.errorRedLista = null;
    Render.renderizarTareas();
    Estadisticas.actualizar();
    await this.sincronizarConServidorAlInicio();
    Render.renderizarTareas();
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Estadisticas.actualizar();
  },

  _buscarTarea(id) {
    return State.tareas.find((tarea) => tarea.id === id);
  },

  async agregar(titulo, proyecto, prioridad, fecha) {
    if (Utils.estaVacio(titulo)) {
      console.warn("Imposible añadir tarea sin título");
      return false;
    }

    const proyectosArray = this._normalizarProyectos(proyecto);

    const cuerpo = {
      titulo: titulo.trim(),
      proyectos: proyectosArray,
      prioridad: prioridad || "media",
      fecha: fecha?.trim() || State.SIN_FECHA,
      hecha: false,
    };

    try {
      const creada = await this._conIndicadorMutacion(() => ApiTareas.crear(cuerpo));
      State.tareas.unshift(creada);
      this.actualizarUI();
      return true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo crear la tarea");
      return false;
    }
  },

  async añadirAProyecto(id, nombreProyecto) {
    const nombre = nombreProyecto?.trim();
    if (!nombre) return false;
    const tarea = this._buscarTarea(id);
    if (!tarea || !Array.isArray(tarea.proyectos)) return false;
    if (tarea.proyectos.includes(nombre)) return false;
    const nuevosProyectos = [...tarea.proyectos, nombre];
    try {
      await this._conIndicadorMutacion(() => ApiTareas.actualizar(id, { proyectos: nuevosProyectos }));
      tarea.proyectos.push(nombre);
      this.actualizarUI();
      return true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo actualizar la tarea");
      return false;
    }
  },

  async quitarDeProyecto(id, nombreProyecto) {
    const tarea = this._buscarTarea(id);
    if (!tarea || !Array.isArray(tarea.proyectos)) return false;
    const indice = tarea.proyectos.indexOf(nombreProyecto);
    if (indice === -1) return false;
    const nuevosProyectos = tarea.proyectos.filter((p) => p !== nombreProyecto);
    try {
      await this._conIndicadorMutacion(() => ApiTareas.actualizar(id, { proyectos: nuevosProyectos }));
      tarea.proyectos.splice(indice, 1);
      this.actualizarUI();
      return true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo actualizar la tarea");
      return false;
    }
  },

  async alternarHecha(id) {
    const tarea = this._buscarTarea(id);
    if (!tarea) return;
    const nuevoValor = !tarea.hecha;
    try {
      await this._conIndicadorMutacion(() => ApiTareas.actualizar(id, { hecha: nuevoValor }));
      tarea.hecha = nuevoValor;
      this.actualizarUI();
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo actualizar la tarea");
    }
  },

  async eliminar(id) {
    try {
      await this._conIndicadorMutacion(() => ApiTareas.eliminar(id));
      State.tareas = State.tareas.filter((tarea) => tarea.id !== id);
      this.actualizarUI();
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo eliminar la tarea");
    }
  },

  async eliminarTodasCompletadas() {
    try {
      const resultado = await this._conIndicadorMutacion(() => ApiTareas.eliminarCompletadas());
      const cantidad = typeof resultado?.eliminadas === "number" ? resultado.eliminadas : 0;
      State.tareas = State.tareas.filter((tarea) => !tarea.hecha);
      this.actualizarUI();
      return cantidad;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudieron eliminar las tareas completadas");
      return 0;
    }
  },

  actualizarUI() {
    Render.renderizarTareas();
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
  },
};
