const Navegacion = {
  /**
   * Configura los listeners del sidebar: clic en vistas (nav-item) cambia filtro y cierra sidebar;
   * botón hamburguesa abre/cierra el panel; clic fuera cierra el sidebar en móvil.
   * @returns {void}
   */
  init() {
    const barraLateral = Utils.getElement("sidebar");
    const botonMenu = Utils.getElement("btn-menu");

    Utils.getElements(".nav-item[data-vista]").forEach((elementoVista) => {
      elementoVista.addEventListener("click", () => {
        Filtros.cambiarFiltro(elementoVista.dataset.vista);
        if (barraLateral) Utils.removeClass(barraLateral, "open");
      });
    });

    if (!botonMenu || !barraLateral) return;
    botonMenu.addEventListener("click", () => Utils.toggleClass(barraLateral, "open"));
    document.addEventListener("click", (evento) => {
      if (barraLateral.classList.contains("open") && !barraLateral.contains(evento.target) && !botonMenu.contains(evento.target)) {
        Utils.removeClass(barraLateral, "open");
      }
    });
  },
};