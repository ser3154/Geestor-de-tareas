const express = require('express');
const router = express.Router();

const tareasControllers = require('../controllers/tareaControllers');

router.post('/', tareasControllers.crearTarea);
// Para listar tareas de un usuario: GET /?usuarioId=<id>
router.get('/usuario/:usuarioId', tareasControllers.obtenerTodasLasTareas);

router.get('/:id', tareasControllers.obtenerTareaPorId);
router.put('/:id', tareasControllers.actualizarTarea);
router.delete('/:id', tareasControllers.eliminarTarea);

module.exports = router;