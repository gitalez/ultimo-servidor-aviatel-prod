"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// estas rutas mensajes fueron de prueba , por ahora no se usan
const express_1 = require("express");
//import shortId from 'shortid';
// router es una funcion que me permite crear objetos de tipo Router
const mensajesRoutes = express_1.Router();
// los parametros de la funcion de flecha son los handlres que van a manejar las respuestas 
// este metodo rutas sera  invocado en el middleware  en index.ts
// con metod get 
// en postman : localhost:5000/mensaje1
mensajesRoutes.get('/mensaje1', (req, res) => {
    // respuesta al cliente 
    res.json({
        ok: true,
        mensaje: 'todo bien por get'
    });
});
// con metod post 
// en postman : localhost:5000/mensajes/mensaje2
// tildamos en postman  urlencoded en el body  
// coloco 
//cuerpo : hola
// de : alex
mensajesRoutes.post('/mensaje2', (req, res) => {
    console.log('entramos en mensaje2');
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    // respuesta al cliente 
    res.json({
        ok: true,
        cuerpo: cuerpo,
        de: de
    });
});
/// servicio donde leer un parametro de la url 
// id es un parametro que se pasa por la url 
// con metod post 
// en postman : localhost:5000/mensajes3/abc
// tildamos en postman  urlencoded en el body  
// coloco 
//cuerpo : hola
// de : alex
mensajesRoutes.post('/mensaje3/:id', (req, res) => {
    const id = req.params.id;
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    // respuesta al cliente 
    res.json({
        ok: true,
        cuerpo: cuerpo,
        de: de,
        parametro: id
    });
});
// hay que exportarlo para que el index lo vea
exports.default = mensajesRoutes;
