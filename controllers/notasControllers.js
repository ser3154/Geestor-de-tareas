const express = require('express');
const NotaDAO = require('../dataAccess/NotaDAO');
const Nota = require('../models/Nota');
const notaDAO = new NotaDAO();

// CREATE
exports.crearNota = async (req, res) => {
    try {
        const { contenido, tipo, usuarioId } = req.body;
        if (!contenido || !usuarioId) {
            return res.status(400).json({ mensaje: 'El contenido y el usuarioId son obligatorios.' });
        }
        
        if (typeof contenido !== 'string' || contenido.trim() === '') {
            return res.status(400).json({ mensaje: 'El contenido debe ser un texto no vacío.' });
        }
        
        if (typeof usuarioId !== 'string' || usuarioId.trim() === '') {
            return res.status(400).json({ mensaje: 'El usuarioId debe ser un texto no vacío.' });
        }
        
        if (tipo && typeof tipo !== 'string') {
            return res.status(400).json({ mensaje: 'El tipo debe ser un texto.' });
        }

        const nuevaNota = await notaDAO.crear(contenido, tipo, usuarioId);
        res.status(201).json(nuevaNota);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error interno del servidor al crear la nota.', error: err.message });
    }
};

// READ - Todas las notas de un usuario
exports.obtenerNotasDeUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const notas = await notaDAO.obtenerPorUsuario(usuarioId);
        res.status(200).json(notas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener las notas.' });
    }
};

// READ - Por ID
exports.obtenerNotaPorId = async (req, res) => {
    try {
        const nota = await notaDAO.obtenerPorId(req.params.id);
        if (!nota) {
            return res.status(404).json({ mensaje: 'Nota no encontrada' });
        }
        res.status(200).json(nota);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener la nota.' });
    }
};

// UPDATE
exports.actualizarNotaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        
        // VALIDACION DATOS
        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío.' });
        }
        
        const { contenido, tipo } = datosActualizar;
        if (contenido !== undefined && (typeof contenido !== 'string' || contenido.trim() === '')) {
            return res.status(400).json({ mensaje: 'Si se incluye, el contenido debe ser un texto no vacío.' });
        }
        if (tipo !== undefined && typeof tipo !== 'string') {
            return res.status(400).json({ mensaje: 'Si se incluye, el tipo debe ser un texto.' });
        }

        const nota = await notaDAO.actualizar(id, datosActualizar);

        if (!nota) {
            return res.status(404).json({ mensaje: 'Nota no encontrada' });
        } 

        res.status(200).json(nota);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Error de validación en los datos enviados.', error: error.message });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar la nota.' });
    }
};

// DELETE
exports.eliminarNotaPorId = async (req, res) => {
    try {
        const eliminado = await notaDAO.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Nota no encontrada' });
        }
        // ✅ FIX: Devolver JSON en lugar de res.status(204).send()
        res.status(200).json({ 
            mensaje: 'Nota eliminada correctamente',
            id: req.params.id 
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al eliminar la nota.' 
        });
    }
};
