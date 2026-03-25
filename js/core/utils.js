// Cosas reutilizables: dom, fechas, clases, escapar html, debounce, focus trap en modales

const Utils = {
  // getElementById; si no existe avisa en consola
  getElement(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
      console.warn(`Elemento con id "${id}" no encontrado`);
    }
    return elemento;
  },

  // querySelectorAll
  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  // Fecha de hoy
  formatearFecha(opciones = {}) {
    return new Date().toLocaleDateString("es-ES", opciones);
  },

  removeClass(elemento, nombreClase) {
    if (elemento) elemento.classList.remove(nombreClase);
  },

  // toggle con boolean fijo
  toggleClass(elemento, nombreClase, condicion) {
    if (elemento) elemento.classList.toggle(nombreClase, condicion);
  },

  // Siempre textContent para no meter html malo
  setText(elemento, texto) {
    if (elemento) elemento.textContent = texto;
  },

  // innerHTML a propósito con datos de usuario mejor pasar por escapeHtml antes
  setHTML(elemento, html) {
    if (elemento) elemento.innerHTML = html;
  },

  escapeHtml(cadena) {
    return String(cadena).replace(/[&<>"']/g, (caracter) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caracter]
    );
  },

  // null, undefined o string solo espacios = vacío
  estaVacio(valor) {
    return valor == null || String(valor).trim() === "";
  },

  // "s" si no es 1 para "1 tarea" vs "3 tareas"
  plural(cantidad) {
    return cantidad !== 1 ? "s" : "";
  },

  // Espera a que dejen de llamar
  debounce(funcion, retardoMs) {
    let idTemporizador;
    return (...argumentos) => {
      clearTimeout(idTemporizador);
      idTemporizador = setTimeout(() => funcion(...argumentos), retardoMs);
    };
  },

  // Botones, links, inputs focusables dentro del modal
  obtenerEnfocables(contenedor) {
    if (!contenedor) return [];
    const selectorEnfocables =
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
    return Array.from(contenedor.querySelectorAll(selectorEnfocables)).filter(
      (elemento) => elemento.offsetParent !== null && !elemento.hasAttribute("aria-hidden")
    );
  },

  // Tab cicla dentro del diálogo Escape llama al callback
  crearFocusTrap(dialogo, alPulsarEscape) {
    return (evento) => {
      const enfocables = Utils.obtenerEnfocables(dialogo);
      if (enfocables.length === 0) return;
      if (evento.key === "Escape") {
        evento.preventDefault();
        alPulsarEscape();
        return;
      }
      if (evento.key !== "Tab") return;
      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];
      if (evento.shiftKey) {
        if (document.activeElement === primero) {
          evento.preventDefault();
          ultimo.focus();
        }
      } else {
        if (document.activeElement === ultimo) {
          evento.preventDefault();
          primero.focus();
        }
      }
    };
  },
};
