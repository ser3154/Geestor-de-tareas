const Nota = require('../models/Nota');

class NotaDAO {
    constructor() {}

    // CREATE
    async crear(contenido, tipo, usuarioId) {
        try {
            const nuevaNota = { contenido, tipo, usuarioId };
            const notaGuardada = await Nota.create(nuevaNota);
            console.log(`✓ Nota creada con ID: ${notaGuardada._id}`);
            return notaGuardada._id;
        } catch (error) {
            console.error('✗ Error al crear nota:', error);
            throw error;
        }
    }

    // READ - Obtener por ID
    async obtenerPorId(id) {
        try {
            const nota = await Nota.findById(id);
            if (nota) {
                console.log('✓ Nota encontrada:', nota.contenido.substring(0, 50) + '...');
            } else {
                console.log('✗ Nota no encontrada');
            }
            return nota;
        } catch (error) {
            console.error('✗ Error al obtener nota:', error);
            throw error;
        }
    }

    // READ - Obtener todas las de un usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const notas = await Nota.find({ usuarioId }).sort({ fecha_creacion: -1 });
            console.log(`✓ Se encontraron ${notas.length} notas para el usuario`);
            return notas;
        } catch (error) {
            console.error('✗ Error al obtener notas del usuario:', error);
            throw error;
        }
    }

    // UPDATE
    async actualizar(id, datos) {
        try {
            const notaActualizada = await Nota.findByIdAndUpdate(id, datos, { new: true });
            if (notaActualizada) {
                console.log('✓ Nota actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return notaActualizada;
        } catch (error) {
            console.error('✗ Error al actualizar nota:', error);
            throw error;
        }
    }

    // DELETE
    async eliminar(id) {
        try {
            const resultado = await Nota.findByIdAndDelete(id);
            if (resultado) {
                console.log('✓ Nota eliminada correctamente');
            } else {
                console.log('✗ Nota no encontrada');
            }
            return resultado;
        } catch (error) {
            console.error('✗ Error al eliminar nota:', error);
            throw error;
        }
    }
}

module.exports = NotaDAO;