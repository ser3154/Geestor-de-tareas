const express = require('express');
const router = express.Router();
const CategoriaDAO = require('../dataAccess/CategoriasDAO');

const categoriaDAO = new CategoriaDAO();

// CREATE
router.post('/', async (req, res) => {
    try {
        const { nombre, color, descripcion, usuarioId } = req.body;
        const id = await categoriaDAO.crear(nombre, color, descripcion, usuarioId);
        res.status(201).json({ mensaje: 'Categoría creada correctamente', id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear categoría', detalle: error.message });
    }
});

// READ - Todas
router.get('/', async (req, res) => {
    try {
        const { usuarioId } = req.query;
        const categorias = usuarioId
            ? await categoriaDAO.obtenerPorUsuario(usuarioId)
            : await categoriaDAO.obtenerPorUsuario();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
    try {
        const categoria = await categoriaDAO.obtenerPorId(req.params.id);
        if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const categoria = await categoriaDAO.actualizar(req.params.id, req.body);
        if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría actualizada correctamente', categoria });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await categoriaDAO.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
});

module.exports = router;
