let cursos = [];

function guardarCursosEnLocalStorage() {
    localStorage.setItem("cursos", JSON.stringify(cursos));
}

function obtenerCursosDeLocalStorage() {
    const cursosLS = localStorage.getItem("cursos");
    if (cursosLS) {
        cursos = JSON.parse(cursosLS);
        return true;
    }
    return false;
}

async function cargarCursos() {
    try {
        const cursosCargados = obtenerCursosDeLocalStorage();
        if (!cursosCargados) {
            const response = await fetch("data/cursos.json");
            if (!response.ok) throw new Error("error al cargar cursos");
            cursos = await response.json();
            guardarCursosEnLocalStorage();
        }
    } catch (error) {
        console.error("Error:", error);
        Toastify({
            text: "No se pudieron cargar los cursos",
            duration: 3000,
            backgroundColor: "red",
        }).showToast();
    } finally {
        console.log("Carga de cursos finalizada");
    }
}

function guardarEnLocalStorage(inscripcion) {
    let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
    inscripciones.push(inscripcion);
    localStorage.setItem("inscripciones", JSON.stringify(inscripciones));


}
function obtenerInscripciones() {
    return JSON.parse(localStorage.getItem("inscripciones")) || [];
}

function borrarInscripciones() {
    localStorage.removeItem("inscripciones");
}

const cursosDisponibles = () => cursos.filter(curso=> curso.cupos> 0);