let tasks = [];

let siguienteId = 1;

const SIN_FECHA = "Sin fecha";

const PRIORIDADES_VALIDAS = new Set(["alta", "media", "baja"]);

function obtenerTodas() {
  return tasks.map((tarea) => ({
    ...tarea,
    proyectos: [...tarea.proyectos],
  }));
}

function _normalizarProyectos(valor) {
  if (!Array.isArray(valor)) return [];
  return valor
    .map((nombre) => (typeof nombre === "string" ? nombre.trim() : ""))
    .filter(Boolean);
}

function crearTarea(data) {
  const datos = data !== null && typeof data === "object" && !Array.isArray(data) ? data : {};

  const tituloCrudo = typeof datos.titulo === "string" ? datos.titulo.trim() : "";
  const titulo = tituloCrudo || "Sin título";

  const prioridad = PRIORIDADES_VALIDAS.has(datos.prioridad) ? datos.prioridad : "media";

  let fecha = SIN_FECHA;
  if (typeof datos.fecha === "string" && datos.fecha.trim() !== "") {
    fecha = datos.fecha.trim();
  }

  const nuevaTarea = {
    id: siguienteId++,
    titulo,
    proyectos: _normalizarProyectos(datos.proyectos),
    prioridad,
    fecha,
    hecha: Boolean(datos.hecha),
  };

  tasks.unshift(nuevaTarea);
  return {
    ...nuevaTarea,
    proyectos: [...nuevaTarea.proyectos],
  };
}

function eliminarTarea(id) {
  const idNumerico = Number(id);
  if (Number.isNaN(idNumerico)) {
    throw new Error('NOT_FOUND');
  }

  const indice = tasks.findIndex((tarea) => tarea.id === idNumerico);
  if (indice === -1) {
    throw new Error('NOT_FOUND');
  }

  tasks.splice(indice, 1);
}

function actualizarTarea(id, parches) {
  const idNumerico = Number(id);
  if (Number.isNaN(idNumerico)) {
    throw new Error('NOT_FOUND');
  }
  const tarea = tasks.find((t) => t.id === idNumerico);
  if (!tarea) {
    throw new Error('NOT_FOUND');
  }

  if (parches.titulo !== undefined) {
    const texto = typeof parches.titulo === "string" ? parches.titulo.trim() : "";
    if (texto !== "") tarea.titulo = texto;
  }
  if (parches.prioridad !== undefined && PRIORIDADES_VALIDAS.has(parches.prioridad)) {
    tarea.prioridad = parches.prioridad;
  }
  if (parches.proyectos !== undefined) {
    tarea.proyectos = _normalizarProyectos(parches.proyectos);
  }
  if (parches.fecha !== undefined) {
    if (typeof parches.fecha === "string" && parches.fecha.trim() !== "") {
      tarea.fecha = parches.fecha.trim();
    } else {
      tarea.fecha = SIN_FECHA;
    }
  }
  if (parches.hecha !== undefined) {
    tarea.hecha = Boolean(parches.hecha);
  }

  return {
    ...tarea,
    proyectos: [...tarea.proyectos],
  };
}

function eliminarCompletadas() {
  const antes = tasks.length;
  tasks = tasks.filter((tarea) => !tarea.hecha);
  return antes - tasks.length;
}

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea,
  actualizarTarea,
  eliminarCompletadas,
};
