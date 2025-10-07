const mongoose = require('mongoose');
const { Schema } = mongoose;

const rachaSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tareaId: {
        type: Schema.Types.ObjectId,
        ref: 'Tarea',
        required: true
    },
    racha_actual: {
        type: Number,
        default: 1
    },
    racha_maxima: {
        type: Number,
        default: 1
    },
    ultima_completada: {
        type: Date,
        default: Date.now
    },
    estatus: {
        type: String,
        enum: ['activa', 'rota'],
        default: 'activa'
    }
});

const Racha = mongoose.model('Racha', rachaSchema);

module.exports = Racha;