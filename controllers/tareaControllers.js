const TareaDAO = require('../dataAccess/TareaDAO');
const tareaDAO = new TareaDAO();
const LogroDAO = require('../dataAccess/LogrosDAO');
const estadosValidos = ['pendiente', 'en_progreso', 'completada'];
const prioridadesValidas = ['baja', 'media', 'alta'];

exports.crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion, estado, fecha_vencimiento, prioridad, usuarioId, categoria, recordatorios } = req.body;

        if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
            return res.status(400).json({ mensaje: 'El titulo es obligatorio y debe ser un texto no vacío.' });
        }
        if (!usuarioId || typeof usuarioId !== 'string' || usuarioId.trim() === '') {
            return res.status(400).json({ mensaje: 'El usuarioId es obligatorio y debe ser un texto no vacío.' });
        }
        if (estado !== undefined && !estadosValidos.includes(estado)) {
            return res.status(400).json({ mensaje: `El estado, si se incluye, debe ser uno de: ${estadosValidos.join(', ')}.` });
        }
        if (prioridad !== undefined && !prioridadesValidas.includes(prioridad)) {
            return res.status(400).json({ mensaje: `La prioridad, si se incluye, debe ser uno de: ${prioridadesValidas.join(', ')}.` });
        }
        if (fecha_vencimiento !== undefined) {
            const ts = Date.parse(fecha_vencimiento);
            if (isNaN(ts)) {
                return res.status(400).json({ mensaje: 'Si se incluye, fecha_vencimiento debe ser una fecha válida.' });
            }
        }

        // Crear y obtener el documento completo (TareaDAO.crear devuelve el _id)
        const nuevoId = await tareaDAO.crear(req.body);
        const tareaCreada = await tareaDAO.obtenerPorId(nuevoId);

        res.status(201).json(tareaCreada);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ mensaje: 'Conflicto al crear la tarea (clave duplicada).' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al crear la tarea.', error: err.message });
    }
};

exports.obtenerTodasLasTareas = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        if (!usuarioId) {
            return res.status(400).json({ mensaje: 'Se requiere query param usuarioId para listar tareas.' });
        }
        const tareas = await tareaDAO.obtenerPorUsuario(usuarioId);
        res.status(200).json(tareas);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener tareas', error: err.message });
    }
};

exports.obtenerTareaPorId = async (req, res) => {
    try {
        const tarea = await tareaDAO.obtenerPorId(req.params.id);
        if (!tarea) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
        }
        res.status(200).json(tarea);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al obtener la tarea.', error: err.message });
    }
};

exports.actualizarTarea = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;

        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no puede estar vacío.' });
        }

        const { titulo, descripcion, estado, fecha_vencimiento, prioridad, usuarioId } = datosActualizar;

        if (titulo !== undefined && (typeof titulo !== 'string' || titulo.trim() === '')) {
            return res.status(400).json({ mensaje: 'Si se incluye, el titulo debe ser un texto no vacío.' });
        }
        if (estado !== undefined && !estadosValidos.includes(estado)) {
            return res.status(400).json({ mensaje: `Si se incluye, el estado debe ser uno de: ${estadosValidos.join(', ')}.` });
        }
        if (prioridad !== undefined && !prioridadesValidas.includes(prioridad)) {
            return res.status(400).json({ mensaje: `Si se incluye, la prioridad debe ser uno de: ${prioridadesValidas.join(', ')}.` });
        }
        if (fecha_vencimiento !== undefined) {
            const ts = Date.parse(fecha_vencimiento);
            if (isNaN(ts)) {
                return res.status(400).json({ mensaje: 'Si se incluye, fecha_vencimiento debe ser una fecha válida.' });
            }
        }
        if (usuarioId !== undefined && (typeof usuarioId !== 'string' || usuarioId.trim() === '')) {
            return res.status(400).json({ mensaje: 'Si se incluye, el usuarioId debe ser un texto no vacío.' });
        }

        
        const tareaActualizada = await tareaDAO.actualizar(id, datosActualizar);
        if (!tareaActualizada) {
            return res.status(404).json({ mensaje: 'ID de la tarea no encontrado.' });
        }

        if (tareaActualizada.estado === 'completada') {
            
            try {
                const usuarioId = tareaActualizada.usuarioId;
                
                // Verificar si el usuario ya tiene el logro de "Primera Tarea"
                // Obtenemos todos los logros del usuario
                const logrosUsuario = await LogroDAO.obtenerPorUsuario(usuarioId);
                
                // Buscamos si ya existe el logro específico
                const tieneLogroPrimerTarea = logrosUsuario.some(logro => 
                    logro.nombre === 'Primera Tarea Completada'
                );
                
                if (!tieneLogroPrimerTarea) {
                    // Si no lo tiene, se lo creamos
                    
                    await LogroDAO.crear(
                        usuarioId,
                        'Primera Tarea Completada', 
                        '¡Has completado tu primera tarea exitosamente!', 
                        '🏅', 
                        new Date(),
                        'Completar 1 tarea' // Criterio
                    );
                    console.log(`🏆 Logro otorgado al usuario ${usuarioId}: Primera Tarea Completada`);
                    
                }else {
                    
                }
            } catch (logroErr) {
                console.error('🔍 DEBUG ERROR: Falló la creación del logro:', logroErr);
                console.error('Error al intentar otorgar logro:', logroErr);
            }} else {
            console.log('🔍 DEBUG: No entró al IF de estado. Estado es:', tareaActualizada.estado);
        }
        
        res.status(200).json(tareaActualizada);
    } catch (err) {
        console.error('Error general:', err);
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        if (err.code === 11000) {
            return res.status(409).json({ mensaje: 'Conflicto al actualizar la tarea (clave duplicada).' });
        }
        res.status(500).json({ mensaje: 'Error interno del servidor al actualizar la tarea.', error: err.message });
    }
};

exports.eliminarTarea = async (req, res) => {
    try {
        const eliminado = await tareaDAO.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
        }
        res.status(200).json({ 
            mensaje: 'Tarea eliminada correctamente',
            id: req.params.id 
        });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ mensaje: 'El ID proporcionado no es válido.' });
        }
        res.status(500).json({ 
            mensaje: 'Error interno del servidor al eliminar la tarea.', 
            error: err.message 
        });
    }
};