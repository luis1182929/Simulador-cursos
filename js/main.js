

document.addEventListener("DOMContentLoaded", async () => {
    await cargarCursos();         
    renderOpcionesCursos();
    mostrarInscripciones();
});

function renderOpcionesCursos() {
    const SelectCurso = document.getElementById("cursoSeleccionado");
    SelectCurso.innerHTML = "";

    
    const opciones = cursos.map(c => ({
        value: c.nombre,
        label: c.cupos > 0
            ? `${c.nombre.toUpperCase()}  ${c.duracion}`
            : `${c.nombre.toUpperCase()}  ${c.duracion} (Sin cupos)`
    }));

    opciones.forEach(op => {
        const option = document.createElement("option");
        option.value = op.value;       
        option.textContent = op.label;
        SelectCurso.appendChild(option);
    });
}

const form = document.getElementById("formInscripcion");
const inscripcionesGuardadas = document.getElementById("inscripcionesGuardadas");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    
    const cursosLS = JSON.parse(localStorage.getItem("cursos"));
    if (Array.isArray(cursosLS)) cursos = cursosLS;

    const nombreUsuario = document.getElementById("nombreUsuario").value.trim();
    const cursoSeleccionado = document.getElementById("cursoSeleccionado").value;
    const curso = cursos.find(c => c.nombre.toLowerCase() === cursoSeleccionado.toLowerCase());

    if (!curso) {
        Toastify({ text: "Curso no encontrado.", duration: 3000, backgroundColor: "red" }).showToast();
        return;
    }
    if (curso.cupos <= 0) {
        const esMP = ["matematicas","programacion"].includes(curso.nombre.toLowerCase());
        Toastify({
            text: esMP ? `Ya no hay más cupos para ${curso.nombre}` : `No hay cupos disponibles para ${curso.nombre}`,
            duration: 3000,
            backgroundColor: "red"
        }).showToast();
        return;
    }

    
    curso.cupos--;

    
    if (["matematicas","programacion"].includes(curso.nombre.toLowerCase()) && curso.cupos === 0) {
        Toastify({
            text: `Ya no hay más cupos para ${curso.nombre}`,
            duration: 3000,
            backgroundColor: "red"
        }).showToast();
    }

    
    guardarCursosEnLocalStorage(); 
    renderOpcionesCursos();

    
    const inscripcion = {
        nombre: nombreUsuario,
        curso: curso.nombre,
        fecha: new Date().toLocaleDateString(),
    };
    guardarEnLocalStorage(inscripcion);
    mostrarInscripciones();

    
    Toastify({
        text: `${nombreUsuario}, te inscribiste a ${cursoSeleccionado}. Quedan ${curso.cupos} cupos disponibles`,
        duration: 3000,
        backgroundColor: "green"
    }).showToast();
});

function mostrarInscripciones() {
    let inscripciones = obtenerInscripciones();
    inscripcionesGuardadas.innerHTML = "<h2>Inscripciones previas:</h2>";
    inscripciones.forEach(inscripcion => {
        const parrafo = document.createElement("p");
        parrafo.textContent = `${inscripcion.nombre} se inscribio en ${inscripcion.curso} el ${inscripcion.fecha}.`;
        inscripcionesGuardadas.appendChild(parrafo);
    });
}

const btnBorrar = document.getElementById("btnBorrar");
const modal = document.getElementById("modalconfirm");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

btnBorrar.addEventListener("click", () => {
    modal.style.display = "block"; 
});

confirmYes.addEventListener("click", () => {
    localStorage.removeItem("inscripciones"); 
    document.getElementById("inscripcionesGuardadas").innerHTML = "";
    modal.style.display = "none"; 
});

confirmNo.addEventListener("click", () => {
    modal.style.display = "none"; 
});

async function resetearCupos() {
    try {
        const resp = await fetch('data/cursos.json');
        if (!resp.ok) throw new Error('No se pudo cargar data/cursos.json');
        const data = await resp.json();

        cursos = data;
        guardarCursosEnLocalStorage();
        renderOpcionesCursos();

        Toastify({
            text: "Cupos reseteados correctamente.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #2193b0, #6dd5ed)"
        }).showToast();
    } catch (error) {
        console.error('Error al resetear cupos:', error);
        Toastify({
            text: "Error al resetear cupos. Revisa la consola.",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red"
        }).showToast();
    }
}

document.getElementById('resetCuposBtn').addEventListener('click', () => {
    resetearCupos();
});