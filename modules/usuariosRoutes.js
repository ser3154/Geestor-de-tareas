const express = require('express');
const router = express.Router();
const UsuarioDAO = require('../dataAccess/UsuarioDAO');

const usuarioDAO = new UsuarioDAO();

// CREATE
router.post('/', async (req, res) => {
    try {
        const { nombre, email } = req.body;
        const id = await usuarioDAO.crear(nombre, email);
        res.status(201).json({ mensaje: 'Usuario creado correctamente', id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
    }
});

// READ - Todos
router.get('/', async (req, res) => {
    try {
        const usuarios = await usuarioDAO.obtenerTodos();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
    try {
        const usuario = await usuarioDAO.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const usuario = await usuarioDAO.actualizar(req.params.id, req.body);
        if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario actualizado correctamente', usuario });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await usuarioDAO.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
