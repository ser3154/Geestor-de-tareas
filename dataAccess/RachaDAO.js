const Racha = require('../models/Racha');

class RachaDAO {
    constructor() {}

    // CREATE
    async crear(datosRacha) {
        try {
            const nuevaRacha = await Racha.create(datosRacha);
            console.log(`✓ Racha creada con ID: ${nuevaRacha._id}`);
            return nuevaRacha._id;
        } catch (error) {
            console.error('✗ Error al crear racha:', error);
            throw error;
        }
    }

    // READ - Obtener por ID
    async obtenerPorId(id) {
        try {
            const racha = await Racha.findById(id);
            if (racha) {
                console.log('✓ Racha encontrada');
            } else {
                console.log('✗ Racha no encontrada');
            }
            return racha;
        } catch (error) {
            console.error('✗ Error al obtener racha:', error);
            throw error;
        }
    }

    // READ - Obtener todas las de un usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const rachas = await Racha.find({ usuarioId });
            console.log(`✓ Se encontraron ${rachas.length} rachas para el usuario`);
            return rachas;
        } catch (error) {
            console.error('✗ Error al obtener rachas:', error);
            throw error;
        }
    }

    // UPDATE
    async actualizar(id, datos) {
        try {
            const rachaActualizada = await Racha.findByIdAndUpdate(id, datos, { new: true });
            if (rachaActualizada) {
                console.log('✓ Racha actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return rachaActualizada;
        } catch (error) {
            console.error('✗ Error al actualizar racha:', error);
            throw error;
        }
    }

    // DELETE
    async eliminar(id) {
        try {
            const resultado = await Racha.findByIdAndDelete(id);
            if (resultado) {
                console.log('✓ Racha eliminada correctamente');
            } else {
                console.log('✗ Racha no encontrada');
            }
            return resultado;
        } catch (error) {
            console.error('✗ Error al eliminar racha:', error);
            throw error;
        }
    }
}

module.exports = RachaDAO;