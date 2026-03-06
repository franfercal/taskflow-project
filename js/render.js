/*Hace y actualiza la interfaz de usuario */

const Render = {
  /* inicializa listeners */
  init() {
    // tareas
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

    // estadísticas click
    const statsGrid = document.querySelector(".estadisticas-grid");
    if (statsGrid) {
      statsGrid.addEventListener("click", (e) => {
        const card = e.target.closest("[data-filtro]");
        if (card) Filtros.cambiarFiltro(card.dataset.filtro);
      });
    }

    // filter chips
    const contenedorFiltros = Utils.getElement("filters");
    if (contenedorFiltros) {
      contenedorFiltros.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (chip) Filtros.cambiarFiltro(chip.dataset.filtro);
      });
    }

    // proyectos laterales
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

  /* renderiza filtros  */
  renderizarFiltros() {
    const contenedor = Utils.getElement("filters");
    if (!contenedor) return;

    const filtrosBase = Filtros.obtenerFiltrosBase();

    Utils.setHTML(
      contenedor,
      filtrosBase
        .map(
          (f) => `
        <button
          class="filter-chip ${State.filtroActivo === f.valor ? "active" : ""}"
          data-filtro="${f.valor}"
        >
          ${f.etiqueta}
        </button>`
        )
        .join("")
    );
  },

  /*renderiza los proyect lateral */
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
          <div class="nav-item" data-vista="${Utils.escapeHtml(proyecto)}">
            <span class="nav-icon">◆</span>
            <span class="nav-label">${Utils.escapeHtml(proyecto)}</span>
            <span class="nav-counter">${pendientes}</span>
            <button class="btn-eliminar-proyecto" data-proyecto="${Utils.escapeHtml(proyecto)}" aria-label="Eliminar proyecto">✕</button>
          </div>`;
        })
        .join("")
    );
  },

  /* renderiza tareas visibles */
  renderizarTareas() {
    const visibles = Filtros.obtenerVisibles();
    const contenedor = Utils.getElement("task-list");
    if (!contenedor) return;

    Utils.setHTML(
      contenedor,
      !visibles.length
        ? '<div class="empty-state">No hay tareas</div>'
        : this.renderizarGrupo("Pendientes", visibles.filter((t) => !t.hecha)) +
          this.renderizarGrupo("Completadas", visibles.filter((t) => t.hecha))
    );
    Estadisticas.actualizar();
  },

  /* renderiza grupo tareas */
  renderizarGrupo(titulo, lista) {
    if (!lista.length) return "";

    return `
      <section class="tasks-section">
        <h2 class="task-group-title">${titulo}</h2>
        ${lista.map((tarea) => this.renderizarTarjeta(tarea)).join("")}
      </section>`;
  },

  /* formatea fecha*/
  formatearFecha(fechaStr) {
    if (!fechaStr || fechaStr === "Sin fecha") return fechaStr;
    const [datePart] = fechaStr.split(" ");
    const date = new Date(datePart + "T00:00:00");
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "long" });
    return `${weekday} ${day} de ${month}`;
  },

  /* extrae hora de fecha */
  extraerHora(fechaStr) {
    if (!fechaStr || fechaStr === "Sin fecha") return null;
    const partes = fechaStr.split(" ");
    return partes[1] || null;
  },

  /* tarjet de tarea */
  renderizarTarjeta(tarea) {
    const hora = this.extraerHora(tarea.fecha);
    return `
      <div
        class="task-card ${tarea.hecha ? "completada" : `prioridad-${tarea.prioridad}`}"
        data-id="${tarea.id}"
      >
        <div class="checkbox">${tarea.hecha ? "✓" : ""}</div>
        <div class="task-info">
          <div class="task-title">${Utils.escapeHtml(tarea.titulo)}</div>
          <span class="task-proyecto">${Utils.escapeHtml(tarea.proyecto)}</span>
          <span class="task-fecha">${this.formatearFecha(tarea.fecha)}</span>
          ${hora ? `<span class="task-hora">◷ ${hora}</span>` : ""}
        </div>
        <span class="badge badge-${tarea.prioridad}">
          ${tarea.prioridad}
        </span>
        <button
          class="btn-eliminar"
          data-id="${tarea.id}"
          aria-label="Eliminar tarea"
        >
          ✕
        </button>
      </div>`;
  },

};