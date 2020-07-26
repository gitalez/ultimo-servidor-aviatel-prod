"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const environments_1 = require("../global/environments");
const autenticacion_1 = require("../middlewares/autenticacion");
const uniqid_1 = __importDefault(require("uniqid"));
// Routes es una funcion que me permite crear objetos de tipo Router
const userRoutes = express_1.Router();
/////////////////////// rutas de usuario /////////////////////////
/// ruta para crear un usuario 
// postman : localhost:5000/usuario/crear
// cuando creamos un usuario nuevo , generamos un token y se lo enviamos a la app que lo solicito
// obligatorios en el body del cliente: nombre, email, password, role
userRoutes.post('/crear', (req, res) => {
    const body = req.body;
    // generamos el dealer code de 6 digitos 
    const idDealer = uniqid_1.default();
    const largo = idDealer.length;
    let idTemp = idDealer.substr(largo - 4, 3);
    let dealerCode = `${idTemp}${new Date().getMilliseconds()}`;
    console.log('el code dealer es :', dealerCode);
    // defino la info de un user que viene del post 
    // para luego salvarlo en mongo
    const user = {
        nombre: body.nombre,
        email: body.email,
        password: bcrypt_1.default.hashSync(body.password, 10),
        role: body.role,
        imagen: body.imagen,
        dealerCode: dealerCode
    };
    /// grabo en base de datos DB el user , me devuelve un userDB
    usuario_model_1.Usuario.create(user).then((userDB) => __awaiter(void 0, void 0, void 0, function* () {
        // en userDB esta el id del usuario , 
        //si quiero que me de toda la info del usuario
        // hago un execPopulate, como execPopulate es una promesa paso a userDB 
        //por un async await 
        // para que el .json espere a que se ejecute esa promesa 
        // el populate no traera estos campos 
        const noTraer = '-passwordTemporal -emailEncriptado -cuentaVerificada';
        yield userDB.populate('usuario', noTraer).execPopulate();
        // si fue creado, contruyo un payload con el userDB
        const payload = {
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            imagen: userDB.imagen
        };
        // y con el payload genero un token  y se lo envio al cliente como respuesta 
        const tokenUser = token_1.default.getJwtToken(payload);
        /// respuesta positiva 
        res.status(200).json({
            ok: true,
            mensaje: " usuario creado",
            token: tokenUser
        });
    }))
        .catch((err) => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'error al crear un usuario',
                error: err
            });
        }
    });
}); // end crear
//////////////////////////////////////
/// ruta para update de un usuario 
// postman : localhost:5000/update
// este metodo no se deberia ejecutar a menos que el token sea valido
// creamos un  middleware para su verificacion 
// postman : localhost:5000/update 
// colocar en los headers de postman x-token : al token entregado cuando se crea o loguea el usuario 
userRoutes.post('/update', [autenticacion_1.verificaToken], (req, res) => {
    console.log('entramos en user update');
    // en el req viene a info que esta en el payload que entrega verificaToken
    // lo que ponemos aqui es lo que se va a actualizar
    // el ep || es por si algun campo viene vacio 
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        imagen: req.body.imagen || req.usuario.imagen
    };
    // actualizamos al usuario
    // con new: true me envia mongoose la base actualizada 
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userUpdate) => {
        if (err) {
            return res.status(500).json({
                // internal server error
                ok: false,
                mensaje: "error en BD al actualizar",
                errors: err
            });
        }
        if (!userUpdate) {
            return res.status(400).json({
                ok: false,
                mensaje: "el usuario a actualizar no existe",
                errors: err
            });
        }
        //genero un nuevo token, porque puede ser que al actualizar 
        //el usuario se cambiaron los datos del payload 
        const tokenUser = token_1.default.getJwtToken({
            _id: userUpdate._id,
            nombre: userUpdate.nombre,
            email: userUpdate.email,
            imagen: userUpdate.imagen
        });
        // respondo al cliente una respuesta positiva
        res.status(200).json({
            ok: true,
            mensaje: "actualizacion correcta",
            usuario: userUpdate,
            id: userUpdate._id,
            token: tokenUser,
            caducidad: environments_1.CADTOKEN
        });
    });
});
// ruta para obtener la info del usuario por su token
// postman : localhost:5000/usuario/token
// si el token no es valido verificatoken se encarga de poner :
//   "ok": false,
//   "mensaje": "token no valido"
userRoutes.get('/token', [autenticacion_1.verificaToken], (req, res) => {
    console.log('entramos en user token');
    const usuario = req.usuario; // viene en el req gracias al verificatoken 
    res.status(200).json({
        ok: true,
        mensaje: "token obtenido",
        usuario: usuario
    });
});
/// ruta de prueba para probar
// postman : localhost:5000/prueba
userRoutes.get('/prueba_usuario', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'ruta usuario ok'
    });
});
// para probar luego !!!! , aparententemente ante un usuario creado hace un post de cierta informacion que quiere postear 
userRoutes.post('/create_posteo', (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.create(body).then((userDB) => __awaiter(void 0, void 0, void 0, function* () {
        // en userDB esta el id del usuario , si quiero que me de toda la info del usuario
        // hago un populate , como populate es una promesa paso a userDB por un async await 
        // para que el .json espere a que se ejecute esa promesa 
        const noTraer = '-passwordTemporal -emailEncriptado -cuentaVerificada'; // el execpopulate no traera estos campos 
        yield userDB.populate('usuario', noTraer).execPopulate();
        res.status(202).json({
            ok: true,
            post: userDB
        });
    }))
        .catch(err => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'error al crear un usuario',
                error: err
            });
        }
    });
});
// hay que exportarlo para que el index lo vea
exports.default = userRoutes;
