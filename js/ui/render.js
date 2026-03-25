// Pinta lista, filtros, sidebar de proyectos, tarjetas y estados de red

const Render = {
  // Borde + badge según prioridad (alta rojo, media naranja, baja azul).
  PRIORIDAD_CLASES: {
    alta: { borde: "border-red-500 dark:border-red-400", badge: "badge badge-alta font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 dark:border-red-400/30" },
    media: { borde: "border-orange-500 dark:border-orange-400", badge: "badge badge-media font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-orange-500/15 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 dark:border-orange-400/30" },
    baja: { borde: "border-blue-500 dark:border-blue-400", badge: "badge badge-baja font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 dark:border-blue-400/30" },
  },

  CLASES_TARJETA_BASE:
    "task-card group border-2 rounded-xl p-4 px-5 mb-3 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-white dark:bg-gray-900 ",
  CLASES_TARJETA_COMPLETADA:
    "completada border-green-500 dark:border-green-400 opacity-50 hover:opacity-100",
  CLASES_TITULO_HECHA:
    "task-title font-semibold flex-1 min-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis text-base line-through text-gray-600 dark:text-gray-400",
  CLASES_TITULO_PENDIENTE:
    "task-title font-semibold flex-1 min-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis text-base text-gray-900 dark:text-gray-100",
  CLASES_CHECKBOX_HECHA:
    "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white",
  CLASES_CHECKBOX_PENDIENTE:
    "border-gray-200 dark:border-gray-600 text-transparent",
  CLASES_CHIP_PROYECTO:
    "task-proyecto font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded px-2.5 py-1",
  CLASES_PANEL_CARGA_LISTA:
    "red-estado-carga flex flex-col items-center justify-center py-16 px-6 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/25",
  CLASES_PANEL_ERROR_LISTA:
    "red-estado-error flex flex-col items-stretch max-w-lg mx-auto py-8 px-6 rounded-xl border-2 bg-amber-50/80 dark:bg-amber-950/20 text-gray-900 dark:text-gray-100",
  CLASES_SIN_PROYECTO:
    "task-proyecto font-mono text-xs text-gray-400 dark:text-gray-500 italic",
  CLASES_FECHA_HORA: "task-fecha font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap",
  CLASES_TIEMPO_RESTANTE: "task-tiempo-restante font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap",
  CLASES_TIEMPO_RESTANTE_URGENTE: "task-tiempo-restante font-mono text-xs text-red-600 dark:text-red-400 font-medium whitespace-nowrap",
  CLASES_BTN_GESTIONAR:
    "btn-gestionar-proyectos w-7 h-7 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 text-[0.9rem] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
  CLASES_BTN_ELIMINAR:
    "btn-eliminar w-6.5 h-6.5 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 text-[0.8rem] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset",
  CLASES_EMPTY_STATE:
    "empty-state text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-8 px-4 text-sm font-mono",
  CLASES_GRUPO_TITULO:
    "task-group-title flex items-center gap-3 mb-4 font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest after:content-[''] after:flex-1 after:h-px after:bg-gray-200 dark:after:bg-gray-700",
  CLASES_FILTER_CHIP_BASE:
    "filter-chip rounded-full px-4 py-2 text-xs font-mono cursor-pointer transition-all duration-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
  CLASES_NAV_PROYECTO_ITEM:
    "nav-item group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent font-semibold text-sm text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
  CLASES_NAV_PROYECTO_BTN:
    "btn-eliminar-proyecto w-5.5 h-5.5 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 font-bold text-[0.85rem] ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset",
  CLASES_NAV_PROYECTO_CONTADOR:
    "font-mono text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-full px-2 py-0.5",

  // Cierra el sidebar en móvil tras cambiar filtro o vista.
  _cerrarSidebarSiAbierto() {
    const sidebar = Utils.getElement("sidebar");
    if (sidebar) Utils.removeClass(sidebar, "open");
  },

  // Delegación: lista (eliminar / gestionar proyectos / toggle hecha), stats, chips, sidebar, limpiar completadas.
  init() {
    // Reintento de carga inicial: el botón vive dentro de #task-list (contenido dinámico).
    const areaPrincipal = document.querySelector("main");
    if (areaPrincipal) {
      areaPrincipal.addEventListener("click", (evento) => {
        const botonReintentar = evento.target.closest("#btn-reintentar-lista-tareas");
        if (botonReintentar) {
          evento.preventDefault();
          TareasController.reintentarCargaLista();
        }
      });
    }

    const botonLimpiarCompletadas = Utils.getElement("btn-limpiar-completadas");
    if (botonLimpiarCompletadas) {
      botonLimpiarCompletadas.addEventListener("click", async () => {
        const tareasHechas = State.tareas.filter((tarea) => tarea.hecha);
        const cantidad = tareasHechas.length;
        if (cantidad === 0) return;
        const plural = Utils.plural(cantidad);
        // SweetAlert2 expone Swal en global al cargar sweetalert2.all.min.js desde el CDN.
        if (typeof Swal === "undefined") {
          console.error("SweetAlert2 no está cargado; no se puede mostrar la confirmación.");
          return;
        }
        const esModoOscuro = document.documentElement.classList.contains("dark");
        const resultado = await Swal.fire({
          title: "¿Eliminar tareas completadas?",
          html: `Se eliminarán <strong>${cantidad}</strong> tarea${plural} completada${plural}.<br/>Esta acción <strong>no se puede deshacer</strong>.`,
          icon: "warning",
          iconColor: esModoOscuro ? "#fbbf24" : "#d97706",
          showCancelButton: true,
          focusCancel: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#2563eb",
          cancelButtonColor: esModoOscuro ? "#374151" : "#9ca3af",
          background: esModoOscuro ? "#111827" : "#ffffff",
          color: esModoOscuro ? "#f3f4f6" : "#1f2937",
        });
        if (!resultado.isConfirmed) return;
        await TareasController.eliminarTodasCompletadas();
        Render._cerrarSidebarSiAbierto();
      });
    }

    const contenedorLista = Utils.getElement("task-list");
    if (contenedorLista) {
      contenedorLista.addEventListener("click", async (evento) => {
        if (evento.target.classList.contains("btn-eliminar")) {
          evento.stopPropagation();
          await TareasController.eliminar(Number(evento.target.dataset.id));
          return;
        }
        if (evento.target.closest(".btn-gestionar-proyectos")) {
          evento.stopPropagation();
          ModalProyectos.abrir(Number(evento.target.closest(".btn-gestionar-proyectos").dataset.id));
          return;
        }
        const tarjeta = evento.target.closest(".task-card");
        if (tarjeta) {
          await TareasController.alternarHecha(Number(tarjeta.dataset.id));
        }
      });
    }
    const cuadriculaEstadisticas = Utils.getElements(".estadisticas-grid")[0];
    if (cuadriculaEstadisticas) {
      cuadriculaEstadisticas.addEventListener("click", (evento) => {
        const tarjetaFiltro = evento.target.closest("[data-filtro]");
        if (tarjetaFiltro) {
          Filtros.cambiarFiltro(tarjetaFiltro.dataset.filtro);
          this._cerrarSidebarSiAbierto();
        }
      });
    }
    const contenedorFiltros = Utils.getElement("filters");
    if (contenedorFiltros) {
      contenedorFiltros.addEventListener("click", (evento) => {
        const chipFiltro = evento.target.closest(".filter-chip");
        if (chipFiltro) Filtros.cambiarFiltro(chipFiltro.dataset.filtro);
      });
    }
    const navProyectos = Utils.getElement("nav-proyectos");
    if (navProyectos) {
      navProyectos.addEventListener("click", async (evento) => {
        const botonEliminar = evento.target.closest(".btn-eliminar-proyecto");
        if (botonEliminar) {
          evento.stopPropagation();
          await ProyectosController.eliminar(botonEliminar.dataset.proyecto);
          return;
        }
        const elementoNav = evento.target.closest(".nav-item");
        if (elementoNav) {
          Filtros.cambiarFiltro(elementoNav.dataset.vista);
          this._cerrarSidebarSiAbierto();
        }
      });
    }
  },

  // Clases del chip de prioridad (todas / alta / media / baja).
  clasesBordeFiltro(valor) {
    const mapaEstilos = {
      todas: "border-2 border-gray-500 dark:border-gray-400 text-gray-500 dark:text-gray-400 hover:border-gray-600 dark:hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300",
      alta: "border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:border-red-600 dark:hover:border-red-300 hover:text-red-600 dark:hover:text-red-400",
      media: "border-2 border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 hover:border-orange-600 dark:hover:border-orange-300 hover:text-orange-600 dark:hover:text-orange-400",
      baja: "border-2 border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:border-blue-600 dark:hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400",
    };
    return mapaEstilos[valor] || mapaEstilos.todas;
  },

  // Chips Todas/Alta/Media/Baja según State.filtroActivo.
  renderizarFiltros() {
    const contenedor = Utils.getElement("filters");
    if (!contenedor) return;

    const filtrosBase = [
      { etiqueta: "Todas", valor: "todas" },
      { etiqueta: "Alta", valor: "alta" },
      { etiqueta: "Media", valor: "media" },
      { etiqueta: "Baja", valor: "baja" },
    ];

    Utils.setHTML(
      contenedor,
      filtrosBase
        .map(
          (filtro) => `
        <button
          type="button"
          class="${this.CLASES_FILTER_CHIP_BASE} ${State.filtroActivo === filtro.valor ? "active" : ""} ${this.clasesBordeFiltro(filtro.valor)}"
          data-filtro="${filtro.valor}"
        >
          ${filtro.etiqueta}
        </button>`
        )
        .join("")
    );
  },

  // Sidebar: proyectos, pendientes por proyecto, botón borrar al hover.
  renderizarProyectosLateral() {
    const contenedor = Utils.getElement("nav-proyectos");
    if (!contenedor) return;

    Utils.setHTML(
      contenedor,
      State.proyectos
        .map((proyecto) => {
          const pendientes = ProyectosController.obtenerPendientesPorProyecto(
            proyecto
          );

          return `
          <div class="${this.CLASES_NAV_PROYECTO_ITEM}" data-vista="${Utils.escapeHtml(proyecto)}">
            <span class="w-5 text-base flex items-center justify-center shrink-0">◆</span>
            <span class="flex-1 whitespace-nowrap">${Utils.escapeHtml(proyecto)}</span>
            <span class="${this.CLASES_NAV_PROYECTO_CONTADOR}">${pendientes}</span>
            <button type="button" class="${this.CLASES_NAV_PROYECTO_BTN}" data-proyecto="${Utils.escapeHtml(proyecto)}" aria-label="Eliminar proyecto">✕</button>
          </div>`;
        })
        .join("")
    );
  },

  // Barra fina arriba mientras hay POST/PATCH/DELETE en vuelo.
  actualizarBarraActividadRed() {
    const barra = Utils.getElement("red-bar-actividad");
    if (!barra) return;
    const visible = State.peticionesMutacionEnCurso > 0;
    barra.dataset.visible = visible ? "true" : "false";
    barra.classList.toggle("opacity-0", !visible);
    barra.classList.toggle("opacity-100", visible);
    barra.setAttribute("aria-busy", visible ? "true" : "false");
  },

  // Desbloquea buscar / filtrar / nueva tarea solo si la carga inicial fue OK.
  actualizarControlesSegunEstadoRed() {
    const listo = State.estadoRedLista === "exito";
    const botonNuevaTarea = document.querySelector(".btn-nueva-tarea");
    if (botonNuevaTarea) {
      botonNuevaTarea.disabled = !listo;
      botonNuevaTarea.classList.toggle("opacity-50", !listo);
      botonNuevaTarea.classList.toggle("cursor-not-allowed", !listo);
    }
    const campoBusqueda = Utils.getElement("input-busqueda");
    if (campoBusqueda) {
      campoBusqueda.disabled = !listo;
      campoBusqueda.classList.toggle("opacity-50", !listo);
      campoBusqueda.classList.toggle("cursor-not-allowed", !listo);
    }
    const contenedorFiltrosPrioridad = Utils.getElement("filters");
    if (contenedorFiltrosPrioridad) {
      contenedorFiltrosPrioridad.classList.toggle("pointer-events-none", !listo);
      contenedorFiltrosPrioridad.classList.toggle("opacity-45", !listo);
    }
  },

  // Placeholder mientras llegan las tareas (spinner + aria).
  _htmlPanelCargaLista() {
    return `
      <div class="${this.CLASES_PANEL_CARGA_LISTA}" role="status" aria-live="polite" aria-busy="true">
        <div class="w-11 h-11 rounded-full border-[3px] border-blue-500 dark:border-blue-400 border-t-transparent animate-spin" aria-hidden="true"></div>
        <p class="mt-5 font-mono text-sm font-semibold text-blue-900 dark:text-blue-200 text-center">Cargando tareas desde el servidor…</p>
        <p class="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center max-w-sm leading-relaxed">
          La petición está en curso (latencia de red y tiempo de respuesta de Node.js).
        </p>
      </div>`;
  },

  // Panel feo pero claro: sin red vs 4xx vs 5xx + botón reintentar.
  _htmlPanelErrorLista() {
    const detalle = State.errorRedLista || {
      mensaje: "No se pudo obtener la lista.",
      codigoHttp: undefined,
      esErrorRed: true,
    };
    const codigo = detalle.codigoHttp;
    let clasesBorde = "border-slate-300 dark:border-slate-600";
    let etiquetaTipo = "Error";
    if (detalle.esErrorRed && codigo === undefined) {
      clasesBorde = "border-slate-400 dark:border-slate-500";
      etiquetaTipo = "Sin conexión";
    } else if (codigo >= 400 && codigo < 500) {
      clasesBorde = "border-amber-500 dark:border-amber-400";
      etiquetaTipo = `Error del cliente (HTTP ${codigo})`;
    } else if (codigo >= 500) {
      clasesBorde = "border-red-500 dark:border-red-400";
      etiquetaTipo = `Error del servidor (HTTP ${codigo})`;
    } else if (codigo != null) {
      etiquetaTipo = `HTTP ${codigo}`;
    }

    const mensajeSeguro = Utils.escapeHtml(detalle.mensaje || "Error desconocido");

    return `
      <div class="${this.CLASES_PANEL_ERROR_LISTA} ${clasesBorde}" role="alert" aria-live="assertive">
        <div class="flex items-start gap-3 mb-4">
          <span class="text-2xl shrink-0" aria-hidden="true">⚠</span>
          <div class="min-w-0 flex-1">
            <p class="font-mono text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">${Utils.escapeHtml(etiquetaTipo)}</p>
            <p class="text-sm font-semibold leading-snug">${mensajeSeguro}</p>
          </div>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400 mb-5 font-mono leading-relaxed">
          Revisa que el servidor esté ejecutándose y que la URL base de la API sea correcta (<code class="bg-gray-200/80 dark:bg-gray-800 px-1 rounded">/api/v1/tasks</code>).
        </p>
        <button
          type="button"
          id="btn-reintentar-lista-tareas"
          class="w-full sm:w-auto self-center px-5 py-2.5 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-bold text-sm border-0 cursor-pointer transition-all duration-200 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Reintentar conexión
        </button>
      </div>`;
  },

  // Lista principal: loading / error / vacío / pendientes+completadas + stats.
  renderizarTareas() {
    const contenedor = Utils.getElement("task-list");
    if (!contenedor) return;

    this.actualizarControlesSegunEstadoRed();

    if (State.estadoRedLista === "cargando") {
      Utils.setHTML(contenedor, this._htmlPanelCargaLista());
      Estadisticas.actualizar();
      return;
    }

    if (State.estadoRedLista === "error") {
      Utils.setHTML(contenedor, this._htmlPanelErrorLista());
      Estadisticas.actualizar();
      return;
    }

    const visibles = Filtros.obtenerVisibles();
    Utils.setHTML(
      contenedor,
      !visibles.length
        ? `<div class="${this.CLASES_EMPTY_STATE}">No hay tareas</div>`
        : this.renderizarGrupo("Pendientes", visibles.filter((t) => !t.hecha)) +
          this.renderizarGrupo("Completadas", visibles.filter((t) => t.hecha))
    );
    Estadisticas.actualizar();
  },

  // Un bloque con título + tarjetas; si lista vacía no pinta nada.
  renderizarGrupo(titulo, lista) {
    if (!lista.length) return "";

    return `
      <section class="tasks-section mb-6">
        <h2 class="${this.CLASES_GRUPO_TITULO}">${titulo}</h2>
        ${lista.map((tarea) => this.renderizarTarjeta(tarea)).join("")}
      </section>`;
  },

  // "2025-03-12" → "miércoles 12 de marzo" (es-ES).
  formatearFecha(fechaStr) {
    if (!fechaStr || fechaStr === State.SIN_FECHA) return fechaStr;
    const [parteFecha] = fechaStr.split(" ");
    const fechaObjeto = new Date(parteFecha + "T00:00:00");
    const diaSemana = fechaObjeto.toLocaleDateString("es-ES", { weekday: "long" });
    const dia = fechaObjeto.getDate();
    const mes = fechaObjeto.toLocaleDateString("es-ES", { month: "long" });
    return `${diaSemana} ${dia} de ${mes}`;
  },

  // Si viene "YYYY-MM-DD HH:mm", devuelve solo la hora; si no, null.
  extraerHora(fechaStr) {
    if (!fechaStr || fechaStr === State.SIN_FECHA) return null;
    const partesFecha = fechaStr.split(" ");
    return partesFecha[1] || null;
  },

  // "3 d", "Vencida", etc.; urgente si pasó o queda menos de 24h.
  _obtenerTiempoRestante(fechaStr) {
    if (!fechaStr || fechaStr === State.SIN_FECHA) return null;
    const partes = fechaStr.trim().split(" ");
    const parteFecha = partes[0];
    const parteHora = partes[1];
    const fechaLimite = parteHora
      ? new Date(parteFecha + "T" + parteHora + ":00")
      : new Date(parteFecha + "T23:59:59");
    const ahora = new Date();
    const diffMs = fechaLimite.getTime() - ahora.getTime();

    if (diffMs < 0) {
      const diasPasados = Math.floor(-diffMs / (24 * 60 * 60 * 1000));
      const texto = diasPasados === 0 ? "Vencida" : `Venció hace ${diasPasados} d`;
      return { texto, urgente: true };
    }

    const dias = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    const horas = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const menos24h = diffMs < 24 * 60 * 60 * 1000;
    let texto;
    if (dias > 0 && horas > 0) texto = `${dias} d, ${horas} h`;
    else if (dias > 0) texto = `${dias} d`;
    else if (horas > 0) texto = `${horas} h`;
    else texto = "< 1 h";
    return { texto, urgente: menos24h };
  },

  // Pack de clases: borde, título, checkbox, badge según prioridad y si está hecha.
  _obtenerClasesTarjeta(tarea) {
    const prioridad = this.PRIORIDAD_CLASES[tarea.prioridad] || this.PRIORIDAD_CLASES.baja;
    return {
      clasesTarjeta: tarea.hecha
        ? this.CLASES_TARJETA_BASE + this.CLASES_TARJETA_COMPLETADA
        : this.CLASES_TARJETA_BASE + `prioridad-${tarea.prioridad} ${prioridad.borde}`,
      clasesTitulo: tarea.hecha ? this.CLASES_TITULO_HECHA : this.CLASES_TITULO_PENDIENTE,
      clasesCheckbox: tarea.hecha ? this.CLASES_CHECKBOX_HECHA : this.CLASES_CHECKBOX_PENDIENTE,
      clasesBadge: prioridad.badge,
    };
  },

  // Una fila: checkbox, título, chips proyecto, fecha/hora, prioridad, ⊕, papelera.
  renderizarTarjeta(tarea) {
    const proyectos = State.proyectosDeTarea(tarea);
    const hora = this.extraerHora(tarea.fecha);
    const tiempoRestante = this._obtenerTiempoRestante(tarea.fecha);
    const { clasesTarjeta, clasesTitulo, clasesCheckbox, clasesBadge } = this._obtenerClasesTarjeta(tarea);
    const chipsProyectos = proyectos.length
      ? proyectos
          .map((nombreProyecto) => `<span class="${this.CLASES_CHIP_PROYECTO}">${Utils.escapeHtml(nombreProyecto)}</span>`)
          .join("")
      : `<span class="${this.CLASES_SIN_PROYECTO}">Sin proyecto</span>`;
    const spanTiempoRestante = tiempoRestante
      ? `<span class="shrink-0 ${tiempoRestante.urgente ? this.CLASES_TIEMPO_RESTANTE_URGENTE : this.CLASES_TIEMPO_RESTANTE}" title="Tiempo hasta la fecha límite">${Utils.escapeHtml(tiempoRestante.texto)}</span>`
      : "";
    return `
      <div class="${clasesTarjeta}" data-id="${tarea.id}">
        <div class="checkbox w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0 transition-all duration-200 ${clasesCheckbox}">${tarea.hecha ? "✓" : ""}</div>
        <div class="task-info flex-1 flex items-center flex-wrap gap-4 min-w-0">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="${clasesTitulo}">${Utils.escapeHtml(tarea.titulo)}</div>
            ${spanTiempoRestante}
          </div>
          <div class="flex items-center gap-2 flex-wrap">${chipsProyectos}</div>
          <span class="${this.CLASES_FECHA_HORA}">${this.formatearFecha(tarea.fecha)}</span>
          ${hora ? `<span class="${this.CLASES_FECHA_HORA}">◷ ${hora}</span>` : ""}
        </div>
        <button
          type="button"
          class="${this.CLASES_BTN_GESTIONAR}"
          data-id="${tarea.id}"
          aria-label="Gestionar proyectos de la tarea"
          title="Añadir o quitar proyectos"
        >⊕</button>
        <span class="${clasesBadge}">${tarea.prioridad}</span>
        <button
          type="button"
          class="${this.CLASES_BTN_ELIMINAR}"
          data-id="${tarea.id}"
          aria-label="Eliminar tarea"
        >
          ✕
        </button>
      </div>`;
  },

};