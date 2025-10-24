const express = require('express');
const router = express.Router();
const RachaDAO = require('../dataAccess/RachaDAO');

const rachaDAO = new RachaDAO();

// CREATE
router.post('/', async (req, res) => {
    try {
        const id = await rachaDAO.crear(req.body);
        res.status(201).json({ mensaje: 'Racha creada correctamente', id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear racha', detalle: error.message });
    }
});

// READ - Todas por usuario
router.get('/', async (req, res) => {
    try {
        const { usuarioId } = req.query;
        if (!usuarioId) return res.status(400).json({ error: 'Falta usuarioId' });
        const rachas = await rachaDAO.obtenerPorUsuario(usuarioId);
        res.json(rachas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener rachas' });
    }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
    try {
        const racha = await rachaDAO.obtenerPorId(req.params.id);
        if (!racha) return res.status(404).json({ mensaje: 'Racha no encontrada' });
        res.json(racha);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener racha' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const racha = await rachaDAO.actualizar(req.params.id, req.body);
        if (!racha) return res.status(404).json({ mensaje: 'Racha no encontrada' });
        res.json({ mensaje: 'Racha actualizada correctamente', racha });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar racha' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await rachaDAO.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Racha no encontrada' });
        res.json({ mensaje: 'Racha eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar racha' });
    }
});

module.exports = router;
