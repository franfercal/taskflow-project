/**
 * Controlador de tareas: alta, marcar/desmarcar como hecha y borrado.
 * Persistencia vía API (`js/api/client.js` → `TaskflowApiClient` / `ApiTareas`).
 * Gestión de estados de red: indicador en mutaciones, errores con código HTTP y reintento de carga inicial.
 */

const TareasController = {
  /**
   * Normaliza el argumento proyecto (string o array) a un array de nombres no vacíos.
   */
  _normalizarProyectos(proyecto) {
    if (Array.isArray(proyecto)) return proyecto.filter((nombreProyecto) => nombreProyecto && String(nombreProyecto).trim());
    if (proyecto) return [String(proyecto).trim()];
    return [];
  },

  /**
   * Ejecuta una operación asíncrona que modifica datos en el servidor y actualiza la barra de actividad global.
   * @template T
   * @param {() => Promise<T>} operacion
   * @returns {Promise<T>}
   */
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

  /**
   * Expone el contador de mutación para otros controladores (p. ej. `ProyectosController.eliminar`).
   * @template T
   * @param {() => Promise<T>} operacion
   * @returns {Promise<T>}
   */
  conIndicadorMutacion(operacion) {
    return this._conIndicadorMutacion(operacion);
  },

  /**
   * Muestra un aviso al usuario si SweetAlert2 está cargado; incluye código HTTP si existe.
   */
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

  /**
   * Obtiene tareas del servidor y fusiona nombres de proyecto en `State.proyectos`.
   * Actualiza `estadoRedLista` y `errorRedLista` para la UI (éxito / error con 400, 500 o fallo de red).
   * No llama a `Render`: quien invoque debe pintar después (p. ej. `App.init` o `reintentarCargaLista`).
   * @returns {Promise<void>}
   */
  async sincronizarConServidorAlInicio() {
    try {
      const lista = await ApiTareas.listar();
      if (!Array.isArray(lista)) {
        throw Object.assign(new Error("La API no devolvió una lista de tareas"), { status: 400 });
      }
      State.tareas = lista;
      State.siguienteId = lista.length === 0 ? 1 : Math.max(...lista.map((t) => t.id)) + 1;
      const nombresProyecto = new Set(State.proyectos);
      lista.forEach((tarea) => {
        State.proyectosDeTarea(tarea).forEach((nombre) => nombresProyecto.add(nombre));
      });
      State.proyectos = [...nombresProyecto];
      State.servidorAlcanzable = true;
      State.estadoRedLista = "exito";
      State.errorRedLista = null;
    } catch (error) {
      console.warn("TaskFlow: API no disponible al iniciar.", error);
      State.tareas = [];
      State.siguienteId = 1;
      State.servidorAlcanzable = false;
      const codigoHttp = typeof error?.status === "number" ? error.status : undefined;
      State.estadoRedLista = "error";
      State.errorRedLista = {
        codigoHttp,
        mensaje: error instanceof Error ? error.message : String(error),
        esErrorRed: codigoHttp === undefined,
      };
    }
  },

  /**
   * Vuelve a pedir la lista al servidor tras un error (botón "Reintentar" en la UI).
   * @returns {Promise<void>}
   */
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

  /**
   * Busca una tarea por id en State.tareas.
   * @param {number} id
   * @returns {Object|undefined}
   */
  _buscarTarea(id) {
    return State.tareas.find((tarea) => tarea.id === id);
  },

  /**
   * Crea una tarea en el servidor y la inserta al inicio de State.tareas.
   * @param {string} titulo - Texto de la tarea (obligatorio)
   * @param {string|string[]} proyecto - Nombre del proyecto o array de nombres (varios proyectos)
   * @param {string} prioridad - "alta" | "media" | "baja"
   * @param {string} fecha - "YYYY-MM-DD", "YYYY-MM-DD HH:mm" o "Sin fecha"
   * @returns {Promise<boolean>} true si se añadió
   */
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
      State.siguienteId = Math.max(State.siguienteId, creada.id + 1);
      this.actualizarUI();
      State.servidorAlcanzable = true;
      return true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo crear la tarea");
      return false;
    }
  },

  /**
   * Añade un proyecto a la tarea en el servidor y en memoria.
   * @param {number} id - id de la tarea
   * @param {string} nombreProyecto - Nombre del proyecto a añadir
   * @returns {Promise<boolean>}
   */
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
      State.servidorAlcanzable = true;
      return true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo actualizar la tarea");
      return false;
    }
  },

  /**
   * Quita un proyecto de la tarea en el servidor y en memoria.
   * @param {number} id - id de la tarea
   * @param {string} nombreProyecto - Nombre del proyecto a quitar
   * @returns {Promise<boolean>}
   */
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
      State.servidorAlcanzable = true;
      return true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo actualizar la tarea");
      return false;
    }
  },

  /**
   * Cambia el estado "hecha" de la tarea con el id dado (toggle completada/pendiente).
   * @param {number} id - id de la tarea
   * @returns {Promise<void>}
   */
  async alternarHecha(id) {
    const tarea = this._buscarTarea(id);
    if (!tarea) return;
    const nuevoValor = !tarea.hecha;
    try {
      await this._conIndicadorMutacion(() => ApiTareas.actualizar(id, { hecha: nuevoValor }));
      tarea.hecha = nuevoValor;
      this.actualizarUI();
      State.servidorAlcanzable = true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo actualizar la tarea");
    }
  },

  /**
   * Elimina la tarea con el id indicado en el servidor y en State.
   * @param {number} id - id de la tarea a eliminar
   * @returns {Promise<void>}
   */
  async eliminar(id) {
    try {
      await this._conIndicadorMutacion(() => ApiTareas.eliminar(id));
      State.tareas = State.tareas.filter((tarea) => tarea.id !== id);
      this.actualizarUI();
      State.servidorAlcanzable = true;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudo eliminar la tarea");
    }
  },

  /**
   * Elimina todas las tareas completadas vía API.
   * @returns {Promise<number>} Cantidad eliminada según el servidor (o 0 si error)
   */
  async eliminarTodasCompletadas() {
    try {
      const resultado = await this._conIndicadorMutacion(() => ApiTareas.eliminarCompletadas());
      const cantidad = typeof resultado?.eliminadas === "number" ? resultado.eliminadas : 0;
      State.tareas = State.tareas.filter((tarea) => !tarea.hecha);
      this.actualizarUI();
      State.servidorAlcanzable = true;
      return cantidad;
    } catch (error) {
      this._notificarErrorRed(error, "No se pudieron eliminar las tareas completadas");
      return 0;
    }
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
