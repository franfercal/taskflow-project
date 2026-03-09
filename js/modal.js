/** modal para neuva tarea*/

const Modal = {
  elementos: {},
  fpFecha: null,
  reloj: { hora: null, minuto: null, paso: "hora" },

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

    if (this.elementos.fechaDia) {
      this.fpFecha = flatpickr(this.elementos.fechaDia, {
        dateFormat: "Y-m-d",
        allowInput: true,
      });
    }

    this.iniciarReloj();
    this.agregarEventListeners();
  },

  /*  reloj */
  posicionEnCirculo(centro, radio, anguloGrados) {
    const rad = (anguloGrados - 90) * (Math.PI / 180);
    return {
      left: `${centro + radio * Math.cos(rad) - 16}px`,
      top: `${centro + radio * Math.sin(rad) - 16}px`,
    };
  },

  iniciarReloj() {
    const cara = document.getElementById("reloj-cara");
    const display = document.getElementById("reloj-display");
    const popover = document.getElementById("reloj-popover");
    const valorActual = document.getElementById("reloj-valor-actual");
    const btnListo = document.getElementById("reloj-listo");
    if (!cara || !display || !popover) return;

    const centro = 100;
    const radio = 78;

    const mostrarPopover = () => {
      popover.classList.remove("hidden");
      popover.style.display = "block";
    };
    const ocultarPopover = () => {
      popover.classList.add("hidden");
      popover.style.display = "none";
    };

    const actualizarValorTexto = () => {
      const h = this.reloj.hora != null ? this.reloj.hora : 0;
      const m = this.reloj.minuto != null ? this.reloj.minuto : 0;
      if (valorActual) valorActual.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    };

    const renderHoras = () => {
      cara.innerHTML = "";
      for (let h = 0; h < 24; h++) {
        const pos = this.posicionEnCirculo(centro, radio, (h * 360) / 24);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "reloj-numero" + (this.reloj.hora === h ? " selected" : "");
        btn.textContent = String(h).padStart(2, "0");
        btn.style.left = pos.left;
        btn.style.top = pos.top;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.reloj.hora = h;
          this.reloj.paso = "minuto";
          actualizarValorTexto();
          renderMinutos();
        });
        cara.appendChild(btn);
      }
      const centroEl = document.createElement("div");
      centroEl.className = "reloj-centro";
      cara.appendChild(centroEl);
    };

    const minutos = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const renderMinutos = () => {
      cara.innerHTML = "";
      for (let i = 0; i < 12; i++) {
        const m = minutos[i];
        const pos = this.posicionEnCirculo(centro, radio, (i * 360) / 12);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "reloj-minuto" + (this.reloj.minuto === m ? " selected" : "");
        btn.textContent = String(m).padStart(2, "0");
        btn.style.left = pos.left;
        btn.style.top = pos.top;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.reloj.minuto = m;
          this.aplicarHoraReloj();
          this.actualizarDisplayReloj();
          ocultarPopover();
        });
        cara.appendChild(btn);
      }
      const centroEl = document.createElement("div");
      centroEl.className = "reloj-centro";
      cara.appendChild(centroEl);
    };

    display.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const inputVal = this.elementos.fechaHora?.value || "";
      const match = inputVal.match(/^(\d{1,2}):(\d{2})$/);
      if (match) {
        this.reloj.hora = parseInt(match[1], 10);
        this.reloj.minuto = parseInt(match[2], 10);
      } else {
        const now = new Date();
        this.reloj.hora = now.getHours();
        this.reloj.minuto = minutos[Math.round(now.getMinutes() / 5) % 12];
      }
      this.reloj.paso = "hora";
      actualizarValorTexto();
      renderHoras();
      mostrarPopover();
    });

    if (btnListo) {
      btnListo.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.reloj.minuto == null) this.reloj.minuto = 0;
        this.aplicarHoraReloj();
        this.actualizarDisplayReloj();
        ocultarPopover();
      });
    }

    document.addEventListener("click", (e) => {
      if (popover.style.display === "block" && !popover.contains(e.target) && !display.contains(e.target)) {
        ocultarPopover();
      }
    });
  },

  aplicarHoraReloj() {
    const input = this.elementos.fechaHora;
    if (!input) return;
    const h = this.reloj.hora ?? 0;
    const m = this.reloj.minuto ?? 0;
    input.value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  },

  actualizarDisplayReloj() {
    const display = Utils.getElement("reloj-display");
    const input = this.elementos.fechaHora;
    if (display && input) display.textContent = input.value || "--:--";
  },

  abrir() {
    this.sincronizarSelectProyecto();
    const { backdrop, nuevoProyectoContainer, titulo } = this.elementos;
    if (nuevoProyectoContainer) nuevoProyectoContainer.style.display = "none";
    this.fpFecha?.setDate(new Date(), true);
    if (this.elementos.fechaHora) this.elementos.fechaHora.value = "";
    this.reloj.hora = null;
    this.reloj.minuto = null;
    this.reloj.paso = "hora";
    this.actualizarDisplayReloj();
    const popoverReloj = document.getElementById("reloj-popover");
    if (popoverReloj) {
      popoverReloj.classList.add("hidden");
      popoverReloj.style.display = "none";
    }
    backdrop?.classList.remove("hidden");
    titulo?.focus();
  },

  cerrar() {
    this.elementos.backdrop?.classList.add("hidden");
    this.limpiarCampos();
  },

  limpiarCampos() {
    const { titulo, nombreProyecto, nuevoProyectoContainer, fechaHora } = this.elementos;
    if (titulo) {
      titulo.value = "";
      titulo.classList.remove("border-red-500");
    }
    this.fpFecha?.clear();
    if (fechaHora) fechaHora.value = "";
    this.reloj.hora = null;
    this.reloj.minuto = null;
    this.reloj.paso = "hora";
    this.actualizarDisplayReloj();
    if (nombreProyecto) {
      nombreProyecto.value = "";
      nombreProyecto.classList.remove("border-red-500");
    }
    if (nuevoProyectoContainer) nuevoProyectoContainer.style.display = "none";
  },

  sincronizarSelectProyecto() {
    const selectProyecto = this.elementos.proyecto;
    if (!selectProyecto) return;
    const valorActual = selectProyecto.value;
    Utils.setHTML(
      selectProyecto,
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

  guardar() {
    const { titulo: tituloEl, proyecto: proyectoEl, prioridad, fechaDia, fechaHora, nombreProyecto } = this.elementos;
    const titulo = tituloEl?.value?.trim() ?? "";
    const proyecto = proyectoEl?.value ?? "";
    const prioridadVal = prioridad?.value ?? "media";
    const dia = fechaDia?.value ?? "";
    const hora = fechaHora?.value ?? "";
    const fecha = dia ? (hora ? `${dia} ${hora}` : dia) : "Sin fecha";

    if (!titulo) {
      tituloEl?.classList.add("border-red-500");
      tituloEl?.focus();
      return;
    }
    if (proyecto === "__nuevo__") {
      nombreProyecto?.classList.add("border-red-500");
      nombreProyecto?.focus();
      return;
    }
    tituloEl?.classList.remove("border-red-500");
    nombreProyecto?.classList.remove("border-red-500");
    if (TareasController.agregar(titulo, proyecto, prioridadVal, fecha)) this.cerrar();
  },

  crearProyecto() {
    const nombre = this.elementos.nombreProyecto?.value?.trim() ?? "";
    if (Utils.estaVacio(nombre)) return;
    if (ProyectosController.agregar(nombre)) {
      if (this.elementos.proyecto) this.elementos.proyecto.value = nombre;
      if (this.elementos.nuevoProyectoContainer) this.elementos.nuevoProyectoContainer.style.display = "none";
      if (this.elementos.nombreProyecto) this.elementos.nombreProyecto.value = "";
    }
  },

  agregarEventListeners() {
    const cerrar = () => this.cerrar();
    Utils.getElements(".btn-nueva-tarea").forEach((btn) => btn.addEventListener("click", () => this.abrir()));
    Utils.getElement("btn-close-modal")?.addEventListener("click", cerrar);
    Utils.getElement("btn-cancelar-modal")?.addEventListener("click", cerrar);
    this.elementos.backdrop?.addEventListener("click", (e) => { if (e.target === this.elementos.backdrop) this.cerrar(); });
    Utils.getElement("btn-guardar-tarea")?.addEventListener("click", () => this.guardar());
    this.elementos.titulo?.addEventListener("keydown", (e) => { if (e.key === "Enter") this.guardar(); });
    this.elementos.proyecto?.addEventListener("change", (e) => {
      const mostrar = e.target.value === "__nuevo__";
      const cont = this.elementos.nuevoProyectoContainer;
      if (cont) cont.style.display = mostrar ? "flex" : "none";
      if (mostrar) this.elementos.nombreProyecto?.focus();
    });
    Utils.getElement("btn-confirmar-proyecto")?.addEventListener("click", () => this.crearProyecto());
    this.elementos.nombreProyecto?.addEventListener("keydown", (e) => { if (e.key === "Enter") this.crearProyecto(); });
  },
};