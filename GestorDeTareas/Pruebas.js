// pruebas.js
const Database = require('./DataBase');
const Usuario = require('./Usuario');
const Tarea = require('./Tareas');

async function ejecutarPruebas() {
    const database = new Database();
    
    try {
        // Conectar a la base de datos
        await database.conectar();
        console.log('\n=== INICIANDO PRUEBAS ===\n');

        // Instanciar las clases
        const usuarioDAO = new Usuario(database);
        const tareaDAO = new Tarea(database);

        // =====================
        // PRUEBAS DE USUARIOS
        // =====================
        console.log('\n--- PRUEBAS DE USUARIOS ---\n');

        // 1. Crear usuarios
        console.log('1. Creando usuarios...');
        const userId1 = await usuarioDAO.crear('Jorge Elias', 'jorge@email.com');
        const userId2 = await usuarioDAO.crear('Gabriel Medina', 'gabriel@email.com');

        // 2. Obtener usuario por ID
        console.log('\n2. Obteniendo usuario por ID...');
        await usuarioDAO.obtenerPorId(userId1);

        // 3. Obtener todos los usuarios
        console.log('\n3. Obteniendo todos los usuarios...');
        await usuarioDAO.obtenerTodos();

        // 4. Buscar por email
        console.log('\n4. Buscando usuario por email...');
        await usuarioDAO.obtenerPorEmail('jorge@email.com');

        // 5. Actualizar usuario
        console.log('\n5. Actualizando usuario...');
        await usuarioDAO.actualizar(userId1, { 
            nombre: 'Jorge Eduardo Elias Cazares' 
        });

        // 6. Contar usuarios activos
        console.log('\n6. Contando usuarios activos...');
        await usuarioDAO.contarActivos();

        // =====================
        // PRUEBAS DE TAREAS
        // =====================
        console.log('\n--- PRUEBAS DE TAREAS ---\n');

        // 1. Crear tareas
        console.log('1. Creando tareas...');
        const tareaId1 = await tareaDAO.crear({
            titulo: 'Completar asignación de Tópicos Web',
            descripcion: 'Desarrollar la capa de acceso a datos con Node.js',
            usuarioId: userId1,
            prioridad: 'alta',
            estado: 'en_progreso',
            fecha_vencimiento: new Date('2024-11-15'),
            categoria: {
                categoriaId: '507f1f77bcf86cd799439011',
                nombre: 'Escuela'
            },
            recordatorios: [
                {
                    fecha_hora: new Date('2024-11-10T10:00:00'),
                    tipo: 'email',
                    estado: 'pendiente'
                }
            ]
        });

        const tareaId2 = await tareaDAO.crear({
            titulo: 'Estudiar para examen de MongoDB',
            descripcion: 'Repasar modelado NoSQL y operaciones CRUD',
            usuarioId: userId1,
            prioridad: 'alta',
            estado: 'pendiente',
            fecha_vencimiento: new Date('2024-11-12')
        });

        const tareaId3 = await tareaDAO.crear({
            titulo: 'Hacer ejercicio',
            descripcion: 'Ir al gimnasio',
            usuarioId: userId2,
            prioridad: 'media',
            estado: 'pendiente'
        });

        // 2. Obtener tarea por ID
        console.log('\n2. Obteniendo tarea por ID...');
        await tareaDAO.obtenerPorId(tareaId1);

        // 3. Obtener tareas de un usuario
        console.log('\n3. Obteniendo tareas del usuario...');
        await tareaDAO.obtenerPorUsuario(userId1);

        // 4. Obtener tareas por estado
        console.log('\n4. Obteniendo tareas pendientes...');
        await tareaDAO.obtenerPorEstado(userId1, 'pendiente');

        // 5. Obtener tareas por prioridad
        console.log('\n5. Obteniendo tareas de prioridad alta...');
        await tareaDAO.obtenerPorPrioridad(userId1, 'alta');

        // 6. Actualizar estado de tarea
        console.log('\n6. Cambiando estado de tarea a completada...');
        await tareaDAO.cambiarEstado(tareaId2, 'completada');

        // 7. Agregar recordatorio
        console.log('\n7. Agregando recordatorio a tarea...');
        await tareaDAO.agregarRecordatorio(tareaId1, {
            fecha_hora: '2024-11-14T09:00:00',
            tipo: 'notificacion',
            estado: 'pendiente'
        });

        // 8. Actualizar categoría
        console.log('\n8. Actualizando categoría de tarea...');
        await tareaDAO.actualizarCategoria(
            tareaId3, 
            '507f1f77bcf86cd799439012', 
            'Personal'
        );

        // 9. Obtener estadísticas
        console.log('\n9. Obteniendo estadísticas de tareas...');
        await tareaDAO.obtenerEstadisticas(userId1);

        // 10. Obtener tareas vencidas
        console.log('\n10. Obteniendo tareas vencidas...');
        await tareaDAO.obtenerVencidas(userId1);

        // =====================
        // PRUEBAS DE DELETE
        // =====================
        console.log('\n--- PRUEBAS DE ELIMINACIÓN ---\n');

        // 1. Eliminar una tarea
        console.log('1. Eliminando una tarea...');
        await tareaDAO.eliminar(tareaId3);

        // 2. Desactivar usuario (no eliminarlo)
        console.log('\n2. Desactivando usuario...');
        await usuarioDAO.cambiarEstado(userId2, false);

        console.log('\n=== PRUEBAS COMPLETADAS ===\n');

    } catch (error) {
        console.error('Error en las pruebas:', error);
    } finally {
        // Desconectar de la base de datos
        await database.desconectar();
    }
}

// Ejecutar las pruebas
ejecutarPruebas();