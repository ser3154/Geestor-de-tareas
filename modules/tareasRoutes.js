const express = require('express');
const router = express.Router();
const TareaDAO = require('../dataAccess/TareaDAO');

const tareaDAO = new TareaDAO();

// CREATE
router.post('/', async (req, res) => {
    try {
        const id = await tareaDAO.crear(req.body);
        res.status(201).json({ mensaje: 'Tarea creada correctamente', id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear tarea', detalle: error.message });
    }
});

// READ - Todas (opcional por usuario)
router.get('/', async (req, res) => {
    try {
        const { usuarioId } = req.query;
        const tareas = usuarioId
            ? await tareaDAO.obtenerPorUsuario(usuarioId)
            : await tareaDAO.obtenerPorUsuario();
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
    try {
        const tarea = await tareaDAO.obtenerPorId(req.params.id);
        if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tarea' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const tarea = await tareaDAO.actualizar(req.params.id, req.body);
        if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea actualizada correctamente', tarea });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await tareaDAO.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        res.json({ mensaje: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
});

module.exports = router;
