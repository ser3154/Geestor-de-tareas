class DashboardMain extends HTMLElement {
    constructor() {
        super();
        this.tareas = [];
        this.filtroActual = 'todas';
    }

    connectedCallback() {
        this.checkAuth();
        this.render();
        this.attachEvents();
        this.cargarTareas();
    }

    checkAuth() {
        if (!ApiService.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }

    render() {
        this.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h1 class="dashboard-title">Mis Tareas</h1>
                    <button class="btn btn-new-task" id="btnNewTask">
                        ➕ Nueva Tarea
                    </button>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3 id="statTotal">0</h3>
                            <p>Total</p>
                        </div>
                        <div class="stat-icon">📋</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3 id="statPendientes">0</h3>
                            <p>Pendientes</p>
                        </div>
                        <div class="stat-icon">⏳</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3 id="statCompletadas">0</h3>
                            <p>Completadas</p>
                        </div>
                        <div class="stat-icon">✅</div>
                    </div>
                </div>

                <div class="filters">
                    <button class="filter-btn active" data-filter="todas">Todas</button>
                    <button class="filter-btn" data-filter="pendiente">Pendientes</button>
                    <button class="filter-btn" data-filter="en_progreso">En Progreso</button>
                    <button class="filter-btn" data-filter="completada">Completadas</button>
                </div>

                <div class="tasks-section">
                    <div class="tasks-header">
                        <h2>Lista de Tareas</h2>
                        <span class="tasks-count" id="tasksCount">0 tareas</span>
                    </div>
                    <div class="tasks-list" id="tasksList">
                        <div class="loading-container">
                            <div class="loading-spinner"></div>
                            <p>Cargando tareas...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const btnNewTask = this.querySelector('#btnNewTask');
        btnNewTask.addEventListener('click', () => this.abrirModal());

        const filterBtns = this.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.cambiarFiltro(e));
        });
    }

    async cargarTareas() {
        try {
            const user = ApiService.getUser();
            this.tareas = await ApiService.request(`/tareas/usuario/${user.id}`);
            this.actualizarEstadisticas();
            this.renderTareas();
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            this.mostrarError('Error al cargar las tareas');
        }
    }

    actualizarEstadisticas() {
        const total = this.tareas.length;
        const completadas = this.tareas.filter(t => t.estado === 'completada').length;
        const pendientes = this.tareas.filter(t => t.estado !== 'completada').length;

        this.querySelector('#statTotal').textContent = total;
        this.querySelector('#statPendientes').textContent = pendientes;
        this.querySelector('#statCompletadas').textContent = completadas;
    }

    renderTareas() {
        const tasksList = this.querySelector('#tasksList');
        const tareasFiltradas = this.filtrarTareas();

        this.querySelector('#tasksCount').textContent = `${tareasFiltradas.length} tareas`;

        if (tareasFiltradas.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>No hay tareas</h3>
                    <p>Comienza creando tu primera tarea</p>
                </div>
            `;
            return;
        }

        tasksList.innerHTML = tareasFiltradas.map(tarea => `
            <div class="task-item ${tarea.estado === 'completada' ? 'task-completed' : ''}" data-id="${tarea._id}">
                <input type="checkbox" class="task-checkbox" 
                    ${tarea.estado === 'completada' ? 'checked' : ''} 
                    data-id="${tarea._id}">
                <div class="task-content">
                    <h3 class="task-title">${tarea.titulo}</h3>
                    ${tarea.descripcion ? `<p class="task-description">${tarea.descripcion}</p>` : ''}
                    <div class="task-meta">
                        <span class="task-badge badge-priority-${tarea.prioridad}">
                            ${tarea.prioridad.toUpperCase()}
                        </span>
                        ${tarea.categoria?.nombre ? `<span class="task-badge">${tarea.categoria.nombre}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-icon btn-edit" data-id="${tarea._id}" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon btn-delete" data-id="${tarea._id}" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        this.attachTaskEvents();
    }

    attachTaskEvents() {
        const checkboxes = this.querySelectorAll('.task-checkbox');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', (e) => this.toggleTarea(e));
        });

        const deleteButtons = this.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.eliminarTarea(e));
        });

        const editButtons = this.querySelectorAll('.btn-edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.editarTarea(e));
        });
    }

    async toggleTarea(event) {
        const id = event.target.dataset.id;
        const checked = event.target.checked;

        try {
            await ApiService.request(`/tareas/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    estado: checked ? 'completada' : 'pendiente'
                })
            });
            await this.cargarTareas();
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            event.target.checked = !checked;
        }
    }

    async eliminarTarea(event) {
        const id = event.target.dataset.id;
        
        if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;

        try {
            await ApiService.request(`/tareas/${id}`, {
                method: 'DELETE'
            });
            await this.cargarTareas();
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
        }
    }

    editarTarea(event) {
        const id = event.target.dataset.id;
        const tarea = this.tareas.find(t => t._id === id);
        this.abrirModal(tarea);
    }

    filtrarTareas() {
        if (this.filtroActual === 'todas') {
            return this.tareas;
        }
        return this.tareas.filter(t => t.estado === this.filtroActual);
    }

    cambiarFiltro(event) {
        this.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.filtroActual = event.target.dataset.filter;
        this.renderTareas();
    }

    abrirModal(tarea = null) {
        const modal = document.querySelector('task-modal');
        modal.abrir(tarea);
    }

    mostrarError(mensaje) {
        const tasksList = this.querySelector('#tasksList');
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Error</h3>
                <p>${mensaje}</p>
            </div>
        `;
    }
}

customElements.define('dashboard-main', DashboardMain);