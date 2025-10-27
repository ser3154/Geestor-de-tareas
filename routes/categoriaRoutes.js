const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware);
const categoriaControllers = require ('../controllers/categoriaControllers')


router.post('/' , categoriaControllers.crearCategoria)

router.get('/'  , categoriaControllers.obtenerTodasLasCategorias)

//ID DEL USUARIO
router.get('/usuario/:usuarioId', categoriaControllers.obtenerCategoriasDeUsuario);

//ID DE CATEGORIA
router.get('/:id',categoriaControllers.obtenerCategoriaPorId)
router.put('/:id', categoriaControllers.actualizarCategoriaPorId)
router.delete('/:id', categoriaControllers.eliminarCategoriaPorId)

module.exports = router;