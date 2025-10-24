const express = require('express');
const Database = require('./config/DataBase');

const usuariosRoutes = require('./modules/usuariosRoutes');
const categoriasRoutes = require('./modules/categoriasRoutes');
const tareasRoutes = require('./modules/tareasRoutes');
const notasRoutes = require('./modules/notasRoutes');
const rachasRoutes = require('./modules/rachasRoutes');
const logrosRoutes = require('./modules/logrosRoutes');

const app = express();
const database = new Database();

app.use(express.json());
database.conectar();

app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/tareas', tareasRoutes);
app.use('/notas', notasRoutes);
app.use('/rachas', rachasRoutes);
app.use('/logros', logrosRoutes);

app.get('/', (req, res) => res.send('API REST funcionando correctamente'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
