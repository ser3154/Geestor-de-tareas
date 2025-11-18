/* =============================================================================
   API SERVICE - GESTIÓN DE LLAMADAS AL BACKEND
   ============================================================================= */

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3000/api/v1';
        this.token = localStorage.getItem('token');
    }

    /**
     * Realiza una solicitud HTTP genérica
     */
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            
            if (response.status === 401) {
                this.logout();
                throw new Error('Sesión expirada');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error en la solicitud');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en solicitud:', error);
            throw error;
        }
    }

    /**
     * AUTENTICACIÓN
     */

    async login(email, password) {
        const response = await this.request('/auth/login', 'POST', {
            email,
            password
        });
        
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('token', response.token);
        }

        return response;
    }

    async register(nombre, email, password) {
        const response = await this.request('/auth/register', 'POST', {
            nombre,
            email,
            password
        });

        if (response.token) {
            this.token = response.token;
            localStorage.setItem('token', response.token);
        }

        return response;
    }

    async verificarToken() {
        try {
            const response = await this.request('/auth/verify', 'GET');
            return response.usuario || response;
        } catch (error) {
            this.logout();
            return null;
        }
    }

    /**
     * TAREAS
     */

    async crearTarea(usuarioId, tarea) {
        return await this.request('/tareas', 'POST', {
            usuarioId,
            ...tarea
        });
    }

    async obtenerTareas(usuarioId) {
        return await this.request(`/tareas/usuario/${usuarioId}`, 'GET');
    }

    async obtenerTarea(id) {
        return await this.request(`/tareas/${id}`, 'GET');
    }

    async actualizarTarea(id, tarea) {
        return await this.request(`/tareas/${id}`, 'PUT', tarea);
    }

    async eliminarTarea(id) {
        return await this.request(`/tareas/${id}`, 'DELETE');
    }

    /**
     * CATEGORÍAS
     */

    async crearCategoria(usuarioId, categoria) {
        return await this.request('/categorias', 'POST', {
            usuarioId,
            ...categoria
        });
    }

    async obtenerCategorias(usuarioId) {
        return await this.request(`/categorias/usuario/${usuarioId}`, 'GET');
    }

    async obtenerCategoria(id) {
        return await this.request(`/categorias/${id}`, 'GET');
    }

    async actualizarCategoria(id, categoria) {
        return await this.request(`/categorias/${id}`, 'PUT', categoria);
    }

    async eliminarCategoria(id) {
        return await this.request(`/categorias/${id}`, 'DELETE');
    }

    /**
     * NOTAS
     */

    async crearNota(usuarioId, nota) {
        return await this.request('/notas', 'POST', {
            usuarioId,
            ...nota
        });
    }

    async obtenerNotas(usuarioId) {
        return await this.request(`/notas/usuario/${usuarioId}`, 'GET');
    }

    async obtenerNota(id) {
        return await this.request(`/notas/${id}`, 'GET');
    }

    async actualizarNota(id, nota) {
        return await this.request(`/notas/${id}`, 'PUT', nota);
    }

    async eliminarNota(id) {
        return await this.request(`/notas/${id}`, 'DELETE');
    }

    /**
     * LOGROS
     */

    async obtenerLogros(usuarioId) {
        return await this.request(`/logros/usuario/${usuarioId}`, 'GET');
    }

    /**
     * RACHAS
     */

    async obtenerRacha(usuarioId) {
        return await this.request(`/rachas/usuario/${usuarioId}`, 'GET');
    }

    /**
     * UTILIDADES
     */

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }

    isAuthenticated() {
        return !!this.token;
    }
}

// Instancia global
const api = new ApiService();
