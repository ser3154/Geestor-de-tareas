const mongoose = require('mongoose');
const { Schema } = mongoose;

const notaSchema = new Schema({
    contenido: {
        type: String,
        required: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    tipo: {
        type: String,
        default: 'general'
    },
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

const Nota = mongoose.model('Nota', notaSchema);

module.exports = Nota;