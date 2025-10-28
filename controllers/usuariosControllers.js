const express = require('express');
const UsuarioDAO = require('../dataAccess/UsuarioDAO');
const { validationResult } = require('express-validator');


exports.crearUsuario = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, email, password } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await UsuarioDAO.obtenerUsuarioPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
        }
        // Crear el nuevo usuario
        const nuevoUsuario = await UsuarioDAO.crear({ nombre, email, password });
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        next(error);
    }
};

exports.obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioDAO.obtenerTodos();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener usuarios', error: err.message });
    }
};

// READ - Por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await UsuarioDAO.obtenerPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }
        res.status(200).json(usuario);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener el usuario.', error: err.message });
    }
};

// UPDATE
exports.actualizarUsuario = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const datosActualizar = req.body;

        const usuarioActualizado = await UsuarioDAO.actualizar(id, datosActualizar);
        
        if (!usuarioActualizado) {
            return res.status(404).json({ msg: "ID del usuario no encontrado" });
        }

        res.status(200).json(usuarioActualizado);

    } catch (err) {
        // El error de email duplicado lo podemos manejar de forma más específica
        if (err.code === 11000) {
            return res.status(409).json({ mensaje: 'El email ya se encuentra registrado por otro usuario.' });
        }
        // Pasamos cualquier otro error al manejador centralizado
        next(err);
    }
};

// DELETE
exports.eliminarUsuario = async (req, res) => {
    try {
        const eliminado = await UsuarioDAO.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }
        res.status(204).send()
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al eliminar el usuario.', error: err.message });
    }
};