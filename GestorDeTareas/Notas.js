// Nota.js
const Database = require('./DataBase');

class Nota {
    constructor(database) {
        this.db = database.obtenerDB();
        this.coleccion = this.db.collection('notas');
    }

    // CREATE - Crear nueva nota
    async crear(contenido, tipo, usuarioId) {
        try {
            const nuevaNota = {
                contenido: contenido,
                fecha_creacion: new Date(),
                tipo: tipo || 'general',
                usuarioId: Database.crearObjectId(usuarioId)
            };

            const resultado = await this.coleccion.insertOne(nuevaNota);
            console.log(`✓ Nota creada con ID: ${resultado.insertedId}`);
            return resultado.insertedId;
        } catch (error) {
            console.error('✗ Error al crear nota:', error);
            throw error;
        }
    }

    // READ - Obtener nota por ID
    async obtenerPorId(id) {
        try {
            const nota = await this.coleccion.findOne({ 
                _id: Database.crearObjectId(id) 
            });
            
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

    // READ - Obtener todas las notas de un usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const notas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            }).sort({ fecha_creacion: -1 }).toArray();
            
            console.log(`✓ Se encontraron ${notas.length} notas para el usuario`);
            return notas;
        } catch (error) {
            console.error('✗ Error al obtener notas del usuario:', error);
            throw error;
        }
    }

    // READ - Obtener notas por tipo
    async obtenerPorTipo(usuarioId, tipo) {
        try {
            const notas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                tipo: tipo
            }).sort({ fecha_creacion: -1 }).toArray();
            
            console.log(`✓ Se encontraron ${notas.length} notas de tipo: ${tipo}`);
            return notas;
        } catch (error) {
            console.error('✗ Error al obtener notas por tipo:', error);
            throw error;
        }
    }

    // READ - Obtener todas las notas
    async obtenerTodas() {
        try {
            const notas = await this.coleccion.find({})
                .sort({ fecha_creacion: -1 })
                .toArray();
            console.log(`✓ Se encontraron ${notas.length} notas en total`);
            return notas;
        } catch (error) {
            console.error('✗ Error al obtener todas las notas:', error);
            throw error;
        }
    }

    // READ - Buscar notas por contenido (búsqueda de texto)
    async buscarPorContenido(usuarioId, textoBusqueda) {
        try {
            const notas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                contenido: { $regex: textoBusqueda, $options: 'i' }
            }).toArray();
            
            console.log(`✓ Se encontraron ${notas.length} notas que contienen: "${textoBusqueda}"`);
            return notas;
        } catch (error) {
            console.error('✗ Error al buscar notas por contenido:', error);
            throw error;
        }
    }

    // READ - Obtener notas recientes (últimos N días)
    async obtenerRecientes(usuarioId, dias = 7) {
        try {
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - dias);

            const notas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                fecha_creacion: { $gte: fechaLimite }
            }).sort({ fecha_creacion: -1 }).toArray();
            
            console.log(`✓ Se encontraron ${notas.length} notas de los últimos ${dias} días`);
            return notas;
        } catch (error) {
            console.error('✗ Error al obtener notas recientes:', error);
            throw error;
        }
    }

    // READ - Obtener notas por rango de fechas
    async obtenerPorRangoFechas(usuarioId, fechaInicio, fechaFin) {
        try {
            const notas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                fecha_creacion: { 
                    $gte: new Date(fechaInicio),
                    $lte: new Date(fechaFin)
                }
            }).sort({ fecha_creacion: -1 }).toArray();
            
            console.log(`✓ Se encontraron ${notas.length} notas en el rango de fechas`);
            return notas;
        } catch (error) {
            console.error('✗ Error al obtener notas por rango de fechas:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar nota
    async actualizar(id, datos) {
        try {
            const resultado = await this.coleccion.updateOne(
                { _id: Database.crearObjectId(id) },
                { $set: datos }
            );

            if (resultado.modifiedCount > 0) {
                console.log('✓ Nota actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return resultado.modifiedCount;
        } catch (error) {
            console.error('✗ Error al actualizar nota:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar contenido de nota
    async actualizarContenido(id, nuevoContenido) {
        try {
            return await this.actualizar(id, { contenido: nuevoContenido });
        } catch (error) {
            console.error('✗ Error al actualizar contenido de nota:', error);
            throw error;
        }
    }

    // UPDATE - Cambiar tipo de nota
    async cambiarTipo(id, nuevoTipo) {
        try {
            return await this.actualizar(id, { tipo: nuevoTipo });
        } catch (error) {
            console.error('✗ Error al cambiar tipo de nota:', error);
            throw error;
        }
    }

    // DELETE - Eliminar nota
    async eliminar(id) {
        try {
            const resultado = await this.coleccion.deleteOne({ 
                _id: Database.crearObjectId(id) 
            });

            if (resultado.deletedCount > 0) {
                console.log('✓ Nota eliminada correctamente');
            } else {
                console.log('✗ Nota no encontrada');
            }
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar nota:', error);
            throw error;
        }
    }

    // DELETE - Eliminar todas las notas de un usuario
    async eliminarPorUsuario(usuarioId) {
        try {
            const resultado = await this.coleccion.deleteMany({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            });

            console.log(`✓ ${resultado.deletedCount} notas eliminadas`);
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar notas del usuario:', error);
            throw error;
        }
    }

    // DELETE - Eliminar notas por tipo
    async eliminarPorTipo(usuarioId, tipo) {
        try {
            const resultado = await this.coleccion.deleteMany({ 
                usuarioId: Database.crearObjectId(usuarioId),
                tipo: tipo
            });

            console.log(`✓ ${resultado.deletedCount} notas de tipo "${tipo}" eliminadas`);
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar notas por tipo:', error);
            throw error;
        }
    }

    // READ - Contar notas de un usuario
    async contarPorUsuario(usuarioId) {
        try {
            const count = await this.coleccion.countDocuments({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            });
            console.log(`✓ El usuario tiene ${count} notas`);
            return count;
        } catch (error) {
            console.error('✗ Error al contar notas:', error);
            throw error;
        }
    }

    // READ - Contar notas por tipo
    async contarPorTipo(usuarioId, tipo) {
        try {
            const count = await this.coleccion.countDocuments({ 
                usuarioId: Database.crearObjectId(usuarioId),
                tipo: tipo
            });
            console.log(`✓ El usuario tiene ${count} notas de tipo "${tipo}"`);
            return count;
        } catch (error) {
            console.error('✗ Error al contar notas por tipo:', error);
            throw error;
        }
    }

    // READ - Obtener estadísticas de notas por tipo
    async obtenerEstadisticas(usuarioId) {
        try {
            const pipeline = [
                { 
                    $match: { usuarioId: Database.crearObjectId(usuarioId) } 
                },
                {
                    $group: {
                        _id: '$tipo',
                        cantidad: { $sum: 1 }
                    }
                }
            ];

            const estadisticas = await this.coleccion.aggregate(pipeline).toArray();
            console.log('✓ Estadísticas de notas obtenidas:', estadisticas);
            return estadisticas;
        } catch (error) {
            console.error('✗ Error al obtener estadísticas:', error);
            throw error;
        }
    }
}

module.exports = Nota;