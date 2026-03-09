/* alterna modo claro/oscuro - aaplica clase .dark en <html> */

const Tema = {
  CLAVE: "taskflow-tema",
  ICONO_CLARO: "☀",
  ICONO_OSCURO: "☾",
  btn: null,

  init() {
    this.btn = Utils.getElement("btn-tema");
    const guardado = localStorage.getItem(this.CLAVE);
    const esOscuro = guardado ? guardado === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.aplicar(esOscuro);
    if (this.btn) this.btn.addEventListener("click", () => this.toggle());
  },

  aplicar(oscuro) {
    document.documentElement.classList.toggle("dark", oscuro);
    if (this.btn) this.btn.textContent = oscuro ? this.ICONO_OSCURO : this.ICONO_CLARO;
    localStorage.setItem(this.CLAVE, oscuro ? "dark" : "light");
  },

  toggle() {
    this.aplicar(!document.documentElement.classList.contains("dark"));
  },
};
