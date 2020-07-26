"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const json_system_1 = __importDefault(require("../classes/json-system"));
const jsonSystem = new json_system_1.default();
// estas ruta esta definida en el index.ts
const helpRoutes = express_1.Router();
/////////////////////// rutas del help/////////////////////////
//////////////////////////////////////
/// ruta  de obtener una ayuda  
// postman : localhost:5000/help/get-help
// en el body ponemos : 
// help : login
helpRoutes.post('/get-help', (req, res) => {
    console.log('entramos en help ');
    const help = req.body.help;
    console.log('el help es ', help);
    jsonSystem.getHelp(help).then((respuesta) => {
        res.status(200).json({
            ok: true,
            help: respuesta
        });
    });
});
helpRoutes.post('/prueba', (req, res) => {
    console.log('entramos en posts prueba');
    res.status(200).json({
        ok: true,
        estado: 'prueba help'
    });
});
exports.default = helpRoutes;
