require("./config/env");

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");

const aplicacion = express();
const numeroPuerto = Number(process.env.PORT);

/** Raíz del repo sirve index.html, /js, /styles desde el mismo origen que la API. */
const raizProyecto = path.join(__dirname, "..", "..");
const rutaArchivoOpenapi = path.join(__dirname, "..", "openapi.yaml");

/**
 * Carga la especificación OpenAPI 3 desde YAML y fija el servidor según PORT.
 * Si el fichero falla, la app arranca igual pero sin Swagger UI.
 */
function cargarDocumentoOpenapi() {
  try {
    const textoYaml = fs.readFileSync(rutaArchivoOpenapi, "utf8");
    const documento = YAML.parse(textoYaml);
    /** URL pública del API para Swagger (Vercel expone VERCEL_URL en preview/producción). */
    const urlBaseServidor =
      process.env.VERCEL_URL != null && String(process.env.VERCEL_URL).trim() !== ""
        ? `https://${String(process.env.VERCEL_URL).replace(/^https?:\/\//, "")}`
        : `http://127.0.0.1:${numeroPuerto}`;
    const descripcionServidor =
      process.env.VERCEL_URL != null && String(process.env.VERCEL_URL).trim() !== ""
        ? "Despliegue Vercel (variable VERCEL_URL)"
        : "Instancia local (variable PORT en server/.env)";
    documento.servers = [
      {
        url: urlBaseServidor,
        description: descripcionServidor,
      },
    ];
    return documento;
  } catch (error) {
    console.error("TaskFlow: no se pudo cargar openapi.yaml; Swagger UI deshabilitado.", error.message);
    return null;
  }
}

const documentoOpenapi = cargarDocumentoOpenapi();

aplicacion.use(cors());
aplicacion.use(express.json());

/** Rutas de sandbox (500 forzado, etc.): solo si ENABLE_API_TEST_ROUTES=true */
if (process.env.ENABLE_API_TEST_ROUTES === "true") {
  const enrutadorSandbox = require("./routes/test-sandbox.routes");
  aplicacion.use("/api/v1", enrutadorSandbox);
  console.warn("TaskFlow: rutas de prueba API activas (ENABLE_API_TEST_ROUTES). No uses en producción pública.");
}

const rutasTareas = require("./routes/task.routes");
aplicacion.use("/api/v1/tasks", rutasTareas);

/** Documentación OpenAPI + Swagger UI (antes de estáticos para no ser interceptado). */
if (documentoOpenapi) {
  aplicacion.get("/openapi.yaml", (req, res) => {
    res.type("text/yaml; charset=utf-8").send(fs.readFileSync(rutaArchivoOpenapi, "utf8"));
  });
  aplicacion.get("/openapi.json", (req, res) => {
    res.json(documentoOpenapi);
  });
  aplicacion.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(documentoOpenapi, {
      customSiteTitle: "TaskFlow API — Swagger UI",
      customCss: ".swagger-ui .topbar { display: none }",
    })
  );
}

aplicacion.use(express.static(raizProyecto, { index: ["index.html"] }));

const ERRORES_HTTP_CLIENTE_MENSAJE = {
  NOT_FOUND: {
    codigoEstado: 404,
    cuerpo: {
      error: "NOT_FOUND",
      mensaje: "El recurso solicitado no existe",
    },
  },
};

function manejadorErrores(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const textoMensaje = err instanceof Error ? err.message : String(err);
  const definicionCliente = ERRORES_HTTP_CLIENTE_MENSAJE[textoMensaje];

  if (definicionCliente) {
    res.status(definicionCliente.codigoEstado).json(definicionCliente.cuerpo);
    return;
  }

  console.error(err);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    mensaje: "Error interno del servidor",
  });
}

aplicacion.use(manejadorErrores);

if (require.main === module) {
  aplicacion.listen(numeroPuerto, "0.0.0.0", () => {
    console.log(`Servidor escuchando en http://127.0.0.1:${numeroPuerto} (API tareas: /api/v1/tasks)`);
    if (documentoOpenapi) {
      console.log(`Swagger UI: http://127.0.0.1:${numeroPuerto}/api-docs   OpenAPI JSON: /openapi.json`);
    }
  });
}

module.exports = aplicacion;
