const express = require('express');
const LogroDAO = require('../dataAccess/LogrosDAO');
const logroDAO = new LogroDAO();

// CREATE
exports.crearLogro = async (req, res) => {
    try {
        const { usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio } = req.body;
        
        // VALIDACIONES
        if (!usuarioId || typeof usuarioId !== 'string' || usuarioId.trim() === '') {
            return res.status(400).json({ mensaje: 'El usuarioId es obligatorio y debe ser un texto no vacío.' });
        }
        
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ mensaje: 'El nombre es obligatorio y debe ser un texto no vacío.' });
        }
        
        if (!descripcion || typeof descripcion !== 'string' || descripcion.trim() === '') {
            return res.status(400).json({ mensaje: 'La descripción es obligatoria y debe ser un texto no vacío.' });
        }
        
        if (icono && typeof icono !== 'string') {
            return res.status(400).json({ mensaje: 'Si se incluye, el icono debe ser un texto.' });
        }
        
        if (fecha_otorgado !== undefined) {
            const ts = Date.parse(fecha_otorgado);
            if (isNaN(ts)) {
                return res.status(400).json({ mensaje: 'Si se incluye, fecha_otorgado debe ser una fecha válida.' });
            }
        }

        const id = await logroDAO.crear(usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio);
        const logroCreado = await logroDAO.obtenerPorId(id);
        
        res.status(201).json(logroCreado);
    } catch (err) {
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al crear el logro.', 
            error: err.message 
        });
    }
};

// READ - Todos los logros
exports.obtenerTodosLosLogros = async (req, res) => {
    try {
        const logros = await logroDAO.obtenerTodosLosLogros();
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
        const { usuarioId } = req.params; // ✅ CORREGIDO: usa req.params en lugar de req.query
        
        if (!usuarioId) {
            return res.status(400).json({ mensaje: 'El usuarioId es requerido.' });
        }
        
        const logros = await logroDAO.obtenerPorUsuario(usuarioId);
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
        const logro = await logroDAO.obtenerPorId(req.params.id);
        
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
exports.actualizarLogro = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        
        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío.' });
        }
        
        const { nombre, descripcion, icono, fecha_otorgado, criterio } = datosActualizar;
        
        // VALIDACIONES
        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
            return res.status(400).json({ mensaje: 'Si se incluye, el nombre debe ser un texto no vacío.' });
        }
        
        if (descripcion !== undefined && (typeof descripcion !== 'string' || descripcion.trim() === '')) {
            return res.status(400).json({ mensaje: 'Si se incluye, la descripción debe ser un texto no vacío.' });
        }
        
        if (icono !== undefined && typeof icono !== 'string') {
            return res.status(400).json({ mensaje: 'Si se incluye, el icono debe ser un texto.' });
        }
        
        if (fecha_otorgado !== undefined) {
            const ts = Date.parse(fecha_otorgado);
            if (isNaN(ts)) {
                return res.status(400).json({ mensaje: 'Si se incluye, fecha_otorgado debe ser una fecha válida.' });
            }
        }
        
        const logroActualizado = await logroDAO.actualizar(id, datosActualizar);
        
        if (!logroActualizado) {
            return res.status(404).json({ mensaje: 'Logro no encontrado.' });
        }
        
        res.status(200).json(logroActualizado);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al actualizar el logro.', 
            error: err.message 
        });
    }
};

// DELETE
exports.eliminarLogro = async (req, res) => {
    try {
        const eliminado = await logroDAO.eliminar(req.params.id);
        
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