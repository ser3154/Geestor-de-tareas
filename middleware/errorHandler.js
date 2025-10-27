const errorHandler = (err, req, res, next) => {
    console.error('Error capturado por middleware:', err);

    // Error de validación de Mongoose
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            mensaje: 'Error de validación',
            errores: errors
        });
    }

    // Error de casteo de ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            mensaje: 'ID proporcionado no es válido'
        });
    }

    // Error de duplicado (código 11000)
    if (err.code === 11000) {
        return res.status(409).json({
            mensaje: 'El recurso ya existe (duplicado)'
        });
    }

    // Error de autenticación JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            mensaje: 'Token JWT inválido'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            mensaje: 'Token JWT expirado'
        });
    }

    // Error interno del servidor (por defecto)
    res.status(500).json({
        mensaje: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
};

module.exports = errorHandler;
