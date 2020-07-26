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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const esp_model_1 = require("../models/esp.model");
// estas ruta tiene que estar definida en el index.ts
const espRoutes = express_1.Router();
/////////////////////// rutas de esp /////////////////////////
/// ruta para crear un esp
// postman : localhost:5000/esp/crear
// obligatorios en el body del cliente: modelo, version
espRoutes.post('/crear', (req, res) => {
    console.log('entramos en crear esp32');
    const body = req.body;
    esp_model_1.Esp.create(body).then((espDB) => __awaiter(void 0, void 0, void 0, function* () {
        // en espDB esta el id del usuario , si quiero que me de toda la info del usuario
        // hago un execPopulate , como execPopulate es una promesa paso a esptDB por un async await 
        // para que el .json espere a que se ejecute esa promesa 
        // el populate no traera estos campos 
        const noTraer = '-passwordTemporal -emailEncriptado -cuentaVerificada';
        yield espDB.populate('usuario', noTraer).execPopulate();
        res.status(200).json({
            ok: true,
            mensaje: "esp creado",
            esp: espDB
        });
    }))
        .catch(err => {
        if (err) {
            res.status(400).json({
                ok: false,
                mensaje: 'error al crear el esp',
                error: err
            });
        }
    });
});
//////////////////////////////////////
/// ruta para obtener un esp a partir de su version 
// postman : localhost:5000/esp/getEsp/AIO-COR-V1.0.0  .... para server de la PC
// postman : http://www.gearmov:5000/getEsp/AIO-COR-V1.0.0  .... para server en vps
// postman : localhost:5000/esp/getEsp/AIO-LEBAT-V1.0.0  .... para server de la  PC
// postman : http://www.gearmov:5000/getEso/AIO-LEBAT-V1.0.0  .... para server en el vps
espRoutes.get('/getEsp/:version', (req, res) => {
    console.log('entramos para obtener el esp');
    //  el params es lo que viene en la url como parametro para rescatarlo de la url
    const version = req.params.version;
    const dispo = esp_model_1.Esp.find({ 'version': version }).exec();
    res.status(200).json({
        ok: true,
        mensaje: " obtencion correcta",
        esp: dispo
    });
});
espRoutes.post('/prueba', (req, res) => {
    console.log('entramos en posts prueba');
    res.status(200).json({
        ok: true,
        estado: ' esp prueba'
    });
});
exports.default = espRoutes;
/////////////////////// rutas de post /////////////////////////
//////////////////////////////////////
/// ruta para crear un dispositivo : lo creamos desde postman , para no craer una app que lo haga 
// postman : localhost:5000/dispositivo/crear  .... para la PC
// postman : htp://www.www.www.www:5000/dispositivo/crear  .... para el vps 
//modelo:  string; AIO-COR
//version: string; AIO-COR-V1.0.0
//revision:  string ; en postman poner fecha del dia que se crea esta version 
//subtitulo: string; Central para portones corredizos 
//url_imagen: string; localhost:5000/assets/imagenes-dispositivos/central-AIO-COR.V3.png
//url_manual: string; localhost:5000/assets/manuales/CPI200+IProg_minimanual_v201.pdf
//descripcion1: string; AIO-COR ha sido diseñada para ser instalada en portones corredizos de hasta 1000 kg de peso
//descripcion2: string; Posee conectividad  en Bluetooth como en Wifi permitiendo  conectarse con la app de su celular
//url_imagen: string; localhost:5000/assets/imagenes-dispositivos/central-AIO-LEBAT.V1.png
//url_manual: string; localhost:5000/assets/manuales/CPI100+IProg_minimanual_v202.pdf
