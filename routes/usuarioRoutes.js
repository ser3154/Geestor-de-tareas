const express = require('express')
const router = express.Router()


const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const usuarioControllers = require ('../controllers/usuariosControllers')
//CREA USUARIO SIN AUTHENTIFICACION

router.post(
    '/',
    // --- Reglas de Validación ---
    body('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('Debe ser un email válido.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    // --------------------------
    usuarioControllers.crearUsuario
);

router.get('/', authMiddleware , usuarioControllers.obtenerTodosLosUsuarios)
router.get('/:id', authMiddleware, usuarioControllers.obtenerUsuarioPorId)

router.put(
    '/:id',
    authMiddleware, 

    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío.'),
    body('email').optional().isEmail().withMessage('Debe proporcionar un email válido.'),
    body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    usuarioControllers.actualizarUsuario
);

router.delete('/:id',authMiddleware , usuarioControllers.eliminarUsuario);

module.exports = router;