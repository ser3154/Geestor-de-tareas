const Logro = require('../models/Logros');

class LogroDAO {
    constructor() {}

    // CREATE - ✅ CORREGIDO: Usa Logro.create() en lugar de insertOne
    async crear(usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio) {
        try {
            const nuevoLogro = {
                usuarioId,
                nombre,
                descripcion,
                icono,
                fecha_otorgado,
                criterio
            };
            const logroGuardado = await Logro.create(nuevoLogro); // ✅ Mongoose method
            console.log(`✔ Logro creado con ID: ${logroGuardado._id}`);
            return logroGuardado._id;
        } catch (error) {
            console.error('✗ Error al crear logro:', error);
            throw error;
        }
    }

    // READ - Obtener por usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const logros = await Logro.find({ usuarioId: usuarioId });
            console.log(`✔ Se encontraron ${logros.length} logros para el usuario`);
            return logros;
        } catch (error) {
            console.error('✗ Error al obtener logros:', error);
            throw error;
        }
    }

    // READ - Obtener todos los logros
    async obtenerTodosLosLogros() {
        try {
            const logros = await Logro.find();
            console.log(`✔ Se encontraron ${logros.length} logros en total`);
            return logros;
        } catch (error) {
            console.error('✗ Error al obtener todos los logros:', error);
            throw error;
        }
    }

    // READ - Obtener por ID
    async obtenerPorId(id) {
        try {
            const logro = await Logro.findById(id);
            if (logro) {
                console.log('✔ Logro encontrado:', logro.nombre);
            } else {
                console.log('✗ Logro no encontrado');
            }
            return logro;
        } catch (error) {
            console.error('✗ Error al obtener logro:', error);
            throw error;
        }
    }
    
    // UPDATE
    async actualizar(id, datos) {
        try {
            const resultado = await Logro.findByIdAndUpdate(id, datos, { new: true });
            if (resultado) {
                console.log('✔ Logro actualizado correctamente');
            } else {
                console.log('✗ No se realizaron cambios o no se encontró el logro');
            }
            return resultado;
        } catch (error) {
            console.error('✗ Error al actualizar logro:', error);
            throw error;
        }
    }

    // DELETE
    async eliminar(id) {
        try {
            const resultado = await Logro.findByIdAndDelete(id);
            if (resultado) {
                console.log('✔ Logro eliminado correctamente');
            } else {
                console.log('✗ Logro no encontrado');
            }
            return resultado;
        } catch (error) {
            console.error('✗ Error al eliminar logro:', error);
            throw error;
        }
    }
}

module.exports = new LogroDAO();