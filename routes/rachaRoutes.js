const express = require('express');
const router = express.Router();

const rachasControllers = require('../controllers/rachaControllers');

router.post('/', rachasControllers.crearRacha);
// Para listar rachas de un usuario: GET /?usuarioId=<id>
router.get('/usuario/:usuarioId', rachasControllers.obtenerTodasLasRachas);
router.get('/:id', rachasControllers.obtenerRachaPorId);
router.put('/:id', rachasControllers.actualizarRacha);
router.delete('/:id', rachasControllers.eliminarRacha);

module.exports = router;