const jwt = require('jsonwebtoken');
const usuarioDAO = require('../dataAccess/UsuarioDAO');

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = 'mi_clave_secreta_super_segura_2024';

// Login - Generar JWT
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación de entrada
        if (!email || !password) {
            return res.status(400).json({ 
                mensaje: 'Email y contraseña son obligatorios.' 
            });
        }

        if (typeof email !== 'string' || email.trim() === '') {
            return res.status(400).json({ 
                mensaje: 'El email debe ser un texto no vacío.' 
            });
        }

        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ 
                mensaje: 'La contraseña debe ser un texto de al menos 6 caracteres.' 
            });
        }

        // Buscar usuario por email
        const usuarios = await usuarioDAO.obtenerTodos();
        const usuario = usuarios.find(u => u.email === email);

        if (!usuario) {
            return res.status(401).json({ 
                mensaje: 'Credenciales inválidas.' 
            });
        }

        // Verificar contraseña
        const passwordValida = await usuario.comparePassword(password);
        if (!passwordValida) {
            return res.status(401).json({ 
                mensaje: 'Credenciales inválidas.' 
            });
        }

        // Generar JWT
        const token = jwt.sign(
            { 
                userId: usuario._id, 
                email: usuario.email 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            mensaje: 'Login exitoso',
            token: token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (err) {
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al realizar login.', 
            error: err.message 
        });
    }
};

// Verificar token (opcional - para validar tokens existentes)
exports.verificarToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                mensaje: 'Token no proporcionado.' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        res.status(200).json({
            mensaje: 'Token válido',
            usuario: decoded
        });

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                mensaje: 'Token inválido.' 
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                mensaje: 'Token expirado.' 
            });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor.', 
            error: err.message 
        });
    }
};

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios.' });
        }

        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await usuarioDAO.obtenerUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email.' });
        }

        // Crear usuario
        const resultado = await usuarioDAO.crear({ nombre, email, password });
        const usuarioGuardado = resultado.usuarioGuardado || resultado;

        // Generar token
        const token = jwt.sign(
            { userId: usuarioGuardado._id, email: usuarioGuardado.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            token,
            usuario: {
                id: usuarioGuardado._id,
                nombre: usuarioGuardado.nombre,
                email: usuarioGuardado.email
            }
        });

    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ mensaje: 'Error interno del servidor al registrar usuario.', error: err.message });
    }
};

module.exports.JWT_SECRET = JWT_SECRET;
