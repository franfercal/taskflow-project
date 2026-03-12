/**
 * Modal para crear una nueva tarea: formulario con título, proyecto, prioridad, fecha y hora.
 * Incluye selector de fecha (flatpickr), reloj circular para la hora y opción "Nuevo proyecto".
 */

const Modal = {
  /** Longitud máxima del título de la tarea (coincide con maxlength del input). */
  MAX_TITULO: 80,
  /** Longitud máxima del nombre de un proyecto (coincide con maxlength del input). */
  MAX_NOMBRE_PROYECTO: 30,

  /** Referencias a los nodos del formulario (backdrop, inputs, selects, mensajes de error, etc.). */
  elementos: {},
  /** Instancia de flatpickr para el campo de fecha (día). */
  fpFecha: null,
  /** Estado del reloj de hora: hora y minuto seleccionados y paso actual (hora / minuto). */
  reloj: { hora: null, minuto: null, paso: "hora" },
  /** Lista de nombres de proyectos elegidos para la nueva tarea (varios proyectos). */
  proyectosSeleccionados: [],
  /** Elemento que tenía el foco antes de abrir el modal (para restaurarlo al cerrar). */
  _elementoConFocoAnterior: null,
  /** Referencia al listener de teclado para el focus trap (para poder eliminarlo al cerrar). */
  _listenerTeclado: null,

  /**
   * Muestra u oculta el mensaje de error en un span (role="alert"). Mensaje vacío = ocultar.
   * @param {HTMLElement | null} span - Elemento donde mostrar el mensaje
   * @param {string} [mensaje] - Texto del error; si está vacío se oculta el span
   * @returns {void}
   */
  _establecerMensajeError(span, mensaje) {
    if (!span) return;
    span.textContent = mensaje || "";
    span.classList.toggle("hidden", !mensaje);
  },

  /**
   * Aplica o quita el estilo de campo inválido (borde rojo y aria-invalid) en un input.
   * @param {HTMLElement | null} input - Campo de formulario
   * @param {boolean} invalido - true = mostrar error, false = quitar error
   * @returns {void}
   */
  _marcarCampoInvalido(input, invalido) {
    if (!input) return;
    input.classList.toggle("border-red-500", invalido);
    input.setAttribute("aria-invalid", invalido ? "true" : "false");
  },

  /**
   * Aplica o quita el ring de error en el contenedor de proyectos seleccionados.
   * @param {boolean} invalido - true = mostrar ring rojo, false = quitar
   * @returns {void}
   */
  _marcarContenedorProyectosInvalido(invalido) {
    const cont = this.elementos.contenedorProyectosSeleccionados;
    if (!cont) return;
    cont.classList.toggle("ring-2", invalido);
    cont.classList.toggle("ring-red-500", invalido);
    cont.classList.toggle("rounded", invalido);
  },

  /**
   * Inicializa referencias a elementos, flatpickr, reloj y todos los event listeners del modal.
   * @returns {void}
   */
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
      contenedorProyectosSeleccionados: Utils.getElement("modal-proyectos-seleccionados"),
      errorTitulo: Utils.getElement("error-titulo"),
      errorProyectos: Utils.getElement("error-proyectos"),
      errorNombreProyecto: Utils.getElement("error-nombre-proyecto"),
    };

    if (this.elementos.fechaDia) {
      this.fpFecha = flatpickr(this.elementos.fechaDia, {
        dateFormat: "Y-m-d",
        allowInput: true,
      });
    }

    this.iniciarReloj();
    this.agregarEventListeners();
  },

  /**
   * Calcula la posición (left, top) de un punto en un círculo para el reloj.
   * @param {number} centro - coordenada del centro (px)
   * @param {number} radio - radio (px)
   * @param {number} anguloGrados - ángulo en grados (0 = 3h, 90 = 6h; -90 para que 0 quede arriba)
   * @returns {{ left: string, top: string }}
   */
  posicionEnCirculo(centro, radio, anguloGrados) {
    const radianes = (anguloGrados - 90) * (Math.PI / 180);
    return {
      left: `${centro + radio * Math.cos(radianes) - 16}px`,
      top: `${centro + radio * Math.sin(radianes) - 16}px`,
    };
  },

  /**
   * Pinta en la cara del reloj botones en círculo para cada valor (horas 0–23 o minutos 0,5,…,55).
   * @param {HTMLElement} caraReloj - Contenedor donde se insertan los botones
   * @param {number} centro - Centro del círculo (px)
   * @param {number} radio - Radio (px)
   * @param {number[]} valores - Valores a mostrar (ej. [0,1,...,23] o [0,5,...,55])
   * @param {number|null} valorSeleccionado - Valor actualmente seleccionado
   * @param {string} claseBase - Clase CSS base del botón ("reloj-numero" o "reloj-minuto")
   * @param {function(number): void} alClic - Se llama con el valor al hacer clic en un botón
   * @returns {void}
   */
  _pintarBotonesReloj(caraReloj, centro, radio, valores, valorSeleccionado, claseBase, alClic) {
    caraReloj.innerHTML = "";
    valores.forEach((valor, indice) => {
      const posicion = this.posicionEnCirculo(centro, radio, (indice * 360) / valores.length);
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = claseBase + (valorSeleccionado === valor ? " selected" : "");
      boton.textContent = String(valor).padStart(2, "0");
      boton.style.left = posicion.left;
      boton.style.top = posicion.top;
      boton.addEventListener("click", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        alClic(valor);
      });
      caraReloj.appendChild(boton);
    });
    const elementoCentro = document.createElement("div");
    elementoCentro.className = "reloj-centro";
    caraReloj.appendChild(elementoCentro);
  },

  /**
   * Monta el reloj de 24h y 12 intervalos de 5 min: botones en círculo, popover, valor actual y "Listo".
   * Al hacer clic en el display se abre el popover; al elegir hora se pasa a minutos y al elegir minuto se cierra.
   * @returns {void}
   */
  iniciarReloj() {
    const caraReloj = Utils.getElement("reloj-cara");
    const botonDisplay = Utils.getElement("reloj-display");
    const popoverReloj = Utils.getElement("reloj-popover");
    const elementoValorActual = Utils.getElement("reloj-valor-actual");
    const botonListo = Utils.getElement("reloj-listo");
    if (!caraReloj || !botonDisplay || !popoverReloj) return;

    const centro = 100;
    const radio = 78;
    const intervalosMinutos = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    const mostrarPopover = () => {
      popoverReloj.classList.remove("hidden");
      popoverReloj.style.display = "block";
    };
    const ocultarPopover = () => {
      popoverReloj.classList.add("hidden");
      popoverReloj.style.display = "none";
    };

    const actualizarValorTexto = () => {
      const hora = this.reloj.hora ?? 0;
      const minuto = this.reloj.minuto ?? 0;
      if (elementoValorActual) elementoValorActual.textContent = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
    };

    const pintarMinutos = () => {
      this._pintarBotonesReloj(caraReloj, centro, radio, intervalosMinutos, this.reloj.minuto, "reloj-minuto", (minuto) => {
        this.reloj.minuto = minuto;
        this.aplicarHoraReloj();
        this.actualizarDisplayReloj();
        ocultarPopover();
      });
    };

    const pintarHoras = () => {
      const horas = Array.from({ length: 24 }, (_, i) => i);
      this._pintarBotonesReloj(caraReloj, centro, radio, horas, this.reloj.hora, "reloj-numero", (hora) => {
        this.reloj.hora = hora;
        this.reloj.paso = "minuto";
        actualizarValorTexto();
        pintarMinutos();
      });
    };

    botonDisplay.addEventListener("click", (evento) => {
      evento.preventDefault();
      evento.stopPropagation();
      const valorInput = this.elementos.fechaHora?.value || "";
      const coincidencia = valorInput.match(/^(\d{1,2}):(\d{2})$/);
      if (coincidencia) {
        this.reloj.hora = parseInt(coincidencia[1], 10);
        this.reloj.minuto = parseInt(coincidencia[2], 10);
      } else {
        const ahora = new Date();
        this.reloj.hora = ahora.getHours();
        this.reloj.minuto = intervalosMinutos[Math.round(ahora.getMinutes() / 5) % 12];
      }
      this.reloj.paso = "hora";
      actualizarValorTexto();
      pintarHoras();
      mostrarPopover();
    });

    if (botonListo) {
      botonListo.addEventListener("click", (evento) => {
        evento.preventDefault();
        evento.stopPropagation();
        if (this.reloj.minuto == null) this.reloj.minuto = 0;
        this.aplicarHoraReloj();
        this.actualizarDisplayReloj();
        ocultarPopover();
      });
    }

    document.addEventListener("click", (evento) => {
      if (popoverReloj.style.display === "block" && !popoverReloj.contains(evento.target) && !botonDisplay.contains(evento.target)) {
        ocultarPopover();
      }
    });
  },

  /**
   * Escribe en el input de hora (field-fecha-hora) el valor actual del reloj en formato HH:mm.
   * @returns {void}
   */
  aplicarHoraReloj() {
    const inputHora = this.elementos.fechaHora;
    if (!inputHora) return;
    const hora = this.reloj.hora ?? 0;
    const minuto = this.reloj.minuto ?? 0;
    inputHora.value = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
  },

  /**
   * Actualiza el texto del botón "reloj-display" con el valor del input de hora o "--:--" si está vacío.
   * @returns {void}
   */
  actualizarDisplayReloj() {
    const display = Utils.getElement("reloj-display");
    const input = this.elementos.fechaHora;
    if (display && input) display.textContent = input.value || "--:--";
  },

  /**
   * Activa el focus trap en el diálogo usando la utilidad compartida (Escape cierra; Tab mantiene foco dentro).
   * @param {HTMLElement} dialog - Elemento con role="dialog"
   * @returns {void}
   */
  _activarFocusTrap(dialog) {
    this._listenerTeclado = Utils.crearFocusTrap(dialog, () => this.cerrar());
    dialog.addEventListener("keydown", this._listenerTeclado);
  },

  /**
   * Quita el listener del focus trap del diálogo de nueva tarea.
   * @returns {void}
   */
  _desactivarFocusTrap() {
    const dialog = Utils.getElement("modal-nueva-tarea");
    if (dialog && this._listenerTeclado) {
      dialog.removeEventListener("keydown", this._listenerTeclado);
      this._listenerTeclado = null;
    }
  },

  /**
   * Abre el modal: sincroniza el select de proyectos, resetea proyectos seleccionados,
   * oculta bloque de nuevo proyecto, pone fecha de hoy, limpia hora y reloj, oculta popover del reloj y muestra el backdrop.
   * Accesibilidad: guarda el foco actual, marca el backdrop como visible para lectores de pantalla y aplica focus trap.
   * @returns {void}
   */
  abrir() {
    this._limpiarErrores();
    this.sincronizarSelectProyecto();
    this.proyectosSeleccionados = [];
    this.renderizarProyectosSeleccionados();
    const { backdrop, nuevoProyectoContainer, titulo } = this.elementos;
    if (nuevoProyectoContainer) nuevoProyectoContainer.style.display = "none";
    this.fpFecha?.setDate(new Date(), true);
    if (this.elementos.fechaHora) this.elementos.fechaHora.value = "";
    this.reloj.hora = null;
    this.reloj.minuto = null;
    this.reloj.paso = "hora";
    this.actualizarDisplayReloj();
    const popoverReloj = Utils.getElement("reloj-popover");
    if (popoverReloj) {
      popoverReloj.classList.add("hidden");
      popoverReloj.style.display = "none";
    }
    // Accesibilidad: guardar elemento con foco para restaurarlo al cerrar
    this._elementoConFocoAnterior = document.activeElement;
    backdrop?.classList.remove("hidden");
    if (backdrop) backdrop.setAttribute("aria-hidden", "false");
    const dialog = Utils.getElement("modal-nueva-tarea");
    if (dialog) {
      titulo?.focus();
      this._activarFocusTrap(dialog);
    } else {
      titulo?.focus();
    }
  },

  /**
   * Oculta el modal, limpia todos los campos y restaura el foco al elemento que lo tenía antes de abrir.
   * @returns {void}
   */
  cerrar() {
    this.elementos.backdrop?.classList.add("hidden");
    if (this.elementos.backdrop) this.elementos.backdrop.setAttribute("aria-hidden", "true");
    this._desactivarFocusTrap();
    this.limpiarCampos();
    // Restaurar foco al elemento que abrió el modal (p. ej. botón "Nueva tarea")
    if (this._elementoConFocoAnterior && typeof this._elementoConFocoAnterior.focus === "function") {
      this._elementoConFocoAnterior.focus();
    }
    this._elementoConFocoAnterior = null;
  },

  /**
   * Vacía título, fecha, hora, reloj, proyectos seleccionados y nombre de nuevo proyecto; quita bordes de error, mensajes y oculta el bloque de nuevo proyecto.
   * @returns {void}
   */
  limpiarCampos() {
    const { titulo, nombreProyecto, nuevoProyectoContainer, fechaHora } = this.elementos;
    this._limpiarErrores();
    if (titulo) titulo.value = "";
    this.proyectosSeleccionados = [];
    this.renderizarProyectosSeleccionados();
    this.fpFecha?.clear();
    if (fechaHora) fechaHora.value = "";
    this.reloj.hora = null;
    this.reloj.minuto = null;
    this.reloj.paso = "hora";
    this.actualizarDisplayReloj();
    if (nombreProyecto) nombreProyecto.value = "";
    if (nuevoProyectoContainer) nuevoProyectoContainer.style.display = "none";
  },

  /**
   * Valida el formulario de nueva tarea (título y al menos un proyecto).
   * @returns {{ valido: boolean, errores: { titulo?: string, proyectos?: string } }}
   */
  _validarFormulario() {
    const { titulo } = this._leerValoresFormulario();
    const errores = {};
    const tituloLimpio = (this.elementos.titulo?.value ?? "").trim();
    if (!tituloLimpio) {
      errores.titulo = "El título es obligatorio.";
    } else if (tituloLimpio.length > this.MAX_TITULO) {
      errores.titulo = `Máximo ${this.MAX_TITULO} caracteres.`;
    }
    if (this.proyectosSeleccionados.length === 0) {
      errores.proyectos = "Añade al menos un proyecto.";
    }
    return { valido: Object.keys(errores).length === 0, errores };
  },

  /**
   * Muestra los errores en pantalla: borde rojo, aria-invalid y mensaje en el span correspondiente.
   * @param {{ titulo?: string, proyectos?: string }} errores - Mensaje por campo
   * @returns {void}
   */
  _mostrarErrores(errores) {
    const { titulo: elementoTitulo, errorTitulo, errorProyectos } = this.elementos;
    if (errores.titulo) {
      this._marcarCampoInvalido(elementoTitulo, true);
      this._establecerMensajeError(errorTitulo, errores.titulo);
    }
    if (errores.proyectos) {
      this._marcarContenedorProyectosInvalido(true);
      this._establecerMensajeError(errorProyectos, errores.proyectos);
    }
  },

  /**
   * Quita todos los estilos y mensajes de error del formulario.
   * @returns {void}
   */
  _limpiarErrores() {
    const { titulo, nombreProyecto, errorTitulo, errorProyectos, errorNombreProyecto } = this.elementos;
    this._marcarCampoInvalido(titulo, false);
    this._marcarCampoInvalido(nombreProyecto, false);
    this._marcarContenedorProyectosInvalido(false);
    this._establecerMensajeError(errorTitulo, "");
    this._establecerMensajeError(errorProyectos, "");
    this._establecerMensajeError(errorNombreProyecto, "");
  },

  /**
   * Quita el error solo del campo título (al escribir).
   * @returns {void}
   */
  _limpiarErrorTitulo() {
    this._marcarCampoInvalido(this.elementos.titulo, false);
    this._establecerMensajeError(this.elementos.errorTitulo, "");
  },

  /**
   * Quita el error del bloque de proyectos (al añadir un proyecto).
   * @returns {void}
   */
  _limpiarErrorProyectos() {
    this._marcarContenedorProyectosInvalido(false);
    this._establecerMensajeError(this.elementos.errorProyectos, "");
  },

  /**
   * Pinta en #modal-proyectos-seleccionados los chips de proyectos elegidos, cada uno con botón para quitar.
   * @returns {void}
   */
  renderizarProyectosSeleccionados() {
    const contenedor = this.elementos.contenedorProyectosSeleccionados;
    if (!contenedor) return;
    if (this.proyectosSeleccionados.length === 0) {
      contenedor.innerHTML = '<span class="font-mono text-xs text-gray-400 dark:text-gray-500 italic">Añade al menos un proyecto con el botón "Añadir"</span>';
      return;
    }
    Utils.setHTML(
      contenedor,
      this.proyectosSeleccionados
        .map(
          (nombreProyecto) =>
            `<span class="inline-flex items-center gap-1 font-mono text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 rounded px-2.5 py-1">
              ${Utils.escapeHtml(nombreProyecto)}
              <button type="button" class="btn-quitar-proyecto-modal rounded hover:bg-red-500/20 text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-0.5 focus:outline-none focus:ring-2 focus:ring-red-500" data-proyecto="${Utils.escapeHtml(nombreProyecto)}" aria-label="Quitar">✕</button>
            </span>`
        )
        .join("")
    );
  },

  /**
   * Rellena el select de proyecto con State.proyectos más la opción "+ Nuevo proyecto…", manteniendo el valor seleccionado si sigue existiendo.
   * @returns {void}
   */
  sincronizarSelectProyecto() {
    const selectProyecto = this.elementos.proyecto;
    if (!selectProyecto) return;
    const valorActual = selectProyecto.value;
    Utils.setHTML(
      selectProyecto,
      State.proyectos
        .map(
          (nombreProyecto) => `
          <option value="${Utils.escapeHtml(nombreProyecto)}" ${nombreProyecto === valorActual ? "selected" : ""}>
            ${Utils.escapeHtml(nombreProyecto)}
          </option>`
        )
        .join("") + `<option value="__nuevo__">+ Nuevo proyecto…</option>`
    );
  },

  /**
   * Lee los valores actuales del formulario (título, prioridad, fecha completa).
   * @returns {{ titulo: string, prioridad: string, fecha: string }}
   */
  _leerValoresFormulario() {
    const { titulo, prioridad, fechaDia, fechaHora } = this.elementos;
    const tituloValor = titulo?.value?.trim() ?? "";
    const prioridadValor = prioridad?.value ?? "media";
    const dia = fechaDia?.value ?? "";
    const hora = fechaHora?.value ?? "";
    const fechaCompleta = dia ? (hora ? `${dia} ${hora}` : dia) : State.SIN_FECHA;
    return { titulo: tituloValor, prioridad: prioridadValor, fecha: fechaCompleta };
  },

  /**
   * Valida el formulario y, si es válido, guarda la tarea y cierra el modal.
   * Si hay errores, los muestra, pone foco en el primer campo inválido y no cierra.
   * @returns {void}
   */
  guardar() {
    this._limpiarErrores();
    const { valido, errores } = this._validarFormulario();
    if (!valido) {
      this._mostrarErrores(errores);
      // Foco en el primer campo con error para facilitar corrección
      if (errores.titulo) {
        this.elementos.titulo?.focus();
      } else if (errores.proyectos) {
        this.elementos.proyecto?.focus();
      }
      return;
    }
    const { titulo, prioridad, fecha } = this._leerValoresFormulario();
    if (TareasController.agregar(titulo, this.proyectosSeleccionados, prioridad, fecha)) this.cerrar();
  },

  /**
   * Muestra error en el campo nombre de proyecto y pone foco. Usado en crearProyecto.
   * @param {string} mensaje - Texto del mensaje de error
   * @returns {void}
   */
  _mostrarErrorNombreProyecto(mensaje) {
    this._establecerMensajeError(this.elementos.errorNombreProyecto, mensaje);
    this._marcarCampoInvalido(this.elementos.nombreProyecto, true);
    this.elementos.nombreProyecto?.focus();
  },

  /**
   * Valida el nombre del nuevo proyecto (no vacío, no duplicado, longitud máxima) y, si es válido, lo crea,
   * lo añade a la selección y oculta el bloque. Si hay error, muestra mensaje y borde rojo.
   * @returns {void}
   */
  crearProyecto() {
    const { nombreProyecto: inputNombre } = this.elementos;
    const nombre = (inputNombre?.value ?? "").trim();
    this._marcarCampoInvalido(inputNombre, false);
    this._establecerMensajeError(this.elementos.errorNombreProyecto, "");

    if (Utils.estaVacio(nombre)) {
      this._mostrarErrorNombreProyecto("Escribe un nombre para el proyecto.");
      return;
    }
    if (nombre.length > this.MAX_NOMBRE_PROYECTO) {
      this._mostrarErrorNombreProyecto(`Máximo ${this.MAX_NOMBRE_PROYECTO} caracteres.`);
      return;
    }
    if (State.existeProyecto(nombre)) {
      this._mostrarErrorNombreProyecto("Ese proyecto ya existe.");
      return;
    }
    if (ProyectosController.agregar(nombre)) {
      if (!this.proyectosSeleccionados.includes(nombre)) this.proyectosSeleccionados.push(nombre);
      this.renderizarProyectosSeleccionados();
      if (this.elementos.proyecto) this.elementos.proyecto.value = nombre;
      if (this.elementos.nuevoProyectoContainer) this.elementos.nuevoProyectoContainer.style.display = "none";
      if (inputNombre) inputNombre.value = "";
    }
  },

  /**
   * Registra los listeners: abrir/cerrar modal, guardar tarea (clic y Enter en título),
   * añadir proyecto al listado, quitar proyecto de un chip, cambio de proyecto para mostrar/ocultar "nuevo proyecto", crear proyecto (clic y Enter en nombre).
   * @returns {void}
   */
  agregarEventListeners() {
    const cerrar = () => this.cerrar();
    Utils.getElements(".btn-nueva-tarea").forEach((btn) => btn.addEventListener("click", () => this.abrir()));
    Utils.getElement("btn-close-modal")?.addEventListener("click", cerrar);
    Utils.getElement("btn-cancelar-modal")?.addEventListener("click", cerrar);
    this.elementos.backdrop?.addEventListener("click", (evento) => { if (evento.target === this.elementos.backdrop) this.cerrar(); });
    Utils.getElement("btn-guardar-tarea")?.addEventListener("click", () => this.guardar());
    this.elementos.titulo?.addEventListener("keydown", (e) => { if (e.key === "Enter") this.guardar(); });

    // Al escribir en el título, quitar el error de ese campo para mejor UX
    this.elementos.titulo?.addEventListener("input", () => this._limpiarErrorTitulo());

    // Añadir el proyecto seleccionado en el select a la lista de proyectos de la tarea
    Utils.getElement("btn-anadir-proyecto-modal")?.addEventListener("click", () => {
      const valorSeleccionado = this.elementos.proyecto?.value ?? "";
      if (valorSeleccionado === "" || valorSeleccionado === "__nuevo__") {
        if (valorSeleccionado === "__nuevo__") {
          this.elementos.nuevoProyectoContainer.style.display = "flex";
          this.elementos.nombreProyecto?.focus();
        }
        return;
      }
      if (!this.proyectosSeleccionados.includes(valorSeleccionado)) {
        this.proyectosSeleccionados.push(valorSeleccionado);
        this.renderizarProyectosSeleccionados();
        this._limpiarErrorProyectos();
      }
    });

    // Al escribir en el nombre del nuevo proyecto, quitar el error de ese campo
    this.elementos.nombreProyecto?.addEventListener("input", () => {
      this._marcarCampoInvalido(this.elementos.nombreProyecto, false);
      this._establecerMensajeError(this.elementos.errorNombreProyecto, "");
    });

    // Quitar un proyecto de la lista al hacer clic en ✕ del chip (delegación)
    this.elementos.contenedorProyectosSeleccionados?.addEventListener("click", (evento) => {
      const botonQuitar = evento.target.closest(".btn-quitar-proyecto-modal");
      if (!botonQuitar) return;
      const nombreProyecto = botonQuitar.dataset.proyecto;
      if (nombreProyecto) {
        this.proyectosSeleccionados = this.proyectosSeleccionados.filter((nombreProy) => nombreProy !== nombreProyecto);
        this.renderizarProyectosSeleccionados();
      }
    });

    this.elementos.proyecto?.addEventListener("change", (evento) => {
      const mostrarNuevoProyecto = evento.target.value === "__nuevo__";
      const contenedorNuevoProyecto = this.elementos.nuevoProyectoContainer;
      if (contenedorNuevoProyecto) contenedorNuevoProyecto.style.display = mostrarNuevoProyecto ? "flex" : "none";
      if (mostrarNuevoProyecto) this.elementos.nombreProyecto?.focus();
    });
    Utils.getElement("btn-confirmar-proyecto")?.addEventListener("click", () => this.crearProyecto());
    this.elementos.nombreProyecto?.addEventListener("keydown", (e) => { if (e.key === "Enter") this.crearProyecto(); });
  },
};