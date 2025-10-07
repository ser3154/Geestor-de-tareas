const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Asegura que no haya dos usuarios con el mismo email
    },
    fecha_registro: {
        type: Date,
        default: Date.now // Asigna la fecha actual por defecto
    },
    activo: {
        type: Boolean,
        default: true
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;