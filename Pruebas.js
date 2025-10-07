// --- IMPORTS ---
const Database = require('./config/DataBase');
const TareaDAO = require('./dataAccess/TareaDAO')
const CategoriaDAO = require('./dataAccess/CategoriasDAO');
const LogroDAO = require('./dataAccess/LogrosDAO');
const UsuarioDAO = require('./dataAccess/UsuarioDAO'); 
const NotaDAO = require('./dataAccess/NotaDAO');
const RachaDAO = require('./dataAccess/RachaDAO');

// --- FUNCIÓN PRINCIPAL DE PRUEBAS ---
async function ejecutarPruebas() {
 const database = new Database()
 let userId1, userId2, catId1, catId2, tareaId, rachaId;
 
    // IDs para usar en las pruebas
    
    try {
        // --- CONEXIONES ---
        await database.conectar(); 
        
        console.log('\n=== INICIANDO PRUEBAS ===\n');


        // DAOs refactorizados con Mongoose
        const rachaDAO = new RachaDAO();
        const categoriaDAO = new CategoriaDAO();
        const logroDAO = new LogroDAO();
        const usuarioDAO = new UsuarioDAO();
        const notaDAO = new NotaDAO()
        const tareaDAO = new TareaDAO();
        
        // ==========================================================
        // PASO 1: PRUEBAS DE USUARIOS (SE EJECUTAN PRIMERO)
        // ==========================================================
        console.log('\n--- PRUEBAS DE USUARIOS ---\n');

        console.log('1. Creando usuarios...');
        userId1 = await usuarioDAO.crear('Jorge Elias', 'jorge@email.com');
        userId2 = await usuarioDAO.crear('Gabriel Medina', 'gabriel@email.com');
        
        console.log('\n2. Obteniendo usuario por ID...');
        await usuarioDAO.obtenerPorId(userId1);

        console.log('\n3. Obteniendo todos los usuarios...');
        await usuarioDAO.obtenerTodos();

        console.log('\n4. Actualizando usuario...');
        await usuarioDAO.actualizar(userId1, { nombre: 'Jorge Eduardo Elias' });
        await usuarioDAO.obtenerPorId(userId1); // Verificamos el cambio

        console.log('\n--- PRUEBAS DE NOTAS ---\n');

        console.log('1. Creando una nueva nota...');
        const notaId = await notaDAO.crear(
            'Recordar revisar el avance del proyecto.',
            'trabajo',
            userId1 // Se usa el ID del primer usuario creado
        );

        console.log('\n2. Obteniendo notas del usuario...');
        await notaDAO.obtenerPorUsuario(userId1);

        console.log('\n3. Actualizando la nota...');
        await notaDAO.actualizar(notaId, { contenido: '¡Revisión del proyecto completada!' });


        // ==========================================================
        // PASO 2: PRUEBAS DE CATEGORÍAS (AHORA FUNCIONARÁN)
        // ==========================================================
        console.log('\n--- PRUEBAS DE CATEGORÍAS ---\n');

        console.log('1. Creando categorías...');
        // Ahora 'userId1' tiene un valor válido
        catId1 = await categoriaDAO.crear(
            'Escuela',
            '#3B82F6',
            'Tareas y proyectos escolares',
            userId1
        );

        catId2 = await categoriaDAO.crear(
            'Personal',
            '#10B981',
            'Actividades personales',
            userId1
        );
        
        console.log('\n2. Obteniendo categorías del usuario...');
        await categoriaDAO.obtenerPorUsuario(userId1);

        console.log('\n--- PRUEBAS DE TAREAS ---\n');
        
        console.log('1. Creando una nueva tarea...');
        const tareaId = await tareaDAO.crear({
            titulo: 'Completar asignación de Tópicos Web',
            descripcion: 'Refactorizar toda la capa de acceso a datos',
            usuarioId: userId1,
            prioridad: 'alta',
            categoria: {
                categoriaId: catId1, // ID de la categoría "Escuela"
                nombre: 'Escuela'
            },
            recordatorios: [
                { fecha_hora: new Date('2025-11-10T10:00:00') }
            ]
        });

        console.log('\n2. Obteniendo tareas del usuario...');
        await tareaDAO.obtenerPorUsuario(userId1);

        console.log('\n3. Actualizando estado de la tarea...');
        await tareaDAO.actualizar(tareaId, { estado: 'completada' })
        

        // =====================
        // PRUEBAS DE RACHAS
        // =====================
        console.log('\n--- PRUEBAS DE RACHAS ---\n');

        console.log('1. Creando una nueva racha...');
        const rachaId = await rachaDAO.crear({
            usuarioId: userId1,
            tareaId: tareaId // ID de la tarea creada anteriormente
        });

        console.log('\n2. Obteniendo rachas del usuario...');
        await rachaDAO.obtenerPorUsuario(userId1);

        console.log('\n3. Actualizando la racha...');
        await rachaDAO.actualizar(rachaId, { racha_actual: 2, racha_maxima: 2 });


        // ==========================================================
        // PASO FINAL: PRUEBAS DE ELIMINACIÓN
        // ==========================================================
        console.log('\n--- PRUEBAS DE ELIMINACIÓN ---\n');
        console.log('1. Eliminando un usuario...');
        await usuarioDAO.eliminar(userId2);
        console.log('Usuarios restantes:');
        await usuarioDAO.obtenerTodos();


        console.log('\n\n✅ === PRUEBAS COMPLETADAS EXITOSAMENTE ===\n');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
    } finally {
        // --- DESCONEXION-
        console.log('\n--- FINALIZANDO CONEXION ---');
        await database.desconectar();
      
    }
}

ejecutarPruebas();