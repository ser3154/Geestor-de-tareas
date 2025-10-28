const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware');
router.use(authMiddleware);

const { body, param } = require('express-validator');
const categoriaControllers = require ('../controllers/categoriaControllers')


router.post(
    '/',
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
        body('usuarioId').notEmpty().withMessage('El usuarioId es obligatorio.'),
        body('color').optional().isString().withMessage('El color debe ser un texto.'),
        body('descripcion').optional().isString().withMessage('La descripción debe ser un texto.')
    ],
    categoriaControllers.crearCategoria
);

router.get('/'  , categoriaControllers.obtenerTodasLasCategorias)

//ID DEL USUARIO
router.get('/usuario/:usuarioId', categoriaControllers.obtenerCategoriasDeUsuario);

//ID DE CATEGORIA
router.get('/:id',categoriaControllers.obtenerCategoriaPorId)

router.put(
    '/:id',
    [
        body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío.'),
        body('color').optional().isString().withMessage('El color debe ser un texto.'),
        body('descripcion').optional().isString().withMessage('La descripción debe ser un texto.')
    ],
    categoriaControllers.actualizarCategoriaPorId
);

router.delete('/:id', categoriaControllers.eliminarCategoriaPorId)

module.exports = router;