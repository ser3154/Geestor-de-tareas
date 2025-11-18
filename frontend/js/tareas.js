/* =============================================================================
   TAREAS - GESTOR DE TAREAS
   ============================================================================= */

class TareasManager {
    static {
        this.currentEditingId = null;
        this.initEventListeners();
    }

    static initEventListeners() {
        // Botón nueva tarea
        const newTaskBtn = document.getElementById('new-task-btn');
        if (newTaskBtn) {
            newTaskBtn.addEventListener('click', () => this.newTask());
        }

        // Formulario de tarea
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        }

        // Cerrar modal
        const taskModalClose = document.querySelector('[data-modal="task-modal"]');
        if (taskModalClose) {
            taskModalClose.addEventListener('click', () => {
                UIHelpers.closeModal('task-modal');
            });
        }

        // Filtros
        const filterCategory = document.getElementById('filter-category');
        const filterStatus = document.getElementById('filter-status');

        if (filterCategory) {
            filterCategory.addEventListener('change', () => this.renderTareas());
        }

        if (filterStatus) {
            filterStatus.addEventListener('change', () => this.renderTareas());
        }

        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('task-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    UIHelpers.closeModal('task-modal');
                }
            });
        }
    }

    static newTask() {
        this.currentEditingId = null;
        UIHelpers.clearForm('task-form');
        document.getElementById('task-modal-title').textContent = 'Nueva Tarea';
        // Asegurarse de que el select de categorías esté actualizado
        this.updateFilterCategories();
        // Resetear valor del select de categoría a sin categoría
        const taskCat = document.getElementById('task-categoria');
        if (taskCat) taskCat.value = '';

        UIHelpers.openModal('task-modal');
    }

    static editTask(id) {
        const tarea = appState.tareas.find(t => t._id === id);
        if (!tarea) return;

        this.currentEditingId = id;
        
        document.getElementById('task-nombre').value = tarea.nombre || tarea.titulo || '';
        document.getElementById('task-descripcion').value = tarea.descripcion || '';
        // Compatibilidad: la categoría puede venir como tarea.categoria.categoriaId o tarea.categoriaId
        const categoriaValue = tarea.categoriaId || (tarea.categoria && (tarea.categoria.categoriaId || tarea.categoria._id)) || '';
        const taskCategoriaEl = document.getElementById('task-categoria');
        if (taskCategoriaEl) taskCategoriaEl.value = categoriaValue;

        document.getElementById('task-fecha').value = (tarea.fecha_vencimiento || tarea.fecha_vencimiento).split ? tarea.fecha_vencimiento.split('T')[0] : '';
        document.getElementById('task-prioridad').value = tarea.prioridad || 'media';

        document.getElementById('task-modal-title').textContent = 'Editar Tarea';
        UIHelpers.openModal('task-modal');
    }

    static async handleTaskSubmit(e) {
        e.preventDefault();

        const nombre = document.getElementById('task-nombre').value;
        const descripcion = document.getElementById('task-descripcion').value;
        const categoriaId = document.getElementById('task-categoria').value;
        const fecha = document.getElementById('task-fecha').value;
        const prioridad = document.getElementById('task-prioridad').value;

        if (!nombre || !fecha) {
            UIHelpers.showAlert('Por favor completa los campos requeridos: nombre y fecha', 'danger');
            return;
        }

        try {
            if (this.currentEditingId) {
                // Editar
                const payload = {
                    titulo: nombre,
                    descripcion,
                    fecha_vencimiento: new Date(fecha),
                    prioridad
                };
                if (categoriaId) payload.categoria = { categoriaId };
                await api.actualizarTarea(this.currentEditingId, payload);
                UIHelpers.showAlert('Tarea actualizada correctamente', 'success');
            } else {
                // Crear
                const payload = {
                    titulo: nombre,
                    descripcion,
                    fecha_vencimiento: new Date(fecha),
                    prioridad,
                    estado: 'pendiente',
                    usuarioId: appState.usuario._id
                };
                if (categoriaId) payload.categoria = { categoriaId };

                await api.crearTarea(appState.usuario._id, payload);
                UIHelpers.showAlert('Tarea creada correctamente', 'success');
            }

            UIHelpers.closeModal('task-modal');

            // Recargar tareas
            const tareas = await api.obtenerTareas(appState.usuario._id);
            appState.tareas = tareas;

            this.renderTareas();
            DashboardManager.renderDashboard();

        } catch (error) {
            UIHelpers.showAlert(error.message, 'danger');
        }
    }

    static async deleteTask(id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            try {
                await api.eliminarTarea(id);
                UIHelpers.showAlert('Tarea eliminada correctamente', 'success');

                // Recargar tareas
                const tareas = await api.obtenerTareas(appState.usuario._id);
                appState.tareas = tareas;

                this.renderTareas();
                DashboardManager.renderDashboard();

            } catch (error) {
                UIHelpers.showAlert(error.message, 'danger');
            }
        }
    }

    static async toggleTask(id) {
        const tarea = appState.tareas.find(t => t._id === id);
        if (!tarea) return;

        const newEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada';

        try {
            await api.actualizarTarea(id, { estado: newEstado });

            // Recargar tareas
            const tareas = await api.obtenerTareas(appState.usuario._id);
            appState.tareas = tareas;

            this.renderTareas();
            DashboardManager.renderDashboard();

        } catch (error) {
            UIHelpers.showAlert(error.message, 'danger');
        }
    }

    static renderTareas() {
        this.updateFilterCategories();

        const container = document.getElementById('tareas-list');
        const filterCategory = document.getElementById('filter-category').value;
        const filterStatus = document.getElementById('filter-status').value;

        let tareas = appState.tareas;

        // Aplicar filtros
        if (filterCategory) {
            tareas = tareas.filter(t => {
                const cid = t.categoriaId || (t.categoria && (t.categoria.categoriaId || t.categoria._id));
                return cid === filterCategory;
            });
        }

        if (filterStatus) {
            tareas = tareas.filter(t => t.estado === filterStatus);
        }

        // Ordenar por fecha de vencimiento
        tareas.sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));

        if (tareas.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay tareas que coincidan con los filtros 🎯</p>';
            return;
        }

        container.innerHTML = tareas.map(tarea => {
            const tareaCategoriaId = tarea.categoriaId || (tarea.categoria && (tarea.categoria.categoriaId || tarea.categoria._id));
            const categoria = appState.categorias.find(c => c._id === tareaCategoriaId);
            const isOverdue = UIHelpers.isOverdue(tarea.fecha_vencimiento);
            const displayName = tarea.nombre || tarea.titulo || 'Sin título';

            return `
                <div class="task-item ${tarea.estado === 'completada' ? 'completed' : ''}">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${tarea.estado === 'completada' ? 'checked' : ''}
                        onchange="TareasManager.toggleTask('${tarea._id}')">
                    <div class="task-content">
                        <div class="task-title">${displayName}</div>
                        ${tarea.descripcion ? `<div class="task-description">${tarea.descripcion}</div>` : ''}
                        <div class="task-meta">
                            ${categoria ? `<span class="task-category">${categoria.nombre}</span>` : ''}
                            <span class="task-date ${isOverdue ? 'overdue' : ''}">
                                📅 ${UIHelpers.formatDate(tarea.fecha_vencimiento)} (${UIHelpers.getDaysDiff(tarea.fecha_vencimiento)})
                            </span>
                            ${tarea.prioridad ? `<span class="task-priority ${tarea.prioridad}">${tarea.prioridad}</span>` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn" onclick="TareasManager.editTask('${tarea._id}')">✎</button>
                        <button class="task-btn delete" onclick="TareasManager.deleteTask('${tarea._id}')">🗑</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    static updateFilterCategories() {
        const select = document.getElementById('filter-category');
        if (!select) return;

        const currentValue = select.value;
        const options = select.querySelectorAll('option');

        // Mantener opción "Todas"
        const allOptions = `<option value="">Todas las categorías</option>`;
        const categoryOptions = appState.categorias.map(cat => 
            `<option value="${cat._id}">${cat.nombre}</option>`
        ).join('');

        select.innerHTML = allOptions + categoryOptions;
        select.value = currentValue;

        // También actualizar el select dentro del modal de tarea
        const taskSelect = document.getElementById('task-categoria');
        if (taskSelect) {
            const defaultOpt = `<option value="">Sin categoría</option>`;
            taskSelect.innerHTML = defaultOpt + categoryOptions;
            // No sobrescribir el valor actual si hay uno
        }
    }
}
