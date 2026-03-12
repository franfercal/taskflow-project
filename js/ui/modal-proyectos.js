/**
 * Modal para gestionar los proyectos de una tarea ya creada: añadir y quitar proyectos.
 * Se abre desde el botón "Gestionar proyectos" (⊕) en cada tarjeta de tarea.
 */

const ModalProyectos = {
  /** id de la tarea que se está editando (null cuando el modal está cerrado). */
  idTarea: null,
  /** Elemento que tenía el foco antes de abrir el modal (para restaurarlo al cerrar). */
  _elementoConFocoAnterior: null,
  /** Listener de teclado para focus trap (para poder eliminarlo al cerrar). */
  _listenerTeclado: null,

  /**
   * Abre el modal de gestión de proyectos para la tarea con el id dado.
   * Rellena chips y select. Accesibilidad: aria-hidden, foco al primer enfocable y focus trap.
   * @param {number} id - id de la tarea
   * @returns {void}
   */
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

  /**
   * Oculta el modal, restaura el foco al elemento anterior y desactiva el focus trap.
   * @returns {void}
   */
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

  /**
   * Activa el focus trap usando la utilidad compartida (Escape cierra; Tab mantiene foco dentro).
   * @param {HTMLElement} dialog - Contenedor del diálogo (elementos enfocables)
   * @returns {void}
   */
  _activarFocusTrap(dialog) {
    this._listenerTeclado = Utils.crearFocusTrap(dialog, () => this.cerrar());
    dialog.addEventListener("keydown", this._listenerTeclado);
  },

  /**
   * Quita el listener del focus trap del diálogo.
   * @returns {void}
   */
  _desactivarFocusTrap() {
    const dialog = Utils.getElement("modal-proyectos-dialog");
    if (dialog && this._listenerTeclado) {
      dialog.removeEventListener("keydown", this._listenerTeclado);
      this._listenerTeclado = null;
    }
  },

  /**
   * Rellena la lista de chips (proyectos actuales de la tarea) y el select con los proyectos
   * a los que aún se puede añadir la tarea (los que no tiene ya).
   * @returns {void}
   */
  actualizarContenido() {
    const tarea = State.tareas.find((item) => item.id === this.idTarea);
    if (!tarea) return;

    const proyectosActuales = State.proyectosDeTarea(tarea);
    const contenedorChips = Utils.getElement("modal-proyectos-chips");
    const select = Utils.getElement("modal-proyectos-select");

    if (!contenedorChips || !select) return;

    // Chips: cada proyecto con botón para quitar
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

    // Select: proyectos que existen y que la tarea aún no tiene
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

  /**
   * Inicializa los event listeners del modal: cerrar, añadir proyecto, delegación para quitar proyecto.
   * @returns {void}
   */
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

    Utils.getElement("btn-anadir-proyecto-tarea")?.addEventListener("click", () => {
      const select = Utils.getElement("modal-proyectos-select");
      const nombre = select?.value?.trim();
      if (!nombre || this.idTarea == null) return;
      TareasController.añadirAProyecto(this.idTarea, nombre);
      this.actualizarContenido();
      Modal.sincronizarSelectProyecto();
    });

    // Delegación: clic en "quitar" de un chip
    Utils.getElement("modal-proyectos-chips")?.addEventListener("click", (evento) => {
      const botonQuitar = evento.target.closest(".btn-quitar-proyecto");
      if (!botonQuitar || this.idTarea == null) return;
      const nombreProyecto = botonQuitar.dataset.proyecto;
      if (nombreProyecto) {
        TareasController.quitarDeProyecto(this.idTarea, nombreProyecto);
        this.actualizarContenido();
        Modal.sincronizarSelectProyecto();
      }
    });
  },
};
