
/* =====================================
   1. DATOS DE EJEMPLO
===================================== */

// Recuperar los incidentes guardados
// Si no existen, cargar los datos iniciales.

let incidentes = JSON.parse(localStorage.getItem("incidentes")) || [

    {
        folio: "F-001",
        fecha: "2026-11-05",
        hora: "08:30",
        ubicacion: "Estación León",
        tipo: "Señalización",
        descripcion: "Desperfecto en señalización ferroviaria.",
        gravedad: "Alta",
        estado: "Pendiente",
        evidencias: []
    },

    {
        folio: "F-002",
        fecha: "2026-11-06",
        hora: "10:15",
        ubicacion: "Tramo Silao",
        tipo: "Comunicación",
        descripcion: "Falla en sistema de comunicación.",
        gravedad: "Media",
        estado: "Pendiente",
        evidencias: []
    },

    {
        folio: "F-003",
        fecha: "2026-11-07",
        hora: "14:20",
        ubicacion: "Vía principal",
        tipo: "Obstrucción",
        descripcion: "Obstrucción en las vías ferroviarias.",
        gravedad: "Crítica",
        estado: "En verificación",
        evidencias: []
    },

    {
        folio: "F-004",
        fecha: "2026-11-08",
        hora: "16:45",
        ubicacion: "Zona de mantenimiento",
        tipo: "Mantenimiento",
        descripcion: "Incidente durante actividades de mantenimiento.",
        gravedad: "Baja",
        estado: "Atendido",
        evidencias: []
    }

];

// Guardar los datos iniciales
localStorage.setItem("incidentes", JSON.stringify(incidentes));


/* =====================================
   DATOS DE ACCIONES CORRECTIVAS
===================================== */

let acciones = JSON.parse(localStorage.getItem("acciones")) || [

    {
        id: "A-001",
        folio: "F-001",
        descripcion: "Revisar y reparar el sistema de señalización.",
        responsable: "Carlos Ramírez",
        asignacion: "2026-11-05",
        limite: "2026-11-12",
        estado: "En proceso",
        avance: 60
    },

    {
        id: "A-002",
        folio: "F-002",
        descripcion: "Revisar conexiones del sistema de comunicación.",
        responsable: "María López",
        asignacion: "2026-11-06",
        limite: "2026-11-14",
        estado: "Pendiente",
        avance: 0
    },

    {
        id: "A-003",
        folio: "F-003",
        descripcion: "Retirar objetos que obstruyen las vías.",
        responsable: "José Hernández",
        asignacion: "2026-11-07",
        limite: "2026-11-10",
        estado: "En revisión",
        avance: 90
    },

    {
        id: "A-004",
        folio: "F-004",
        descripcion: "Realizar inspección del equipo de mantenimiento.",
        responsable: "Ana Martínez",
        asignacion: "2026-11-08",
        limite: "2026-11-15",
        estado: "Completada",
        avance: 100
    }

];

localStorage.setItem("acciones", JSON.stringify(acciones));




/* =====================================
   2. ELEMENTOS PRINCIPALES
===================================== */

const contenido = document.getElementById("page-content");
const botonesMenu = document.querySelectorAll(".menu-item");
const toast = document.getElementById("toast");


/* =====================================
   3. MENSAJES DE CONFIRMACIÓN
===================================== */

function mostrarMensaje(mensaje) {

    toast.textContent = mensaje;

    toast.classList.add("show");

    setTimeout(function() {
        toast.classList.remove("show");
    }, 3000);

}

/* =====================================
   NORMALIZAR TEXTO DE BUSQUEDA
===================================== */

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


/* =====================================
   4. FUNCIONES PARA LOS ESTADOS
===================================== */

function claseEstado(estado) {

    if (estado === "Pendiente") {
        return "estado-pendiente";
    }

    if (estado === "En proceso") {
        return "estado-proceso";
    }

    if (estado === "En verificación") {
        return "estado-revision";
    }

    if (estado === "Atendido") {
        return "estado-completada";
    }

    return "";
}


function claseGravedad(gravedad) {

    if (gravedad === "Crítica") {
        return "gravedad-critica";
    }

    if (gravedad === "Alta") {
        return "gravedad-alta";
    }

    if (gravedad === "Media") {
        return "gravedad-media";
    }

    if (gravedad === "Baja") {
        return "gravedad-baja";
    }

    return "";
}


/* =====================================
   5. MOSTRAR PANEL PRINCIPAL
===================================== */

function mostrarDashboard() {

    let total = incidentes.length;

    let pendientes = incidentes.filter(function(incidente) {
        return incidente.estado === "Pendiente";
    }).length;

    let atendidos = incidentes.filter(function(incidente) {
        return incidente.estado === "Atendido";
    }).length;

    let verificacion = incidentes.filter(function(incidente) {
        return incidente.estado === "En verificación";
    }).length;


    let filas = "";

    // Crear las filas de la tabla

    incidentes.forEach(function(incidente) {

        filas += `
            <tr>

                <td><strong>${incidente.folio}</strong></td>

                <td>${incidente.fecha}</td>

                <td>${incidente.ubicacion}</td>

                <td>${incidente.tipo}</td>

                <td>
                    <span class="badge ${claseGravedad(incidente.gravedad)}">
                        ${incidente.gravedad}
                    </span>
                </td>

                <td>
                    <span class="badge ${claseEstado(incidente.estado)}">
                        ${incidente.estado}
                    </span>
                </td>

                <td>
                <button class="btn-view" onclick="verDetalle('${incidente.folio}')">
                    <i class="bi bi-eye"></i>
                    Ver
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="eliminarIncidente('${incidente.folio}', 'dashboard')">
                    <i class="bi bi-trash"></i>
                    Eliminar
                </button>
                </td>

            </tr>
        `;

    });


    // Mostrar el contenido del dashboard

    contenido.innerHTML = `

        <h1 class="page-title">Panel principal</h1>

        <p class="page-description">
            Resumen general de los incidentes ferroviarios registrados.
        </p>

        <div class="demo-alert">
            <i class="bi bi-info-circle"></i>
            Información de demostración. Los registros son ficticios.
        </div>


        <!-- TARJETAS DE INDICADORES -->

        <div class="stats-container">

            <div class="stat-card">
                <div>
                    <p>Total de incidentes</p>
                    <h2>${total}</h2>
                </div>

                <div class="stat-icon icon-blue">
                    <i class="bi bi-train-front"></i>
                </div>
            </div>


            <div class="stat-card">
                <div>
                    <p>Incidentes pendientes</p>
                    <h2>${pendientes}</h2>
                </div>

                <div class="stat-icon icon-red">
                    <i class="bi bi-exclamation-triangle"></i>
                </div>
            </div>


            <div class="stat-card">
                <div>
                    <p>Incidentes atendidos</p>
                    <h2>${atendidos}</h2>
                </div>

                <div class="stat-icon icon-green">
                    <i class="bi bi-check-circle"></i>
                </div>
            </div>


            <div class="stat-card">
                <div>
                    <p>En verificación</p>
                    <h2>${verificacion}</h2>
                </div>

                <div class="stat-icon icon-yellow">
                    <i class="bi bi-clock-history"></i>
                </div>
            </div>

        </div>


        <!-- TABLA DE INCIDENTES -->

        <div class="table-container">

            <div class="table-header">

                <h3>Incidentes recientes</h3>

                <button class="btn btn-primary" onclick="cambiarPagina('registro')">
                    <i class="bi bi-plus-lg"></i>
                    Nuevo incidente
                </button>

            </div>


            <table>

                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Fecha</th>
                        <th>Ubicación</th>
                        <th>Tipo</th>
                        <th>Gravedad</th>
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>

                <tbody>
                    ${filas}
                </tbody>

            </table>

        </div>

    `;

}


/* =====================================
   6. CONSULTAR DETALLES
===================================== */

function verDetalle(folio) {

    let incidente = incidentes.find(function(elemento) {
        return elemento.folio === folio;
    });

    if (incidente) {

        alert(
            "DETALLES DEL INCIDENTE\n\n" +
            "Folio: " + incidente.folio + "\n" +
            "Fecha: " + incidente.fecha + "\n" +
            "Hora: " + incidente.hora + "\n" +
            "Ubicación: " + incidente.ubicacion + "\n" +
            "Tipo: " + incidente.tipo + "\n" +
            "Gravedad: " + incidente.gravedad + "\n" +
            "Estado: " + incidente.estado + "\n\n" +
            "Descripción:\n" + incidente.descripcion
        );

    }

}


/* =====================================
   ELIMINAR INCIDENTE
===================================== */

function eliminarIncidente(folio, origen) {

    // Buscar el incidente que queremos eliminar
    let incidente = incidentes.find(function(elemento) {
        return elemento.folio === folio;
    });

    if (!incidente) {
        mostrarMensaje("No se encontró el incidente.");
        return;
    }

    // Pedir confirmación
    let confirmar = confirm(
        "¿Estás seguro de eliminar el incidente " + folio +
        "?\n\nTambién se eliminarán sus acciones correctivas relacionadas."
    );

    // Si el usuario cancela, no hacer nada
    if (!confirmar) {
        return;
    }

    // Guardar los datos anteriores por seguridad
    let incidentesAnteriores = incidentes;
    let accionesAnteriores = acciones;

    // Eliminar el incidente
    let nuevosIncidentes = incidentes.filter(function(elemento) {
        return elemento.folio !== folio;
    });

    // Eliminar las acciones relacionadas con ese incidente
    let nuevasAcciones = acciones.filter(function(elemento) {
        return elemento.folio !== folio;
    });

    try {

        // Guardar los cambios
        localStorage.setItem("incidentes", JSON.stringify(nuevosIncidentes));
        localStorage.setItem("acciones", JSON.stringify(nuevasAcciones));

        // Actualizar los arreglos
        incidentes = nuevosIncidentes;
        acciones = nuevasAcciones;

    } catch (error) {

        // Recuperar los datos anteriores
        incidentes = incidentesAnteriores;
        acciones = accionesAnteriores;

        mostrarMensaje("No se pudo eliminar el incidente. Revisa el almacenamiento.");

        return;
    }

    mostrarMensaje("Incidente " + folio + " eliminado correctamente.");

    // Actualizar la pantalla
    if (origen === "dashboard") {

        mostrarDashboard();

    } else if (origen === "historial") {

        document.getElementById("detalleHistorial").innerHTML = "";

        filtrarHistorial();

    }

}



/* =====================================
   7. NAVEGACIÓN ENTRE PANTALLAS
===================================== */


function cambiarPagina(pagina) {

    botonesMenu.forEach(function(boton) {

        boton.classList.remove("active");

        if (boton.dataset.page === pagina) {
            boton.classList.add("active");
        }

    });

    if (pagina === "dashboard") {
        mostrarDashboard();
    }

    else if (pagina === "registro") {
        mostrarRegistro();
    }

    else if (pagina === "acciones") {
        mostrarAcciones();
    }

    else if (pagina === "historial") {

        mostrarHistorial();

    }

}



// Activar los botones del menú

botonesMenu.forEach(function(boton) {

    boton.addEventListener("click", function() {

        cambiarPagina(boton.dataset.page);

    });

});


/* =====================================
   8. GENERAR FOLIO AUTOMÁTICO
===================================== */

function generarFolio() {

    let numero = incidentes.length + 1;

    let folio = "F-" + String(numero).padStart(3, "0");

    // Evitar repetir folios si se eliminan registros
    while (incidentes.some(function(incidente) {
        return incidente.folio === folio;
    })) {
        numero++;
        folio = "F-" + String(numero).padStart(3, "0");
    }

    return folio;

}


/* =====================================
   9. MOSTRAR FORMULARIO
===================================== */

function mostrarRegistro() {

    let folioNuevo = generarFolio();

    let fechaActual = new Date().toLocaleDateString("en-CA");

    contenido.innerHTML = `

        <h1 class="page-title">Registrar incidente</h1>

        <p class="page-description">
            Registra la información del incidente ferroviario y adjunta las evidencias correspondientes.
        </p>

        <div class="demo-alert">
            <i class="bi bi-info-circle"></i>
            Formulario de demostración. Los datos se guardarán en este navegador.
        </div>

        <div class="form-container">

            <form id="form-incidente">

                <div class="form-grid">

                    <div class="form-group">
                        <label>Folio del incidente</label>
                        <input type="text" id="folio" value="${folioNuevo}" readonly>
                    </div>

                    <div class="form-group">
                        <label>Fecha del incidente *</label>
                        <input type="date" id="fecha" value="${fechaActual}" required>
                    </div>

                    <div class="form-group">
                        <label>Hora del incidente *</label>
                        <input type="time" id="hora" required>
                    </div>

                    <div class="form-group">
                        <label>Ubicación *</label>
                        <input type="text" id="ubicacion" placeholder="Ej. Estación León" required>
                    </div>

                    <div class="form-group">
                        <label>Tipo de incidente *</label>
                        <select id="tipo" required>
                            <option value="">Selecciona un tipo</option>
                            <option value="Señalización">Desperfecto en señalización</option>
                            <option value="Comunicación">Falla de comunicación</option>
                            <option value="Obstrucción">Obstrucción en vías</option>
                            <option value="Mantenimiento">Incidente de mantenimiento</option>
                            <option value="Infraestructura">Daño en infraestructura</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Nivel de gravedad *</label>
                        <select id="gravedad" required>
                            <option value="">Selecciona la gravedad</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                            <option value="Crítica">Crítica</option>
                        </select>
                    </div>

                    <div class="form-group full-width">
                        <label>Descripción de lo ocurrido *</label>
                        <textarea id="descripcion"
                            placeholder="Describe detalladamente qué ocurrió..."
                            required></textarea>
                    </div>

                    <div class="form-group full-width">
                        <label>Fotografías o documentos de evidencia</label>

                        <input type="file"
                            id="evidencias"
                            accept="image/*,.pdf,.doc,.docx"
                            multiple>

                        <small class="file-help">
                            Puedes adjuntar imágenes o documentos de prueba.
                            Máximo 2 MB por archivo.
                        </small>

                        <div id="lista-evidencias" class="evidence-list">
                            No hay archivos seleccionados.
                        </div>

                    </div>

                </div>

                <div class="form-actions">

                    <button type="button" class="btn btn-secondary"
                        onclick="cambiarPagina('dashboard')">
                        <i class="bi bi-x-circle"></i>
                        Cancelar
                    </button>

                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-save"></i>
                        Guardar incidente
                    </button>

                </div>

            </form>

        </div>

    `;


    // Mostrar los nombres de los archivos seleccionados

    document.getElementById("evidencias").addEventListener("change", function() {

        let archivos = this.files;
        let lista = document.getElementById("lista-evidencias");

        lista.innerHTML = "";

        if (archivos.length === 0) {
            lista.textContent = "No hay archivos seleccionados.";
            return;
        }

        for (let i = 0; i < archivos.length; i++) {

            let elemento = document.createElement("div");

            elemento.className = "evidence-item";

            elemento.textContent = archivos[i].name;

            lista.appendChild(elemento);

        }

    });


    // Escuchar el envío del formulario

    document.getElementById("form-incidente").addEventListener("submit", guardarIncidente);

}


/* =====================================
   10. GUARDAR NUEVO INCIDENTE
===================================== */

function guardarIncidente(evento) {

    evento.preventDefault();

    let archivos = document.getElementById("evidencias").files;

    let evidencias = [];

    // Validar el tamaño de los archivos

    for (let i = 0; i < archivos.length; i++) {

        if (archivos[i].size > 2 * 1024 * 1024) {

            mostrarMensaje("Cada archivo debe pesar máximo 2 MB.");

            return;

        }

        evidencias.push({
            nombre: archivos[i].name,
            tipo: archivos[i].type,
            tamano: archivos[i].size
        });

    }


    // Crear el nuevo incidente

    let nuevoIncidente = {

        folio: document.getElementById("folio").value,

        fecha: document.getElementById("fecha").value,

        hora: document.getElementById("hora").value,

        ubicacion: document.getElementById("ubicacion").value.trim(),

        tipo: document.getElementById("tipo").value,

        descripcion: document.getElementById("descripcion").value.trim(),

        gravedad: document.getElementById("gravedad").value,

        estado: "Pendiente",

        evidencias: evidencias

    };


    // Validar los campos de texto

    if (
        nuevoIncidente.ubicacion === "" ||
        nuevoIncidente.descripcion === ""
    ) {

        mostrarMensaje("Completa todos los campos obligatorios.");

        return;

    }


    // Agregar el incidente al arreglo

    incidentes.push(nuevoIncidente);


    // Guardar los datos en LocalStorage

    try {

        localStorage.setItem("incidentes", JSON.stringify(incidentes));

    } catch (error) {

        incidentes.pop();

        mostrarMensaje("No se pudo guardar. Revisa el espacio disponible.");

        return;

    }


    // Mostrar confirmación

    mostrarMensaje("Incidente " + nuevoIncidente.folio + " registrado correctamente.");


    // Actualizar el dashboard

    cambiarPagina("dashboard");

}


/* =====================================
   SEGUIMIENTO DE ACCIONES CORRECTIVAS
===================================== */

// Generar identificador de acción

function generarIdAccion() {

    let numero = acciones.length + 1;

    let id = "A-" + String(numero).padStart(3, "0");

    while (acciones.some(function(accion) {
        return accion.id === id;
    })) {

        numero++;

        id = "A-" + String(numero).padStart(3, "0");

    }

    return id;

}


// Mostrar pantalla de seguimiento

function mostrarAcciones() {

    let opcionesIncidentes = "";

    incidentes.forEach(function(incidente) {

        opcionesIncidentes += `
            <option value="${incidente.folio}">
                ${incidente.folio} - ${incidente.tipo}
            </option>
        `;

    });


    let filas = "";

    acciones.forEach(function(accion) {

        filas += `

            <tr>

                <td><strong>${accion.id}</strong></td>

                <td>${accion.folio}</td>

                <td>${accion.descripcion}</td>

                <td>
                    <input type="text"
                        class="filter-control"
                        value="${accion.responsable}"
                        onchange="actualizarAccion('${accion.id}', 'responsable', this.value)">
                </td>

                <td>${accion.asignacion}</td>

                <td>
                    <input type="date"
                        class="filter-control"
                        value="${accion.limite}"
                        onchange="actualizarAccion('${accion.id}', 'limite', this.value)">
                </td>

                <td>
                    <select class="filter-control"
                        onchange="actualizarAccion('${accion.id}', 'estado', this.value)">

                        <option value="Pendiente" ${accion.estado === "Pendiente" ? "selected" : ""}>
                            Pendiente
                        </option>

                        <option value="En proceso" ${accion.estado === "En proceso" ? "selected" : ""}>
                            En proceso
                        </option>

                        <option value="En revisión" ${accion.estado === "En revisión" ? "selected" : ""}>
                            En revisión
                        </option>

                        <option value="Completada" ${accion.estado === "Completada" ? "selected" : ""}>
                            Completada
                        </option>

                    </select>
                </td>

                <td>

                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${accion.avance}%"></div>
                    </div>

                    <div class="progress-edit">

                        <input type="number"
                            min="0"
                            max="100"
                            value="${accion.avance}"
                            onchange="actualizarAccion('${accion.id}', 'avance', this.value)">

                        <span>%</span>

                    </div>

                </td>

            </tr>

        `;

    });


    contenido.innerHTML = `

        <h1 class="page-title">Seguimiento de acciones correctivas</h1>

        <p class="page-description">
            Administra las actividades asignadas para resolver los incidentes ferroviarios.
        </p>

        <div class="demo-alert">
            <i class="bi bi-info-circle"></i>
            Información de demostración. Puedes modificar los responsables,
            fechas, estados y porcentajes de avance.
        </div>


        <!-- FORMULARIO PARA NUEVA ACCIÓN -->

        <div class="form-container">

            <h3 class="section-subtitle">
                <i class="bi bi-plus-circle"></i>
                Asignar nueva acción correctiva
            </h3>

            <form id="form-accion">

                <div class="form-grid">

                    <div class="form-group">

                        <label>Incidente relacionado *</label>

                        <select id="accion-folio" required>

                            <option value="">Selecciona un incidente</option>

                            ${opcionesIncidentes}

                        </select>

                    </div>


                    <div class="form-group">

                        <label>Nombre del responsable *</label>

                        <input type="text"
                            id="accion-responsable"
                            placeholder="Nombre del responsable"
                            required>

                    </div>


                    <div class="form-group full-width">

                        <label>Descripción de la acción correctiva *</label>

                        <textarea id="accion-descripcion"
                            placeholder="Describe la actividad que se realizará..."
                            required></textarea>

                    </div>


                    <div class="form-group">

                        <label>Fecha de asignación *</label>

                        <input type="date"
                            id="accion-asignacion"
                            required>

                    </div>


                    <div class="form-group">

                        <label>Fecha límite *</label>

                        <input type="date"
                            id="accion-limite"
                            required>

                    </div>

                </div>


                <div class="form-actions">

                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-person-check"></i>
                        Asignar acción
                    </button>

                </div>

            </form>

        </div>


        <!-- TABLA DE ACCIONES -->

        <div class="table-container actions-table">

            <div class="table-header">

                <h3>Acciones correctivas registradas</h3>

                <span class="badge estado-revision">
                    ${acciones.length} acciones
                </span>

            </div>


            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Folio</th>
                        <th>Acción correctiva</th>
                        <th>Responsable</th>
                        <th>Asignación</th>
                        <th>Fecha límite</th>
                        <th>Estado</th>
                        <th>Avance</th>
                    </tr>

                </thead>

                <tbody>

                    ${filas || `
                        <tr>
                            <td colspan="8">No hay acciones registradas.</td>
                        </tr>
                    `}

                </tbody>

            </table>

        </div>

    `;


    // Establecer fecha de asignación actual

    document.getElementById("accion-asignacion").value =
        new Date().toLocaleDateString("en-CA");


    // Escuchar el formulario

    document.getElementById("form-accion").addEventListener("submit", guardarAccion);

}


/* =====================================
   GUARDAR NUEVA ACCIÓN
===================================== */

function guardarAccion(evento) {

    evento.preventDefault();

    let folio = document.getElementById("accion-folio").value;

    let responsable = document.getElementById("accion-responsable").value.trim();

    let descripcion = document.getElementById("accion-descripcion").value.trim();

    let asignacion = document.getElementById("accion-asignacion").value;

    let limite = document.getElementById("accion-limite").value;


    // Validar fechas

    if (limite < asignacion) {

        mostrarMensaje("La fecha límite no puede ser anterior a la asignación.");

        return;

    }


    // Crear objeto de acción

    let nuevaAccion = {

        id: generarIdAccion(),

        folio: folio,

        descripcion: descripcion,

        responsable: responsable,

        asignacion: asignacion,

        limite: limite,

        estado: "Pendiente",

        avance: 0

    };


    // Guardar acción

    acciones.push(nuevaAccion);

    localStorage.setItem("acciones", JSON.stringify(acciones));


    mostrarMensaje("Acción " + nuevaAccion.id + " asignada correctamente.");

    mostrarAcciones();

}


/* =====================================
   ACTUALIZAR ACCIONES
===================================== */

function actualizarAccion(id, campo, valor) {

    let accion = acciones.find(function(elemento) {
        return elemento.id === id;
    });

    if (!accion) {
        return;
    }


    // Actualizar porcentaje

    if (campo === "avance") {

        let porcentaje = Number(valor);

        if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {

            mostrarMensaje("El avance debe estar entre 0 y 100.");

            mostrarAcciones();

            return;

        }

        accion.avance = porcentaje;

    }


    // Actualizar responsable

    else if (campo === "responsable") {

        if (valor.trim() === "") {

            mostrarMensaje("El responsable es obligatorio.");

            mostrarAcciones();

            return;

        }

        accion.responsable = valor.trim();

    }


    // Actualizar fecha límite

    else if (campo === "limite") {

        if (valor < accion.asignacion) {

            mostrarMensaje("La fecha límite no puede ser anterior a la asignación.");

            mostrarAcciones();

            return;

        }

        accion.limite = valor;

    }


    // Actualizar estado

    else if (campo === "estado") {

        accion.estado = valor;

        if (valor === "Completada") {
            accion.avance = 100;
        }

    }


    // Guardar cambios

    localStorage.setItem("acciones", JSON.stringify(acciones));


    // Actualizar pantalla

    mostrarAcciones();

    mostrarMensaje("Acción actualizada correctamente.");

}

/* 7. MODULO DE HISTORIAL Y REPORTES */

function mostrarHistorial() {
    contenido.innerHTML = `
        <h1 class="page-title">Historial y reportes</h1>
        <p class="page-description">
            Consulta, filtra y exporta los incidentes registrados en FERROTRACK.
        </p>

        <div class="historial-filtros">

            <div class="form-group">
                <label>Buscar por folio</label>
                <input type="text" id="filtroFolio"
                    placeholder="Ej. F-001">
            </div>

            <div class="form-group">
                <label>Ubicación</label>
                <input type="text" id="filtroUbicacion"
                    placeholder="Escribe una ubicación">
            </div>

            <div class="form-group">
                <label>Gravedad</label>
                <select id="filtroGravedad">
                    <option value="">Todas</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                </select>
            </div>

            <div class="form-group">
                <label>Estado</label>
                <select id="filtroEstado">
                    <option value="">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Atendido">Atendido</option>
                    <option value="En verificación">En verificación</option>
                </select>
            </div>

            <div class="form-group">
                <label>Fecha desde</label>
                <input type="date" id="filtroDesde">
            </div>

            <div class="form-group">
                <label>Fecha hasta</label>
                <input type="date" id="filtroHasta">
            </div>

        </div>

        <div class="historial-acciones">
            <p class="resultado-filtros" id="totalResultados"></p>

            <div>
                <button class="btn btn-secondary" onclick="limpiarFiltros()">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    Limpiar filtros
                </button>

                <button class="btn btn-primary" onclick="exportarReporte()">
                    <i class="bi bi-file-earmark-spreadsheet"></i>
                    Exportar CSV
                </button>
            </div>
        </div>

        <div class="historial-tabla">
            <table>
                <thead>
                    <tr>
                        <th>Folio</th>
                        <th>Fecha</th>
                        <th>Ubicación</th>
                        <th>Tipo</th>
                        <th>Gravedad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody id="tablaHistorial"></tbody>
            </table>
        </div>

        <div id="detalleHistorial"></div>
    `;

    document.getElementById("filtroFolio").addEventListener("input", filtrarHistorial);
    document.getElementById("filtroUbicacion").addEventListener("input", filtrarHistorial);
    document.getElementById("filtroGravedad").addEventListener("change", filtrarHistorial);
    document.getElementById("filtroEstado").addEventListener("change", filtrarHistorial);
    document.getElementById("filtroDesde").addEventListener("change", filtrarHistorial);
    document.getElementById("filtroHasta").addEventListener("change", filtrarHistorial);

    filtrarHistorial();
}


function filtrarHistorial() {
    let folio = normalizarTexto(document.getElementById("filtroFolio").value);
    let ubicacion = normalizarTexto(document.getElementById("filtroUbicacion").value);
    let gravedad = document.getElementById("filtroGravedad").value;
    let estado = document.getElementById("filtroEstado").value;
    let desde = document.getElementById("filtroDesde").value;
    let hasta = document.getElementById("filtroHasta").value;

    let resultados = incidentes.filter(incidente => {

        let coincideFolio = normalizarTexto(incidente.folio).includes(folio);

        let coincideUbicacion = normalizarTexto(incidente.ubicacion).includes(ubicacion);

        let coincideGravedad = gravedad === "" || incidente.gravedad === gravedad;

        let coincideEstado = estado === "" || incidente.estado === estado;

        let coincideDesde = desde === "" || incidente.fecha >= desde;

        let coincideHasta = hasta === "" || incidente.fecha <= hasta;

        return coincideFolio &&
            coincideUbicacion &&
            coincideGravedad &&
            coincideEstado &&
            coincideDesde &&
            coincideHasta;
    });

    document.getElementById("totalResultados").textContent =
        "Incidentes encontrados: " + resultados.length;

    let tabla = document.getElementById("tablaHistorial");

    if (resultados.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:25px;">
                    No se encontraron incidentes.
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = resultados.map(incidente => `
        <tr>
            <td><strong>${incidente.folio}</strong></td>
            <td>${incidente.fecha}</td>
            <td>${incidente.ubicacion}</td>
            <td>${incidente.tipo}</td>
            <td>
                <span class="badge ${claseGravedad(incidente.gravedad)}">
                    ${incidente.gravedad}
                </span>
            </td>
            <td>
                <span class="badge ${claseEstado(incidente.estado)}">
                    ${incidente.estado}
                </span>
            </td>
            <td>
                <button class="btn btn-primary"
                    onclick="mostrarDetalleHistorial('${incidente.folio}')">
                    <i class="bi bi-eye"></i>
                    Ver detalle
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="eliminarIncidente('${incidente.folio}', 'historial')">
                    <i class="bi bi-trash"></i>
                    Eliminar
                </button>
            </td>
        </tr>
    `).join("");
}


function limpiarFiltros() {
    document.getElementById("filtroFolio").value = "";
    document.getElementById("filtroUbicacion").value = "";
    document.getElementById("filtroGravedad").value = "";
    document.getElementById("filtroEstado").value = "";
    document.getElementById("filtroDesde").value = "";
    document.getElementById("filtroHasta").value = "";

    document.getElementById("detalleHistorial").innerHTML = "";

    filtrarHistorial();
}


function mostrarDetalleHistorial(folio) {
    let incidente = incidentes.find(item => item.folio === folio);

    if (!incidente) {
        mostrarMensaje("No se encontró el incidente.");
        return;
    }

    let evidencias = incidente.evidencias || [];

    let accionesRelacionadas = acciones.filter(
        accion => accion.folio === folio
    );

    let listaEvidencias = evidencias.length > 0
        ? evidencias.map(evidencia => `
            <li>
                <i class="bi bi-paperclip"></i>
                ${evidencia.nombre}
            </li>
        `).join("")
        : "<li>Este incidente no tiene evidencias adjuntas.</li>";

    let listaAcciones = accionesRelacionadas.length > 0
        ? accionesRelacionadas.map(accion => `
            <li>
                <strong>${accion.id}</strong> -
                ${accion.descripcion}
                <br>
                Responsable: ${accion.responsable}
                <br>
                Estado: ${accion.estado}
                | Avance: ${accion.avance}%
            </li>
        `).join("")
        : "<li>No hay acciones correctivas relacionadas.</li>";

    document.getElementById("detalleHistorial").innerHTML = `
        <div class="detalle-incidente">

            <h3>
                <i class="bi bi-file-text"></i>
                Detalle del incidente ${incidente.folio}
            </h3>

            <div class="detalle-grid">

                <p><strong>Fecha:</strong> ${incidente.fecha}</p>

                <p><strong>Hora:</strong> ${incidente.hora}</p>

                <p><strong>Ubicación:</strong> ${incidente.ubicacion}</p>

                <p><strong>Tipo:</strong> ${incidente.tipo}</p>

                <p><strong>Gravedad:</strong> ${incidente.gravedad}</p>

                <p><strong>Estado:</strong> ${incidente.estado}</p>

            </div>

            <div class="detalle-evidencias">
                <h4>Descripción</h4>
                <p>${incidente.descripcion}</p>
            </div>

            <div class="detalle-evidencias">
                <h4>Evidencias adjuntas</h4>
                <ul>${listaEvidencias}</ul>
            </div>

            <div class="detalle-acciones">
                <h4>Acciones correctivas relacionadas</h4>
                <ul>${listaAcciones}</ul>
            </div>

        </div>
    `;

    document.getElementById("detalleHistorial").scrollIntoView({
        behavior: "smooth"
    });
}


function exportarReporte() {
    let folio = normalizarTexto(document.getElementById("filtroFolio").value);
    let ubicacion = normalizarTexto(document.getElementById("filtroUbicacion").value);
    let gravedad = document.getElementById("filtroGravedad").value;
    let estado = document.getElementById("filtroEstado").value;
    let desde = document.getElementById("filtroDesde").value;
    let hasta = document.getElementById("filtroHasta").value;

    let resultados = incidentes.filter(incidente => {

        return normalizarTexto(incidente.folio).includes(folio) &&
             normalizarTexto(incidente.ubicacion).includes(ubicacion) &&
            (gravedad === "" || incidente.gravedad === gravedad) &&
            (estado === "" || incidente.estado === estado) &&
            (desde === "" || incidente.fecha >= desde) &&
            (hasta === "" || incidente.fecha <= hasta);
    });

    if (resultados.length === 0) {
        mostrarMensaje("No hay registros para exportar.");
        return;
    }

    let encabezados = [
        "Folio",
        "Fecha",
        "Hora",
        "Ubicacion",
        "Tipo",
        "Descripcion",
        "Gravedad",
        "Estado",
        "Evidencias"
    ];

    let filas = resultados.map(incidente => [
        incidente.folio,
        incidente.fecha,
        incidente.hora,
        incidente.ubicacion,
        incidente.tipo,
        incidente.descripcion,
        incidente.gravedad,
        incidente.estado,
        (incidente.evidencias || []).map(e => e.nombre).join("; ")
    ]);

    function convertirCSV(valor) {
        return '"' + String(valor ?? "").replace(/"/g, '""') + '"';
    }

    let csv = [encabezados, ...filas]
        .map(fila => fila.map(convertirCSV).join(","))
        .join("\n");

    let archivo = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    let url = URL.createObjectURL(archivo);
    let enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = "reporte_ferrotrack.csv";

    document.body.appendChild(enlace);
    enlace.click();

    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);

    mostrarMensaje("Reporte exportado correctamente.");
}






/* =====================================
   8. INICIAR EL SISTEMA
===================================== */

mostrarDashboard();
