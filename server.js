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

// Middleware CORS
const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
};

const server = async () => {
    try {
        const database = new Database();
        await database.conectar();

        const app = express();
        
        // Middleware
        app.use(cors);
        app.use(express.json());
        
        // Servir archivos estáticos del frontend
        app.use(express.static(path.join(__dirname, 'frontend')));

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
            console.log(`Servidor escuchando en el puerto: ${port}`);
        });
    } catch (err) {
        console.error('Fallo en la base de datos');
        console.error(err);
    }
};

server();

