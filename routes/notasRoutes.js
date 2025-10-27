const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const notaControllers = require('../controllers/notasControllers');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// CREATE - Crear nueva nota
router.post('/', notaControllers.crearNota);

// READ - Obtener notas de un usuario específico
router.get('/usuario/:usuarioId', notaControllers.obtenerNotasDeUsuario);

// READ - Obtener nota por ID
router.get('/:id', notaControllers.obtenerNotaPorId);

// UPDATE - Actualizar nota por ID
router.put('/:id', notaControllers.actualizarNotaPorId);

// DELETE - Eliminar nota por ID
router.delete('/:id', notaControllers.eliminarNotaPorId);

module.exports = router;
