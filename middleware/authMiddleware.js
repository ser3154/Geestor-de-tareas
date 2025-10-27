const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/authController');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                mensaje: 'Token de autorización requerido.' 
            });
        }

        // El formato debe ser "Bearer TOKEN"
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                mensaje: 'Formato de token inválido. Use: Bearer TOKEN' 
            });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Agregar información del usuario al request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };
        
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                mensaje: 'Token JWT inválido.' 
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                mensaje: 'Token JWT expirado.' 
            });
        }
        return res.status(500).json({ 
            mensaje: 'Error interno del servidor al verificar token.' 
        });
    }
};

module.exports = authMiddleware;
