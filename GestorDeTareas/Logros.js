const Database = require('./DataBase');

class Logro {
    constructor(database) {
        this.db = database.obtenerDB();
        this.coleccion = this.db.collection('logros');
    }

    // CREATE - Crear nuevo logro
    async crear(usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio) {
        try {
            const nuevoLogro = {
                usuarioId: Database.crearObjectId(usuarioId),
                nombre,
                descripcion,
                icono,
                fecha_otorgado: fecha_otorgado ? new Date(fecha_otorgado) : new Date(),
                criterio // { tipo: String, valor: Number }
            };
            const resultado = await this.coleccion.insertOne(nuevoLogro);
            console.log(`✓ Logro creado con ID: ${resultado.insertedId}`);
            return resultado.insertedId;
        } catch (error) {
            console.error('✗ Error al crear logro:', error);
            throw error;
        }
    }

    // READ - Obtener logros por usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const logros = await this.coleccion.find({
                usuarioId: Database.crearObjectId(usuarioId)
            }).toArray();
            console.log(`✓ Se encontraron ${logros.length} logros para el usuario`);
            return logros;
        } catch (error) {
            console.error('✗ Error al obtener logros:', error);
            throw error;
        }
    }

    // READ - Obtener logro por ID
    async obtenerPorId(id) {
        try {
            const logro = await this.coleccion.findOne({
                _id: Database.crearObjectId(id)
            });
            if (logro) {
                console.log('✓ Logro encontrado:', logro.nombre);
            } else {
                console.log('✗ Logro no encontrado');
            }
            return logro;
        } catch (error) {
            console.error('✗ Error al obtener logro:', error);
            throw error;
        }
    }

    // READ - Obtener todos los logros
    async obtenerTodos() {
        try {
            const logros = await this.coleccion.find({}).toArray();
            console.log(`✓ Se encontraron ${logros.length} logros en total`);
            return logros;
        } catch (error) {
            console.error('✗ Error al obtener todos los logros:', error);
            throw error;
        }
    }

    // DELETE - Eliminar logro
    async eliminar(id) {
        try {
            const resultado = await this.coleccion.deleteOne({
                _id: Database.crearObjectId(id)
            });
            if (resultado.deletedCount > 0) {
                console.log('✓ Logro eliminado correctamente');
            } else {
                console.log('✗ Logro no encontrado');
            }
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar logro:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar logro
    async actualizar(id, datos) {
        try {
            const resultado = await this.coleccion.updateOne(
                { _id: Database.crearObjectId(id) },
                { $set: datos }
            );
            if (resultado.modifiedCount > 0) {
                console.log('✓ Logro actualizado correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return resultado.modifiedCount;
        } catch (error) {
            console.error('✗ Error al actualizar logro:', error);
            throw error;
        }
    }
}

module.exports = Logro;