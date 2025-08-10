document.addEventListener("DOMContentLoaded", async () => {
    await cargarCursos();
    renderOpcionesCursos();
    mostrarInscripciones();
});

function renderOpcionesCursos() {
    const SelectCurso = document.getElementById("cursoSeleccionado");
    SelectCurso.innerHTML = "";

    const cursosFormateados = cursos.map(curso => {
        return {
            ...curso,
            nombre: curso.nombre.toUpperCase(),
            textoMostrar: curso.cupos > 0 ? curso.nombre.toUpperCase() + `  ${curso.duracion}` : curso.nombre.toUpperCase() + `  ${curso.duracion} (Sin cupos)`
        };
    });






    cursosFormateados.forEach(curso => {
        const option = document.createElement("option");
        option.value = curso.nombre;
        option.textContent = curso.textoMostrar;
        SelectCurso.appendChild(option);
    });
    

   
}

const form = document.getElementById("formInscripcion");
const resultado = document.getElementById("resultado");
const inscripcionesGuardadas = document.getElementById("inscripcionesGuardadas");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombreUsuario = document.getElementById("nombreUsuario").value.trim();
    const cursoSeleccionado = document.getElementById("cursoSeleccionado").value;
    const curso = cursos.find(curso => curso.nombre.toLowerCase() === cursoSeleccionado.toLowerCase());

    const inscripciones = obtenerInscripciones();
    const yaInscrito = inscripciones.some(insc =>
        insc.nombre.trim().toLowerCase() === nombreUsuario.toLowerCase() &&
        insc.curso === cursoSeleccionado
    );

    if (yaInscrito) {
        Toastify({
            text: `Ya estás inscrito en el curso ${cursoSeleccionado}.`,
            duration: 3000,
            backgroundColor: "orange",
        }).showToast();
        return;
    }

    if (curso && curso.cupos > 0) {
        curso.cupos--;
        guardarCursosEnLocalStorage();
    
       
    

        const inscripcion = {
            nombre: nombreUsuario,
            curso: curso.nombre,
            fecha: new Date().toLocaleDateString(),
        };

        guardarEnLocalStorage(inscripcion);
        mostrarInscripciones();
        form.reset();

        Toastify({
            text: `${nombreUsuario}, te inscribiste a ${cursoSeleccionado}. Quedan ${curso.cupos} cupos disponibles`,
            duration: 3000,
            backgroundColor: "green",
        }).showToast();


    }
    else {
        Toastify({
            text: `No hay cupos disponibles para el curso ${cursoSeleccionado}.`,
            duration: 3000,
            backgroundColor: "red",
        }).showToast();
    }
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

cargarCursos().then(() => {
    
    console.log(cursosDisponibles()); 
});