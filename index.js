"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const json_system_1 = __importDefault(require("./classes/json-system"));
const environments_1 = require("./global/environments");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mqtt_1 = require("mqtt");
// rutas
const mensajes_1 = __importDefault(require("./rutas/mensajes"));
const usuario_1 = __importDefault(require("./rutas/usuario"));
const esp_1 = __importDefault(require("./rutas/esp"));
const app = "aws_aviatel_server";
console.log(`esta app se llama ${app}`);
// instanciamos la clase Server
//const server = new Server(); // solo si el constructor no es privado
// en el singleton instanciamos la calses erver asi :
const server = server_1.default.instance;
/// un middleware es una funcion que se ejecuta antes de otra
/// body-parser
// lo que sea que me posteen , tomalo y genera un obj de java script
// config body.parser en el middle para enviar urlencoded
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
// config body.parser en el middle para enviar formatos json
server.app.use(body_parser_1.default.json());
// fileupload : toma los archivos  y los coloca en files 
server.app.use(express_fileupload_1.default());
// cors
// cualquera puede llamar a mis servicios
server.app.use(cors_1.default({ origin: true, credentials: true }));
//invocamos al middle use para la cte mensajes
//significa : que este pendiente del path /mensajes,
// y cuando haga la peticion a /mensajes , que trabaje con la ruta mensajes
server.app.use('/mensajes', mensajes_1.default);
//invocamos al middle use para la cte usuario
// significa : que este pendiente del path /usuario , 
// y cuando se haga la peticion a /usuario ,trabaje con la ruta usuario
server.app.use('/usuario', usuario_1.default);
//invocamos al middle use para la cte esp
// significa : que este pendiente del path /esp , 
// y cuando se haga la peticion a /esp , trabaje con la ruta esp
server.app.use('/esp', esp_1.default);
// conectar base de datos mongo
//  {} es una configuracion de mongoose 
// si la bd de la urldb no existe la crea 
mongoose_1.default.connect(environments_1.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
        console.log('ERROR DE MOMGO!!!!!!!!');
        throw err; // tira un error y no sigue 
    }
    console.log('Base de datos MONGO Online!!!!!');
});
const json = new json_system_1.default(); // inicializo la clase json-system
// web_client y mt_1234 : son los creados en users_mqtt en la DB
var opciones = {
    port: 1883,
    host: 'gearmov.com.ar',
    clienteId: 'access_control_server_' + Math.round(Math.random() * (0 - 10000) * -1),
    username: 'web_client',
    password: 'mt_1234',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8',
};
const cliente_mqtt = mqtt_1.connect("mqtt://gearmov.com.ar", opciones);
// escuchamos conexion a mqtt
cliente_mqtt.on('connect', () => {
    console.log("conexion MQTT existosa!");
    // me subscribo a todos los topicos con +/# ( en desarrollo viene bien )
    // luego en produccion veo a quien subscribirme
    cliente_mqtt.subscribe('+/#', (err) => {
        console.log("subscripcion a todos los topicos: exitosa!");
        if (err)
            throw err;
    });
});
// escuchamos cuando se recibe un mensaje
cliente_mqtt.on('message', (topico, mensaje) => {
    // topico viene string puro , pero mensaje viene como un obj , lo paso por tostring para  dejarlo puro
    console.log("mensaje recibido desde --> " + topico + " mensaje  --> " + mensaje.toString());
}); // fin cliente-on
///////// creamos el server  ////////////
// arrancamos el server , la funcion fecha es un callback
// start esta en classes/server.ts
server.start(() => {
    console.log(`Servidor corriendo en el puerto : ${server.port}`);
});
