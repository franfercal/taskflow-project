// Si localStorage no funciona, usa este archivo en lugar de app.js
// Cambio en index.html: <script src="app-indexeddb.js"></script>

// estados

const State = {
  proyectos: ["Desarrollo Web", "FrontEnd", "BackEnd", "JS", "Python"],
  tareas: [],
  filtroActivo: "todas",
  siguienteId: 1,
};

// indexdb

const Persistencia = {
  dbName: "TaskFlowDB",
  dbVersion: 1,
  db: null,
  cargaCompleta: false,

  // Inicializar y cargar IndexedDB
  async inicializar() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("Error al abrir IndexedDB", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("IndexedDB inicializado");
        
        // Cargar datos y resolver cuando termine
        this.cargarDatos().then(() => {
          this.cargaCompleta = true;
          resolve();
        });
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("tareas")) {
          db.createObjectStore("tareas", { keyPath: "id" });
          console.log("Almacén 'tareas' creado");
        }
        if (!db.objectStoreNames.contains("proyectos")) {
          db.createObjectStore("proyectos", { keyPath: "nombre" });
          console.log("Almacén 'proyectos' creado");
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "clave" });
          console.log("Almacen 'meta' creado");
        }
      };
    });
  },

  // Cargar datos
  cargarDatos() {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve();
        return;
      }

      try {
        let tareasListas = false;
        let proyectosListos = false;
        let metaLista = false;

        // Cargar tareas
        const tareasRequest = this.db
          .transaction(["tareas"], "readonly")
          .objectStore("tareas")
          .getAll();

        tareasRequest.onsuccess = () => {
          if (tareasRequest.result.length > 0) {
            State.tareas = tareasRequest.result;
            console.log(`✓ ${State.tareas.length} tareas cargadas`);
          } else {
            console.log("Sin tareas guardadas");
          }
          tareasListas = true;
          if (tareasListas && proyectosListos && metaLista) resolve();
        };

        tareasRequest.onerror = () => {
          console.warn("Advertencia al cargar tareas");
          tareasListas = true;
          if (tareasListas && proyectosListos && metaLista) resolve();
        };

        // Cargar proyectos
        const proyectosRequest = this.db
          .transaction(["proyectos"], "readonly")
          .objectStore("proyectos")
          .getAll();

        proyectosRequest.onsuccess = () => {
          if (proyectosRequest.result.length > 0) {
            const proyectosGuardados = proyectosRequest.result.map((p) => p.nombre);
            State.proyectos = proyectosGuardados;
            console.log(`✓ ${State.proyectos.length} proyectos cargados`);
          } else {
            console.log("Sin proyectos guardados, usando predeterminados");
          }
          proyectosListos = true;
          if (tareasListas && proyectosListos && metaLista) resolve();
        };

        proyectosRequest.onerror = () => {
          console.warn("Advertencia al cargar proyectos");
          proyectosListos = true;
          if (tareasListas && proyectosListos && metaLista) resolve();
        };

        // Cargar siguiente ID
        const metaRequest = this.db
          .transaction(["meta"], "readonly")
          .objectStore("meta")
          .get("siguienteId");

        metaRequest.onsuccess = () => {
          if (metaRequest.result && metaRequest.result.valor) {
            State.siguienteId = metaRequest.result.valor;
            console.log(`Siguiente ID cargado: ${State.siguienteId}`);
          } else {
            console.log("Usando siguiente ID predeterminado");
          }
          metaLista = true;
          if (tareasListas && proyectosListos && metaLista) resolve();
        };

        metaRequest.onerror = () => {
          console.warn("Advertencia al cargar meta");
          metaLista = true;
          if (tareasListas && proyectosListos && metaLista) resolve();
        };
      } catch (error) {
        console.error("Error al cargar datos", error);
        resolve();
      }
    });
  },

  // Guardar estado completo
  guardar() {
    if (!this.db) {
      console.warn("IndexedDB, no se pueden guardar datos");
      return;
    }

    try {
      // Guardar tareas
      const transaccionTareas = this.db
        .transaction(["tareas"], "readwrite")
        .objectStore("tareas");
      transaccionTareas.clear();
      State.tareas.forEach((tarea) => {
        transaccionTareas.add(tarea);
      });

      // Guardar proyectos
      const transaccionProyectos = this.db
        .transaction(["proyectos"], "readwrite")
        .objectStore("proyectos");
      transaccionProyectos.clear();
      State.proyectos.forEach((proyecto) => {
        transaccionProyectos.add({ nombre: proyecto });
      });

      // Guardar siguiente ID
      const transaccionMeta = this.db
        .transaction(["meta"], "readwrite")
        .objectStore("meta");
      transaccionMeta.put({ clave: "siguienteId", valor: State.siguienteId });

      console.log("Datos guardados en IndexedDB");
    } catch (error) {
      console.error("Error al guardar en IndexedDB", error);
    }
  },

  // Limpiar almacenamiento
  limpiar() {
    if (!this.db) return;

    try {
      this.db.transaction(["tareas"], "readwrite").objectStore("tareas").clear();
      this.db
        .transaction(["proyectos"], "readwrite")
        .objectStore("proyectos")
        .clear();
      this.db.transaction(["meta"], "readwrite").objectStore("meta").clear();

      console.log("✓ IndexedDB limpiado");
    } catch (error) {
      console.error("Error al limpiar", error);
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

// log.filtrados

const Filtros = {
  obtenerVisibles() {
    const { tareas } = State;
    const filtro = State.filtroActivo;

    const filtrosMap = {
      todas: () => tareas,
      alta: () => tareas.filter((t) => t.prioridad === "alta"),
      hoy: () =>
        tareas.filter(
          (t) => !t.hecha && t.fecha.toLowerCase().includes("hoy")
        ),
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
          chip.dataset.filtro === State.filtroActivo
        )
      );
    document
      .querySelectorAll(".nav-item[data-vista]")
      .forEach((item) =>
        item.classList.toggle(
          "active",
          item.dataset.vista === State.filtroActivo
        )
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
    Persistencia.guardar();
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
    Persistencia.guardar();
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
        </button>`
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
          (t) => t.proyecto === proyecto && !t.hecha
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
      (t) => !t.hecha && t.fecha.toLowerCase().includes("hoy")
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
          </option>`
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
    if (btnCancelar)
      btnCancelar.addEventListener("click", () => this.cerrar());

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
  async init() {
    try {
      await Persistencia.inicializar();
      
      this.configurarFecha();
      Modal.init();
      Navegacion.init();
      Render.renderizarFiltros();
      Render.renderizarProyectosLateral();
      Render.renderizarTareas();
      console.log("TaskFlow iniciado con IndexedDB");
    } catch (error) {
      console.error("Error al inicializar TaskFlow con IndexedDB", error);
    }
  },

  configurarFecha() {
    const fechaElement = document.getElementById("fecha-actual");

    if (fechaElement) {
      const fecha = Utils.formatearFecha({
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      fechaElement.textContent = fecha;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});