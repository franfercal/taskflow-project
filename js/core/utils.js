/**
 * Utilidades compartidas: acceso al DOM, formato de fecha, clases CSS, escape HTML y debounce.
 */

const Utils = {
  /**
   * Obtiene un elemento por id. Si no existe, escribe un aviso en consola.
   * @param {string} id - id del elemento
   * @returns {HTMLElement | null}
   */
  getElement(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
      console.warn(`Elemento con id "${id}" no encontrado`);
    }
    return elemento;
  },

  /**
   * Devuelve todos los elementos que coinciden con el selector CSS.
   * @param {string} selector - selector CSS (ej: ".filter-chip")
   * @returns {NodeListOf<Element>}
   */
  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Fecha actual formateada en español según las opciones de toLocaleDateString.
   * @param {Intl.DateTimeFormatOptions} opciones - ej: { weekday: "short", day: "numeric", month: "short" }
   * @returns {string}
   */
  formatearFecha(opciones = {}) {
    return new Date().toLocaleDateString("es-ES", opciones);
  },

  /**
   * Quita una clase CSS del elemento si existe.
   * @param {HTMLElement | null} elemento - Nodo del DOM
   * @param {string} nombreClase - Nombre de la clase a quitar
   */
  removeClass(elemento, nombreClase) {
    if (elemento) elemento.classList.remove(nombreClase);
  },

  /**
   * Añade la clase si condicion es true, la quita si es false.
   * @param {HTMLElement | null} elemento - Nodo del DOM
   * @param {string} nombreClase - Nombre de la clase
   * @param {boolean} condicion - true = clase presente, false = clase ausente
   */
  toggleClass(elemento, nombreClase, condicion) {
    if (elemento) elemento.classList.toggle(nombreClase, condicion);
  },

  /**
   * Asigna el texto del nodo (evita inyección de HTML).
   * @param {HTMLElement | null} elemento - Nodo del DOM
   * @param {string} texto - Texto a mostrar
   */
  setText(elemento, texto) {
    if (elemento) elemento.textContent = texto;
  },

  /**
   * Sustituye el HTML interno del elemento (usar con cuidado; preferir escapeHtml para datos de usuario).
   * @param {HTMLElement | null} elemento - Nodo del DOM
   * @param {string} html - HTML a insertar
   */
  setHTML(elemento, html) {
    if (elemento) elemento.innerHTML = html;
  },

  /**
   * Escapa caracteres peligrosos para mostrar texto seguro en HTML.
   * @param {string} cadena - texto a escapar
   * @returns {string}
   */
  escapeHtml(cadena) {
    return String(cadena).replace(/[&<>"']/g, (caracter) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caracter]
    );
  },

  /**
   * Comprueba si un valor es vacío (null, undefined o solo espacios).
   * Convierte a string para evitar errores si se pasa un número u otro tipo.
   * @param {*} valor
   * @returns {boolean}
   */
  estaVacio(valor) {
    return valor == null || String(valor).trim() === "";
  },

  /**
   * Devuelve "s" para plural cuando cantidad !== 1, "" en caso contrario.
   * Útil para mensajes: "1 tarea" vs "N tareas".
   * @param {number} cantidad
   * @returns {string}
   */
  plural(cantidad) {
    return cantidad !== 1 ? "s" : "";
  },

  /**
   * Devuelve una función que ejecuta la dada solo tras retardoMs sin nuevas llamadas (debounce).
   * Útil para búsqueda mientras se escribe.
   * @param {Function} funcion - función a ejecutar
   * @param {number} retardoMs - milisegundos de espera
   * @returns {Function}
   */
  debounce(funcion, retardoMs) {
    let idTemporizador;
    return (...argumentos) => {
      clearTimeout(idTemporizador);
      idTemporizador = setTimeout(() => funcion(...argumentos), retardoMs);
    };
  },

  /**
   * Devuelve los elementos enfocables dentro de un contenedor (botones, inputs, selects, enlaces).
   * Usado por los modales para el focus trap.
   * @param {HTMLElement | null} contenedor - Contenedor donde buscar (p. ej. el diálogo del modal)
   * @returns {HTMLElement[]}
   */
  obtenerEnfocables(contenedor) {
    if (!contenedor) return [];
    const selectorEnfocables =
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
    return Array.from(contenedor.querySelectorAll(selectorEnfocables)).filter(
      (elemento) => elemento.offsetParent !== null && !elemento.hasAttribute("aria-hidden")
    );
  },

  /**
   * Crea un listener de teclado que implementa focus trap (Tab/Shift+Tab) y Escape.
   * Al pulsar Escape se llama a onEscape(). Devuelve la función para poder registrarla y eliminarla.
   * @param {HTMLElement} dialogo - Contenedor del diálogo (donde están los enfocables)
   * @param {Function} alPulsarEscape - Función a ejecutar al pulsar Escape (p. ej. cerrar modal)
   * @returns {Function} Handler para keydown (pasar a addEventListener/removeEventListener)
   */
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