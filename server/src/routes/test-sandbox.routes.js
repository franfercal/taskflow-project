// Activar con ENABLE_API_TEST_ROUTES=true en .env

const express = require("express");

const enrutador = express.Router();

// Fuerza un 500 a proposito
enrutador.get("/_sandbox/force-500", (req, res, next) => {
  next(new Error("FORCED_INTERNAL_ERROR_FOR_API_TESTS"));
});

module.exports = enrutador;
