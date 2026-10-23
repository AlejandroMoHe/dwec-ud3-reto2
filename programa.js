//CONSTANTES 
const mapaPermisosRol = new Map([
    ["ADMIN", new Set(["LEER", "CREAR", "MODIFICAR", "ELIMINAR"])],
    ["EDITOR", new Set(["LEER", "CREAR", "MODIFICAR"])],
    ["INVITADO", new Set(["LEER"])]
]);

const mapaUsuarios = new Map([
    ["admin@empresa.com", {
        nombre: "Sofía Admin",
        pass: "123456",
        rol: "ADMIN"
    }],
    ["editor@empresa.com", {
        nombre: "Carlos Editor",
        pass: "123456",
        rol: "EDITOR"
    }],
    ["invitado@empresa.com", {
        nombre: "Alex Invitado",
        pass: "123456",
        rol: "INVITADO"
    }]
]);

//VARIABLES 
let sesionesActivas = new Map();
let logs = [];

let email = "";
let password = "";
let accion = "";

//FUNCIONES 
function anadeMensajeALogs(logs, mensaje){
    //TODO, Alejandro
}

function iniciarSesion(mapaUsuarios, sesionesActivas, logs, email, pass){
    //TODO, Alejandro
}

function comprobarSesionValida(sesionesActivas, token){
    //TODO, Juan Francisco Martin
}

function recuperaUsuarioYRol(mapaUsuarios, email){
    //TODO, Juan Francisco Martin
}

function concedePermiso(mapaPermisosRol, rol, permiso){
    //TODO, Pedro Silvente
}

function verificarPermiso(mapaUsuarios, mapaPermisosRol, sesionesActivas, logs, token, permisoRequerido){
    //TODO, Juan Francisco Castillo
}

//-------------------PRINCIPAL--------
// Juan Francisco Castillo y Pedro Silvente
email = prompt("Introduce tu email: ");
password = prompt("Introduce el password: ");
accion = prompt("¿Qué acción quiere realizar (CREAR, LEER, MODIFICAR, ELIMINAR)?: ");
