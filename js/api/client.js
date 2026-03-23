/**
 * Capa de red del cliente: peticiones HTTP asíncronas con la API nativa fetch
 * contra el servidor Node/Express (recurso /api/v1/tasks).
 *
 * No se usa axios para no añadir dependencias al front estático; el patrón con fetch
 * es equivalente (await fetch + JSON).
 */

/**
 * URL base por defecto cuando la app no se abre vía HTTP desde el mismo origen
 * (p. ej. file://). Debe coincidir con el puerto del servidor (PORT en server/.env).
 * @type {string}
 */
const URL_BASE_TAREAS_DESARROLLO = "http://localhost:3000/api/v1/tasks";

/**
 * Resuelve la URL base del recurso tareas (sin barra final).
 * Prioridad: meta tag en index.html → mismo origen si hay protocolo http(s) → fallback localhost.
 *
 * Opcional en index.html: <meta name="taskflow-api-tasks-base" content="http://localhost:3000/api/v1/tasks" />
 *
 * @returns {string}
 */
function resolverUrlBaseApiTareas() {
  const meta = document.querySelector('meta[name="taskflow-api-tasks-base"]');
  const contenidoMeta = meta && meta.getAttribute("content");
  if (contenidoMeta && contenidoMeta.trim()) {
    return contenidoMeta.trim().replace(/\/$/, "");
  }
  const { protocol, hostname } = window.location;
  if (protocol === "file:" || hostname === "") {
    return URL_BASE_TAREAS_DESARROLLO;
  }
  return `${window.location.origin}/api/v1/tasks`;
}

/**
 * Ejecuta una petición HTTP con fetch, espera el cuerpo como texto y parsea JSON si aplica.
 * Lanza Error con propiedad .status si la respuesta no es OK.
 *
 * @param {string} urlCompleta - URL absoluta del endpoint
 * @param {RequestInit} opcionesFetch - method, body, headers, etc.
 * @returns {Promise<*>}
 */
async function peticionHttpJson(urlCompleta, opcionesFetch = {}) {
  const cabeceras = { ...opcionesFetch.headers };
  if (
    opcionesFetch.body !== undefined &&
    opcionesFetch.body !== null &&
    typeof opcionesFetch.body === "string"
  ) {
    cabeceras["Content-Type"] = "application/json";
  }

  const respuesta = await fetch(urlCompleta, {
    ...opcionesFetch,
    headers: cabeceras,
  });

  const textoCuerpo = await respuesta.text();
  /** @type {*|null} */
  let datosParseados = null;
  if (textoCuerpo) {
    try {
      datosParseados = JSON.parse(textoCuerpo);
    } catch {
      datosParseados = { error: textoCuerpo };
    }
  }

  if (!respuesta.ok) {
    const mensajeError =
      datosParseados && typeof datosParseados === "object" && (datosParseados.mensaje || datosParseados.error)
        ? String(datosParseados.mensaje || datosParseados.error)
        : respuesta.statusText;
    const errorRed = new Error(mensajeError);
    errorRed.status = respuesta.status;
    throw errorRed;
  }

  return datosParseados;
}

/**
 * Construye la URL del recurso tareas + sufijo (ej. "/1", "/completed").
 * @param {string} sufijo - "" o ruta relativa al recurso (con barra inicial)
 */
function urlTareas(sufijo) {
  const base = resolverUrlBaseApiTareas();
  return `${base}${sufijo}`;
}

const TaskflowApiClient = {
  urlBaseTareas: () => resolverUrlBaseApiTareas(),

  /**
   * GET /api/v1/tasks — lista todas las tareas.
   * @returns {Promise<Object[]>}
   */
  async listarTareas() {
    return peticionHttpJson(urlTareas(""), { method: "GET" });
  },

  /**
   * POST /api/v1/tasks — crea una tarea.
   * @param {Object} cuerpo - Payload JSON esperado por el backend
   * @returns {Promise<Object>}
   */
  async crearTarea(cuerpo) {
    return peticionHttpJson(urlTareas(""), {
      method: "POST",
      body: JSON.stringify(cuerpo),
    });
  },

  /**
   * DELETE /api/v1/tasks/:id
   * @param {number} idTarea
   * @returns {Promise<*>}
   */
  async eliminarTarea(idTarea) {
    return peticionHttpJson(urlTareas(`/${idTarea}`), { method: "DELETE" });
  },

  /**
   * PATCH /api/v1/tasks/:id
   * @param {number} idTarea
   * @param {Object} parches - Campos parciales (hecha, titulo, etc.)
   * @returns {Promise<Object>}
   */
  async actualizarTarea(idTarea, parches) {
    return peticionHttpJson(urlTareas(`/${idTarea}`), {
      method: "PATCH",
      body: JSON.stringify(parches),
    });
  },

  /**
   * DELETE /api/v1/tasks/completed
   * @returns {Promise<{ eliminadas: number }>}
   */
  async eliminarTareasCompletadas() {
    return peticionHttpJson(urlTareas("/completed"), { method: "DELETE" });
  },
};

/**
 * Alias con nombres cortos para controladores (`TareasController`, etc.).
 */
const ApiTareas = {
  urlBase: () => TaskflowApiClient.urlBaseTareas(),
  listar: () => TaskflowApiClient.listarTareas(),
  crear: (cuerpo) => TaskflowApiClient.crearTarea(cuerpo),
  eliminar: (id) => TaskflowApiClient.eliminarTarea(id),
  actualizar: (id, parches) => TaskflowApiClient.actualizarTarea(id, parches),
  eliminarCompletadas: () => TaskflowApiClient.eliminarTareasCompletadas(),
};

/**
 * Funciones asíncronas de conveniencia (misma implementación que TaskflowApiClient).
 * Útiles si se prefiere importar por nombre en futuros módulos ES o para documentación explícita.
 */
async function fetchListarTareas() {
  return TaskflowApiClient.listarTareas();
}

async function fetchCrearTarea(cuerpo) {
  return TaskflowApiClient.crearTarea(cuerpo);
}

async function fetchEliminarTarea(idTarea) {
  return TaskflowApiClient.eliminarTarea(idTarea);
}

async function fetchActualizarTarea(idTarea, parches) {
  return TaskflowApiClient.actualizarTarea(idTarea, parches);
}

async function fetchEliminarTareasCompletadas() {
  return TaskflowApiClient.eliminarTareasCompletadas();
}
