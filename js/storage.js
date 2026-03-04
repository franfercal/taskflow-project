/* LocalStorage para persistencia */

const Persistencia = {
  // Claves de almacenamiento
  KEYS: {
    TAREAS: "taskflow_tareas",
    PROYECTOS: "taskflow_proyectos",
    SIGUIENTE_ID: "taskflow_siguiente_id",
  },

  /* guarda estado actual  */
  guardar() {
    try {
      localStorage.setItem(this.KEYS.TAREAS, JSON.stringify(State.tareas));
      localStorage.setItem(
        this.KEYS.PROYECTOS,
        JSON.stringify(State.proyectos)
      );
      localStorage.setItem(
        this.KEYS.SIGUIENTE_ID,
        State.siguienteId.toString()
      );
      console.log("Datos guardadose");
    } catch (error) {
      console.error("Error al guardar", error);
    }
  },

  /* carga estados guardados */
  cargar() {
    try {
      const tareas = localStorage.getItem(this.KEYS.TAREAS);
      const proyectos = localStorage.getItem(this.KEYS.PROYECTOS);
      const siguienteId = localStorage.getItem(this.KEYS.SIGUIENTE_ID);

      if (tareas) State.tareas = JSON.parse(tareas);
      if (proyectos) State.proyectos = JSON.parse(proyectos);
      if (siguienteId) State.siguienteId = parseInt(siguienteId, 10);

      console.log("Datos cargados desde localStorage");
    } catch (error) {
      console.error("Error al cargar", error);
    }
  },

  /* limpia todo  */
  limpiar() {
    try {
      localStorage.removeItem(this.KEYS.TAREAS);
      localStorage.removeItem(this.KEYS.PROYECTOS);
      localStorage.removeItem(this.KEYS.SIGUIENTE_ID);
      console.log("Memoria limpia");
    } catch (error) {
      console.error("Error al limpiar la memoria", error);
    }
  },

  /* guarda en cada cambio */
  autoguardar() {
    this.guardar();
  },
};