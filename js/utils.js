/**  Contiene helpers y utils  */

const Utils = {
  /** obtiene elemento del DOM por ID - con validación */
  getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Elemento con id "${id}" no encontrado`);
    }
    return element;
  },

  /** obtiene elementos del DOM */
  getElements(selector) {
    return document.querySelectorAll(selector);
  },

  /** formatea las fechas */
  formatearFecha(opciones = {}) {
    return new Date().toLocaleDateString("es-ES", opciones);
  },

  /** añade clases */
  addClass(element, className) {
    if (element) element.classList.add(className);
  },

  /** quita clases */
  removeClass(element, className) {
    if (element) element.classList.remove(className);
  },

  /** toggle de clase */
  toggleClass(element, className, condition) {
    if (element) element.classList.toggle(className, condition);
  },

  /** inserta texto de elemento */
  setText(element, text) {
    if (element) element.textContent = text;
  },

  /** inserta el HTML de elemento */
  setHTML(element, html) {
    if (element) element.innerHTML = html;
  },

  /** crea elemento DOM */
  createElement(tag, className = "", textContent = "") {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    return element;
  },

  /** escapa caracteres HTML especiales */
  escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
  },

  /** cadena vacia o con espacios */
  estaVacio(valor) {
    return !valor || !valor.trim();
  },

  /** optimizacion */
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  },
};