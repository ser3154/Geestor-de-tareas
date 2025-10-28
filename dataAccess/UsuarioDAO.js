const Usuario = require('../models/Usuario');

class UsuarioDAO {
    constructor() {}

    // CREATE
    async crear(datosUsuario) {
        try {
            const usuarioGuardado = await Usuario.create(datosUsuario);
            console.log(`✓ Usuario creado con ID: ${usuarioGuardado._id}`);
            return {msj: "Usuario registrado correctamente." , usuarioGuardado};
        } catch (error) {
            console.error('✗ Error al crear usuario:', error);
            throw error;
        }
    }

    async obtenerUsuarioPorEmail(email) {
        try {
            const usuario = await Usuario.findOne({ email: email });
            if (usuario) {
                console.log(`✓ Usuario encontrado por email: ${usuario.email}`);
            } else {
                console.log(`✗ Usuario con email ${email} no encontrado`);
            }
            return usuario;
        } catch (error) {
            console.error('✗ Error al obtener usuario por email:', error);
            throw error;
        }
    }

    // READ - Obtener por ID
    async obtenerPorId(id) {
        try {
            const usuario = await Usuario.findById(id);
            if (usuario) {
                console.log('✓ Usuario encontrado:', usuario.nombre);
            } else {
                console.log('✗ Usuario no encontrado');
            }
            return usuario;
        } catch (error) {
            console.error('✗ Error al obtener usuario:', error);
            throw error;
        }
    }

    // READ - Obtener todos los usuarios
    async obtenerTodos() {
        try {
            const usuarios = await Usuario.find({});
            console.log(`✓ Se encontraron ${usuarios.length} usuarios`);
            return usuarios;
        } catch (error) {
            console.error('✗ Error al obtener usuarios:', error);
            throw error;
        }
    }

    // UPDATE - Actualizar usuario
    async actualizar(id, datos) {
        try {
            const usuarioActualizado = await Usuario.findByIdAndUpdate(id, datos, { new: true });
            if (usuarioActualizado) {
                console.log('✓ Usuario actualizado correctamente');
            } else {
                console.log('✗ No se realizaron cambios');
            }
            return usuarioActualizado;
        } catch (error) {
            console.error('✗ Error al actualizar usuario:', error);
            throw error;
        }
    }

    // DELETE
    async eliminar(id) {
        try {
            const resultado = await Usuario.findByIdAndDelete(id);
            if (resultado) {
                console.log('✓ Usuario eliminado correctamente');
            } else {
                console.log('✗ Usuario no encontrado');
            }
            return resultado;
        } catch (error) {
            console.error('✗ Error al eliminar usuario:', error);
            throw error;
        }
    }
}

module.exports = new UsuarioDAO();