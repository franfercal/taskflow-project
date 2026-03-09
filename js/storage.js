/* persistencia localStorage. tareas-proyectos-siguienteId */

const Persistencia = {
  KEYS: {
    TAREAS: "taskflow_tareas",
    PROYECTOS: "taskflow_proyectos",
    SIGUIENTE_ID: "taskflow_siguiente_id",
  },

  guardar() {
    try {
      localStorage.setItem(this.KEYS.TAREAS, JSON.stringify(State.tareas));
      localStorage.setItem(this.KEYS.PROYECTOS, JSON.stringify(State.proyectos));
      localStorage.setItem(this.KEYS.SIGUIENTE_ID, String(State.siguienteId));
    } catch (e) {
      console.error("Error al guardar", e);
    }
  },

  cargar() {
    try {
      const tareas = localStorage.getItem(this.KEYS.TAREAS);
      const proyectos = localStorage.getItem(this.KEYS.PROYECTOS);
      const id = localStorage.getItem(this.KEYS.SIGUIENTE_ID);
      if (tareas) State.tareas = JSON.parse(tareas);
      if (proyectos) State.proyectos = JSON.parse(proyectos);
      if (id) State.siguienteId = parseInt(id, 10);
    } catch (e) {
      console.error("Error al cargar", e);
    }
  },
};