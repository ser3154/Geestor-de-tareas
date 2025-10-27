const express = require('express');
const LogroDAO = require('../dataAccess/LogrosDAO');
const logroDAO = new LogroDAO()



// CREATE
exports.crearLogro = async (req, res) => {
    try {
        const { usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio } = req.body;
        const id = await logroDAO.crear(usuarioId, nombre, descripcion, icono, fecha_otorgado, criterio);
        res.status(201).json({ mensaje: 'Logro creado correctamente', id });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear logro', detalle: error.message });
    }
};

// READ - Todos por usuario
exports.obtenerLogrosPorUsuario = async (req,res) =>{
    try {
        const { usuarioId } = req.query;
        if (!usuarioId) return res.status(400).json({ error: 'Falta usuarioId' });
        const logros = await logroDAO.obtenerPorUsuario(usuarioId);
        res.json(logros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener logros' });
    }
};

exports.obtenerLogroPorId = async(req,res) =>{
    try {
        const logro = await logroDAO.obtenerPorId(req.params.id);
        if (!logro) return res.status(404).json({ mensaje: 'Logro no encontrado' });
        res.json(logro);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener logro' });
    }
};

exports.obtenerTodosLosLogros = async(req,res) =>{
    console.log("Si llega aqui")
    try {
        const logros = await logroDAO.obtenerTodosLosLogros()   
        res.status(200).json(logros)
    } catch (error) {
        res.status(500).json({error : 'Error al obtener los logros'})
    }
}


exports.actualizarLogro = async (req,res) =>{
    try {
        const logro = await logroDAO.actualizar(req.params.id, req.body);
        if (!logro) return res.status(404).json({ mensaje: 'Logro no encontrado' });
        res.json({ mensaje: 'Logro actualizado correctamente', logro });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar logro' });
    }
};

// DELETE
exports.eliminarLogro= async(req,res) =>{
    try {
        const eliminado = await logroDAO.eliminar(req.params.id);
        if (!eliminado){
            return res.status(404).json({ mensaje: 'Logro no encontrado' });
        }
        res.status(204).send()

    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar logro' });
    }
};