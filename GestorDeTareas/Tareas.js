// Tarea.js
const Database = require('./DataBase');

class Tarea {
    constructor(database) {
        this.db = database.obtenerDB();
        this.coleccion = this.db.collection('tareas');
    }

    // CREATE - Crear nueva tarea
    async crear(datosTarea) {
        try {
            const nuevaTarea = {
                titulo: datosTarea.titulo,
                descripcion: datosTarea.descripcion || '',
                fecha_creacion: new Date(),
                fecha_vencimiento: datosTarea.fecha_vencimiento || null,
                estado: datosTarea.estado || 'pendiente',
                prioridad: datosTarea.prioridad || 'media',
                usuarioId: Database.crearObjectId(datosTarea.usuarioId),
                categoria: datosTarea.categoria ? {
                    categoriaId: Database.crearObjectId(datosTarea.categoria.categoriaId),
                    nombre: datosTarea.categoria.nombre
                } : null,
                recordatorios: datosTarea.recordatorios || []
            };

            const resultado = await this.coleccion.insertOne(nuevaTarea);
            console.log(`✓ Tarea creada con ID: ${resultado.insertedId}`);
            return resultado.insertedId;
        } catch (error) {
            console.error('✗ Error al crear tarea:', error);
            throw error;
        }
    }

    // READ - Obtener tarea por ID
    async obtenerPorId(id) {
        try {
            const tarea = await this.coleccion.findOne({ 
                _id: Database.crearObjectId(id) 
            });
            
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

    // READ - Obtener todas las tareas de un usuario
    async obtenerPorUsuario(usuarioId) {
        try {
            const tareas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            }).toArray();
            
            console.log(`✓ Se encontraron ${tareas.length} tareas para el usuario`);
            return tareas;
        } catch (error) {
            console.error('✗ Error al obtener tareas del usuario:', error);
            throw error;
        }
    }

    // READ - Obtener tareas por estado
    async obtenerPorEstado(usuarioId, estado) {
        try {
            const tareas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                estado: estado
            }).toArray();
            
            console.log(`✓ Se encontraron ${tareas.length} tareas con estado: ${estado}`);
            return tareas;
        } catch (error) {
            console.error('✗ Error al obtener tareas por estado:', error);
            throw error;
        }
    }

    // READ - Obtener tareas por prioridad
    async obtenerPorPrioridad(usuarioId, prioridad) {
        try {
            const tareas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                prioridad: prioridad
            }).toArray();
            
            console.log(`✓ Se encontraron ${tareas.length} tareas con prioridad: ${prioridad}`);
            return tareas;
        } catch (error) {
            console.error('✗ Error al obtener tareas por prioridad:', error);
            throw error;
        }
    }

    // READ - Obtener tareas vencidas
    async obtenerVencidas(usuarioId) {
        try {
            const tareas = await this.coleccion.find({ 
                usuarioId: Database.crearObjectId(usuarioId),
                fecha_vencimiento: { $lt: new Date() },
                estado: { $ne: 'completada' }
            }).toArray();
            
            console.log(`✓ Se encontraron ${tareas.length} tareas vencidas`);
            return tareas;
        } catch (error) {
            console.error('✗ Error al obtener tareas vencidas:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar tarea
    async actualizar(id, datos) {
        try {
            const resultado = await this.coleccion.updateOne(
                { _id: Database.crearObjectId(id) },
                { $set: datos }
            );

            if (resultado.modifiedCount > 0) {
                console.log('✓ Tarea actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return resultado.modifiedCount;
        } catch (error) {
            console.error('✗ Error al actualizar tarea:', error);
            throw error;
        }
    }

    // UPDATE - Cambiar estado de tarea
    async cambiarEstado(id, nuevoEstado) {
        try {
            return await this.actualizar(id, { estado: nuevoEstado });
        } catch (error) {
            console.error('✗ Error al cambiar estado de tarea:', error);
            throw error;
        }
    }

    // UPDATE - Agregar recordatorio a tarea
    async agregarRecordatorio(tareaId, recordatorio) {
        try {
            const nuevoRecordatorio = {
                fecha_hora: new Date(recordatorio.fecha_hora),
                tipo: recordatorio.tipo || 'notificacion',
                estado: recordatorio.estado || 'pendiente'
            };

            const resultado = await this.coleccion.updateOne(
                { _id: Database.crearObjectId(tareaId) },
                { $push: { recordatorios: nuevoRecordatorio } }
            );

            if (resultado.modifiedCount > 0) {
                console.log('✓ Recordatorio agregado correctamente');
            }
            return resultado.modifiedCount;
        } catch (error) {
            console.error('✗ Error al agregar recordatorio:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar categoría de tarea
    async actualizarCategoria(tareaId, categoriaId, nombreCategoria) {
        try {
            const categoria = {
                categoriaId: Database.crearObjectId(categoriaId),
                nombre: nombreCategoria
            };

            return await this.actualizar(tareaId, { categoria: categoria });
        } catch (error) {
            console.error('✗ Error al actualizar categoría:', error);
            throw error;
        }
    }

    // DELETE - Eliminar tarea
    async eliminar(id) {
        try {
            const resultado = await this.coleccion.deleteOne({ 
                _id: Database.crearObjectId(id) 
            });

            if (resultado.deletedCount > 0) {
                console.log('✓ Tarea eliminada correctamente');
            } else {
                console.log('✗ Tarea no encontrada');
            }
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar tarea:', error);
            throw error;
        }
    }

    // DELETE - Eliminar todas las tareas de un usuario
    async eliminarPorUsuario(usuarioId) {
        try {
            const resultado = await this.coleccion.deleteMany({ 
                usuarioId: Database.crearObjectId(usuarioId) 
            });

            console.log(`✓ ${resultado.deletedCount} tareas eliminadas`);
            return resultado.deletedCount;
        } catch (error) {
            console.error('✗ Error al eliminar tareas del usuario:', error);
            throw error;
        }
    }

    // READ - Estadísticas de tareas
    async obtenerEstadisticas(usuarioId) {
        try {
            const pipeline = [
                { 
                    $match: { usuarioId: Database.crearObjectId(usuarioId) } 
                },
                {
                    $group: {
                        _id: '$estado',
                        cantidad: { $sum: 1 }
                    }
                }
            ];

            const estadisticas = await this.coleccion.aggregate(pipeline).toArray();
            console.log('✓ Estadísticas obtenidas:', estadisticas);
            return estadisticas;
        } catch (error) {
            console.error('✗ Error al obtener estadísticas:', error);
            throw error;
        }
    }
}

module.exports = Tarea;