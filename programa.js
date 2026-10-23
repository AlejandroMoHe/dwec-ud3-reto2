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
function anadeMensajeALogs(logs, mensaje) {
    //Esta función es para facilitar la inserción de los mensajes en logs
    logs.push(mensaje);
}


function iniciarSesion(mapaUsuarios, sesionesActivas, logs, email, pass) {

    // 1. Si el usuario no existe, se registra el fallo y salimos.
    if (!mapaUsuarios.has(email)) {
        anadeMensajeALogs(logs, {
            fecha: new Date().toISOString(),
            email: email,
            accion: "LOGIN",
            resultado: "CREDENCIALES_INVALIDAS"
        });
        return null;
    }

    let usuario = mapaUsuarios.get(email);

    // 2. Si la contraseña no es correcta, se registra el fallo y salimos.
    if (usuario.pass !== pass) {
        anadeMensajeALogs(logs, {
            fecha: new Date().toISOString(),
            email: email,
            accion: "LOGIN",
            resultado: "CREDENCIALES_INVALIDAS"
        });
        return null;
    }

    // 3. Ambas cosas bien: Si el usuario existe y la contraseña es correcta
    let horaActual = Date.now();
    let token = horaActual + "_" + email;

    // Guardamos la sesión.
    sesionesActivas.set(token, {
        email: email,
        fechaCreacion: horaActual
    });

    // Se registra en los logs
    anadeMensajeALogs(logs, {
        fecha: new Date().toISOString(),
        email: email,
        accion: "LOGIN",
        resultado: "EXITO"
    });

    // Se devuelve el token
    return token;

}

function comprobarSesionValida(sesionesActivas, token) {
    //TODO, Juan Francisco Martin
}


function recuperaUsuarioYRol(mapaUsuarios, email) {
    //TODO, Juan Francisco Martin
}


function concedePermiso(mapaPermisosRol, rol, permiso) {
    //TODO, Pedro Silvente
}


function verificarPermiso(mapaUsuarios, mapaPermisosRol, sesionesActivas, logs, token, permisoRequerido) {
    //TODO, Juan Francisco Castillo
}


//-------------------PRINCIPAL--------
// Juan Francisco Castillo y Pedro Silvente
email = prompt("Introduce tu email: ");
password = prompt("Introduce el password: ");
accion = prompt("¿Qué acción quiere realizar (CREAR, LEER, MODIFICAR, ELIMINAR)?: ");
