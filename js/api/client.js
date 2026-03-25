const URL_BASE_DEV = "http://localhost:3000/api/v1/tasks";

// A que URL conectarse para la API de tareas
function urlAPI() {
  const meta = document.querySelector('meta[name="taskflow-api-tasks-base"]');
  const contenidoMeta = meta && meta.getAttribute("content");
  if (contenidoMeta && contenidoMeta.trim()) {
    return contenidoMeta.trim().replace(/\/$/, "");
  }
  const { protocol, hostname } = window.location;
  if (protocol === "file:" || hostname === "") {
    return URL_BASE_DEV;
  }
  return `${window.location.origin}/api/v1/tasks`;
}

// Realiza petición HTTP y devuel JSON 
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

// URL completa de un endpoint 
function urlTareas(sufijo) {
  const base = urlAPI();
  return `${base}${sufijo}`;
}

// Cliente completo de la API REST
const TaskflowApiClient = {
  // GET /tasks — devuelve todas las tareas
  async listarTareas() {
    return peticionHttpJson(urlTareas(""), { method: "GET" });
  },
  // POST /tasks crea una nueva tarea
  async crearTarea(cuerpo) {
    return peticionHttpJson(urlTareas(""), {
      method: "POST",
      body: JSON.stringify(cuerpo),
    });
  },
  // DELETE /tasks/:id — elimina tarea con id
  async eliminarTarea(idTarea) {
    return peticionHttpJson(urlTareas(`/${idTarea}`), { method: "DELETE" });
  },
  // PATCH /tasks/:id — actualiza campos de una tarea
  async actualizarTarea(idTarea, parches) {
    return peticionHttpJson(urlTareas(`/${idTarea}`), {
      method: "PATCH",
      body: JSON.stringify(parches),
    });
  },
  // DELETE /tasks/completed — elimina todas las completadas
  async eliminarTareasCompletadas() {
    return peticionHttpJson(urlTareas("/completed"), { method: "DELETE" });
  },
};

// Alias para el controlador de tarea
const ApiTareas = {
  listar: () => TaskflowApiClient.listarTareas(),
  crear: (cuerpo) => TaskflowApiClient.crearTarea(cuerpo),
  eliminar: (id) => TaskflowApiClient.eliminarTarea(id),
  actualizar: (id, parches) => TaskflowApiClient.actualizarTarea(id, parches),
  eliminarCompletadas: () => TaskflowApiClient.eliminarTareasCompletadas(),
};

// Funcione exportables por si se usa como modulo.
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
