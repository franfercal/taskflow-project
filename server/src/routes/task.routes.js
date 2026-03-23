//Rutas HTTP de tareas

const express = require("express");
const controladorTareas = require("../controllers/task.controller");

const enrutador = express.Router();

/** listar todas las tareas. */
enrutador.get("/", controladorTareas.listarTareas);

/** crear tarea */
enrutador.post("/", controladorTareas.crearTarea);

// Borrado de completadas.
enrutador.delete("/completed", controladorTareas.eliminarTodasCompletadas);

/** actualización parcial. */
enrutador.patch("/:id", controladorTareas.actualizarTarea);

/** eliminar tarea. */
enrutador.delete("/:id", controladorTareas.eliminarTarea);

module.exports = enrutador;
