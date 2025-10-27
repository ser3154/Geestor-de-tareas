const express = require('express')
const router = express.Router()

const logrosControllers = require ('../controllers/logrosControllers')
console.log("Función obtenerTodosLosLogros:", logrosControllers.obtenerTodosLosLogros);

console.log("LLEGA A LOGRO ROUTES")

// 1. CONSULTAR TODOS LOS LOGROS (Ruta estática)
router.get('/' , logrosControllers.obtenerTodosLosLogros);

// 2. CONSULTAR LOGROS DE UN USUARIO (Ruta específica con parámetro)
router.get('/usuario/:usuarioId', logrosControllers.obtenerLogrosPorUsuario);

// 3. LOGRO POR ID (Ruta genérica con parámetro - DEBE IR AL FINAL de los GET)
router.get('/:id', logrosControllers.obtenerLogroPorId);


// CREAR LOGRO
router.post('/', logrosControllers.crearLogro);

// ACTUALIZAR UN LOGRO CON SU ID
router.put('/:id', logrosControllers.actualizarLogro);

// ELIMINAR LOGRO CON SU ID
router.delete('/:id', logrosControllers.eliminarLogro);

module.exports = router;