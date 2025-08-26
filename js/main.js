
const formInscripcion = document.getElementById("formInscripcion");
const selectCurso = document.getElementById("cursoSeleccionado");
const selectFiltro = document.getElementById("filtroCurso");
const listaInscripcionesEl = document.getElementById("listaInscripciones");

const btnBorrar = document.getElementById("btnBorrar");
const modalConfirm = document.getElementById("modalconfirm");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

const resetCuposBtn = document.getElementById("resetCuposBtn");


const modalEdit = document.getElementById("modalEdit");
const formEditar = document.getElementById("formEditar");
const editId = document.getElementById("editId");
const editNombreCompleto = document.getElementById("editNombreCompleto");
const editEmail = document.getElementById("editEmail");
const editTelefono = document.getElementById("editTelefono");
const editModalidad = document.getElementById("editModalidad");
const editCurso = document.getElementById("editCurso");
const cancelEdit = document.getElementById("cancelEdit");


(async function init() {
  await cargarCursos();
  cargarInscripciones();
  renderCursosEnSelects();
  renderFiltroCursos();
  renderInscripciones();

  
  formInscripcion.addEventListener("submit", onInscribir);
  selectFiltro.addEventListener("change", renderInscripciones);

  btnBorrar.addEventListener("click", () => { modalConfirm.style.display = "block"; });
  confirmNo.addEventListener("click", () => { modalConfirm.style.display = "none"; });
  confirmYes.addEventListener("click", borrarTodas);

  resetCuposBtn.addEventListener("click", onResetearCupos);

  
  listaInscripcionesEl.addEventListener("click", onListaClick);

  
  formEditar.addEventListener("submit", onGuardarEdicion);
  cancelEdit.addEventListener("click", () => modalEdit.style.display = "none");
})();


function renderCursosEnSelects() {
  const cursos = obtenerCursos();

  
  selectCurso.innerHTML = `<option value="" disabled selected>Selecciona un curso</option>`;
  cursos.forEach(c => {
    const opt = document.createElement("option");
    opt.value = String(c.id);
    opt.textContent = `${c.nombre} (quedan ${c.cuposDisponibles}/${c.cuposTotales}) — ${c.duracion}`;
    if (c.cuposDisponibles === 0) opt.disabled = true;
    selectCurso.appendChild(opt);
  });

  
  editCurso.innerHTML = "";
  cursos.forEach(c => {
    const opt = document.createElement("option");
    opt.value = String(c.id);
    opt.textContent = `${c.nombre} (quedan ${c.cuposDisponibles}/${c.cuposTotales}) — ${c.duracion}`;
    if (c.cuposDisponibles === 0) opt.disabled = true;
    editCurso.appendChild(opt);
  });
}

function renderFiltroCursos() {
  const cursos = obtenerCursos();
  selectFiltro.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "todos";
  optAll.textContent = "Todos los cursos";
  selectFiltro.appendChild(optAll);

  cursos.forEach(c => {
    const opt = document.createElement("option");
    opt.value = String(c.id);
    opt.textContent = c.nombre;
    selectFiltro.appendChild(opt);
  });
}

function contarInscripcionesPorCurso(cursoId) {
  const ins = obtenerInscripciones();
  let count = 0;               
  for (const i of ins) {        
    if (String(i.cursoId) === String(cursoId)) {
      count++;
    }
  }
  return count;
}

function renderInscripciones() {
  const cursos = obtenerCursos();
  const inscripciones = obtenerInscripciones();

  const filtro = selectFiltro?.value ?? "todos";
  const listaFiltrada = (filtro === "todos")
    ? inscripciones
    : inscripciones.filter(i => String(i.cursoId) === String(filtro));

 
  let resumenHTML = "";
  if (filtro !== "todos") {
    const curso = cursos.find(c => String(c.id) === String(filtro));
    const totalEnCurso = contarInscripcionesPorCurso(filtro);
    resumenHTML = `
      <p style="margin:8px 0;">
        <em>Mostrando ${listaFiltrada.length} inscripcione(s) en <strong>${curso?.nombre ?? "Curso"}</strong>.
        Total inscriptos en ese curso: ${totalEnCurso}.</em>
      </p>
    `;
  }

  if (!listaFiltrada.length) {
    listaInscripcionesEl.innerHTML = resumenHTML + `<p><strong>No hay inscripciones</strong></p>`;
    return;
  }

  const rows = listaFiltrada.map(i => {
    const curso = cursos.find(c => String(c.id) === String(i.cursoId));
    const cursoNombre = curso?.nombre ?? i.cursoNombre ?? "(curso)";
    const fecha = formatearFecha(i.fecha);
    return `
      <tr data-id="${i.id}">
        <td>${i.nombreCompleto}</td>
        <td>${i.email}</td>
        <td>${i.telefono}</td>
        <td>${i.modalidad}</td>
        <td>${cursoNombre}</td>
        <td>${fecha}</td>
        <td>
          <button class="btn-editar" data-id="${i.id}">Editar</button>
          <button class="btn-eliminar" data-id="${i.id}">Eliminar</button>
        </td>
      </tr>
    `;
  }).join("");

  listaInscripcionesEl.innerHTML = `
    ${resumenHTML}
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Modalidad</th>
          <th>Curso</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}


function onInscribir(e) {
  e.preventDefault();

  
  if (!formInscripcion.checkValidity()) {
    Toastify({ text: "Revisa los datos del formulario", duration: 2500, backgroundColor: "orange" }).showToast();
    return;
  }

  const nombreCompleto = document.getElementById("nombreCompleto").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const modalidad = document.getElementById("modalidad").value;
  const cursoId = selectCurso.value;

  if (!cursoId) {
    Toastify({ text: "Selecciona un curso", duration: 2500, backgroundColor: "orange" }).showToast();
    return;
  }

  const cursos = obtenerCursos();
  const curso = cursos.find(c => String(c.id) === String(cursoId));
  if (!curso) {
    Toastify({ text: "Curso no encontrado", duration: 2500, backgroundColor: "red" }).showToast();
    return;
  }
  if (curso.cuposDisponibles <= 0) {
    Toastify({ text: `No hay cupos disponibles para ${curso.nombre}`, duration: 2500, backgroundColor: "red" }).showToast();
    return;
  }

  const nueva = {
    id: (crypto?.randomUUID?.() ?? String(Date.now())),
    nombreCompleto,
    email,
    telefono,
    modalidad,
    cursoId: String(curso.id),
    cursoNombre: curso.nombre,
    fecha: new Date().toISOString(),
  };

  agregarInscripcion(nueva);
  actualizarCupos(curso.id, -1);

  renderCursosEnSelects();
  renderInscripciones();

  Toastify({
    text: `${nombreCompleto}, te inscribiste a ${curso.nombre}. Quedan ${curso.cuposDisponibles - 0} cupos.`,
    duration: 3000,
    backgroundColor: "green"
  }).showToast();

  formInscripcion.reset();
  selectCurso.selectedIndex = 0;
}

function onListaClick(e) {
  const id = e.target?.dataset?.id;
  if (!id) return;

  if (e.target.classList.contains("btn-eliminar")) {
    eliminarInscripcionIndividual(id);
  } else if (e.target.classList.contains("btn-editar")) {
    abrirModalEdicion(id);
  }
}

function eliminarInscripcionIndividual(id) {
  const ins = obtenerInscripciones().find(x => x.id === id);
  if (!ins) return;

  eliminarInscripcion(id);
  actualizarCupos(ins.cursoId, +1);

  renderCursosEnSelects();
  renderInscripciones();

  Toastify({ text: "Inscripción eliminada", duration: 2500, backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)" }).showToast();
}

function abrirModalEdicion(id) {
  const ins = obtenerInscripciones().find(x => x.id === id);
  if (!ins) return;

  editId.value = ins.id;
  editNombreCompleto.value = ins.nombreCompleto;
  editEmail.value = ins.email;
  editTelefono.value = ins.telefono;
  editModalidad.value = ins.modalidad;
  editCurso.value = String(ins.cursoId);

  modalEdit.style.display = "block";
}

function onGuardarEdicion(e) {
  e.preventDefault();

  if (!formEditar.checkValidity()) {
    Toastify({ text: "Revisa los datos del formulario de edición", duration: 2500, backgroundColor: "orange" }).showToast();
    return;
  }

  const id = editId.value;
  const inscripciones = obtenerInscripciones();
  const original = inscripciones.find(x => x.id === id);
  if (!original) return;

  const nuevoCursoId = editCurso.value;
  const cursos = obtenerCursos();
  const cursoNuevo = cursos.find(c => String(c.id) === String(nuevoCursoId));
  if (!cursoNuevo) {
    Toastify({ text: "Curso seleccionado inválido", duration: 2500, backgroundColor: "red" }).showToast();
    return;
  }

 
  if (String(original.cursoId) !== String(nuevoCursoId)) {
    if (cursoNuevo.cuposDisponibles <= 0) {
      Toastify({ text: `No hay cupos en ${cursoNuevo.nombre}`, duration: 2500, backgroundColor: "red" }).showToast();
      return;
    }
    
    actualizarCupos(original.cursoId, +1);
    actualizarCupos(nuevoCursoId, -1);
  }

  const editada = {
    ...original,
    nombreCompleto: editNombreCompleto.value.trim(),
    email: editEmail.value.trim(),
    telefono: editTelefono.value.trim(),
    modalidad: editModalidad.value,
    cursoId: String(nuevoCursoId),
    cursoNombre: cursoNuevo.nombre,
  };

  editarInscripcion(editada);

  renderCursosEnSelects();
  renderInscripciones();

  modalEdit.style.display = "none";
  Toastify({ text: "Inscripción actualizada", duration: 2500, backgroundColor: "green" }).showToast();
}

function borrarTodas() {
  
  const ins = obtenerInscripciones();
  ins.forEach(i => actualizarCupos(i.cursoId, +1));

  
  window.inscripciones = [];  
  saveInscripciones();        

  
  renderCursosEnSelects();
  renderInscripciones();
  modalConfirm.style.display = "none";

  Toastify({
    text: "Se borraron todas las inscripciones",
    duration: 2500,
    backgroundColor: "linear-gradient(to right, #2193b0, #6dd5ed)"
  }).showToast();
}

async function onResetearCupos() {
  try {
    await resetearCuposDesdeJSON();
    renderCursosEnSelects();
    renderInscripciones();
    Toastify({ text: "Cupos reseteados correctamente.", duration: 3000, backgroundColor: "linear-gradient(to right, #2193b0, #6dd5ed)" }).showToast();
  } catch (err) {
    console.error("Error al resetear cupos:", err);
    Toastify({ text: "Error al resetear cupos. Revisa la consola.", duration: 3000, backgroundColor: "red" }).showToast();
  } finally {
    
  }
}


function formatearFecha(value) {
  if (!value) return "";
  const dt = new Date(value);
  return isNaN(dt.getTime()) ? value : dt.toLocaleDateString();
}