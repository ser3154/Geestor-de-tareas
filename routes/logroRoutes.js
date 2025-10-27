const express = require('express');
const router = express.Router();

const logrosControllers = require('../controllers/logrosControllers');


// ✅ IMPORTANTE: Las rutas específicas SIEMPRE van ANTES de las genéricas

// 1. CREAR LOGRO
router.post('/', logrosControllers.crearLogro);

// 2. OBTENER TODOS LOS LOGROS (ruta específica)
router.get('/', logrosControllers.obtenerTodosLosLogros);

// 3. OBTENER LOGROS DE UN USUARIO (ruta específica - ANTES de /:id)
router.get('/usuario/:usuarioId', logrosControllers.obtenerLogrosPorUsuario);

// 4. OBTENER LOGRO POR ID (ruta genérica - DEBE IR DESPUÉS)
router.get('/:id', logrosControllers.obtenerLogroPorId);

// 5. ACTUALIZAR LOGRO
router.put('/:id', logrosControllers.actualizarLogro);

// 6. ELIMINAR LOGRO
router.delete('/:id', logrosControllers.eliminarLogro);

module.exports = router;