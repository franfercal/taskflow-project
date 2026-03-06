/* gestion modal para creacion-edicion de tareas */

const Modal = {
  elementos: {},
  fpFecha: null,
  fpHora: null,

  /* inicializa modal y listeners */
  init() {
    this.elementos = {
      backdrop: Utils.getElement("modal-backdrop"),
      titulo: Utils.getElement("field-titulo"),
      proyecto: Utils.getElement("field-proyecto"),
      prioridad: Utils.getElement("field-prioridad"),
      fechaDia: Utils.getElement("field-fecha-dia"),
      fechaHora: Utils.getElement("field-fecha-hora"),
      nuevoProyectoContainer: Utils.getElement("field-nuevo-proyecto"),
      nombreProyecto: Utils.getElement("field-nombre-proyecto"),
    };

    this.fpFecha = flatpickr(this.elementos.fechaDia, {
      dateFormat: "Y-m-d",
      allowInput: true,
    });

    this.fpHora = flatpickr(this.elementos.fechaHora, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: true,
      allowInput: true,
    });

    this.agregarEventListeners();
  },

  /* abre modal */
  abrir() {
    this.sincronizarSelectProyecto();
    this.elementos.nuevoProyectoContainer.style.display = "none";
    this.fpFecha.setDate(new Date(), true);
    this.elementos.backdrop.classList.remove("hidden");
    this.elementos.titulo.focus();
  },

  /* cierra el modal */
  cerrar() {
    this.elementos.backdrop.classList.add("hidden");
    this.limpiarCampos();
  },

  /*limpia los campos formulario */
  limpiarCampos() {
    this.elementos.titulo.value = "";
    this.fpFecha.clear();
    this.fpHora.clear();
    this.elementos.nombreProyecto.value = "";
    this.elementos.nuevoProyectoContainer.style.display = "none";
    this.elementos.titulo.style.borderColor = "";
    this.elementos.nombreProyecto.style.borderColor = "";
  },

  /* sincroniza proyecto con proyectos actuales */
  sincronizarSelectProyecto() {
    const valorActual = this.elementos.proyecto.value;

    Utils.setHTML(
      this.elementos.proyecto,
      State.proyectos
        .map(
          (p) => `
          <option value="${Utils.escapeHtml(p)}" ${p === valorActual ? "selected" : ""}>
            ${Utils.escapeHtml(p)}
          </option>`
        )
        .join("") + `<option value="__nuevo__">+ Nuevo proyecto…</option>`
    );
  },

  /* valida y guarda nueva tarea */
  guardar() {
    const titulo = this.elementos.titulo.value.trim();
    const proyecto = this.elementos.proyecto.value;
    const prioridad = this.elementos.prioridad.value;
    const dia = this.elementos.fechaDia.value;
    const hora = this.elementos.fechaHora.value;
    const fecha = dia ? (hora ? `${dia} ${hora}` : dia) : "Sin fecha";

    // valida titulo - valida si el nuevo proyecto esta vacio
    if (!titulo) {
      this.elementos.titulo.style.borderColor = "var(--color-peligro)";
      this.elementos.titulo.focus();
      console.warn("Título vacío");
      return;
    }

    if (proyecto === "__nuevo__") {
      this.elementos.nombreProyecto.style.borderColor = "var(--color-peligro)";
      this.elementos.nombreProyecto.focus();
      console.warn("Debe ingresar nombre para nuevo proyecto");
      return;
    }

    // limpia error
    this.elementos.titulo.style.borderColor = "";
    this.elementos.nombreProyecto.style.borderColor = "";

    // añade tarea tarea
    if (TareasController.agregar(titulo, proyecto, prioridad, fecha)) {
      this.cerrar();
      console.log("✓ Tarea agregada");
    }
  },

  /* crea nuevo proyecto desde modal */
  crearProyecto() {
    const nombre = this.elementos.nombreProyecto.value.trim();

    if (Utils.estaVacio(nombre)) {
      console.warn("Nombre de proyecto vacío");
      return;
    }

    if (ProyectosController.agregar(nombre)) {
      this.elementos.proyecto.value = nombre;
      this.elementos.nuevoProyectoContainer.style.display = "none";
      this.elementos.nombreProyecto.value = "";
    }
  },

  /* añade listeners al modal */
  agregarEventListeners() {
    // boton abrir modal
    Utils.getElements(".btn-nueva-tarea").forEach((btn) => {
      btn.addEventListener("click", () => this.abrir());
    });

    // btones cerrar
    Utils.getElement("btn-close-modal")?.addEventListener("click", () =>
      this.cerrar()
    );
    Utils.getElement("btn-cancelar-modal")?.addEventListener("click", () =>
      this.cerrar()
    );

    // click fuera del modal
    this.elementos.backdrop?.addEventListener("click", (e) => {
      if (e.target === this.elementos.backdrop) this.cerrar();
    });

    // boton guardar
    Utils.getElement("btn-guardar-tarea")?.addEventListener("click", () =>
      this.guardar()
    );

    // enter en título
    this.elementos.titulo?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.guardar();
    });

    // cambio select proyecto
    this.elementos.proyecto?.addEventListener("change", (e) => {
      const mostrar = e.target.value === "__nuevo__";
      this.elementos.nuevoProyectoContainer.style.display = mostrar
        ? "flex"
        : "none";
      if (mostrar) this.elementos.nombreProyecto.focus();
    });

    // btonn confirmar proyecto
    Utils.getElement("btn-confirmar-proyecto")?.addEventListener("click", () =>
      this.crearProyecto()
    );

    // enter en nombre proyecto
    this.elementos.nombreProyecto?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.crearProyecto();
    });
  },
};