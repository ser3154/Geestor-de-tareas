const express = require('express');
const CategoriaDAO = require('../dataAccess/CategoriasDAO');
const Categoria = require('../models/Categorias');
const categoriaDAO = new CategoriaDAO();

// CREATE
exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, color, descripcion, usuarioId } = req.body;
        const id = await categoriaDAO.crear(nombre, color, descripcion, usuarioId);
        res.status(201).json({ mensaje: 'Categoría creada correctamente', id });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear categoría', error: err.message });
    }
};

// READ - Todas
exports.obtenerCategoriasDeUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        const categorias = await categoriaDAO.obtenerPorUsuario(usuarioId)
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

//GET TODAS
exports.obtenerTodasLasCategorias = async (req,res) =>{
    try {
        const categorias = await categoriaDAO.obtenerTodasLasCategorias();
        if(!categorias){
            
        }
        res.json(categorias)
    } catch (error) {
        res.status(500).json({error : 'Error al obtener las categorias'})
    }
}

// READ - Por ID
exports.obtenerCategoriaPorId= async (req, res) => {
    try {
        const categoria = await categoriaDAO.obtenerPorId(req.params.id);
        if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
};



// UPDATE
exports.actualizarCategoriaPorId= async (req, res) => {
    try {
        const categoria = await categoriaDAO.actualizar(req.params.id, req.body);
        if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría actualizada correctamente', categoria });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

// DELETE
exports.eliminarCategoriaPorId= async (req, res) => {
    try {
        const eliminado = await categoriaDAO.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
};