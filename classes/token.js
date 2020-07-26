"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environments_1 = require("../global/environments");
// las propiedades de esta clase van a ser  estaticas 
// no sera necesario hacer const token = new token  
// colocamos una semilla para incorporar al token 
// el seed es secreto 
// aqui podemos  generar el token, recordar que estamos del lado server
// invocamos al metodo sign
// colocamos la data como un objeto, conocida como payload
// luego una semilla que sera la clave secreta llamada seed
// luego la fecha de expiracion
class Token {
    constructor() {
    }
    // obtenemos el token 
    static getJwtToken(payload) {
        // nos devuelve la firma 
        return jsonwebtoken_1.default.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad });
    }
    // comprobamos el token 
    static comprobarToken(userToken) {
        // resolvemos la comparacion como una promesa 
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, resultado) => {
                if (err) {
                    // no confiar, token no valido
                    reject();
                }
                else {
                    // token valido
                    resolve(resultado);
                }
                ;
            });
        });
    }
}
exports.default = Token;
Token.seed = environments_1.SEED; // inic de la semilla 
Token.caducidad = environments_1.CADTOKEN;
