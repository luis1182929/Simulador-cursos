

const cursos = [
    {
        nombre: "Programacion",
        duracion: "3 meses",
        cupos: 5
    },
    {
        nombre: "Ingles",
        duracion: "2 meses",
        cupos: 0
    },
    {
        nombre: "Matematicas",
        duracion: "6 meses",
        cupos: 2
    }
    
];

const SelectCurso = document.getElementById("cursoSeleccionado");
const form = document.getElementById("formInscripcion");
const resultado = document.getElementById("resultado");
const inscripcionesGuardadas = document.getElementById("inscripcionesGuardadas");

function cargarCursos() {
    cursos.forEach(curso => {
        const option = document.createElement("option");
        option.value = curso.nombre;
        option.textContent = `${curso.nombre} ${curso.duracion}`;
        SelectCurso.appendChild(option);
    });
}


form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombreUsuario = document.getElementById("nombreUsuario").value.trim();
    const cursoSeleccionado = SelectCurso.value;
    const curso = cursos.find(curso => curso.nombre === cursoSeleccionado);

    
    const inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
    const yaInscrito = inscripciones.some(insc =>
        insc.nombre.trim().toLowerCase() === nombreUsuario.toLowerCase() &&
        insc.curso === cursoSeleccionado
    );

    if (yaInscrito) {
        mostrarMensaje(`Ya estás inscrito en el curso ${cursoSeleccionado}.`);
        return;
    }

    
    if (curso && curso.cupos > 0) {
        curso.cupos--;

        const inscripcion = {
            nombre: nombreUsuario,
            curso: curso.nombre,
            fecha: new Date().toLocaleDateString(),
        };

        guardarEnLocalStorage(inscripcion);
        mostrarMensaje(`${nombreUsuario}, te inscribiste a ${curso.nombre}. Quedan ${curso.cupos} cupos disponibles`);
        mostrarInscripciones();
        form.reset();
    } else {
        mostrarMensaje(`No hay cupos disponibles para el curso ${cursoSeleccionado}.`);
    }
});





function mostrarInscripciones() {
    let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
    inscripcionesGuardadas.innerHTML = "<h2>Inscripciones previas:</h2>";
    inscripciones.forEach(inscripcion => {
        const parrafoInscripcion = document.createElement("p");
        parrafoInscripcion.textContent = `${inscripcion.nombre} se inscribió en ${inscripcion.curso} el ${inscripcion.fecha}.`;
        inscripcionesGuardadas.appendChild(parrafoInscripcion);
    })
}
function guardarEnLocalStorage(inscripcion) {
    let inscripciones = JSON.parse(localStorage.getItem("inscripciones")) || [];
    inscripciones.push(inscripcion);
    localStorage.setItem("inscripciones", JSON.stringify(inscripciones));
}


function mostrarMensaje(mensaje) {
    resultado.textContent = mensaje;
}


cargarCursos();
mostrarInscripciones();

const btnBorrar = document.getElementById("btnBorrar");

btnBorrar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de que quieres borrar todas las inscripciones?")) {
        localStorage.removeItem("inscripciones");
        mostrarMensaje ("inscripciones borradas exitosamente");
        mostrarInscripciones();
    }
});








