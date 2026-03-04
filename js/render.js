/*Hace y actualiza la interfaz de usuario */

const Render = {
  /* inicializa listeners una sola vez */
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

    // tarjetas estadísticas clickables
    const statsGrid = document.querySelector(".estadisticas-grid");
    if (statsGrid) {
      statsGrid.addEventListener("click", (e) => {
        const card = e.target.closest("[data-filtro]");
        if (card) Filtros.cambiarFiltro(card.dataset.filtro);
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
          ${(f.etiqueta)}
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
          <div class="nav-item" data-vista="${(proyecto)}">
            <span class="nav-icon">◆</span>
            <span class="nav-label">${(proyecto)}</span>
            <span class="nav-counter">${pendientes}</span>
            <button class="btn-eliminar-proyecto" data-proyecto="${(proyecto)}" aria-label="Eliminar proyecto">✕</button>
          </div>`;
        })
        .join("")
    );

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

  /* formatea fecha ISO para mostrar */
  formatearFecha(fechaStr) {
    if (!fechaStr || fechaStr === "Sin fecha") return fechaStr;
    const [datePart, timePart] = fechaStr.split(" ");
    const date = new Date(datePart + "T00:00:00");
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("es-ES", { month: "long" });
    const display = `${weekday} ${day} de ${month}`;
    return timePart ? `${display} · ${timePart}` : display;
  },

  /* renderiza tarjet de tarea */
  renderizarTarjeta(tarea) {
    return `
      <div 
        class="task-card ${tarea.hecha ? "completada" : `prioridad-${tarea.prioridad}`}"
        data-id="${tarea.id}"
      >
        <div class="checkbox">${tarea.hecha ? "✓" : ""}</div>
        <div class="task-info">
          <div class="task-title">${(tarea.titulo)}</div>
          <span class="task-proyecto">${(tarea.proyecto)}</span>
          <span class="task-fecha">${this.formatearFecha(tarea.fecha)}</span>
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