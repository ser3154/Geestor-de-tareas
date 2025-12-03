const { validationResult } = require('express-validator');
const express = require('express');
const CategoriaDAO = require('../dataAccess/CategoriasDAO');
const Categoria = require('../models/Categorias');


// CREATE
exports.crearCategoria = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, color, descripcion, usuarioId } = req.body;
        const nuevaCategoria = await CategoriaDAO.crear(nombre, color, descripcion, usuarioId);
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        next(err);
    }
};

// READ - Todas

exports.obtenerCategoriasDeUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const categorias = await CategoriaDAO.obtenerPorUsuario(usuarioId)
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener las categorías.' });
    }
};

//GET TODAS
exports.obtenerTodasLasCategorias = async (req,res) =>{
    try {
        const categorias = await CategoriaDAO.obtenerTodasLasCategorias();
        if(!categorias){
              return res.status(404).json({ mensaje: 'CategoríaS no encontradas' });
        }
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({error : 'Error al obtener las categorias'})
    }
}

// READ - Por ID
exports.obtenerCategoriaPorId= async (req, res) => {
    try {
        const categoria = await CategoriaDAO.obtenerPorId(req.params.id);
        if (!categoria) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.status(200).json(categoria);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener la categoría.' });
    }
};



// UPDATE
exports.actualizarCategoriaPorId = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        const categoriaActualizada = await CategoriaDAO.actualizar(id, datosActualizar);
        if (!categoriaActualizada) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada.' });
        }
        res.json(categoriaActualizada);
    } catch (error) {
        next(error);
    }
};


exports.eliminarCategoriaPorId = async (req, res) => {
    try {
        const eliminado = await CategoriaDAO.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        // ✅ FIX: Devolver JSON en lugar de res.status(204).send()
        res.status(200).json({ 
            mensaje: 'Categoría eliminada correctamente',
            id: req.params.id 
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al eliminar la categoría.' 
        });
    }
};