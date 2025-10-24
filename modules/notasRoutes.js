const express = require('express');
const router = express.Router();
const NotaDAO = require('../dataAccess/NotaDAO');

const notaDAO = new NotaDAO();

// CREATE
router.post('/', async (req, res) => {
    try {
        const { contenido, tipo, usuarioId } = req.body;
        const id = await notaDAO.crear(contenido, tipo, usuarioId);
        res.status(201).json({ mensaje: 'Nota creada correctamente', id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear nota', detalle: error.message });
    }
});

// READ - Todas (por usuario)
router.get('/', async (req, res) => {
    try {
        const { usuarioId } = req.query;
        if (!usuarioId) return res.status(400).json({ error: 'Falta el usuarioId en la consulta' });
        const notas = await notaDAO.obtenerPorUsuario(usuarioId);
        res.json(notas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notas' });
    }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
    try {
        const nota = await notaDAO.obtenerPorId(req.params.id);
        if (!nota) return res.status(404).json({ mensaje: 'Nota no encontrada' });
        res.json(nota);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener nota' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const nota = await notaDAO.actualizar(req.params.id, req.body);
        if (!nota) return res.status(404).json({ mensaje: 'Nota no encontrada' });
        res.json({ mensaje: 'Nota actualizada correctamente', nota });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar nota' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await notaDAO.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Nota no encontrada' });
        res.json({ mensaje: 'Nota eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar nota' });
    }
});

module.exports = router;
