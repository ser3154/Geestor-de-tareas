const express = require('express')
const router = express.Router()



const usuarioControllers = require ('../controllers/usuariosControllers')
 


router.post('/', usuarioControllers.crearUsuario)
router.get('/', usuarioControllers.obtenerTodosLosUsuarios)
router.get('/:id',usuarioControllers.obtenerUsuarioPorId)
router.put('/:id', usuarioControllers.actualizarUsuario)

router.delete('/:id',usuarioControllers.eliminarUsuario);

module.exports = router;