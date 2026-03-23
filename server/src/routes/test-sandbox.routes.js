/**
 * Rutas solo para pruebas manuales (HTTPie, Postman) y demos de errores HTTP.
 * Se montan únicamente si `ENABLE_API_TEST_ROUTES=true` en el entorno.
 * No habilitar en producción frente a Internet público.
 */

const express = require("express");

const enrutador = express.Router();

/**
 * Provoca un error no contemplado que llega al middleware global → respuesta 500 JSON.
 * Útil para validar clientes, logs y Swagger frente a INTERNAL_SERVER_ERROR.
 */
enrutador.get("/_sandbox/force-500", (req, res, next) => {
  next(new Error("FORCED_INTERNAL_ERROR_FOR_API_TESTS"));
});

module.exports = enrutador;
