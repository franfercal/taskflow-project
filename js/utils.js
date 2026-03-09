/** helpers DOM-formato fecha-clases-debounce */

const Utils = {
  getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Elemento con id "${id}" no encontrado`);
    }
    return element;
  },

  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  formatearFecha(opciones = {}) {
    return new Date().toLocaleDateString("es-ES", opciones);
  },

  removeClass(element, className) {
    if (element) element.classList.remove(className);
  },

  toggleClass(element, className, condition) {
    if (element) element.classList.toggle(className, condition);
  },

  setText(element, text) {
    if (element) element.textContent = text;
  },

  setHTML(element, html) {
    if (element) element.innerHTML = html;
  },

  escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
  },

  estaVacio(valor) {
    return !valor || !valor.trim();
  },

  /* ejecuta la funcion tras delay ms desde la ultima llamada */
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },
};