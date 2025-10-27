const express = require('express');
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

        // Rutas públicas (sin autenticación)
        app.use('/api/auth', authRoutes);

        // Rutas protegidas (con autenticación)
        app.use('/api/usuarios', usuarioRoutes);
        app.use('/api/categorias', categoriaRoutes);
        app.use('/api/notas', notasRoutes);
        app.use('/api/logros', logroRoutes);
        app.use('/api/tareas', tareaRoutes);
        app.use('/api/rachas', rachaRoutes);

        // Middleware de manejo de errores (debe ir al final)
        app.use(errorHandler);

        const port = 3000;
        app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto: ${port}`);
        });
    } catch (err) {
        console.error('Fallo en la base de datos');
        console.error(err);
    }
};

server();

