
const cursos = [
    {
        nombre: "programacion",
        duracion: "3 meses",
        cupos: 5
    },
    {
        nombre: "ingles",
        duracion: "2 meses",
        cupos: 0
    },
    {
        nombre: "matematicas",
        duracion: "6 meses",
        cupos: 2
    }
];
let inscripciones = [];
let cantidadinscritos = 0;

function solicitardatos() {
    let nombre = prompt("ingresa tu nombre: ");
    let edad = parseInt(prompt("ingresa tu edad: "));
    return { nombre, edad };


}
const usuario = solicitardatos();
console.log(usuario);

let nombrecurso = prompt("A que curso te quieres inscribir? (programacion, ingles, matematicas)".toLowerCase());
let cursoelegido = null;
for (let i = 0; i < cursos.length; i++) {
    if (cursos[i].nombre === nombrecurso.toLowerCase()) {
        cursoelegido = cursos[i];
        break;
    }
}

if (cursoelegido !== null) {
    if (usuario.edad < 18) {
        alert("Lo siento, debes tener al menos 18 años para inscribirte.");
    } else {
        if (cursoelegido.cupos > 0) {
            cursoelegido.cupos--;

            inscripciones[cantidadinscritos] = {
                nombre: usuario.nombre,
                edad: usuario.edad,
                curso: cursoelegido.nombre,
            };
            cantidadinscritos++;
            alert("Inscripcion exitosa, te inscribiste a " + cursoelegido.nombre + ". \nCupos restantes: " + cursoelegido.cupos);
        } else {
            alert("Lo sentimos, no hay cupos disponibles para " + cursoelegido.nombre);
        }
    }
} else {
    alert("Curso no valido, por favor verifica el nombre.");    
}





