// Router montado en /api/v1/tasks

const express = require("express");
const controladorTareas = require("../controllers/task.controller");

const enrutador = express.Router();

// GET …/tasks
enrutador.get("/", controladorTareas.listarTareas);

// POST …/tasks
enrutador.post("/", controladorTareas.crearTarea);

// DELETE …/tasks/completed tiene que ir antes que id, para no confundir con completed
enrutador.delete("/completed", controladorTareas.eliminarTodasCompletadas);

// PATCH …/tasks/:id
enrutador.patch("/:id", controladorTareas.actualizarTarea);

// DELETE …/tasks/:id
enrutador.delete("/:id", controladorTareas.eliminarTarea);

module.exports = enrutador;
