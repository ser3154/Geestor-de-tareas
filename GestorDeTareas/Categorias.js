// Categoria.js
const Database = require('./DataBase');

class Categoria {
    constructor(database) {
        this.db = database.obtenerDB();
        this.coleccion = this.db.collection('categorias');
    }

    // CREATE - Crear nueva categoría
    async crear(nombre, color, descripcion, usuarioId) {
        try {
            const nuevaCategoria = {
                nombre: nombre,
                color: color,
                descripcion: descripcion || '',
                usuarioId: Database.crearObjectId(usuarioId)
            };

            const resultado = await this.coleccion.insertOne(nuevaCategoria);
            console.log(`✓ Categoría creada con ID: ${resultado.insertedId}`);
            return resultado.insertedId;
        } catch (error) {
            console.error('✗ Error al crear categoría:', error);
            throw error;
        }
    }

    // READ - Obtener categoría por ID
    async obtenerPorId(id) {
        try {
            const categoria = await this.coleccion.findOne({ 
                _id: Database.crearObjectId(id) 
            });
            
            if (categoria) {
                console.log('✓ Categoría encontrada:', categoria.nombre);
            } else {
                console.log('✗ Categoría no encontrada');
            }
            return categoria;
        } catch (error) {
            console.error('✗ Error al obtener categoría:', error);
            throw error;
        }
    }

    // READ - Obtener todas las categorías de un usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const categorias = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            }).toArray();
            
            console.log(`✓ Se encontraron ${categorias.length} categorías para el usuario`);
            return categorias;
        } catch (error) {
            console.error('✗ Error al obtener categorías del usuario:', error);
            throw error;
        }
    }

    // READ - Obtener todas las categorías
    async obtenerTodas() {
        try {
            const categorias = await this.coleccion.find({}).toArray();
            console.log(`✓ Se encontraron ${categorias.length} categorías en total`);
            return categorias;
        } catch (error) {
            console.error('✗ Error al obtener todas las categorías:', error);
            throw error;
        }
    }

    // READ - Buscar categoría por nombre
    async buscarPorNombre(usuarioId, nombre) {
        try {
            const categoria = await this.coleccion.findOne({ 
                usuarioId: Database.crearObjectId(usuarioId),
                nombre: nombre
            });
            
            if (categoria) {
                console.log('✓ Categoría encontrada por nombre:', categoria.nombre);
            } else {
                console.log('✗ Categoría no encontrada con ese nombre');
            }
            return categoria;
        } catch (error) {
            console.error('✗ Error al buscar categoría por nombre:', error);
            throw error;
        }
    }

    // READ - Obtener categorías por color
    async obtenerPorColor(usuarioId, color) {
        try {
            const categorias = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                color: color
            }).toArray();
            
            console.log(`✓ Se encontraron ${categorias.length} categorías con color ${color}`);
            return categorias;
        } catch (error) {
            console.error('✗ Error al obtener categorías por color:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar categoría
    async actualizar(id, datos) {
        try {
            const resultado = await this.coleccion.updateOne(
                { _id: Database.crearObjectId(id) },
                { $set: datos }
            );

            if (resultado.modifiedCount > 0) {
                console.log('✓ Categoría actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return resultado.modifiedCount;
        } catch (error) {
            console.error('✗ Error al actualizar categoría:', error);
            throw error;
        }
    }

    // UPDATE - Cambiar color de categoría
    async cambiarColor(id, nuevoColor) {
        try {
            return await this.actualizar(id, { color: nuevoColor });
        } catch (error) {
            console.error('✗ Error al cambiar color de categoría:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar nombre de categoría
    async cambiarNombre(id, nuevoNombre) {
        try {
            return await this.actualizar(id, { nombre: nuevoNombre });
        } catch (error) {
            console.error('✗ Error al cambiar nombre de categoría:', error);
            throw error;
        }
    }

    // DELETE - Eliminar categoría
    async eliminar(id) {
        try {
            const resultado = await this.coleccion.deleteOne({ 
                _id: Database.crearObjectId(id) 
            });

            if (resultado.deletedCount > 0) {
                console.log('✓ Categoría eliminada correctamente');
            } else {
                console.log('✗ Categoría no encontrada');
            }
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar categoría:', error);
            throw error;
        }
    }

    // DELETE - Eliminar todas las categorías de un usuario
    async eliminarPorUsuario(usuarioId) {
        try {
            const resultado = await this.coleccion.deleteMany({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            });

            console.log(`✓ ${resultado.deletedCount} categorías eliminadas`);
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar categorías del usuario:', error);
            throw error;
        }
    }

    // READ - Contar categorías de un usuario
    async contarPorUsuario(usuarioId) {
        try {
            const count = await this.coleccion.countDocuments({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            });
            console.log(`✓ El usuario tiene ${count} categorías`);
            return count;
        } catch (error) {
            console.error('✗ Error al contar categorías:', error);
            throw error;
        }
    }

    // READ - Verificar si existe categoría con ese nombre
    async existeNombre(usuarioId, nombre) {
        try {
            const count = await this.coleccion.countDocuments({ 
                usuarioId: Database.crearObjectId(usuarioId),
                nombre: nombre
            });
            const existe = count > 0;
            console.log(`✓ Categoría "${nombre}" ${existe ? 'ya existe' : 'no existe'}`);
            return existe;
        } catch (error) {
            console.error('✗ Error al verificar existencia de categoría:', error);
            throw error;
        }
    }
}

module.exports = Categoria;