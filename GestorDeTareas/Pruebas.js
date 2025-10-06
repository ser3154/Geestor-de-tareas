// pruebas.js
const Database = require('./DataBase');
const Usuario = require('./Usuario');
const Tarea = require('./Tareas');
const Categoria = require('./Categorias');
const Nota = require('./Notas');
const Logro = require('./Logros');
const Racha = require('./Rachas');

async function ejecutarPruebas() {
    const database = new Database();
    
    try {
        // Conectar a la base de datos
        await database.conectar();
        console.log('\n=== INICIANDO PRUEBAS ===\n');

        // Instanciar las clases
        const usuarioDAO = new Usuario(database);
        const tareaDAO = new Tarea(database);
        const categoriaDAO = new Categoria(database);
        const logroDAO = new Logro(database);
        const rachaDAO = new Racha(database);

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
        // PRUEBAS DE CATEGORÍAS
        // =====================
        console.log('\n--- PRUEBAS DE CATEGORÍAS ---\n');

        // 1. Crear categorías
        console.log('1. Creando categorías...');
        const catId1 = await categoriaDAO.crear(
            'Escuela',
            '#3B82F6',
            'Tareas y proyectos escolares',
            userId1
        );

        const catId2 = await categoriaDAO.crear(
            'Personal',
            '#10B981',
            'Actividades personales',
            userId1
        );

        const catId3 = await categoriaDAO.crear(
            'Trabajo',
            '#F59E0B',
            'Tareas laborales',
            userId1
        );

        const catId4 = await categoriaDAO.crear(
            'Gimnasio',
            '#EF4444',
            'Rutinas de ejercicio',
            userId2
        );

        // 2. Obtener categoría por ID
        console.log('\n2. Obteniendo categoría por ID...');
        await categoriaDAO.obtenerPorId(catId1);

        // 3. Obtener todas las categorías de un usuario
        console.log('\n3. Obteniendo categorías del usuario 1...');
        await categoriaDAO.obtenerPorUsuario(userId1);

        // 4. Buscar categoría por nombre
        console.log('\n4. Buscando categoría "Escuela"...');
        await categoriaDAO.buscarPorNombre(userId1, 'Escuela');

        // 5. Obtener categorías por color
        console.log('\n5. Obteniendo categorías con color azul...');
        await categoriaDAO.obtenerPorColor(userId1, '#3B82F6');

        // 6. Contar categorías de un usuario
        console.log('\n6. Contando categorías del usuario 1...');
        await categoriaDAO.contarPorUsuario(userId1);

        // 7. Verificar si existe una categoría
        console.log('\n7. Verificando si existe categoría "Escuela"...');
        await categoriaDAO.existeNombre(userId1, 'Escuela');

        // 8. Actualizar categoría
        console.log('\n8. Actualizando descripción de categoría...');
        await categoriaDAO.actualizar(catId2, {
            descripcion: 'Actividades personales y hobbies'
        });

        // 9. Cambiar color de categoría
        console.log('\n9. Cambiando color de categoría...');
        await categoriaDAO.cambiarColor(catId3, '#FB923C');

        // 10. Cambiar nombre de categoría
        console.log('\n10. Cambiando nombre de categoría...');
        await categoriaDAO.cambiarNombre(catId3, 'Oficina');

        // =====================
        // PRUEBAS DE TAREAS
        // =====================
        console.log('\n--- PRUEBAS DE TAREAS ---\n');

        // 1. Crear tareas usando las categorías creadas
        console.log('1. Creando tareas con categorías...');
        const tareaId1 = await tareaDAO.crear({
            titulo: 'Completar asignación de Tópicos Web',
            descripcion: 'Desarrollar la capa de acceso a datos con Node.js',
            usuarioId: userId1,
            prioridad: 'alta',
            estado: 'en_progreso',
            fecha_vencimiento: new Date('2024-11-15'),
            categoria: {
                categoriaId: catId1,
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
            fecha_vencimiento: new Date('2024-11-12'),
            categoria: {
                categoriaId: catId1,
                nombre: 'Escuela'
            }
        });

        const tareaId3 = await tareaDAO.crear({
            titulo: 'Hacer ejercicio',
            descripcion: 'Ir al gimnasio',
            usuarioId: userId2,
            prioridad: 'media',
            estado: 'pendiente',
            categoria: {
                categoriaId: catId4,
                nombre: 'Gimnasio'
            }
        });

        const tareaId4 = await tareaDAO.crear({
            titulo: 'Leer libro de programación',
            descripcion: 'Continuar con el libro de Node.js',
            usuarioId: userId1,
            prioridad: 'baja',
            estado: 'pendiente',
            categoria: {
                categoriaId: catId2,
                nombre: 'Personal'
            }
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

        // 8. Actualizar categoría de tarea
        console.log('\n8. Actualizando categoría de tarea...');
        await tareaDAO.actualizarCategoria(
            tareaId4, 
            catId1, 
            'Escuela'
        );

        // 9. Obtener estadísticas
        console.log('\n9. Obteniendo estadísticas de tareas...');
        await tareaDAO.obtenerEstadisticas(userId1);

        // 10. Obtener tareas vencidas
        console.log('\n10. Obteniendo tareas vencidas...');
        await tareaDAO.obtenerVencidas(userId1);

        // =====================
        // PRUEBAS DE LOGROS
        // =====================
        console.log('\n--- PRUEBAS DE LOGROS ---\n');

        // 1. Crear logro
        const logroId = await logroDAO.crear(
            userId1,
            'Primer tarea completada',
            'Completaste tu primera tarea',
            '🏆',
            new Date(),
            { tipo: 'tareas_completadas', valor: 1 }
        );

        // 2. Obtener logro por ID
        await logroDAO.obtenerPorId(logroId);

        // 3. Obtener logros por usuario
        await logroDAO.obtenerPorUsuario(userId1);

        // 4. Actualizar logro
        await logroDAO.actualizar(logroId, { nombre: '¡Primer tarea completada!' });

        // 5. Eliminar logro
        await logroDAO.eliminar(logroId);

        // =====================
        // PRUEBAS DE RACHAS
        // =====================
        console.log('\n--- PRUEBAS DE RACHAS ---\n');

        // 1. Crear racha
        const rachaId = await rachaDAO.crear(
            userId1,
            tareaId1,
            3, // racha_actual
            5, // racha_maxima
            new Date(),
            'activa'
        );

        // 2. Obtener racha por ID
        await rachaDAO.obtenerPorId(rachaId);

        // 3. Obtener rachas por usuario
        await rachaDAO.obtenerPorUsuario(userId1);

        // 4. Actualizar racha
        await rachaDAO.actualizar(rachaId, { racha_actual: 4 });

        // 5. Eliminar racha
        await rachaDAO.eliminar(rachaId);

        // =====================
        // PRUEBAS DE DELETE
        // =====================
        console.log('\n--- PRUEBAS DE ELIMINACIÓN ---\n');

        // 1. Eliminar una tarea
        console.log('1. Eliminando una tarea...');
        await tareaDAO.eliminar(tareaId3);

        // 2. Eliminar una categoría
        console.log('\n2. Eliminando una categoría...');
        await categoriaDAO.eliminar(catId4);

        // 3. Desactivar usuario (no eliminarlo)
        console.log('\n3. Desactivando usuario...');
        await usuarioDAO.cambiarEstado(userId2, false);

        // 4. Mostrar resumen final
        console.log('\n--- RESUMEN FINAL ---');
        console.log('Categorías restantes del usuario 1:');
        await categoriaDAO.obtenerPorUsuario(userId1);
        console.log('\nTareas restantes del usuario 1:');
        await tareaDAO.obtenerPorUsuario(userId1);

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