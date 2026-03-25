const Navegacion = {
  // Sidebar: vistas cambian filtro hamburguesa y click fuera cierran en móvil
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
