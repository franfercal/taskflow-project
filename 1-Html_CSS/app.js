// Si indexdb no funciona, usa este archivo en lugar de appindexdb.js
// Cambio en index.html: <script src="app.js"></script>

// estados

const State = {
  proyectos: ["Diseño", "Front End", "Base de Datos", "Base de Datos."],
  tareas: [],
  filtroActivo: "todas",
  siguienteId: 1,
};

// localstorage

const Persistencia = {
  // Claves de almacenamiento
  KEYS: {
    TAREAS: "taskflow_tareas",
    PROYECTOS: "taskflow_proyectos",
    SIGUIENTE_ID: "taskflow_siguiente_id",
  },

  // Guardar estado entero
  guardar() {
    try {
      localStorage.setItem(
        this.KEYS.TAREAS,
        JSON.stringify(State.tareas)
      );
      localStorage.setItem(
        this.KEYS.PROYECTOS,
        JSON.stringify(State.proyectos)
      );
      localStorage.setItem(
        this.KEYS.SIGUIENTE_ID,
        State.siguienteId.toString()
      );
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  },

  // Cargar estado guardado
  cargar() {
    try {
      const tareas = localStorage.getItem(this.KEYS.TAREAS);
      const proyectos = localStorage.getItem(this.KEYS.PROYECTOS);
      const siguienteId = localStorage.getItem(this.KEYS.SIGUIENTE_ID);

      if (tareas) {
        State.tareas = JSON.parse(tareas);
      }
      if (proyectos) {
        State.proyectos = JSON.parse(proyectos);
      }
      if (siguienteId) {
        State.siguienteId = parseInt(siguienteId, 10);
      }

      console.log("✓ Datos cargados");
    } catch (error) {
      console.error("Error al cargar", error);
    }
  },

  // Limpiar almacenamiento
  limpiar() {
    try {
      localStorage.removeItem(this.KEYS.TAREAS);
      localStorage.removeItem(this.KEYS.PROYECTOS);
      localStorage.removeItem(this.KEYS.SIGUIENTE_ID);
      console.log("Memoria Limpia");
    } catch (error) {
      console.error("Error al eliminar memoria:", error);
    }
  },
};

//

const Utils = {
  getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Elemento con id "${id}" no encontrado`);
    }
    return element;
  },
  formatearFecha(opciones = {}) {
    return new Date().toLocaleDateString("es-ES", opciones);
  },
  sanitizar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
  },
};

// logica filtrados

const Filtros = {
  obtenerVisibles() {
    const { tareas } = State;
    const filtro = State.filtroActivo;

    const filtrosMap = {
      todas: () => tareas,
      alta: () => tareas.filter((t) => t.prioridad === "alta"),
      hoy: () =>
        tareas.filter((t) => !t.hecha && t.fecha.toLowerCase().includes("hoy")),
      semana: () => tareas.filter((t) => !t.hecha),
      "completadas-vista": () => tareas.filter((t) => t.hecha),
    };
    return filtrosMap[filtro]
      ? filtrosMap[filtro]()
      : tareas.filter((t) => t.proyecto === filtro);
  },
  cambiarFiltro(nuevoFiltro) {
    State.filtroActivo = nuevoFiltro;
    this.actualizarUIFiltros();
    Render.renderizarTareas();
  },
  actualizarUIFiltros() {
    document
      .querySelectorAll(".filter-chip")
      .forEach((chip) =>
        chip.classList.toggle(
          "active",
          chip.dataset.filtro === State.filtroActivo,
        ),
      );
    document
      .querySelectorAll(".nav-item[data-vista]")
      .forEach((item) =>
        item.classList.toggle(
          "active",
          item.dataset.vista === State.filtroActivo,
        ),
      );
  },
};

// tareas

const TareasController = {
  agregar(titulo, proyecto, prioridad, fecha) {
    if (!titulo?.trim()) {
      console.warn("No se puede agregar tarea sin título");
      return false;
    }

    const nuevaTarea = {
      id: State.siguienteId++,
      titulo: titulo.trim(),
      proyecto,
      prioridad,
      fecha: fecha?.trim() || "Sin fecha",
      hecha: false,
    };

    State.tareas.unshift(nuevaTarea);
    this.actualizarUI();
    return true;
  },
  alternarHecha(id) {
    const tarea = State.tareas.find((t) => t.id === id);
    if (tarea) {
      tarea.hecha = !tarea.hecha;
      this.actualizarUI();
    }
  },
  eliminar(id) {
    State.tareas = State.tareas.filter((t) => t.id !== id);
    this.actualizarUI();
  },
  actualizarUI() {
    Render.renderizarTareas();
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Estadisticas.actualizar();
  },
};

// proyectos

const ProyectosController = {
  agregar(nombre) {
    const nombreLimpio = nombre?.trim();
    if (!nombreLimpio) {
      console.warn("Nombre de proyecto vacío");
      return false;
    }
    if (State.proyectos.includes(nombreLimpio)) {
      console.warn("El proyecto ya existe");
      return false;
    }
    State.proyectos.push(nombreLimpio);
    this.actualizarUI();
    return true;
  },
  actualizarUI() {
    Render.renderizarProyectosLateral();
    Render.renderizarFiltros();
    Modal.sincronizarSelectProyecto();
  },
};

// render

const Render = {
  renderizarFiltros() {
    const contenedor = Utils.getElement("filters");
    if (!contenedor) return;

    const filtrosBase = [
      { etiqueta: "Todas", valor: "todas" },
      { etiqueta: "Alta prioridad", valor: "alta" },
    ];

    const filtrosProyectos = State.proyectos.map((p) => ({
      etiqueta: p,
      valor: p,
    }));

    const todosFiltros = [...filtrosBase, ...filtrosProyectos];

    contenedor.innerHTML = todosFiltros
      .map(
        (f) => `
        <button 
          class="filter-chip ${State.filtroActivo === f.valor ? "active" : ""}" 
          data-filtro="${f.valor}"
        >
          ${Utils.sanitizar(f.etiqueta)}
        </button>`,
      )
      .join("");

    contenedor.querySelectorAll(".filter-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        Filtros.cambiarFiltro(btn.dataset.filtro);
      });
    });
  },

  renderizarProyectosLateral() {
    const contenedor = Utils.getElement("nav-proyectos");
    if (!contenedor) return;

    contenedor.innerHTML = State.proyectos
      .map((proyecto) => {
        const pendientes = State.tareas.filter(
          (t) => t.proyecto === proyecto && !t.hecha,
        ).length;

        return `
          <div class="nav-item" data-vista="${proyecto}">
            <span class="nav-icon">◆</span>
            ${Utils.sanitizar(proyecto)}
            <span class="nav-counter">${pendientes}</span>
          </div>`;
      })
      .join("");

    contenedor.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        Filtros.cambiarFiltro(item.dataset.vista);
      });
    });
  },

  renderizarTareas() {
    const visibles = Filtros.obtenerVisibles();
    const pendientes = visibles.filter((t) => !t.hecha);
    const completadas = visibles.filter((t) => t.hecha);

    const contenedor = Utils.getElement("task-list");
    if (!contenedor) return;

    if (!visibles.length) {
      contenedor.innerHTML = `
        <div class="empty-state">No hay tareas</div>`;
      Estadisticas.actualizar();
      return;
    }

    contenedor.innerHTML =
      this.renderizarGrupo("Pendientes", pendientes) +
      this.renderizarGrupo("Completadas", completadas);

    this.agregarEventListeners(contenedor);
    Estadisticas.actualizar();
  },

  renderizarGrupo(titulo, lista) {
    if (!lista.length) return "";

    return `
      <section class="tasks-section">
        <h2 class="task-group-title">${titulo}</h2>
        ${lista.map((tarea) => this.renderizarTarjeta(tarea)).join("")}
      </section>`;
  },

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
        <button class="btn-eliminar" data-id="${tarea.id}" aria-label="Eliminar tarea">
          ✕
        </button>
      </div>`;
  },

  agregarEventListeners(contenedor) {
    contenedor.querySelectorAll(".task-card").forEach((tarjeta) => {
      tarjeta.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar")) return;
        TareasController.alternarHecha(Number(tarjeta.dataset.id));
      });
    });

    contenedor.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        TareasController.eliminar(Number(btn.dataset.id));
      });
    });
  },
};

const Estadisticas = {
  actualizar() {
    const total = State.tareas.length;
    const completadas = State.tareas.filter((t) => t.hecha).length;
    const pendientes = total - completadas;
    const porcentaje = total ? Math.round((completadas / total) * 100) : 0;

    this.actualizarElemento("est-total", total);
    this.actualizarElemento("est-completadas", completadas);
    this.actualizarElemento("est-porcentaje", `${porcentaje}%`);

    const fillElement = Utils.getElement("est-fill");
    if (fillElement) {
      fillElement.style.width = `${porcentaje}%`;
    }

    this.actualizarContadores(completadas, pendientes);

    this.actualizarSubtitulo(pendientes);
  },

  actualizarElemento(id, valor) {
    const elemento = Utils.getElement(id);
    if (elemento) {
      elemento.textContent = valor;
    }
  },

  actualizarContadores(completadas, pendientes) {
    const hoy = State.tareas.filter(
      (t) => !t.hecha && t.fecha.toLowerCase().includes("hoy"),
    ).length;

    this.actualizarElemento("cnt-todas", State.tareas.length);
    this.actualizarElemento("cnt-hoy", hoy);
    this.actualizarElemento("cnt-semana", pendientes);
    this.actualizarElemento("cnt-completadas", completadas);
  },

  actualizarSubtitulo(pendientes) {
    const fecha = Utils.formatearFecha({
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const texto = `${fecha} · ${pendientes} pendiente${pendientes !== 1 ? "s" : ""}`;
    this.actualizarElemento("subtitle-pendientes", texto);
  },
};

// modal

const Modal = {
  elementos: {},

  init() {
    this.elementos = {
      backdrop: Utils.getElement("modal-backdrop"),
      titulo: Utils.getElement("field-titulo"),
      proyecto: Utils.getElement("field-proyecto"),
      prioridad: Utils.getElement("field-prioridad"),
      fecha: Utils.getElement("field-fecha"),
      nuevoProyectoContainer: Utils.getElement("field-nuevo-proyecto"),
      nombreProyecto: Utils.getElement("field-nombre-proyecto"),
    };

    this.agregarEventListeners();
  },

  abrir() {
    this.sincronizarSelectProyecto();
    this.elementos.nuevoProyectoContainer.style.display = "none";
    this.elementos.backdrop.classList.remove("hidden");
    this.elementos.titulo.focus();
  },

  cerrar() {
    this.elementos.backdrop.classList.add("hidden");
    this.limpiarCampos();
  },

  limpiarCampos() {
    this.elementos.titulo.value = "";
    this.elementos.fecha.value = "";
    this.elementos.nombreProyecto.value = "";
    this.elementos.nuevoProyectoContainer.style.display = "none";
    this.elementos.titulo.style.borderColor = "";
  },

  sincronizarSelectProyecto() {
    const valorActual = this.elementos.proyecto.value;

    this.elementos.proyecto.innerHTML =
      State.proyectos
        .map(
          (p) => `
          <option value="${p}" ${p === valorActual ? "selected" : ""}>
            ${Utils.sanitizar(p)}
          </option>`,
        )
        .join("") + `<option value="__nuevo__">+ Nuevo proyecto…</option>`;
  },

  guardar() {
    const titulo = this.elementos.titulo.value.trim();
    const proyecto = this.elementos.proyecto.value;
    const prioridad = this.elementos.prioridad.value;
    const fecha = this.elementos.fecha.value.trim();

    if (!titulo) {
      this.elementos.titulo.style.borderColor = "var(--color-peligro)";
      this.elementos.titulo.focus();
      return;
    }

    if (proyecto === "__nuevo__") {
      this.elementos.nombreProyecto.style.borderColor = "var(--color-peligro)";
      this.elementos.nombreProyecto.focus();
      return;
    }

    this.elementos.titulo.style.borderColor = "";
    TareasController.agregar(titulo, proyecto, prioridad, fecha);
    this.cerrar();
  },

  crearProyecto() {
    const nombre = this.elementos.nombreProyecto.value.trim();

    if (!nombre) return;

    if (ProyectosController.agregar(nombre)) {
      this.sincronizarSelectProyecto();
      this.elementos.proyecto.value = nombre;
      this.elementos.nuevoProyectoContainer.style.display = "none";
      this.elementos.nombreProyecto.value = "";
    }
  },

  agregarEventListeners() {
    document
      .querySelectorAll(".btn-nueva-tarea")
      .forEach((btn) => btn.addEventListener("click", () => this.abrir()));

    const btnCerrar = Utils.getElement("btn-close-modal");
    const btnCancelar = Utils.getElement("btn-cancelar-modal");

    if (btnCerrar) btnCerrar.addEventListener("click", () => this.cerrar());
    if (btnCancelar) btnCancelar.addEventListener("click", () => this.cerrar());

    this.elementos.backdrop?.addEventListener("click", (e) => {
      if (e.target === this.elementos.backdrop) this.cerrar();
    });

    const btnGuardar = Utils.getElement("btn-guardar-tarea");
    if (btnGuardar) {
      btnGuardar.addEventListener("click", () => this.guardar());
    }

    this.elementos.titulo?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.guardar();
    });

    this.elementos.proyecto?.addEventListener("change", (e) => {
      const mostrar = e.target.value === "__nuevo__";
      this.elementos.nuevoProyectoContainer.style.display = mostrar
        ? "flex"
        : "none";
      if (mostrar) this.elementos.nombreProyecto.focus();
    });

    const btnConfirmar = Utils.getElement("btn-confirmar-proyecto");
    if (btnConfirmar) {
      btnConfirmar.addEventListener("click", () => this.crearProyecto());
    }

    this.elementos.nombreProyecto?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.crearProyecto();
    });
  },
};

// navegacion

const Navegacion = {
  init() {
    this.configurarVistas();
    this.configurarMenuMovil();
  },

  configurarVistas() {
    document.querySelectorAll(".nav-item[data-vista]").forEach((item) => {
      item.addEventListener("click", () => {
        Filtros.cambiarFiltro(item.dataset.vista);
      });
    });
  },

  configurarMenuMovil() {
    const btnMenu = Utils.getElement("btn-menu");
    const sidebar = Utils.getElement("sidebar");

    if (btnMenu && sidebar) {
      btnMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }
  },
};

// inicio app

const App = {

  init() {
    Persistencia.cargar();
    this.configurarFecha();
    Modal.init();
    Navegacion.init();
    Render.renderizarFiltros();
    Render.renderizarProyectosLateral();
    Render.renderizarTareas();
    console.log("✓ TaskFlow iniciado");
  },

  configurarFecha() {
    console.log("Cargando...");
    const fechaElement = document.getElementById("fecha-actual");
    console.log("Elemento fecha-actual:", fechaElement);
    
    if (fechaElement) {
      const fecha = Utils.formatearFecha({
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      console.log("Fecha formateada:", fecha);
      fechaElement.textContent = fecha;
      console.log("✓ Fecha establecida correctamente");
    } else {
      console.error("❌ Elemento fecha-actual no encontrado");
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
