const express = require('express');
const router = express.Router();

const logrosControllers = require('../controllers/logrosControllers');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
router.use(authMiddleware);

// IMPORTANTE: Las rutas específicas SIEMPRE van ANTES de las genéricas

// 1. CREAR LOGRO
router.post(
    '/',
    [
        body('usuarioId').notEmpty().withMessage('El usuarioId es obligatorio.'),
        body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
        body('descripcion').notEmpty().withMessage('La descripción es obligatoria.'),
        body('icono').notEmpty().withMessage('El icono no debe estar vacio.'),
        body('fecha_otorgado').optional().isISO8601().toDate().withMessage('La fecha_otorgado debe ser una fecha válida.')
    ],
    logrosControllers.crearLogro
);

// 2. OBTENER TODOS LOS LOGROS (ruta específica)
router.get('/', logrosControllers.obtenerTodosLosLogros);

// 3. OBTENER LOGROS DE UN USUARIO (ruta específica - ANTES de /:id)
router.get('/usuario/:usuarioId', logrosControllers.obtenerLogrosPorUsuario);

// 4. OBTENER LOGRO POR ID (ruta genérica - DEBE IR DESPUÉS)
router.get('/:id', logrosControllers.obtenerLogroPorId);

// 5. ACTUALIZAR LOGRO
router.put(
    '/:id',
    [
        body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío.'),
        body('descripcion').optional().notEmpty().withMessage('La descripción no puede estar vacía.'),
        body('icono').optional().isString().withMessage('El icono debe ser un texto.'),
        body('fecha_otorgado').optional().isISO8601().toDate().withMessage('La fecha_otorgado debe ser una fecha válida.')
    ],
    logrosControllers.actualizarLogro
);

// 6. ELIMINAR LOGRO
router.delete('/:id', logrosControllers.eliminarLogro);

module.exports = router;