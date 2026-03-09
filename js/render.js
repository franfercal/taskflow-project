/* renderiza la interfaz - delegar eventos */

const Render = {
  /* clases Tailwind prioridad: borde de tarjeta  badge */
  PRIORIDAD_CLASES: {
    alta: { borde: "border-red-500 dark:border-red-400", badge: "badge badge-alta font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-red-500/15 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 dark:border-red-400/30" },
    media: { borde: "border-orange-500 dark:border-orange-400", badge: "badge badge-media font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-orange-500/15 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 dark:border-orange-400/30" },
    baja: { borde: "border-blue-500 dark:border-blue-400", badge: "badge badge-baja font-medium text-xs px-2.5 py-1 rounded-full tracking-wide bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 dark:border-blue-400/30" },
  },

  init() {
    const contenedor = Utils.getElement("task-list");
    if (contenedor) {
      contenedor.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar")) {
          e.stopPropagation();
          TareasController.eliminar(Number(e.target.dataset.id));
          return;
        }
        const tarjeta = e.target.closest(".task-card");
        if (tarjeta) {
          TareasController.alternarHecha(Number(tarjeta.dataset.id));
        }
      });
    }
    const statsGrid = Utils.getElements(".estadisticas-grid")[0];
    if (statsGrid) {
      statsGrid.addEventListener("click", (e) => {
        const card = e.target.closest("[data-filtro]");
        if (card) Filtros.cambiarFiltro(card.dataset.filtro);
      });
    }
    const contenedorFiltros = Utils.getElement("filters");
    if (contenedorFiltros) {
      contenedorFiltros.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (chip) Filtros.cambiarFiltro(chip.dataset.filtro);
      });
    }
    const navProyectos = Utils.getElement("nav-proyectos");
    if (navProyectos) {
      navProyectos.addEventListener("click", (e) => {
        const btnEliminar = e.target.closest(".btn-eliminar-proyecto");
        if (btnEliminar) {
          e.stopPropagation();
          ProyectosController.eliminar(btnEliminar.dataset.proyecto);
          return;
        }
        const item = e.target.closest(".nav-item");
        if (item) {
          Filtros.cambiarFiltro(item.dataset.vista);
        }
      });
    }
  },

  clasesBordeFiltro(valor) {
    const map = {
      todas: "border-2 border-gray-500 dark:border-gray-400 text-gray-500 dark:text-gray-400 hover:border-gray-600 dark:hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300",
      alta: "border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:border-red-600 dark:hover:border-red-300 hover:text-red-600 dark:hover:text-red-400",
      media: "border-2 border-orange-500 dark:border-orange-400 text-orange-500 dark:text-orange-400 hover:border-orange-600 dark:hover:border-orange-300 hover:text-orange-600 dark:hover:text-orange-400",
      baja: "border-2 border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:border-blue-600 dark:hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400",
    };
    return map[valor] || map.todas;
  },

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
          (f) => `
        <button
          type="button"
          class="filter-chip ${State.filtroActivo === f.valor ? "active" : ""} rounded-full px-4 py-2 text-xs font-mono cursor-pointer transition-all duration-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${this.clasesBordeFiltro(f.valor)}"
          data-filtro="${f.valor}"
        >
          ${f.etiqueta}
        </button>`
        )
        .join("")
    );
  },

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
          <div class="nav-item group flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent font-semibold text-sm text-gray-500 dark:text-gray-400 cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset" data-vista="${Utils.escapeHtml(proyecto)}">
            <span class="w-5 text-base flex items-center justify-center shrink-0">◆</span>
            <span class="flex-1 whitespace-nowrap">${Utils.escapeHtml(proyecto)}</span>
            <span class="font-mono text-xs border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-full px-2 py-0.5">${pendientes}</span>
            <button type="button" class="btn-eliminar-proyecto w-5.5 h-5.5 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 font-bold text-[0.85rem] ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset" data-proyecto="${Utils.escapeHtml(proyecto)}" aria-label="Eliminar proyecto">✕</button>
          </div>`;
        })
        .join("")
    );
  },

  renderizarTareas() {
    const visibles = Filtros.obtenerVisibles();
    const contenedor = Utils.getElement("task-list");
    if (!contenedor) return;

    Utils.setHTML(
      contenedor,
      !visibles.length
        ? '<div class="empty-state text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-8 px-4 text-sm font-mono">No hay tareas</div>'
        : this.renderizarGrupo("Pendientes", visibles.filter((t) => !t.hecha)) +
          this.renderizarGrupo("Completadas", visibles.filter((t) => t.hecha))
    );
    Estadisticas.actualizar();
  },

  renderizarGrupo(titulo, lista) {
    if (!lista.length) return "";

    return `
      <section class="tasks-section mb-6">
        <h2 class="task-group-title flex items-center gap-3 mb-4 font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest after:content-[''] after:flex-1 after:h-px after:bg-gray-200 dark:after:bg-gray-700">${titulo}</h2>
        ${lista.map((tarea) => this.renderizarTarjeta(tarea)).join("")}
      </section>`;
  },

  formatearFecha(fechaStr) {
    if (!fechaStr || fechaStr === "Sin fecha") return fechaStr;
    const [datePart] = fechaStr.split(" ");
    const date = new Date(datePart + "T00:00:00");
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "long" });
    return `${weekday} ${day} de ${month}`;
  },

  extraerHora(fechaStr) {
    if (!fechaStr || fechaStr === "Sin fecha") return null;
    const partes = fechaStr.split(" ");
    return partes[1] || null;
  },

  renderizarTarjeta(tarea) {
    const hora = this.extraerHora(tarea.fecha);
    const baseCard = "task-card group border-2 rounded-xl p-4 px-5 mb-3 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset bg-white dark:bg-gray-900 ";
    const clasesTarjeta = tarea.hecha
      ? baseCard + "completada border-green-500 dark:border-green-400 opacity-50 hover:opacity-100"
      : baseCard + `prioridad-${tarea.prioridad} ${this.PRIORIDAD_CLASES[tarea.prioridad]?.borde || this.PRIORIDAD_CLASES.baja.borde}`;
    const clasesTitulo = tarea.hecha
      ? "task-title font-semibold flex-1 min-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis text-base line-through text-gray-600 dark:text-gray-400"
      : "task-title font-semibold flex-1 min-w-[160px] whitespace-nowrap overflow-hidden text-ellipsis text-base text-gray-900 dark:text-gray-100";
    const clasesBadge = this.PRIORIDAD_CLASES[tarea.prioridad]?.badge || this.PRIORIDAD_CLASES.baja.badge;
    return `
      <div class="${clasesTarjeta}" data-id="${tarea.id}">
        <div class="checkbox w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0 transition-all duration-200 ${
          tarea.hecha
            ? "border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500 text-white"
            : "border-gray-200 dark:border-gray-600 text-transparent"
        }">${tarea.hecha ? "✓" : ""}</div>
        <div class="task-info flex-1 flex items-center flex-wrap gap-4 min-w-0">
          <div class="${clasesTitulo}">${Utils.escapeHtml(tarea.titulo)}</div>
          <span class="task-proyecto font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded px-2.5 py-1">${Utils.escapeHtml(tarea.proyecto)}</span>
          <span class="task-fecha font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">${this.formatearFecha(tarea.fecha)}</span>
          ${hora ? `<span class="task-hora font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">◷ ${hora}</span>` : ""}
        </div>
        <span class="${clasesBadge}">${tarea.prioridad}</span>
        <button
          type="button"
          class="btn-eliminar w-6.5 h-6.5 rounded flex items-center justify-center shrink-0 bg-transparent border-none text-gray-500 dark:text-gray-400 text-[0.8rem] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
          data-id="${tarea.id}"
          aria-label="Eliminar tarea"
        >
          ✕
        </button>
      </div>`;
  },

};