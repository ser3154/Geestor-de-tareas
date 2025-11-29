class ApiService {
    /**
     * Configuración base de la API
     */
    static API_BASE = 'http://localhost:3000/api/v1';
    static TOKEN_KEY = 'jwt_token';
    static USER_KEY = 'user_data';

    /**
     * Obtiene el token JWT del almacenamiento
     * @returns {string|null}
     */
    static getToken() {
        return sessionStorage.getItem(this.TOKEN_KEY);
    }

    /**
     * Guarda el token JWT en el almacenamiento
     * @param {string} token 
     */
    static setToken(token) {
        sessionStorage.setItem(this.TOKEN_KEY, token);
    }

    /**
     * Elimina el token JWT del almacenamiento
     */
    static removeToken() {
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.USER_KEY);
    }

    /**
     * Guarda los datos del usuario
     * @param {Object} userData 
     */
    static setUser(userData) {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }

    /**
     * Obtiene los datos del usuario
     * @returns {Object|null}
     */
    static getUser() {
        const userData = sessionStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean}
     */
    static isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Realiza una petición HTTP a la API
     * @param {string} endpoint 
     * @param {Object} options 
     * @returns {Promise<Object>}
     */
    static async request(endpoint, options = {}) {
        const token = this.getToken();
        
        // Configurar headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Agregar token JWT si existe (excepto en login)
        if (token && !endpoint.includes('/auth/login')) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Configuración completa de la petición
        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${this.API_BASE}${endpoint}`, config);
            
            // Intentar parsear la respuesta como JSON
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { mensaje: 'Respuesta sin contenido' };
            }

            // Manejo de errores HTTP
            if (!response.ok) {
                // Si es error 401, cerrar sesión
                if (response.status === 401) {
                    this.logout();
                    window.location.reload();
                }
                
                throw new Error(data.mensaje || `Error ${response.status}: ${response.statusText}`);
            }

            return data;

        } catch (error) {
            console.error('Error en petición API:', error);
            throw error;
        }
    }

    // ========================================
    // AUTENTICACIÓN
    // ========================================

    /**
     * Inicia sesión
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    static async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        // Guardar token y datos de usuario
        if (response.token) {
            this.setToken(response.token);
            this.setUser(response.usuario);
        }

        return response;
    }

    /**
     * Cierra sesión
     */
    static logout() {
        this.removeToken();
    }

    /**
     * Verifica si el token es válido
     * @returns {Promise<Object>}
     */
    static async verifyToken() {
        return this.request('/auth/verify');
    }

    // ========================================
    // USUARIOS
    // ========================================

    /**
     * Registra un nuevo usuario
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    static async registrarUsuario(userData) {
        return this.request('/usuarios', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Obtiene un usuario por ID
     * @param {string} id 
     * @returns {Promise<Object>}
     */
    static async obtenerUsuario(id) {
        return this.request(`/usuarios/${id}`);
    }

    /**
     * Actualiza un usuario
     * @param {string} id 
     * @param {Object} datos 
     * @returns {Promise<Object>}
     */
    static async actualizarUsuario(id, datos) {
        return this.request(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    }

    // ========================================
    // TAREAS
    // ========================================

    /**
     * Obtiene las tareas de un usuario
     * @param {string} usuarioId 
     * @returns {Promise<Array>}
     */
    static async obtenerTareas(usuarioId) {
        return this.request(`/tareas/usuario/${usuarioId}`);
    }

    /**
     * Crea una nueva tarea
     * @param {Object} tarea 
     * @returns {Promise<Object>}
     */
    static async crearTarea(tarea) {
        return this.request('/tareas', {
            method: 'POST',
            body: JSON.stringify(tarea)
        });
    }

    /**
     * Obtiene una tarea por ID
     * @param {string} id 
     * @returns {Promise<Object>}
     */
    static async obtenerTarea(id) {
        return this.request(`/tareas/${id}`);
    }

    /**
     * Actualiza una tarea
     * @param {string} id 
     * @param {Object} datos 
     * @returns {Promise<Object>}
     */
    static async actualizarTarea(id, datos) {
        return this.request(`/tareas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    }

    /**
     * Elimina una tarea
     * @param {string} id 
     * @returns {Promise<void>}
     */
    static async eliminarTarea(id) {
        return this.request(`/tareas/${id}`, {
            method: 'DELETE'
        });
    }

    // ========================================
    // CATEGORÍAS
    // ========================================

    /**
     * Obtiene las categorías de un usuario
     * @param {string} usuarioId 
     * @returns {Promise<Array>}
     */
    static async obtenerCategorias(usuarioId) {
        return this.request(`/categorias/usuario/${usuarioId}`);
    }

    /**
     * Crea una nueva categoría
     * @param {Object} categoria 
     * @returns {Promise<Object>}
     */
    static async crearCategoria(categoria) {
        return this.request('/categorias', {
            method: 'POST',
            body: JSON.stringify(categoria)
        });
    }

    /**
     * Actualiza una categoría
     * @param {string} id 
     * @param {Object} datos 
     * @returns {Promise<Object>}
     */
    static async actualizarCategoria(id, datos) {
        return this.request(`/categorias/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    }

    /**
     * Elimina una categoría
     * @param {string} id 
     * @returns {Promise<void>}
     */
    static async eliminarCategoria(id) {
        return this.request(`/categorias/${id}`, {
            method: 'DELETE'
        });
    }

    // ========================================
    // NOTAS
    // ========================================

    /**
     * Obtiene las notas de un usuario
     * @param {string} usuarioId 
     * @returns {Promise<Array>}
     */
    static async obtenerNotas(usuarioId) {
        return this.request(`/notas/usuario/${usuarioId}`);
    }

    /**
     * Crea una nueva nota
     * @param {Object} nota 
     * @returns {Promise<Object>}
     */
    static async crearNota(nota) {
        return this.request('/notas', {
            method: 'POST',
            body: JSON.stringify(nota)
        });
    }

    /**
     * Actualiza una nota
     * @param {string} id 
     * @param {Object} datos 
     * @returns {Promise<Object>}
     */
    static async actualizarNota(id, datos) {
        return this.request(`/notas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    }

    /**
     * Elimina una nota
     * @param {string} id 
     * @returns {Promise<void>}
     */
    static async eliminarNota(id) {
        return this.request(`/notas/${id}`, {
            method: 'DELETE'
        });
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}