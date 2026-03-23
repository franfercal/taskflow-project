/**
 * Tema claro / oscuro (clase `.dark` en `<html>`).
 * Por defecto: modo claro. La elección del usuario se guarda en localStorage (solo tema, no datos de tareas).
 */

const Tema = {
  ICONO_CLARO: "☀",
  ICONO_OSCURO: "☾",

  /** Clave en localStorage para recordar la preferencia entre visitas. */
  CLAVE_ALMACENAMIENTO_TEMA: "taskflow_tema_preferido",

  /** Valores permitidos guardados (cadenas explícitas para evitar ambigüedad). */
  VALOR_TEMA_CLARO: "claro",
  VALOR_TEMA_OSCURO: "oscuro",

  /** Referencia al botón de cambiar tema (header). */
  btn: null,

  /**
   * Lee la preferencia guardada; si no hay valor, usa tema claro (no se sigue prefers-color-scheme).
   * @returns {boolean} true = aplicar modo oscuro
   */
  _leerPreferenciaGuardada() {
    try {
      const valorGuardado = localStorage.getItem(this.CLAVE_ALMACENAMIENTO_TEMA);
      if (valorGuardado === this.VALOR_TEMA_OSCURO) return true;
      if (valorGuardado === this.VALOR_TEMA_CLARO) return false;
    } catch (error) {
      // Modo privado o políticas del navegador pueden bloquear localStorage.
      console.warn("TaskFlow: no se pudo leer el tema guardado.", error);
    }
    return false;
  },

  /**
   * Persiste la elección del usuario para la próxima carga.
   * @param {boolean} oscuro - true = oscuro, false = claro
   */
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

  /**
   * Inicializa: tema por defecto claro o el guardado en localStorage; enlaza el botón.
   * @returns {void}
   */
  init() {
    this.btn = Utils.getElement("btn-tema");
    const usarOscuro = this._leerPreferenciaGuardada();
    this.aplicar(usarOscuro);
    if (this.btn) this.btn.addEventListener("click", () => this.toggle());
  },

  /**
   * Aplica modo oscuro o claro: clase .dark en documentElement e icono del botón.
   * @param {boolean} oscuro - true = modo oscuro, false = modo claro
   * @returns {void}
   */
  aplicar(oscuro) {
    document.documentElement.classList.toggle("dark", oscuro);
    if (this.btn) this.btn.textContent = oscuro ? this.ICONO_OSCURO : this.ICONO_CLARO;
  },

  /**
   * Alterna tema y guarda la preferencia en localStorage.
   * @returns {void}
   */
  toggle() {
    const pasarAOscuro = !document.documentElement.classList.contains("dark");
    this.aplicar(pasarAOscuro);
    this._guardarPreferencia(pasarAOscuro);
  },
};
