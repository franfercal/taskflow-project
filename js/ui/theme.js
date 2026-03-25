// Tema claro/oscuro con .dark en <html> y preferencia en localStorage (solo eso, no las tareas).

const Tema = {
  ICONO_CLARO: "☀",
  ICONO_OSCURO: "☾",

  CLAVE_ALMACENAMIENTO_TEMA: "taskflow_tema_preferido",

  VALOR_TEMA_CLARO: "claro",
  VALOR_TEMA_OSCURO: "oscuro",

  btn: null,

  _leerPreferenciaGuardada() {
    try {
      const valorGuardado = localStorage.getItem(this.CLAVE_ALMACENAMIENTO_TEMA);
      if (valorGuardado === this.VALOR_TEMA_OSCURO) return true;
      if (valorGuardado === this.VALOR_TEMA_CLARO) return false;
    } catch (error) {
      // Ventana privada o bloqueo de storage: nos quedamos en claro.
      console.warn("TaskFlow: no se pudo leer el tema guardado.", error);
    }
    return false;
  },

  _guardarPreferencia(oscuro) {
    try {
      localStorage.setItem(
        this.CLAVE_ALMACENAMIENTO_TEMA,
        oscuro ? this.VALOR_TEMA_OSCURO : this.VALOR_TEMA_CLARO
      );
    } catch (error) {
      console.warn("TaskFlow: no se pudo guardar el tema.", error);
    }
  },

  init() {
    this.btn = Utils.getElement("btn-tema");
    const usarOscuro = this._leerPreferenciaGuardada();
    this.aplicar(usarOscuro);
    if (this.btn) this.btn.addEventListener("click", () => this.toggle());
  },

  aplicar(oscuro) {
    document.documentElement.classList.toggle("dark", oscuro);
    if (this.btn) this.btn.textContent = oscuro ? this.ICONO_OSCURO : this.ICONO_CLARO;
  },

  toggle() {
    const pasarAOscuro = !document.documentElement.classList.contains("dark");
    this.aplicar(pasarAOscuro);
    this._guardarPreferencia(pasarAOscuro);
  },
};
