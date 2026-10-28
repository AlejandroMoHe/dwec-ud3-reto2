//CONSTANTES 
const TIEMPO_EXPIRACION_MS = 30 * 60 * 1000;
const ACCIONES_POSIBLES = ['CREAR', 'LEER', 'MODIFICAR', 'ELIMINAR'];

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
let token = "";
let rol = "";

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

function sesionExiste(sesionesActivas, token, email, permisoRequerido) {
    //TODO, Juan Francisco Martin
    if(!sesionesActivas.has(token)){
        anadeMensajeALogs(logs, {
            fecha: new Date().toISOString(),
            email: email,
            accion: permisoRequerido,
            resultado: "SESION_INEXISTENTE"
        });

        return false;
    }

    return true;
}

function sesionExpirada(sesionesActivas, token, email, permisoRequerido) {
    //TODO, Juan Francisco Martin
    let datos = sesionesActivas.get(token);
    let fechaCreacion = datos.fechaCreacion;
    let tiempoExpirado = (Date.now() - fechaCreacion) >= TIEMPO_EXPIRACION_MS;

    if(tiempoExpirado){
        anadeMensajeALogs(logs, {
            fecha: new Date().toISOString(),
            email: email,
            accion: permisoRequerido,
            resultado: "SESION_CADUCADA"
        });

        return true;
    }

    return false;
}


function recuperaUsuario(sesionesActivas, token) {
    //TODO, Juan Francisco Martin
    if(!sesionesActivas.has(token)){
        return null;
    } 

    let datos = sesionesActivas.get(token);
    return datos.email;
}

function recuperaRol(mapaUsuarios, email){
    //TODO, Juan Francisco Martin
    if(!mapaUsuarios.has(email)){
        return null;
    }

    let datos = mapaUsuarios.get(email);
    return datos.rol;
}


function tienePermisoSolicitado(mapaPermisosRol, rol, email, permisoRequerido) {
    //TODO, Pedro Silvente
    //DENEGADO 
    //Si no existe el rol 
    if(!mapaPermisosRol.has(rol)){
        anadeMensajeALogs(logs, {
            fecha: new Date().toISOString(),
            email: email,
            accion: permisoRequerido,
            resultado: "PERMISO_DENEGADO"
        });

        return false;
    }

    //Si el rol no tiene el permiso 
    let conjuntoPermisos = mapaPermisosRol.get(rol);
    if(!conjuntoPermisos.has(permisoRequerido)){
        anadeMensajeALogs(logs, {
            fecha: new Date().toISOString(),
            email: email,
            accion: permisoRequerido,
            resultado: "PERMISO_DENEGADO"
        });

        return false;
    }

    //PERMITIDO 
    anadeMensajeALogs(logs, {
        fecha: new Date().toISOString(),
        email: email,
        accion: permisoRequerido,
        resultado: "PERMITIDO"
    });
    return true;
}


function verificarPermiso(mapaUsuarios, mapaPermisosRol, sesionesActivas, logs, token, permisoRequerido) {
    //TODO, Juan Francisco Castillo
    //Sesión no existe
    if(!sesionExiste(sesionesActivas, token, "----@-----.com", permisoRequerido)){
        return false;
    }

    //Sesión expirada 
    if(sesionExpirada(sesionesActivas, token, "----@-----.com", permisoRequerido)){
        return false;
    }

    //Recupera usuario y rol 
    let email = recuperaUsuario(sesionesActivas, token);
    let rol = recuperaRol(mapaUsuarios, email);

    //Tiene el permiso solicitado 
    return tienePermisoSolicitado(mapaPermisosRol, rol, email, permisoRequerido);
}

function mostrarHistorialAuditoria(logs){
    //TODO, Juan Francisco Castillo
    console.log("---------------------------------------------------------");
    console.log("                  HISTORIAL DE AUDITORÍA                 ");
    console.log("---------------------------------------------------------");
    
    for(let i=0; i<logs.length; i++){
        console.log((i+1) +". ["+ logs[i].fecha + "] " + logs[i].email + " | " + logs[i].accion + " | " + logs[i].resultado);
    }
}


//-------------------PRINCIPAL--------
// Juan Francisco Castillo y Pedro Silvente
email = prompt("Introduce tu email: ");
password = prompt("Introduce el password: ");

console.log("==========================================================");
console.log("           CONTROL DE ACCESO Y AUTENTICACIÓN              ");
console.log("==========================================================");
token = iniciarSesion(mapaUsuarios, sesionesActivas, logs, email, password);
if(token){
    rol = recuperaRol(mapaUsuarios, email);
    console.log(`[LOGIN OK] ${email} ha iniciado sesión.`);
    console.log(`Token generado: [${token}]`);

    console.log("[VERIFICACIÓN DE PERMISOS]");
    do{
        accion = prompt("¿Qué acción quiere realizar (CREAR, LEER, MODIFICAR, ELIMINAR)?: ");
        accion = accion.trim();
        accion = accion.toUpperCase();
 
        if(verificarPermiso(mapaUsuarios, mapaPermisosRol, sesionesActivas, logs, token, accion)){
            console.log(`Acción: ${accion} | Rol: ${rol} | Resultado: PERMITIDO`);
        }else{
            console.log(`Acción: ${accion} | Rol: ${rol} | Resultado: DENEGADO`);
        }

    } while(accion!=='');

}else{
    console.log(`[LOGIN ERROR] ${email} no ha iniciado sesión.`);
}
mostrarHistorialAuditoria(logs);
console.log("==========================================================");
