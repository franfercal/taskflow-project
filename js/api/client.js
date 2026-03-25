const URL_BASE_TAREAS_DESARROLLO = "http://localhost:3000/api/v1/tasks";

// meta taskflow-api-tasks-base > mismo origen > file:// cae a localhost:3000
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

// fetch + parseo json; si no va bien el status va en error.status
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

// base + sufijo tipo "" | "/1" | "/completed"
function urlTareas(sufijo) {
  const base = resolverUrlBaseApiTareas();
  return `${base}${sufijo}`;
}

const TaskflowApiClient = {
  async listarTareas() {
    return peticionHttpJson(urlTareas(""), { method: "GET" });
  },

  async crearTarea(cuerpo) {
    return peticionHttpJson(urlTareas(""), {
      method: "POST",
      body: JSON.stringify(cuerpo),
    });
  },

  async eliminarTarea(idTarea) {
    return peticionHttpJson(urlTareas(`/${idTarea}`), { method: "DELETE" });
  },

  async actualizarTarea(idTarea, parches) {
    return peticionHttpJson(urlTareas(`/${idTarea}`), {
      method: "PATCH",
      body: JSON.stringify(parches),
    });
  },

  async eliminarTareasCompletadas() {
    return peticionHttpJson(urlTareas("/completed"), { method: "DELETE" });
  },
};

// Atajos que usa TareasController (mismo api, nombres más cortos).
const ApiTareas = {
  listar: () => TaskflowApiClient.listarTareas(),
  crear: (cuerpo) => TaskflowApiClient.crearTarea(cuerpo),
  eliminar: (id) => TaskflowApiClient.eliminarTarea(id),
  actualizar: (id, parches) => TaskflowApiClient.actualizarTarea(id, parches),
  eliminarCompletadas: () => TaskflowApiClient.eliminarTareasCompletadas(),
};

// Por si pasamos a módulos ES y queremos import { fetchListarTareas } … hoy casi nadie las usa.
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
