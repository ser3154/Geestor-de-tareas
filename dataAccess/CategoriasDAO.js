const Categoria = require('../models/Categorias')
class CategoriaDAO {
    constructor() {}

    // CREATE
    async crear(nombre, color, descripcion, usuarioId) {
        try {
            const nuevaCategoria = { nombre, color, descripcion, usuarioId };
            const categoriaGuardada = await Categoria.create(nuevaCategoria);
            console.log(`✓ Categoría creada con ID: ${categoriaGuardada._id}`);
            return categoriaGuardada._id;
        } catch (error) {
            console.error('✗ Error al crear categoría:', error);
            throw error;
        }
    }

    async obtenerTodasLasCategorias(){
        try {
            const categorias = await Categoria.find()
            return categorias
        } catch (error) {
            console.log("Algo fallo")
            throw error
        }
    }

    // READ - Obtener por ID
    async obtenerPorId(id) {
        try {
            const categoria = await Categoria.findById(id);
            if (categoria) {
                console.log('✓ Categoría encontrada:', categoria.nombre);
            } else {
                console.log('✗ Categoría no encontrada');
            }
            return categoria;
        } catch (error) {
            console.error('✗ Error al obtener categoría:', error);
            throw error;
        }
    }

    // READ - Obtener todas las de un usuario
    async obtenerPorUsuario(usuarioId) {
        console.log(usuarioId)
        try {
            const categorias = await Categoria.find({usuarioId :usuarioId});
            return categorias;
        } catch (error) {
            console.error('✗ Error al obtener categorías del usuario:', error);
            throw error;
        }
    }

    // UPDATE
    async actualizar(id, datos) {
        try {
            const categoriaActualizada = await Categoria.findByIdAndUpdate(id, datos, { new: true });
            if (categoriaActualizada) {
                console.log('✓ Categoría actualizada correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return categoriaActualizada;
        } catch (error) {
            console.error('✗ Error al actualizar categoría:', error);
            throw error;
        }
    }

    // DELETE
    async eliminar(id) {
        try {
            const resultado = await Categoria.findByIdAndDelete(id);
            if (resultado) {
                console.log('✓ Categoría eliminada correctamente');
            } else {
                console.log('✗ Categoría no encontrada');
            }
            return resultado;
        } catch (error) {
            console.error('✗ Error al eliminar categoría:', error);
            throw error;
        }
    }

    

    async cambiarColor(id, nuevoColor) {
        return this.actualizar(id, { color: nuevoColor });
    }

    async cambiarNombre(id, nuevoNombre) {
        return this.actualizar(id, { nombre: nuevoNombre });
    }

    async contarPorUsuario(usuarioId) {
        try {
            const count = await Categoria.countDocuments({ usuarioId });
            console.log(`✓ El usuario tiene ${count} categorías`);
            return count;
        } catch (error) {
            console.error('✗ Error al contar categorías:', error);
            throw error;
        }
    }
}

module.exports = new CategoriaDAO();