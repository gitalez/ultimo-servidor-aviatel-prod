"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const espSchema = new mongoose_1.Schema({
    modelo: {
        type: String,
        unique: true,
        required: [true, 'el modelo es necesario']
    },
    version: {
        type: String,
        required: [true, 'la version es necesaria']
    },
    subtitulo: {
        type: String,
        required: false,
        default: 'sin_subtitulo'
    },
    mac: {
        type: String,
        unique: true,
        required: [true, 'la mac es necesaria']
    },
    creado: {
        type: Date
    },
    revision: {
        type: String,
        required: false,
        default: 'sin_revision'
    },
    descripcion1: {
        type: String,
        required: false,
        default: 'sin_descripcion1'
    },
    descripcion2: {
        type: String,
        required: false,
        default: 'sin_descripcion2'
    },
    url_imagen: {
        type: String,
        required: false,
        default: 'sin_imagen'
    },
    url_manual: {
        type: String,
        required: false,
        default: 'sin_manual'
    },
    hogar: {
        type: String,
        required: false,
        default: 'sin_hogar'
    },
    lugar: {
        type: String,
        required: false,
        default: 'sin_lugar'
    },
    lat: {
        type: Number,
        required: false,
        default: 0
    },
    lng: {
        type: Number,
        required: false,
        default: 0
    },
    invitados: {
        type: Array,
        required: false,
        default: []
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'la referncia al usuario es requerida']
    }
});
// pone la fecha automatica antes de salvar
espSchema.pre('save', function (next) {
    this.creado = new Date();
    next();
});
exports.Esp = mongoose_1.model('Esp', espSchema);
