const express = require('express');
const Database = require('./config/DataBase');
const usuarioRoutes = require('./routes/usuarioRoutes')
const categoriaRoutes = require('./routes/categoriaRoutes')
const logroRoutes = require('./routes/logroRoutes')
const tareaRoutes = require('./routes/tareaRoutes')
const rachaRoutes = require('./routes/rachaRoutes')

/*
const tareasRoutes = require('./modules/tareasRoutes');
const notasRoutes = require('./modules/notasRoutes');
const rachasRoutes = require('./modules/rachasRoutes');
*/

const server = async() =>{
    try {
        const database = new Database()
        await database.conectar()
        const app = express()
        app.use(express.json())

        app.use('/api/rachas', rachaRoutes)
        app.use('/api/logros' , logroRoutes)
        app.use('/api/usuarios' , usuarioRoutes)
        app.use('/api/categorias', categoriaRoutes)
        app.use('/api/tareas' , tareaRoutes)
        

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

