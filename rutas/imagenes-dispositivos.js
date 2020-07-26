"use strict";
// ruta encargada de entregar al cliente las imagenes que estan en assets/img-disp
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// estas ruta esta definida en el index.ts
const imgDispRoutes = express_1.Router();
/////////////////////// rutas de imgagenes de los dispositivos/////////////////////////
// este servicio sera invocado por el pipe del cliente  con la etiqueta src el html 
//////////////////////////////////////
// esto tiene que estar en dist , que es donde esta el nodemon corriendo 
// postman : localhost:5000/img-disp/obteneImg/central-AIO-LEBAT-V1.png
// postman : localhost:5000/img-disp/obtenerImg/central-AIO-COR-V1.png
//
imgDispRoutes.get('/obtenerImg/:img', (req, res) => {
    console.log('ingresamos a imagenes de dispositivos ');
    let img = req.params.img;
    // cargamos un path para ver si la imagen existe 
    // dirname contiene toda la ruta donde estoy en este 
    //momento independiente si estoy en local o en un host como heroku
    let pathImagen = path_1.default.resolve(__dirname, `../assets/imagenes-dispositivos/${img}`);
    if (fs_1.default.existsSync(pathImagen)) {
        res.sendFile(pathImagen); // envio al cliente/ postman  el path de la imagen
    }
    else {
        // no existe , regresamos el noimg
        // obtenmos el path no image
        let pathNoImagen = path_1.default.resolve(__dirname, '../assets/no-img.jpg'); // existe en  la api 
        res.sendFile(pathNoImagen);
    }
});
exports.default = imgDispRoutes;
