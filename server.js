const express = require('express');
const Database = require('./config/DataBase');
const usuarioRoutes = require('./routes/usuarioRoutes')
const categoriaRoutes = require('./routes/categoriaRoutes')
const notasRoutes = require('./routes/notasRoutes')
const authRoutes = require('./routes/authRoutes')
const errorHandler = require('./middleware/errorHandler')


/*
const categoriasRoutes = require('./modules/categoriasRoutes');
const tareasRoutes = require('./modules/tareasRoutes');
const notasRoutes = require('./modules/notasRoutes');
const rachasRoutes = require('./modules/rachasRoutes');
const logrosRoutes = require('./modules/logrosRoutes');
*/

const server = async() =>{
    try {
        const database = new Database()
        await database.conectar()
        const app = express()
        app.use(express.json())
        
        // Rutas públicas (sin autenticación)
        app.use('/api/auth', authRoutes)
        
        // Rutas protegidas (con autenticación)
        app.use('/api/usuarios' , usuarioRoutes)
        app.use('/api/categorias', categoriaRoutes)
        app.use('/api/notas', notasRoutes)
        
        // Middleware de manejo de errores (debe ir al final)
        app.use(errorHandler)

        const port = 3000
        
        app.listen(port, () =>{
            console.log(`Servidor esucchando en el puerto: ${port}`)
        })
    } catch (err) {
     console.error('Fallo en la bd')
     console.error(err)   
    }
}

server()

/*
app.use('/usuarios', usuariosControllers);
app.use('/categorias', categoriasRoutes);
app.use('/tareas', tareasRoutes);
app.use('/notas', notasRoutes);
app.use('/rachas', rachasRoutes);
app.use('/logros', logrosRoutes);
*/

