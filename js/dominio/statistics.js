const Estadisticas = {
  /**
   * Recalcula y escribe en el DOM:
   * - est-completadas / est-pendientes (Progreso)
   * - cnt-todas, cnt-hoy, cnt-semana, cnt-mes, cnt-pendientes, cnt-completadas (Vistas)
   * - subtitle-pendientes (ej. "jueves, 12 de marzo · 3 pendientes")
   * - btn-limpiar-completadas: disabled si no hay tareas completadas
   * @returns {void}
   */
  actualizar() {
    const completadas = State.tareas.filter((tarea) => tarea.hecha).length;
    const pendientes = State.tareas.length - completadas;
    this.set("est-completadas", completadas);
    this.set("est-pendientes", pendientes);

    const ahora = new Date();
    const prefijoMes = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;
    this.set("cnt-todas", State.tareas.length);
    this.set("cnt-hoy", State.tareas.filter((tarea) => !tarea.hecha && tarea.fecha?.startsWith(Filtros._obtenerHoyISO())).length);
    this.set("cnt-semana", Filtros.definiciones.semana(State.tareas).length);
    this.set("cnt-mes", State.tareas.filter((tarea) => tarea.fecha?.startsWith(prefijoMes)).length);
    this.set("cnt-pendientes", pendientes);
    this.set("cnt-completadas", completadas);

    const fechaFormateada = Utils.formatearFecha({ weekday: "long", day: "numeric", month: "long" });
    const plural = Utils.plural(pendientes);

    // Subtítulo según fase de red: carga inicial, error al listar o vista normal.
    if (State.estadoRedLista === "cargando") {
      this.set("subtitle-pendientes", `${fechaFormateada} · Sincronizando con el servidor…`);
    } else if (State.estadoRedLista === "error") {
      const detalle = State.errorRedLista;
      const codigo = detalle?.codigoHttp;
      let mensajeSubtitulo = "No se pudieron cargar las tareas.";
      if (detalle?.esErrorRed) {
        mensajeSubtitulo = "Sin conexión con el servidor. Comprueba que Node esté en marcha.";
      } else if (codigo >= 400 && codigo < 500) {
        mensajeSubtitulo = `Error del cliente (${codigo}). Revisa la petición o los datos enviados.`;
      } else if (codigo >= 500) {
        mensajeSubtitulo = `Error del servidor (${codigo}). Intenta de nuevo más tarde.`;
      } else if (detalle?.mensaje) {
        mensajeSubtitulo = detalle.mensaje;
      }
      this.set("subtitle-pendientes", `${fechaFormateada} · ${mensajeSubtitulo}`);
    } else {
      this.set("subtitle-pendientes", `${fechaFormateada} · ${pendientes} pendiente${plural}`);
    }

    // Habilitar "Limpiar completadas" solo si hay al menos una tarea hecha (evita clics vacíos).
    const botonLimpiarCompletadas = Utils.getElement("btn-limpiar-completadas");
    if (botonLimpiarCompletadas) {
      botonLimpiarCompletadas.disabled = completadas === 0 || State.estadoRedLista !== "exito";
    }
  },

  /**
   * Asigna el texto de un elemento por id.
   * @param {string} id - id del elemento en el DOM
   * @param {string|number} valor - valor a mostrar (se convierte a string)
   * @returns {void}
   */
  set(id, valor) {
    const elemento = Utils.getElement(id);
    if (elemento) Utils.setText(elemento, String(valor));
  },
};