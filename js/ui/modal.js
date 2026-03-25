// Modal “nueva tarea”: flatpickr, reloj circular, proyectos varios, validación y focus trap.

const Modal = {
  // Igual que maxlength del input en el html
  MAX_TITULO: 80,
  MAX_NOMBRE_PROYECTO: 30,

  elementos: {},
  fpFecha: null,
  // Hora/minuto del picker circular y si estás eligiendo hora o minutos.
  reloj: { hora: null, minuto: null, paso: "hora" },
  proyectosSeleccionados: [],
  _elementoConFocoAnterior: null,
  _listenerTeclado: null,

  // Muestra o oculta el span de error
  _establecerMensajeError(span, mensaje) {
    if (!span) return;
    span.textContent = mensaje || "";
    span.classList.toggle("hidden", !mensaje);
  },

  _marcarCampoInvalido(input, invalido) {
    if (!input) return;
    input.classList.toggle("border-red-500", invalido);
    input.setAttribute("aria-invalid", invalido ? "true" : "false");
  },

  // Ring rojo alrededor de los chips de proyecto si falta elegir alguno
  _marcarContenedorProyectosInvalido(invalido) {
    const cont = this.elementos.contenedorProyectosSeleccionados;
    if (!cont) return;
    cont.classList.toggle("ring-2", invalido);
    cont.classList.toggle("ring-red-500", invalido);
    cont.classList.toggle("rounded", invalido);
  },

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

  // Posición de un botón en el círculo del reloj
  posicionEnCirculo(centro, radio, anguloGrados) {
    const radianes = (anguloGrados - 90) * (Math.PI / 180);
    return {
      left: `${centro + radio * Math.cos(radianes) - 16}px`,
      top: `${centro + radio * Math.sin(radianes) - 16}px`,
    };
  },

  // Dibuja botones en círculo (24h o minutos de 5 en 5).
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

  // Popover con horas → minutos; click fuera lo cierra.
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

  aplicarHoraReloj() {
    const inputHora = this.elementos.fechaHora;
    if (!inputHora) return;
    const hora = this.reloj.hora ?? 0;
    const minuto = this.reloj.minuto ?? 0;
    inputHora.value = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
  },

  // El botón redondo muestra la hora o --:--.
  actualizarDisplayReloj() {
    const display = Utils.getElement("reloj-display");
    const input = this.elementos.fechaHora;
    if (display && input) display.textContent = input.value || "--:--";
  },

  _activarFocusTrap(dialog) {
    this._listenerTeclado = Utils.crearFocusTrap(dialog, () => this.cerrar());
    dialog.addEventListener("keydown", this._listenerTeclado);
  },

  _desactivarFocusTrap() {
    const dialog = Utils.getElement("modal-nueva-tarea");
    if (dialog && this._listenerTeclado) {
      dialog.removeEventListener("keydown", this._listenerTeclado);
      this._listenerTeclado = null;
    }
  },

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
    // Guardamos foco para devolverlo al cerrar (accesibilidad).
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

  cerrar() {
    this.elementos.backdrop?.classList.add("hidden");
    if (this.elementos.backdrop) this.elementos.backdrop.setAttribute("aria-hidden", "true");
    this._desactivarFocusTrap();
    this.limpiarCampos();
    if (this._elementoConFocoAnterior && typeof this._elementoConFocoAnterior.focus === "function") {
      this._elementoConFocoAnterior.focus();
    }
    this._elementoConFocoAnterior = null;
  },

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

  _validarFormulario() {
    // Mismo trim que _leerValoresFormulario al guardar.
    const { titulo } = this._leerValoresFormulario();
    const errores = {};
    if (!titulo) {
      errores.titulo = "El título es obligatorio.";
    } else if (titulo.length > this.MAX_TITULO) {
      errores.titulo = `Máximo ${this.MAX_TITULO} caracteres.`;
    }
    if (this.proyectosSeleccionados.length === 0) {
      errores.proyectos = "Añade al menos un proyecto.";
    }
    return { valido: Object.keys(errores).length === 0, errores };
  },

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

  _limpiarErrores() {
    const { titulo, nombreProyecto, errorTitulo, errorProyectos, errorNombreProyecto } = this.elementos;
    this._marcarCampoInvalido(titulo, false);
    this._marcarCampoInvalido(nombreProyecto, false);
    this._marcarContenedorProyectosInvalido(false);
    this._establecerMensajeError(errorTitulo, "");
    this._establecerMensajeError(errorProyectos, "");
    this._establecerMensajeError(errorNombreProyecto, "");
  },

  _limpiarErrorTitulo() {
    this._marcarCampoInvalido(this.elementos.titulo, false);
    this._establecerMensajeError(this.elementos.errorTitulo, "");
  },

  _limpiarErrorProyectos() {
    this._marcarContenedorProyectosInvalido(false);
    this._establecerMensajeError(this.elementos.errorProyectos, "");
  },

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

  _leerValoresFormulario() {
    const { titulo, prioridad, fechaDia, fechaHora } = this.elementos;
    const tituloValor = titulo?.value?.trim() ?? "";
    const prioridadValor = prioridad?.value ?? "media";
    const dia = fechaDia?.value ?? "";
    const hora = fechaHora?.value ?? "";
    const fechaCompleta = dia ? (hora ? `${dia} ${hora}` : dia) : State.SIN_FECHA;
    return { titulo: tituloValor, prioridad: prioridadValor, fecha: fechaCompleta };
  },

  async guardar() {
    this._limpiarErrores();
    const { valido, errores } = this._validarFormulario();
    if (!valido) {
      this._mostrarErrores(errores);
      if (errores.titulo) {
        this.elementos.titulo?.focus();
      } else if (errores.proyectos) {
        this.elementos.proyecto?.focus();
      }
      return;
    }
    const { titulo, prioridad, fecha } = this._leerValoresFormulario();
    if (await TareasController.agregar(titulo, this.proyectosSeleccionados, prioridad, fecha)) this.cerrar();
  },

  _mostrarErrorNombreProyecto(mensaje) {
    this._establecerMensajeError(this.elementos.errorNombreProyecto, mensaje);
    this._marcarCampoInvalido(this.elementos.nombreProyecto, true);
    this.elementos.nombreProyecto?.focus();
  },

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

  agregarEventListeners() {
    const cerrar = () => this.cerrar();
    Utils.getElements(".btn-nueva-tarea").forEach((btn) => btn.addEventListener("click", () => this.abrir()));
    Utils.getElement("btn-close-modal")?.addEventListener("click", cerrar);
    Utils.getElement("btn-cancelar-modal")?.addEventListener("click", cerrar);
    this.elementos.backdrop?.addEventListener("click", (evento) => { if (evento.target === this.elementos.backdrop) this.cerrar(); });
    Utils.getElement("btn-guardar-tarea")?.addEventListener("click", () => this.guardar());
    this.elementos.titulo?.addEventListener("keydown", (e) => { if (e.key === "Enter") this.guardar(); });

    this.elementos.titulo?.addEventListener("input", () => this._limpiarErrorTitulo());

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

    this.elementos.nombreProyecto?.addEventListener("input", () => {
      this._marcarCampoInvalido(this.elementos.nombreProyecto, false);
      this._establecerMensajeError(this.elementos.errorNombreProyecto, "");
    });

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
