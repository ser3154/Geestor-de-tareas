const Database = require('./DataBase');

class Racha {
    constructor(database) {
        this.db = database.obtenerDB();
        this.coleccion = this.db.collection('rachas');
    }

    // CREATE - Crear nueva racha
    async crear(usuarioId, tareaId, racha_actual = 1, racha_maxima = 1, ultima_completada = new Date(), estatus = 'activa') {
        try {
            const nuevaRacha = {
                usuarioId: Database.crearObjectId(usuarioId),
                tareaId: Database.crearObjectId(tareaId),
                racha_actual,
                racha_maxima,
                ultima_completada: new Date(ultima_completada),
                estatus
            };
            const resultado = await this.coleccion.insertOne(nuevaRacha);
            console.log(`✓ Racha creada con ID: ${resultado.insertedId}`);
            return resultado.insertedId;
        } catch (error) {
            console.error('✗ Error al crear racha:', error);
            throw error;
        }
    }

    // READ - Obtener rachas por usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const rachas = await this.coleccion.find({
                usuarioId: Database.crearObjectId(usuarioId)
            }).toArray();
            console.log(`✓ Se encontraron ${rachas.length} rachas para el usuario`);
            return rachas;
        } catch (error) {
            console.error('✗ Error al obtener rachas:', error);
            throw error;
        }
    }

    // READ - Obtener racha por ID
    async obtenerPorId(id) {
        try {
            const racha = await this.coleccion.findOne({
                _id: Database.crearObjectId(id)
            });
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

    // READ - Obtener todas las rachas
    async obtenerTodas() {
        try {
            const rachas = await this.coleccion.find({}).toArray();
            console.log(`✓ Se encontraron ${rachas.length} rachas en total`);
            return rachas;
        } catch (error) {
            console.error('✗ Error al obtener todas las rachas:', error);
            throw error;
        }
    }

    // READ - Obtener rachas por tarea
    async obtenerPorTarea(tareaId) {
        try {
            const rachas = await this.coleccion.find({
                tareaId: Database.crearObjectId(tareaId)
            }).toArray();
            console.log(`✓ Se encontraron ${rachas.length} rachas para la tarea`);
            return rachas;
        } catch (error) {
            console.error('✗ Error al obtener rachas por tarea:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar racha
    async actualizar(id, datos) {
        try {
            const resultado = await this.coleccion.updateOne(
                { _id: Database.crearObjectId(id) },
                { $set: datos }
            );
            if (resultado.modifiedCount > 0) {
                console.log('✓ Racha actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return resultado.modifiedCount;
        } catch (error) {
            console.error('✗ Error al actualizar racha:', error);
            throw error;
        }
    }

    // DELETE - Eliminar racha
    async eliminar(id) {
        try {
            const resultado = await this.coleccion.deleteOne({
                _id: Database.crearObjectId(id)
            });
            if (resultado.deletedCount > 0) {
                console.log('✓ Racha eliminada correctamente');
            } else {
                console.log('✗ Racha no encontrada');
            }
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar racha:', error);
            throw error;
        }
    }
}

module.exports = Racha;