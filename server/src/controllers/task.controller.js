const servicioTareas = require("../services/task.service");

// GET /api/v1/tasks — Lista todas las tareas
function listarTareas(req, res) {
  const lista = servicioTareas.obtenerTodas();
  res.status(200).json(lista);
}

// POST /api/v1/tasks — Crea una tarea 
function crearTarea(req, res) {
  const cuerpo = req.body;

  if (cuerpo === undefined || cuerpo === null) {
    res.status(400).json({ error: "El cuerpo de la petición es obligatorio" });
    return;
  }

  if (typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    res.status(400).json({ error: "El cuerpo debe ser un objeto JSON" });
    return;
  }

  if (typeof cuerpo.titulo !== "string") {
    res.status(400).json({ error: "El campo titulo debe ser una cadena de texto" });
    return;
  }

  if (cuerpo.titulo.trim() === "") {
    res.status(400).json({ error: "El campo titulo no puede estar vacío" });
    return;
  }

  if (cuerpo.prioridad !== undefined && cuerpo.prioridad !== null) {
    if (typeof cuerpo.prioridad !== "string") {
      res.status(400).json({ error: "El campo prioridad debe ser una cadena (alta, media o baja)" });
      return;
    }
    if (!["alta", "media", "baja"].includes(cuerpo.prioridad)) {
      res.status(400).json({ error: "El campo prioridad debe ser alta, media o baja" });
      return;
    }
  }

  if (cuerpo.proyectos !== undefined && cuerpo.proyectos !== null) {
    if (!Array.isArray(cuerpo.proyectos)) {
      res.status(400).json({ error: "El campo proyectos debe ser un array de cadenas" });
      return;
    }
    for (let indice = 0; indice < cuerpo.proyectos.length; indice += 1) {
      const elemento = cuerpo.proyectos[indice];
      if (typeof elemento !== "string") {
        res.status(400).json({ error: "Cada elemento de proyectos debe ser una cadena de texto" });
        return;
      }
    }
  }

  if (cuerpo.fecha !== undefined && cuerpo.fecha !== null && cuerpo.fecha !== "") {
    if (typeof cuerpo.fecha !== "string") {
      res.status(400).json({ error: "El campo fecha debe ser una cadena de texto" });
      return;
    }
  }

  if (cuerpo.hecha !== undefined && cuerpo.hecha !== null && typeof cuerpo.hecha !== "boolean") {
    res.status(400).json({ error: "El campo hecha debe ser un valor booleano (true o false)" });
    return;
  }

  const tareaCreada = servicioTareas.crearTarea(cuerpo);
  res.status(201).json(tareaCreada);
}

// DELETE /api/v1/tasks/:id 
function eliminarTarea(req, res) {
  const idCrudo = req.params.id;

  if (idCrudo === undefined || idCrudo === null || String(idCrudo).trim() === "") {
    res.status(400).json({ error: "El identificador de la tarea es obligatorio" });
    return;
  }

  const idNumerico = Number(idCrudo);
  if (Number.isNaN(idNumerico)) {
    res.status(400).json({ error: "El identificador debe ser un número válido" });
    return;
  }

  try {
    servicioTareas.eliminarTarea(idNumerico);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      res.status(404).json({ error: "NOT_FOUND" });
      return;
    }
    throw error;
  }

  res.status(204).send();
}

// Claves permitidas
const CLAVES_PATCH_PERMITIDAS = new Set(["titulo", "prioridad", "proyectos", "fecha", "hecha"]);

// PATCH /api/v1/tasks/:id — Actualizacion
function actualizarTarea(req, res) {
  const idCrudo = req.params.id;
  const idNumerico = Number(idCrudo);
  if (idCrudo === undefined || idCrudo === null || String(idCrudo).trim() === "" || Number.isNaN(idNumerico)) {
    res.status(400).json({ error: "El identificador debe ser un número válido" });
    return;
  }

  const cuerpo = req.body;
  if (cuerpo === undefined || cuerpo === null) {
    res.status(400).json({ error: "El cuerpo de la petición es obligatorio" });
    return;
  }
  if (typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    res.status(400).json({ error: "El cuerpo debe ser un objeto JSON" });
    return;
  }

  const clavesRecibidas = Object.keys(cuerpo);
  for (let indice = 0; indice < clavesRecibidas.length; indice += 1) {
    if (!CLAVES_PATCH_PERMITIDAS.has(clavesRecibidas[indice])) {
      res.status(400).json({ error: `Campo no permitido: ${clavesRecibidas[indice]}` });
      return;
    }
  }

  if (clavesRecibidas.length === 0) {
    res.status(400).json({ error: "Envía al menos un campo a actualizar" });
    return;
  }

  if (cuerpo.titulo !== undefined) {
    if (typeof cuerpo.titulo !== "string") {
      res.status(400).json({ error: "El campo titulo debe ser una cadena de texto" });
      return;
    }
    if (cuerpo.titulo.trim() === "") {
      res.status(400).json({ error: "El campo titulo no puede estar vacío" });
      return;
    }
  }

  if (cuerpo.prioridad !== undefined && cuerpo.prioridad !== null) {
    if (typeof cuerpo.prioridad !== "string" || !["alta", "media", "baja"].includes(cuerpo.prioridad)) {
      res.status(400).json({ error: "El campo prioridad debe ser alta, media o baja" });
      return;
    }
  }

  if (cuerpo.proyectos !== undefined && cuerpo.proyectos !== null) {
    if (!Array.isArray(cuerpo.proyectos)) {
      res.status(400).json({ error: "El campo proyectos debe ser un array de cadenas" });
      return;
    }
    for (let indice = 0; indice < cuerpo.proyectos.length; indice += 1) {
      if (typeof cuerpo.proyectos[indice] !== "string") {
        res.status(400).json({ error: "Cada elemento de proyectos debe ser una cadena de texto" });
        return;
      }
    }
  }

  if (cuerpo.fecha !== undefined && cuerpo.fecha !== null && cuerpo.fecha !== "") {
    if (typeof cuerpo.fecha !== "string") {
      res.status(400).json({ error: "El campo fecha debe ser una cadena de texto" });
      return;
    }
  }

  if (cuerpo.hecha !== undefined && cuerpo.hecha !== null && typeof cuerpo.hecha !== "boolean") {
    res.status(400).json({ error: "El campo hecha debe ser un valor booleano (true o false)" });
    return;
  }

  try {
    const actualizada = servicioTareas.actualizarTarea(idNumerico, cuerpo);
    res.status(200).json(actualizada);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      res.status(404).json({ error: "NOT_FOUND" });
      return;
    }
    throw error;
  }
}

//DELETE /api/v1/tasks/completed — Borra todas las tareas completadas
function eliminarTodasCompletadas(req, res) {
  const cantidad = servicioTareas.eliminarCompletadas();
  res.status(200).json({ eliminadas: cantidad });
}

module.exports = {
  listarTareas,
  crearTarea,
  eliminarTarea,
  actualizarTarea,
  eliminarTodasCompletadas,
};
