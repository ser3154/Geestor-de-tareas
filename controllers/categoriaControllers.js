const express = require('express');
const CategoriaDAO = require('../dataAccess/CategoriasDAO');
const Categoria = require('../models/Categorias');
const categoriaDAO = new CategoriaDAO();

// CREATE
exports.crearCategoria = async (req, res) => {
    try {
        const { nombre, color, descripcion, usuarioId } = req.body;
        if (!nombre || !usuarioId) {
            return res.status(400).json({ mensaje: 'El nombre y el usuarioId son obligatorios.' });
        }
        
        if (typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({ mensaje: 'El nombre debe ser un texto no vacío.' });
        }
        
        if (typeof usuarioId !== 'string' || usuarioId.trim() === '') { // O la validación de ObjectId si usas Mongo
            return res.status(400).json({ mensaje: 'El usuarioId debe ser un texto no vacío.' });
        }
        
        if (color && typeof color !== 'string') {
            return res.status(400).json({ mensaje: 'El color debe ser un texto.' });
        }

        if (descripcion && typeof descripcion !== 'string') {
            return res.status(400).json({ mensaje: 'La descripción debe ser un texto.' });
        }

        const nuevaCategoria = await categoriaDAO.crear(nombre, color, descripcion, usuarioId);
        res.status(201).json(nuevaCategoria);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error interno del servidor al crear la categoría.', error: err.message });
    }
};

// READ - Todas

exports.obtenerCategoriasDeUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const categorias = await categoriaDAO.obtenerPorUsuario(usuarioId)
        res.status(200).json(categorias)
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener las categorías.' });
    }
};

//GET TODAS
exports.obtenerTodasLasCategorias = async (req,res) =>{
    try {
        const categorias = await categoriaDAO.obtenerTodasLasCategorias();
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
        const categoria = await categoriaDAO.obtenerPorId(req.params.id);
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
exports.actualizarCategoriaPorId= async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;
        
        //VALIDACION DATOS
        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío.' });
        }
        const { nombre, color, descripcion } = datosActualizar;
        if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
             return res.status(400).json({ mensaje: 'Si se incluye, el nombre debe ser un texto no vacío.' });
        }
        if (color !== undefined && typeof color !== 'string') {
            return res.status(400).json({ mensaje: 'Si se incluye, el color debe ser un texto.' });
        }
        if (descripcion !== undefined && typeof descripcion !== 'string') {
            return res.status(400).json({ mensaje: 'Si se incluye, la descripción debe ser un texto.' });
        }

        const categoria = await categoriaDAO.actualizar(id, datosActualizar);

        if (!categoria){
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        } 

        res.status(200).json(categoria)
    } catch (error) {
      if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: 'Error de validación en los datos enviados.', error: error.message });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar la categoría.' });
    }
};


exports.eliminarCategoriaPorId= async (req, res) => {
    try {
        const eliminado = await categoriaDAO.eliminar(req.params.id);
        if (!eliminado){
            return res.status(404).json({ mensaje: 'Categoría no encontrada' });
        }
        res.status(204).send() 
    } catch (error) {
       if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al eliminar la categoría.' });
    }
};