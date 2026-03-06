/* Interaccion con las vistas y el menu movil*/

const Navegacion = {
  /* empieza navegación */
  init() {
    this.configurarVistas();
    this.configurarMenuMovil();
  },

  /* configura listeners vistas */
  configurarVistas() {
    Utils.getElements(".nav-item[data-vista]").forEach((item) => {
      item.addEventListener("click", () => {
        Filtros.cambiarFiltro(item.dataset.vista);
      });
    });
  },

  /* configura menu movil */
  configurarMenuMovil() {
    const btnMenu = Utils.getElement("btn-menu");
    const sidebar = Utils.getElement("sidebar");

    if (btnMenu && sidebar) {
      btnMenu.addEventListener("click", () => {
        Utils.toggleClass(sidebar, "open");
      });

      // Cerrar click fuera
      document.addEventListener("click", (e) => {
        if (
          !sidebar.contains(e.target) &&
          !btnMenu.contains(e.target) &&
          sidebar.classList.contains("open")
        ) {
          Utils.removeClass(sidebar, "open");
        }
      });
    }
  },

};