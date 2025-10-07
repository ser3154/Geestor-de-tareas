const Tarea = require('../models/Tarea');

class TareaDAO {
    constructor() {}

    // CREATE
    async crear(datosTarea) {
        try {
            // Mongoose usará los valores por defecto del Schema si no vienen datos
            const tareaGuardada = await Tarea.create(datosTarea);
            console.log(`✓ Tarea creada con ID: ${tareaGuardada._id}`);
            return tareaGuardada._id;
        } catch (error) {
            console.error('✗ Error al crear tarea:', error);
            throw error;
        }
    }

    // READ - Obtener por ID
    async obtenerPorId(id) {
        try {
            const tarea = await Tarea.findById(id);
            if (tarea) {
                console.log('✓ Tarea encontrada:', tarea.titulo);
            } else {
                console.log('✗ Tarea no encontrada');
            }
            return tarea;
        } catch (error) {
            console.error('✗ Error al obtener tarea:', error);
            throw error;
        }
    }

    // READ - Obtener todas las de un usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const tareas = await Tarea.find({ usuarioId });
            console.log(`✓ Se encontraron ${tareas.length} tareas para el usuario`);
            return tareas;
        } catch (error) {
            console.error('✗ Error al obtener tareas del usuario:', error);
            throw error;
        }
    }

    // UPDATE
    async actualizar(id, datos) {
        try {
            const tareaActualizada = await Tarea.findByIdAndUpdate(id, datos, { new: true });
            if (tareaActualizada) {
                console.log('✓ Tarea actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return tareaActualizada;
        } catch (error) {
            console.error('✗ Error al actualizar tarea:', error);
            throw error;
        }
    }

    // DELETE
    async eliminar(id) {
        try {
            const resultado = await Tarea.findByIdAndDelete(id);
            if (resultado) {
                console.log('✓ Tarea eliminada correctamente');
            } else {
                console.log('✗ Tarea no encontrada');
            }
            return resultado;
        } catch (error) {
            console.error('✗ Error al eliminar tarea:', error);
            throw error;
        }
    }
}

module.exports = TareaDAO;