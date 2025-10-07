const mongoose = require('mongoose');
const { Schema } = mongoose;

const categoriaSchema = new Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String, 
        default: '' 
    },
    usuarioId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;