const express = require('express');
const router = express.Router();

const tareasControllers = require('../controllers/tareasControllers');

router.post('/', tareasControllers.crearTarea);
// Para listar tareas de un usuario: GET /?usuarioId=<id>
router.get('/', tareasControllers.obtenerTodasLasTareas);
router.get('/:id', tareasControllers.obtenerTareaPorId);
router.put('/:id', tareasControllers.actualizarTarea);
router.delete('/:id', tareasControllers.eliminarTarea);

module.exports = router;