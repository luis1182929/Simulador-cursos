
let cursos = [];
let inscripciones = [];

const LS_KEYS = {
  cursos: "cursos",
  inscripciones: "inscripciones",
};


function saveCursos() {
  localStorage.setItem(LS_KEYS.cursos, JSON.stringify(cursos));
}
function saveInscripciones() {
  localStorage.setItem(LS_KEYS.inscripciones, JSON.stringify(inscripciones));
}
function loadCursosDesdeLS() {
  const raw = localStorage.getItem(LS_KEYS.cursos);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
function loadInscripcionesDesdeLS() {
  const raw = localStorage.getItem(LS_KEYS.inscripciones);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}


function toSlug(str) {
  return str
    ?.normalize("NFD")
    ?.replace(/\p{Diacritic}/gu, "")
    ?.toLowerCase()
    ?.trim();
}


function normalizarCursos(data) {
  return data.map((c, idx) => {
    const tot = Number(c.cuposTotales ?? c.cupos ?? 0);
    const disp = Number(c.cuposDisponibles ?? c.cupos ?? 0);
    return {
      id: c.id ?? idx + 1,
      nombre: c.nombre,
      slug: c.slug ?? toSlug(c.nombre),
      duracion: c.duracion ?? "",
      cuposTotales: tot,
      cuposDisponibles: Math.min(disp, tot),
    };
  });
}


async function cargarCursos() {
  try {
    const desdeLS = loadCursosDesdeLS();
    if (desdeLS && Array.isArray(desdeLS) && desdeLS.length) {
      cursos = normalizarCursos(desdeLS);
    } else {
      const response = await fetch("data/cursos.json");
      if (!response.ok) throw new Error("No se pudo cargar data/cursos.json");
      const data = await response.json();
      cursos = normalizarCursos(data);
      saveCursos();
    }
  } catch (err) {
    console.error("Error al cargar cursos:", err);
    Toastify({ text: "No se pudieron cargar los cursos", duration: 3000, backgroundColor: "red" }).showToast();
  }
}


function cargarInscripciones() {
  inscripciones = loadInscripcionesDesdeLS();
}


function actualizarCupos(cursoId, delta) {
  const c = cursos.find(x => String(x.id) === String(cursoId));
  if (!c) return;
  c.cuposDisponibles = Math.max(0, Math.min(c.cuposTotales, c.cuposDisponibles + delta));
  saveCursos();
}


function obtenerCursos() { return cursos; }
function obtenerInscripciones() { return inscripciones; }

function agregarInscripcion(nueva) {
  inscripciones.push(nueva);
  saveInscripciones();
}

function editarInscripcion(editada) {
  const idx = inscripciones.findIndex(i => i.id === editada.id);
  if (idx !== -1) {
    inscripciones[idx] = editada;
    saveInscripciones();
  }
}

function eliminarInscripcion(id) {
  inscripciones = inscripciones.filter(i => i.id !== id);
  saveInscripciones();
}

async function resetearCuposDesdeJSON() {
  const resp = await fetch('data/cursos.json');
  if (!resp.ok) throw new Error('No se pudo cargar data/cursos.json');
  const data = await resp.json();
  cursos = normalizarCursos(data);
  saveCursos();
}


window.cargarCursos = cargarCursos;
window.cargarInscripciones = cargarInscripciones;
window.obtenerCursos = obtenerCursos;
window.obtenerInscripciones = obtenerInscripciones;
window.agregarInscripcion = agregarInscripcion;
window.editarInscripcion = editarInscripcion;
window.eliminarInscripcion = eliminarInscripcion;
window.actualizarCupos = actualizarCupos;
window.resetearCuposDesdeJSON = resetearCuposDesdeJSON;
window.saveCursos = saveCursos;
window.saveInscripciones = saveInscripciones;