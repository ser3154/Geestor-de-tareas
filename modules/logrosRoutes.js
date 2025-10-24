const express = require('express');
const router = express.Router();
const LogroDAO = require('../dataAccess/LogrosDAO');

const logroDAO = new LogroDAO();

// CREATE
router.post('/', async (req, res) => {
    try {
        const { usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio } = req.body;
        const id = await logroDAO.crear(usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio);
        res.status(201).json({ mensaje: 'Logro creado correctamente', id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear logro', detalle: error.message });
    }
});

// READ - Todos por usuario
router.get('/', async (req, res) => {
    try {
        const { usuarioId } = req.query;
        if (!usuarioId) return res.status(400).json({ error: 'Falta usuarioId' });
        const logros = await logroDAO.obtenerPorUsuario(usuarioId);
        res.json(logros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener logros' });
    }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
    try {
        const logro = await logroDAO.obtenerPorId(req.params.id);
        if (!logro) return res.status(404).json({ mensaje: 'Logro no encontrado' });
        res.json(logro);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener logro' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const logro = await logroDAO.actualizar(req.params.id, req.body);
        if (!logro) return res.status(404).json({ mensaje: 'Logro no encontrado' });
        res.json({ mensaje: 'Logro actualizado correctamente', logro });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar logro' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await logroDAO.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Logro no encontrado' });
        res.json({ mensaje: 'Logro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar logro' });
    }
});

module.exports = router;
