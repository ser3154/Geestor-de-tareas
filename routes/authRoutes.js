const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', authController.register);

// GET /api/auth/verify - Verificar token
router.get('/verify', authController.verificarToken);

module.exports = router;
