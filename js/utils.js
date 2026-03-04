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
    if (!element) return;
    if (condition !== undefined) {
      element.classList.toggle(className, condition);
    } else {
      element.classList.toggle(className);
    }
  },

  /** obtiene valor  atributo data */
  getData(element, key) {
    return element?.dataset?.[key];
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

  /** Delega eventos a padre */
  delegate(parentSelector, eventType, childSelector, callback) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;

    parent.addEventListener(eventType, (e) => {
      const target = e.target.closest(childSelector);
      if (target) callback.call(target, e);
    });
  },

  /** cadema vacia p con espacios */
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