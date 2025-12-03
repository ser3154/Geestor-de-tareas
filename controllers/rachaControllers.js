const RachaDAO = require('../dataAccess/RachaDAO');
const rachaDAO = new RachaDAO();

const estatusValidos = ['activa', 'rota'];

exports.crearRacha = async (req, res) => {
    try {
        const { usuarioId, tareaId } = req.body;

        if (!usuarioId || !tareaId) {
            return res.status(400).json({ mensaje: 'El usuarioId y tareaId son obligatorios.' });
        }
        if (typeof usuarioId !== 'string' || usuarioId.trim() === '') {
            return res.status(400).json({ mensaje: 'El usuarioId debe ser un texto no vacío.' });
        }
        if (typeof tareaId !== 'string' || tareaId.trim() === '') {
            return res.status(400).json({ mensaje: 'El tareaId debe ser un texto no vacío.' });
        }

        // Crear y obtener el documento completo
        const nuevoId = await rachaDAO.crear(req.body);
        const rachaCreada = await rachaDAO.obtenerPorId(nuevoId);

        res.status(201).json(rachaCreada);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Error de validación.', error: err.message });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al crear la racha.', error: err.message });
    }
};

exports.obtenerTodasLasRachas = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        if (!usuarioId) {
            return res.status(400).json({ mensaje: 'Se requiere query param usuarioId para listar rachas.' });
        }
        const rachas = await rachaDAO.obtenerPorUsuario(usuarioId);
        res.status(200).json(rachas);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener rachas', error: err.message });
    }
};

exports.obtenerRachaPorId = async (req, res) => {
    try {
        const racha = await rachaDAO.obtenerPorId(req.params.id);
        if (!racha) {
            return res.status(404).json({ mensaje: 'Racha no encontrada.' });
        }
        res.status(200).json(racha);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener la racha.', error: err.message });
    }
};

exports.actualizarRacha = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;

        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío.' });
        }

        const { racha_actual, racha_maxima, estatus } = datosActualizar;

        if (racha_actual !== undefined && (!Number.isInteger(racha_actual) || racha_actual < 0)) {
            return res.status(400).json({ mensaje: 'Si se incluye, racha_actual debe ser un número entero no negativo.' });
        }
        if (racha_maxima !== undefined && (!Number.isInteger(racha_maxima) || racha_maxima < 0)) {
            return res.status(400).json({ mensaje: 'Si se incluye, racha_maxima debe ser un número entero no negativo.' });
        }
        if (estatus !== undefined && !estatusValidos.includes(estatus)) {
            return res.status(400).json({ mensaje: `Si se incluye, el estatus debe ser uno de: ${estatusValidos.join(', ')}.` });
        }

        const rachaActualizada = await rachaDAO.actualizar(id, datosActualizar);
        if (!rachaActualizada) {
            return res.status(404).json({ mensaje: 'ID de la racha no encontrado.' });
        }
        res.status(200).json(rachaActualizada);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar la racha.', error: err.message });
    }
};

exports.eliminarRacha = async (req, res) => {
    try {
        const eliminado = await rachaDAO.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Racha no encontrada.' });
        }
        // ✅ FIX: Devolver JSON en lugar de res.status(204).send()
        res.status(200).json({ 
            mensaje: 'Racha eliminada correctamente',
            id: req.params.id 
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al eliminar la racha.', 
            error: err.message 
        });
    }
};