const express = require('express');

const UsuarioDAO = require('../dataAccess/UsuarioDAO');


const usuarioDAO = new UsuarioDAO();


exports.crearUsuario = async (req, res) => {
    try {
       const usuarioCreado = await usuarioDAO.crear(req.body);
       
        res.status(201).json(usuarioCreado);
    } catch (err) {
        res.status(500).json({ msg: 'Error al crear usuario', error: err.message });
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
        res.status(500).json({ msg: 'No se pudo obtener el usuario.', error: err.message });
    }
};

// UPDATE
exports.actualizarUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await usuarioDAO.actualizar(req.params.id, req.body);
        if (!usuarioActualizado) {
            return res.status(404).json({ msg: "ID del usuario no encontrado" });
        }
        res.status(200).json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ msg: 'No se pudo actualizar el usuario.', error: err.message });
    }
};

// DELETE
exports.eliminarUsuario = async (req, res) => {
    try {
        const eliminado = await usuarioDAO.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: "Eliminado correctamente." });
    } catch (err) {
        res.status(500).json({ msg: 'No se puede eliminar el usuario', error: err.message });
    }
};