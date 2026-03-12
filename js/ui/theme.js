/**
 * Tema claro/oscuro: aplica la clase .dark en <html> (Tailwind) y guarda la preferencia en localStorage.
 * Si no hay preferencia guardada, usa la del sistema (prefers-color-scheme: dark).
 */

const Tema = {
  /** Clave en localStorage donde se guarda "light" o "dark". */
  CLAVE: "taskflow-tema",
  ICONO_CLARO: "☀",
  ICONO_OSCURO: "☾",
  /** Referencia al botón de cambiar tema (header). */
  btn: null,

  /**
   * Lee preferencia guardada o del sistema, aplica el tema y asocia el clic del botón a toggle.
   * @returns {void}
   */
  init() {
    this.btn = Utils.getElement("btn-tema");
    const temaGuardado = localStorage.getItem(this.CLAVE);
    const esOscuro = temaGuardado ? temaGuardado === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.aplicar(esOscuro);
    if (this.btn) this.btn.addEventListener("click", () => this.toggle());
  },

  /**
   * Aplica modo oscuro o claro: clase .dark en documentElement, icono del botón y guardado en localStorage.
   * @param {boolean} oscuro - true = modo oscuro, false = modo claro
   * @returns {void}
   */
  aplicar(oscuro) {
    document.documentElement.classList.toggle("dark", oscuro);
    if (this.btn) this.btn.textContent = oscuro ? this.ICONO_OSCURO : this.ICONO_CLARO;
    localStorage.setItem(this.CLAVE, oscuro ? "dark" : "light");
  },

  /**
   * Alterna entre claro y oscuro según el estado actual de la clase .dark.
   * @returns {void}
   */
  toggle() {
    this.aplicar(!document.documentElement.classList.contains("dark"));
  },
};
