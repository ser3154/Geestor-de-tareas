const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// GET /api/auth/verify - Verificar token
router.get('/verify', authController.verificarToken);

module.exports = router;
