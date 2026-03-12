/**
 * Módulo de renderizado: pinta la lista de tareas, los filtros, la barra de proyectos y las tarjetas.
 * Usa delegación de eventos en los contenedores para clics en eliminar, marcar hecha, filtros y proyectos.
 */

const Render = {
  /**
   * Clases Tailwind por prioridad: borde de la tarjeta y estilo del badge (alta=rojo, media=naranja, baja=azul).
   */
  PRIORIDAD_CLASES: {
    alta: { borde: "border-red-500 dark:border-red-400", badge: "badge badge-alta font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 dark:border-red-400/30" },
    media: { borde: "border-orange-500 dark:border-orange-400", badge: "badge badge-media font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-orange-500/15 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 dark:border-orange-400/30" },
    baja: { borde: "border-blue-500 dark:border-blue-400", badge: "badge badge-baja font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 dark:border-blue-400/30" },
  },

  /** Clases base de la tarjeta de tarea (común a completada y pendiente). */
  CLASES_TARJETA_BASE:
    "task-card group border-2 rounded-xl p-4 px-5 mb-3 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-white dark:bg-gray-900 ",
  /** Sufijo de clases cuando la tarea está completada (borde verde, opacidad). */
  CLASES_TARJETA_COMPLETADA:
    "completada border-green-500 dark:border-green-400 opacity-50 hover:opacity-100",
  /** Título de tarea completada (tachado, gris). */
  CLASES_TITULO_HECHA:
    "task-title font-semibold flex-1 min-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis text-base line-through text-gray-600 dark:text-gray-400",
  /** Título de tarea pendiente. */
  CLASES_TITULO_PENDIENTE:
    "task-title font-semibold flex-1 min-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis text-base text-gray-900 dark:text-gray-100",
  /** Checkbox cuando la tarea está hecha. */
  CLASES_CHECKBOX_HECHA:
    "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white",
  /** Checkbox cuando la tarea está pendiente. */
  CLASES_CHECKBOX_PENDIENTE:
    "border-gray-200 dark:border-gray-600 text-transparent",
  /** Chip de proyecto en la tarjeta (con borde y fondo). */
  CLASES_CHIP_PROYECTO:
    "task-proyecto font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded px-2.5 py-1",
  /** Placeholder cuando la tarea no tiene proyecto. */
  CLASES_SIN_PROYECTO:
    "task-proyecto font-mono text-xs text-gray-400 dark:text-gray-500 italic",
  /** Contenedor de fecha/hora en tarjeta. */
  CLASES_FECHA_HORA: "task-fecha font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap",
  /** Tiempo restante hasta la fecha límite (días/horas). */
  CLASES_TIEMPO_RESTANTE: "task-tiempo-restante font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap",
  /** Tiempo restante cuando queda poco (menos de 24 h) o ya venció. */
  CLASES_TIEMPO_RESTANTE_URGENTE: "task-tiempo-restante font-mono text-xs text-red-600 dark:text-red-400 font-medium whitespace-nowrap",
  /** Botón gestionar proyectos (⊕) en tarjeta. */
  CLASES_BTN_GESTIONAR:
    "btn-gestionar-proyectos w-7 h-7 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 text-[0.9rem] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
  /** Botón eliminar tarea en tarjeta. */
  CLASES_BTN_ELIMINAR:
    "btn-eliminar w-6.5 h-6.5 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 text-[0.8rem] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset",
  /** Estado vacío cuando no hay tareas que mostrar. */
  CLASES_EMPTY_STATE:
    "empty-state text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-8 px-4 text-sm font-mono",
  /** Título de sección (Pendientes / Completadas). */
  CLASES_GRUPO_TITULO:
    "task-group-title flex items-center gap-3 mb-4 font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest after:content-[''] after:flex-1 after:h-px after:bg-gray-200 dark:after:bg-gray-700",
  /** Base común de los chips de filtro (prioridad). */
  CLASES_FILTER_CHIP_BASE:
    "filter-chip rounded-full px-4 py-2 text-xs font-mono cursor-pointer transition-all duration-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
  /** Ítem de proyecto en el sidebar (nombre + contador + botón eliminar). */
  CLASES_NAV_PROYECTO_ITEM:
    "nav-item group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent font-semibold text-sm text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
  /** Botón eliminar proyecto en el sidebar. */
  CLASES_NAV_PROYECTO_BTN:
    "btn-eliminar-proyecto w-5.5 h-5.5 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 font-bold text-[0.85rem] ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset",
  /** Contador de proyecto en el sidebar. */
  CLASES_NAV_PROYECTO_CONTADOR:
    "font-mono text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-full px-2 py-0.5",

  /**
   * Cierra el sidebar en vista móvil si está abierto (quita la clase "open").
   * Usado tras cambiar filtro desde estadísticas o desde la lista de proyectos.
   * @returns {void}
   */
  _cerrarSidebarSiAbierto() {
    const sidebar = Utils.getElement("sidebar");
    if (sidebar) Utils.removeClass(sidebar, "open");
  },

  /**
   * Configura la delegación de eventos:
   * - task-list: clic en botón eliminar → eliminar tarea; clic en tarjeta → alternar hecha
   * - estadisticas-grid: clic en tarjeta con data-filtro → cambiar filtro y cerrar sidebar en móvil
   * - filters: clic en filter-chip → cambiar filtro
   * - nav-proyectos: clic en btn-eliminar-proyecto → eliminar proyecto; clic en nav-item → cambiar vista y cerrar sidebar
   * @returns {void}
   */
  init() {
    const contenedorLista = Utils.getElement("task-list");
    if (contenedorLista) {
      contenedorLista.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("btn-eliminar")) {
          evento.stopPropagation();
          TareasController.eliminar(Number(evento.target.dataset.id));
          return;
        }
        if (evento.target.closest(".btn-gestionar-proyectos")) {
          evento.stopPropagation();
          ModalProyectos.abrir(Number(evento.target.closest(".btn-gestionar-proyectos").dataset.id));
          return;
        }
        const tarjeta = evento.target.closest(".task-card");
        if (tarjeta) {
          TareasController.alternarHecha(Number(tarjeta.dataset.id));
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
      navProyectos.addEventListener("click", (evento) => {
        const botonEliminar = evento.target.closest(".btn-eliminar-proyecto");
        if (botonEliminar) {
          evento.stopPropagation();
          ProyectosController.eliminar(botonEliminar.dataset.proyecto);
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

  /**
   * Devuelve las clases CSS para el borde y texto del chip de filtro según el valor (todas, alta, media, baja).
   * @param {string} valor - "todas" | "alta" | "media" | "baja"
   * @returns {string}
   */
  clasesBordeFiltro(valor) {
    const mapaEstilos = {
      todas: "border-2 border-gray-500 dark:border-gray-400 text-gray-500 dark:text-gray-400 hover:border-gray-600 dark:hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300",
      alta: "border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:border-red-600 dark:hover:border-red-300 hover:text-red-600 dark:hover:text-red-400",
      media: "border-2 border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 hover:border-orange-600 dark:hover:border-orange-300 hover:text-orange-600 dark:hover:text-orange-400",
      baja: "border-2 border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:border-blue-600 dark:hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400",
    };
    return mapaEstilos[valor] || mapaEstilos.todas;
  },

  /**
   * Rellena el contenedor #filters con los chips de prioridad (Todas, Alta, Media, Baja)
   * y marca como activo el que coincide con State.filtroActivo.
   * @returns {void}
   */
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

  /**
   * Pinta en #nav-proyectos la lista de proyectos con icono, nombre, contador de pendientes
   * y botón para eliminar proyecto (visible al hacer hover).
   * @returns {void}
   */
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

  /**
   * Obtiene las tareas visibles según filtro y búsqueda, pinta la lista en #task-list
   * (vacío, o grupos Pendientes / Completadas con tarjetas) y actualiza las estadísticas del sidebar.
   * @returns {void}
   */
  renderizarTareas() {
    const visibles = Filtros.obtenerVisibles();
    const contenedor = Utils.getElement("task-list");
    if (!contenedor) return;

    Utils.setHTML(
      contenedor,
      !visibles.length
        ? `<div class="${this.CLASES_EMPTY_STATE}">No hay tareas</div>`
        : this.renderizarGrupo("Pendientes", visibles.filter((t) => !t.hecha)) +
          this.renderizarGrupo("Completadas", visibles.filter((t) => t.hecha))
    );
    Estadisticas.actualizar();
  },

  /**
   * Genera el HTML de una sección con título (ej. "Pendientes" o "Completadas") y las tarjetas de la lista.
   * @param {string} titulo - Título del grupo
   * @param {Object[]} lista - Array de tareas
   * @returns {string} HTML de la sección o "" si lista está vacía
   */
  renderizarGrupo(titulo, lista) {
    if (!lista.length) return "";

    return `
      <section class="tasks-section mb-6">
        <h2 class="${this.CLASES_GRUPO_TITULO}">${titulo}</h2>
        ${lista.map((tarea) => this.renderizarTarjeta(tarea)).join("")}
      </section>`;
  },

  /**
   * Convierte una fecha tipo "YYYY-MM-DD" o "YYYY-MM-DD HH:mm" en texto legible (ej. "jueves 12 de marzo").
   * @param {string} fechaStr - Fecha en formato ISO o State.SIN_FECHA
   * @returns {string} Texto formateado o el mismo valor si no hay fecha
   */
  formatearFecha(fechaStr) {
    if (!fechaStr || fechaStr === State.SIN_FECHA) return fechaStr;
    const [parteFecha] = fechaStr.split(" ");
    const fechaObjeto = new Date(parteFecha + "T00:00:00");
    const diaSemana = fechaObjeto.toLocaleDateString("es-ES", { weekday: "long" });
    const dia = fechaObjeto.getDate();
    const mes = fechaObjeto.toLocaleDateString("es-ES", { month: "long" });
    return `${diaSemana} ${dia} de ${mes}`;
  },

  /**
   * Extrae la parte hora de una fecha "YYYY-MM-DD HH:mm" (ej. "14:30").
   * @param {string} fechaStr - Fecha con o sin hora (o State.SIN_FECHA)
   * @returns {string|null} Hora en formato "HH:mm" o null si no hay hora
   */
  extraerHora(fechaStr) {
    if (!fechaStr || fechaStr === State.SIN_FECHA) return null;
    const partesFecha = fechaStr.split(" ");
    return partesFecha[1] || null;
  },

  /**
   * Calcula el tiempo restante hasta la fecha límite (o si ya pasó).
   * Si no hay fecha o es "Sin fecha", devuelve null.
   * @param {string} fechaStr - Fecha en "YYYY-MM-DD" o "YYYY-MM-DD HH:mm" (o State.SIN_FECHA)
   * @returns {{ texto: string, urgente: boolean } | null} texto para mostrar; urgente = true si venció o queda &lt; 24 h
   */
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

  /**
   * Devuelve las clases CSS aplicables a la tarjeta según prioridad y estado hecha.
   * @param {Object} tarea - Objeto tarea con hecha y prioridad
   * @param {boolean} tarea.hecha - Si la tarea está completada
   * @param {string} tarea.prioridad - "alta" | "media" | "baja"
   * @returns {{ clasesTarjeta: string, clasesTitulo: string, clasesCheckbox: string, clasesBadge: string }}
   */
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

  /**
   * Genera el HTML de una tarjeta de tarea: checkbox, título, proyectos (varios chips), fecha, hora (si hay), badge de prioridad, botón gestionar proyectos y eliminar.
   * Las tareas hechas llevan estilo tachado y borde verde; las pendientes usan el color de prioridad.
   * @param {Object} tarea - Objeto tarea
   * @param {number} tarea.id - Id de la tarea
   * @param {string} tarea.titulo - Título
   * @param {string[]} [tarea.proyectos] - Nombres de proyectos
   * @param {string} tarea.prioridad - "alta" | "media" | "baja"
   * @param {string} tarea.fecha - Fecha límite (YYYY-MM-DD o con hora)
   * @param {boolean} tarea.hecha - Si está completada
   * @returns {string} HTML de la tarjeta
   */
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