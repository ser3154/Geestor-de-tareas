const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

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
    password: {
        type: String,
        required: true,
        minlength: 8,
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

// Hashear la contraseña antes de guardar si se ha modificado
usuarioSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

// Metodo para comparar una contraseña en texto plano con la almacenada
usuarioSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};



const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;