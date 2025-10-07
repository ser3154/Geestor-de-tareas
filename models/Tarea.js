const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schema para los recordatorios
const recordatorioSchema = new Schema({
    fecha_hora: { type: Date, required: true },
    tipo: { type: String, default: 'notificacion' },
    estado: { type: String, default: 'pendiente' }
}, { _id: false }); // _id: false para que no cree IDs para cada recordatorio

// Schema principal de la Tarea
const tareaSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        default: ''
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_vencimiento: {
        type: Date,
        default: null
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en_progreso', 'completada'],
        default: 'pendiente'
    },
    prioridad: {
        type: String,
        enum: ['baja', 'media', 'alta'],
        default: 'media'
    },
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        categoriaId: { type: Schema.Types.ObjectId, ref: 'Categoria' },
        nombre: String
    },
    recordatorios: [recordatorioSchema] // Array de recordatorios
});

const Tarea = mongoose.model('Tarea', tareaSchema);

module.exports = Tarea;