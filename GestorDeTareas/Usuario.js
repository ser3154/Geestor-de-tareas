const Database = require('./DataBase');

class Usuario {
    constructor(database) {
        this.db = database.obtenerDB();
        this.coleccion = this.db.collection('usuarios');
    }

    // CREATE - Crear nuevo usuario
    async crear(nombre, email) {
        try {
            const nuevoUsuario = {
                nombre: nombre,
                email: email,
                fecha_registro: new Date(),
                activo: true
            };

            const resultado = await this.coleccion.insertOne(nuevoUsuario);
            console.log(`✓ Usuario creado con ID: ${resultado.insertedId}`);
            return resultado.insertedId;
        } catch (error) {
            console.error('✗ Error al crear usuario:', error);
            throw error;
        }
    }

    // READ - Obtener usuario por ID
    async obtenerPorId(id) {
        try {
            const usuario = await this.coleccion.findOne({ 
                _id: Database.crearObjectId(id) 
            });
            
            if (usuario) {
                console.log('✓ Usuario encontrado:', usuario.nombre);
            } else {
                console.log('✗ Usuario no encontrado');
            }
            return usuario;
        } catch (error) {
            console.error('✗ Error al obtener usuario:', error);
            throw error;
        }
    }

    // READ - Obtener todos los usuarios
    async obtenerTodos() {
        try {
            const usuarios = await this.coleccion.find({}).toArray();
            console.log(`✓ Se encontraron ${usuarios.length} usuarios`);
            return usuarios;
        } catch (error) {
            console.error('✗ Error al obtener usuarios:', error);
            throw error;
        }
    }

    // READ - Obtener usuario por email
    async obtenerPorEmail(email) {
        try {
            const usuario = await this.coleccion.findOne({ email: email });
            if (usuario) {
                console.log('✓ Usuario encontrado por email:', usuario.nombre);
            }
            return usuario;
        } catch (error) {
            console.error('✗ Error al buscar usuario por email:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar usuario
    async actualizar(id, datos) {
        try {
            const resultado = await this.coleccion.updateOne(
                { _id: Database.crearObjectId(id) },
                { $set: datos }
            );

            if (resultado.modifiedCount > 0) {
                console.log('✓ Usuario actualizado correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return resultado.modifiedCount;
        } catch (error) {
            console.error('✗ Error al actualizar usuario:', error);
            throw error;
        }
    }

    // UPDATE - Activar/Desactivar usuario
    async cambiarEstado(id, activo) {
        try {
            return await this.actualizar(id, { activo: activo });
        } catch (error) {
            console.error('✗ Error al cambiar estado del usuario:', error);
            throw error;
        }
    }

    // DELETE - Eliminar usuario
    async eliminar(id) {
        try {
            const resultado = await this.coleccion.deleteOne({ 
                _id: Database.crearObjectId(id) 
            });

            if (resultado.deletedCount > 0) {
                console.log('✓ Usuario eliminado correctamente');
            } else {
                console.log('✗ Usuario no encontrado');
            }
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar usuario:', error);
            throw error;
        }
    }

    // READ - Contar usuarios activos
    async contarActivos() {
        try {
            const count = await this.coleccion.countDocuments({ activo: true });
            console.log(`✓ Usuarios activos: ${count}`);
            return count;
        } catch (error) {
            console.error('✗ Error al contar usuarios:', error);
            throw error;
        }
    }
}

module.exports = Usuario;