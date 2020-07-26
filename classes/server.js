"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environments_1 = require("../global/environments");
const path_1 = __importDefault(require("path"));
// clase server 
// default : es lo unico que voy a exportar, exporto el paquete por defecto 
class Server {
    constructor() {
        this.app = express_1.default(); // inicializo app , que ahora tiene todos los metodos de express
        this.port = environments_1.SERVER_PORT;
    }
    // si ya existe una instancia , regresa esa instancia 
    // si no existe o si es la primera vez que se llama a esta funcion 
    // crea una nueva instancia con el this() o Server()
    static get instance() {
        //retorno la _instance si existe o sino 
        // regreso  una _instance al server 
        // this() es equivalente a poner Server()
        return this._instance || (this._instance = new this());
    }
    // una vez ejecutada this.publicFolder() nos da el path para al carpeta publica y levanta un express.static 
    // y muestra el contenido del public/index/html
    // para que muestre los cambios en el html hay que correr en la term del proyecto : npm run html 
    //hace en copyfiles public/*html dist
    publicFolder() {
        // este es el path donde va a estar la carpeta publica
        const publicPath = path_1.default.resolve(__dirname, '../public');
        this.app.use(express_1.default.static(publicPath));
    }
    // METODO PARA LEVANTAR EL SERVIDOR 
    // creamos el metodo start que recibe un callback que se lo pasamos a listen 
    start(callback) {
        this.app.listen(this.port);
        this.publicFolder();
        console.log('Servidor corriendo en el puerto :', this.port);
    }
}
exports.default = Server;
