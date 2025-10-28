const express = require('express');
const LogroDAO = require('../dataAccess/LogrosDAO');
const { validationResult } = require('express-validator');
const { body } = require('express-validator');
// CREATE
exports.crearLogro = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio } = req.body;
        const id = await LogroDAO.crear(usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio);
        const logroCreado = await LogroDAO.obtenerPorId(id);

        res.status(201).json(logroCreado);
    } catch (err) {
        next(err);
    }
};

// READ - Todos los logros
exports.obtenerTodosLosLogros = async (req, res) => {
    try {
        const logros = await LogroDAO.obtenerTodosLosLogros();
        res.status(200).json(logros);
    } catch (err) {
        res.status(500).json({ 
            mensaje: 'Error al obtener logros', 
            error: err.message 
        });
    }
};

// READ - Logros por usuario
exports.obtenerLogrosPorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params; 
        
        if (!usuarioId) {
            return res.status(400).json({ mensaje: 'El usuarioId es requerido.' });
        }
        
        const logros = await LogroDAO.obtenerPorUsuario(usuarioId);
        res.status(200).json(logros);
    } catch (err) {
        res.status(500).json({ 
            mensaje: 'Error al obtener logros del usuario', 
            error: err.message 
        });
    }
};

// READ - Por ID
exports.obtenerLogroPorId = async (req, res) => {
    try {
        const logro = await LogroDAO.obtenerPorId(req.params.id);
        
        if (!logro) {
            return res.status(404).json({ mensaje: 'Logro no encontrado.' });
        }
        
        res.status(200).json(logro);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al obtener el logro.', 
            error: err.message 
        });
    }
};

// UPDATE
exports.actualizarLogro = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const datosActualizar = req.body;

        const logroActualizado = await LogroDAO.actualizar(id, datosActualizar);

        if (!logroActualizado) {
            return res.status(404).json({ mensaje: 'Logro no encontrado.' });
        }

        res.status(200).json(logroActualizado);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        next(err);
    }
};

// DELETE
exports.eliminarLogro = async (req, res) => {
    try {
        const eliminado = await LogroDAO.eliminar(req.params.id);
        
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Logro no encontrado.' });
        }
        
        res.status(204).send();
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al eliminar el logro.', 
            error: err.message 
        });
    }
};