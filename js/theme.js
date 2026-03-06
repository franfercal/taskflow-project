const Tema = {
  CLAVE: "taskflow-tema",
  ICONO_CLARO: "☀",
  ICONO_OSCURO: "☾",

  init() {
    const guardado = localStorage.getItem(this.CLAVE);
    const prefiereDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const esOscuro = guardado ? guardado === "dark" : prefiereDark;

    this.aplicar(esOscuro);

    const btn = document.getElementById("btn-tema");
    if (btn) btn.addEventListener("click", () => this.toggle());
  },

  aplicar(oscuro) {
    document.documentElement.classList.toggle("dark", oscuro);
    const btn = document.getElementById("btn-tema");
    if (btn) btn.textContent = oscuro ? this.ICONO_OSCURO : this.ICONO_CLARO;
    localStorage.setItem(this.CLAVE, oscuro ? "dark" : "light");
  },

  toggle() {
    this.aplicar(!document.documentElement.classList.contains("dark"));
  },
};
