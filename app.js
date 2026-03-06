/* Inicializa y coordina los módulos */

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

const App = {
  /* Inicializa aplicacion */
  init() {
    console.log("Iniciando TaskFlow");

    try {
      // 1. datos
      Persistencia.cargar();

      // 2. header
      this.configurarFecha();
      Tema.init();

      // 3. componentes
      Modal.init();
      Navegacion.init();
      Render.init();
      Filtros.init();

      // 4. render UI 
      Render.renderizarFiltros();
      Render.renderizarProyectosLateral();
      Render.renderizarTareas();
      Estadisticas.actualizar();

      console.log("TaskFlow iniciado");
      console.log(`Tareas: ${State.tareas.length} | Proyectos: ${State.proyectos.length}`);
    } catch (error) {
      console.error("Error al inicializar", error);
    }
  },

  /* fecha header */
  configurarFecha() {
    const fechaElement = Utils.getElement("fecha-actual");

    if (fechaElement) {
      const fecha = Utils.formatearFecha({
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      Utils.setText(fechaElement, fecha);
      console.log("Fecha ok");
    } else {
      console.warn("Error en elemento fecha-actual");
    }
  },

  /* destruye app */
  destroy() {
    Persistencia.limpiar();
    State.reset();
    console.log("✓ TaskFlow destruido");
  },
};

// iniciar app cuando el DOM este cargado
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});