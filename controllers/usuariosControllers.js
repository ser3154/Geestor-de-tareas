const express = require('express');
const UsuarioDAO = require('../dataAccess/UsuarioDAO');
const usuarioDAO = new UsuarioDAO();


exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'El nombre, email y password son obligatorios.' });
        }
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ mensaje: 'El nombre debe ser un texto no vacío.' });
        }

        // Expresión regular simple para validar el formato del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== 'string' || !emailRegex.test(email)) {
            return res.status(400).json({ mensaje: 'El formato del email no es válido.' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ mensaje: 'La contraseña debe ser un texto de al menos 6 caracteres.' });
        }
        const usuarioCreado = await usuarioDAO.crear(req.body);
        res.status(201).json(usuarioCreado);

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ mensaje: 'El email ya se encuentra registrado.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al crear el usuario.', error: err.message });
    }
};

exports.obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioDAO.obtenerTodos();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener usuarios', error: err.message });
    }
};

// READ - Por ID
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await usuarioDAO.obtenerPorId(req.params.id);
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
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;

        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío.' });
        }
        const { nombre, email, password } = datosActualizar;
        //---------------------------------------------- VALIDACION ----------------------------------------------//
        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
             return res.status(400).json({ mensaje: 'Si se incluye, el nombre debe ser un texto no vacío.' });
        }
        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof email !== 'string' || !emailRegex.test(email)) {
                return res.status(400).json({ mensaje: 'Si se incluye, el formato del email no es válido.' });
            }
        }
        if (password !== undefined && (typeof password !== 'string' || password.length < 6)) {
            return res.status(400).json({ mensaje: 'Si se incluye, la contraseña debe tener al menos 6 caracteres.' });
        }
        //---------------------------------------------- VALIDACION ----------------------------------------------//

        const usuarioActualizado = await usuarioDAO.actualizar(id,datosActualizar);
        if (!usuarioActualizado) {
            return res.status(404).json({ msg: "ID del usuario no encontrado" });
        }
        res.status(200).json(usuarioActualizado);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        if (err.code === 11000) {
            return res.status(409).json({ mensaje: 'El email ya se encuentra registrado por otro usuario.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar el usuario.', error: err.message });
    }
};

// DELETE
exports.eliminarUsuario = async (req, res) => {
    try {
        const eliminado = await usuarioDAO.eliminar(req.params.id);
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