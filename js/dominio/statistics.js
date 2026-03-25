const Estadisticas = {
  // Rellena contadores del sidebar, subtítulo y estado del botón limpiar completadas.
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

    // Subtítulo cargando, error con detalle o modo normal.
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

    const botonLimpiarCompletadas = Utils.getElement("btn-limpiar-completadas");
    if (botonLimpiarCompletadas) {
      botonLimpiarCompletadas.disabled = completadas === 0 || State.estadoRedLista !== "exito";
    }
  },

  set(id, valor) {
    const elemento = Utils.getElement(id);
    if (elemento) Utils.setText(elemento, String(valor));
  },
};
