/** vistas sidebar y menu movil - listeners filtros y apertura/cierre panel */

const Navegacion = {
  init() {
    Utils.getElements(".nav-item[data-vista]").forEach((item) => {
      item.addEventListener("click", () => Filtros.cambiarFiltro(item.dataset.vista));
    });
    const btnMenu = Utils.getElement("btn-menu");
    const sidebar = Utils.getElement("sidebar");
    if (!btnMenu || !sidebar) return;
    btnMenu.addEventListener("click", () => Utils.toggleClass(sidebar, "open"));
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !btnMenu.contains(e.target)) {
        Utils.removeClass(sidebar, "open");
      }
    });
  },
};