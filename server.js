const express = require('express');
const path = require('path');
const Database = require('./config/DataBase');

// Rutas principales
const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const notasRoutes = require('./routes/notasRoutes');
const authRoutes = require('./routes/authRoutes');
const logroRoutes = require('./routes/logroRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const rachaRoutes = require('./routes/rachaRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const server = async () => {
    try {
        const database = new Database();
        await database.conectar();

        const app = express();
        app.use(express.json());

        // ========================================
        // SERVIR ARCHIVOS ESTÁTICOS (FRONTEND)
        // ========================================
        app.use(express.static(path.join(__dirname, 'frontend')));

        // Ruta principal - servir index.html
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
        });

        // ========================================
        // RUTAS DE LA API
        // ========================================

        // Rutas públicas (sin autenticación)
        app.use('/api/v1/auth', authRoutes);

        // Rutas protegidas (con autenticación)
        app.use('/api/v1/usuarios', usuarioRoutes);
        app.use('/api/v1/categorias', categoriaRoutes);
        app.use('/api/v1/notas', notasRoutes);
        app.use('/api/v1/logros', logroRoutes);
        app.use('/api/v1/tareas', tareaRoutes);
        app.use('/api/v1/rachas', rachaRoutes);

        // Middleware de manejo de errores (debe ir al final)
        app.use(errorHandler);

        const port = 3000;
        app.listen(port, () => {
            console.log('=================================');
            console.log('🚀 Servidor iniciado exitosamente');
            console.log('📡 API: http://localhost:' + port + '/api/v1');
            console.log('🌐 Frontend: http://localhost:' + port);
            console.log('=================================');
        });
    } catch (err) {
        console.error('❌ Fallo en la base de datos');
        console.error(err);
    }
};

server();
