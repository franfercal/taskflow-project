/*Hace y actualiza la interfaz de usuario */

const Render = {
  /* renderiza filtros  */
  renderizarFiltros() {
    const contenedor = Utils.getElement("filters");
    if (!contenedor) return;

    const filtrosBase = Filtros.obtenerFiltrosBase();
    const filtrosProyectos = State.proyectos.map((p) => ({
      etiqueta: p,
      valor: p,
    }));

    const todosFiltros = [...filtrosBase, ...filtrosProyectos];

    Utils.setHTML(
      contenedor,
      todosFiltros
        .map(
          (f) => `
        <button 
          class="filter-chip ${State.filtroActivo === f.valor ? "active" : ""}" 
          data-filtro="${f.valor}"
        >
          ${Utils.sanitizar(f.etiqueta)}
        </button>`
        )
        .join("")
    );

    this.delegarEventosFiltros();
  },

  /*delega eventos filtros */
  delegarEventosFiltros() {
    Utils.getElements(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        Filtros.cambiarFiltro(btn.dataset.filtro);
      });
    });
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
          <div class="nav-item" data-vista="${Utils.sanitizar(proyecto)}">
            <span class="nav-icon">◆</span>
            ${Utils.sanitizar(proyecto)}
            <span class="nav-counter">${pendientes}</span>
          </div>`;
        })
        .join("")
    );

    this.delegarEventosProyectos();
  },

  /* delega eventos proyecto */
  delegarEventosProyectos() {
    Utils.getElements("#nav-proyectos .nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        Filtros.cambiarFiltro(item.dataset.vista);
      });
    });
  },

  /* renderiza tareas visible  */
  renderizarTareas() {
    const visibles = Filtros.obtenerVisibles();
    const pendientes = visibles.filter((t) => !t.hecha);
    const completadas = visibles.filter((t) => t.hecha);

    const contenedor = Utils.getElement("task-list");
    if (!contenedor) return;

    if (!visibles.length) {
      Utils.setHTML(contenedor, '<div class="empty-state">No hay tareas</div>');
      Estadisticas.actualizar();
      return;
    }

    Utils.setHTML(
      contenedor,
      this.renderizarGrupo("Pendientes", pendientes) +
        this.renderizarGrupo("Completadas", completadas)
    );

    this.agregarEventListenersTareas();
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

  /* renderiza tarjet de tarea */
  renderizarTarjeta(tarea) {
    return `
      <div 
        class="task-card ${tarea.hecha ? "completada" : ""}" 
        data-id="${tarea.id}"
      >
        <div class="checkbox">${tarea.hecha ? "✓" : ""}</div>
        <div class="task-info">
          <div class="task-title">${Utils.sanitizar(tarea.titulo)}</div>
          <span class="task-proyecto">${Utils.sanitizar(tarea.proyecto)}</span>
          <span class="task-fecha">${Utils.sanitizar(tarea.fecha)}</span>
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

  /* agreega event listeners a tarjetas de tareas */
  agregarEventListenersTareas() {
    const contenedor = Utils.getElement("task-list");
    if (!contenedor) return;

    // event delegation marcar hecha
    contenedor.addEventListener("click", (e) => {
      const tarjeta = e.target.closest(".task-card");
      if (tarjeta && !e.target.classList.contains("btn-eliminar")) {
        const id = Number(tarjeta.dataset.id);
        TareasController.alternarHecha(id);
      }
    });

    // event delegation eliminar
    contenedor.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-eliminar")) {
        e.stopPropagation();
        const id = Number(e.target.dataset.id);
        TareasController.eliminar(id);
      }
    });
  },
};