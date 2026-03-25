const ModalProyectos = {
  idTarea: null,
  _elementoConFocoAnterior: null,
  _listenerTeclado: null,

  abrir(id) {
    const tarea = State.tareas.find((item) => item.id === id);
    if (!tarea) return;
    this._elementoConFocoAnterior = document.activeElement;
    this.idTarea = id;
    this.actualizarContenido();
    const backdrop = Utils.getElement("modal-proyectos-backdrop");
    if (backdrop) {
      backdrop.classList.remove("hidden");
      backdrop.setAttribute("aria-hidden", "false");
    }
    const dialog = Utils.getElement("modal-proyectos-dialog");
    if (dialog) {
      const enfocables = Utils.obtenerEnfocables(dialog);
      if (enfocables.length > 0) enfocables[0].focus();
      this._activarFocusTrap(dialog);
    }
  },

  cerrar() {
    this.idTarea = null;
    const backdrop = Utils.getElement("modal-proyectos-backdrop");
    if (backdrop) {
      backdrop.classList.add("hidden");
      backdrop.setAttribute("aria-hidden", "true");
    }
    this._desactivarFocusTrap();
    if (this._elementoConFocoAnterior && typeof this._elementoConFocoAnterior.focus === "function") {
      this._elementoConFocoAnterior.focus();
    }
    this._elementoConFocoAnterior = null;
  },

  _activarFocusTrap(dialog) {
    this._listenerTeclado = Utils.crearFocusTrap(dialog, () => this.cerrar());
    dialog.addEventListener("keydown", this._listenerTeclado);
  },

  _desactivarFocusTrap() {
    const dialog = Utils.getElement("modal-proyectos-dialog");
    if (dialog && this._listenerTeclado) {
      dialog.removeEventListener("keydown", this._listenerTeclado);
      this._listenerTeclado = null;
    }
  },

  // Chips con lo que ya tiene la tarea + select con proyectos que puede sumar
  actualizarContenido() {
    const tarea = State.tareas.find((item) => item.id === this.idTarea);
    if (!tarea) return;

    const proyectosActuales = State.proyectosDeTarea(tarea);
    const contenedorChips = Utils.getElement("modal-proyectos-chips");
    const select = Utils.getElement("modal-proyectos-select");

    if (!contenedorChips || !select) return;

    if (proyectosActuales.length === 0) {
      contenedorChips.innerHTML =
        '<span class="font-mono text-xs text-gray-400 dark:text-gray-500 italic">Ningún proyecto. Añade uno abajo.</span>';
    } else {
      Utils.setHTML(
        contenedorChips,
        proyectosActuales
          .map(
            (nombreProyecto) => `
          <span class="inline-flex items-center gap-1 font-mono text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded px-2.5 py-1">
            ${Utils.escapeHtml(nombreProyecto)}
            <button type="button" class="btn-quitar-proyecto rounded hover:bg-red-500/20 text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-0.5 focus:outline-none focus:ring-2 focus:ring-red-500" data-proyecto="${Utils.escapeHtml(nombreProyecto)}" aria-label="Quitar de este proyecto">✕</button>
          </span>`
          )
          .join("")
      );
    }

    const proyectosDisponibles = State.proyectos.filter((nombre) => !proyectosActuales.includes(nombre));
    const valorActual = select.value;
    Utils.setHTML(
      select,
      '<option value="">Elegir proyecto…</option>' +
        proyectosDisponibles
          .map(
            (nombreProyecto) =>
              `<option value="${Utils.escapeHtml(nombreProyecto)}" ${nombreProyecto === valorActual ? "selected" : ""}>${Utils.escapeHtml(nombreProyecto)}</option>`
          )
          .join("")
    );
  },

  init() {
    const cerrar = () => this.cerrar();
    Utils.getElement("btn-close-modal-proyectos")?.addEventListener("click", cerrar);
    Utils.getElement("btn-cerrar-modal-proyectos")?.addEventListener("click", cerrar);
    const backdrop = Utils.getElement("modal-proyectos-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", (evento) => {
        if (evento.target === backdrop) this.cerrar();
      });
    }

    Utils.getElement("btn-anadir-proyecto-tarea")?.addEventListener("click", async () => {
      const select = Utils.getElement("modal-proyectos-select");
      const nombre = select?.value?.trim();
      if (!nombre || this.idTarea == null) return;
      const ok = await TareasController.añadirAProyecto(this.idTarea, nombre);
      if (ok) {
        this.actualizarContenido();
        Modal.sincronizarSelectProyecto();
      }
    });

    // Clic en ✕ del chip → quitar proyecto de la tarea.
    Utils.getElement("modal-proyectos-chips")?.addEventListener("click", async (evento) => {
      const botonQuitar = evento.target.closest(".btn-quitar-proyecto");
      if (!botonQuitar || this.idTarea == null) return;
      const nombreProyecto = botonQuitar.dataset.proyecto;
      if (nombreProyecto) {
        const ok = await TareasController.quitarDeProyecto(this.idTarea, nombreProyecto);
        if (ok) {
          this.actualizarContenido();
          Modal.sincronizarSelectProyecto();
        }
      }
    });
  },
};
