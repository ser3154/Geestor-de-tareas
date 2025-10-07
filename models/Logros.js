const mongoose = require('mongoose');
const { Schema } = mongoose;

const logroSchema = new Schema({
    usuarioId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true 
    },
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        required: true 
    },
    icono: String,
    fecha_otorgado: { 
        type: Date, 
        default: Date.now 
    },
    criterio: {
        tipo: String,
        valor: Number
    }
});

const Logro = mongoose.model('Logro', logroSchema);
module.exports = Logro;