const express = require('express')
const router = express.Router()



const authMiddleware = require('../middleware/authMiddleware');
const usuarioControllers = require ('../controllers/usuariosControllers')
//CREA USUARIO SIN AUTHENTIFICACION
router.post('/', usuarioControllers.crearUsuario)



router.get('/', authMiddleware , usuarioControllers.obtenerTodosLosUsuarios)
router.get('/:id', authMiddleware, usuarioControllers.obtenerUsuarioPorId)
router.put('/:id', authMiddleware , usuarioControllers.actualizarUsuario)

router.delete('/:id',authMiddleware , usuarioControllers.eliminarUsuario);

module.exports = router;