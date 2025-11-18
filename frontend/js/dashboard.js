/* =============================================================================
   DASHBOARD - GESTOR DE ESTADÍSTICAS
   ============================================================================= */

class DashboardManager {
    static renderDashboard() {
        this.updateStats();
        this.renderUpcomingTasks();
        this.renderCategoriesSummary();
    }

    static updateStats() {
        const totalTasks = appState.tareas.length;
        const pendingTasks = appState.tareas.filter(t => t.estado === 'pendiente').length;
        const completedTasks = appState.tareas.filter(t => t.estado === 'completada').length;

        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('pending-tasks').textContent = pendingTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('current-streak').textContent = `${appState.racha}🔥`;
    }

    static renderUpcomingTasks() {
        const container = document.getElementById('upcoming-tasks');
        
        // Ordenar tareas por fecha de vencimiento
        const sorted = [...appState.tareas]
            .filter(t => t.estado === 'pendiente')
            .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento))
            .slice(0, 5);

        if (sorted.length === 0) {
            container.innerHTML = '<p class="empty-state">¡No hay tareas pendientes! 🎉</p>';
            return;
        }

        container.innerHTML = sorted.map(tarea => this.createTaskHTML(tarea)).join('');
    }

    static renderCategoriesSummary() {
        const container = document.getElementById('dashboard-categories');

        if (appState.categorias.length === 0) {
            container.innerHTML = '<p class="empty-state">Crea categorías para organizar tus tareas 📂</p>';
            return;
        }

        container.innerHTML = appState.categorias
            .slice(0, 4)
            .map(cat => this.createCategoryCardHTML(cat))
            .join('');
    }

    static createTaskHTML(tarea) {
        const categoria = appState.categorias.find(c => c._id === tarea.categoriaId);
        const isOverdue = UIHelpers.isOverdue(tarea.fecha_vencimiento);
        
        return `
            <div class="task-item ${tarea.estado === 'completada' ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${tarea.estado === 'completada' ? 'checked' : ''}
                    onchange="TareasManager.toggleTask('${tarea._id}')">
                <div class="task-content">
                    <div class="task-title">${tarea.nombre}</div>
                    ${tarea.descripcion ? `<div class="task-description">${tarea.descripcion}</div>` : ''}
                    <div class="task-meta">
                        ${categoria ? `<span class="task-category">${categoria.nombre}</span>` : ''}
                        <span class="task-date ${isOverdue ? 'overdue' : ''}">
                            📅 ${UIHelpers.formatDate(tarea.fecha_vencimiento)}
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
    }

    static createCategoryCardHTML(categoria) {
        const tasksCount = appState.tareas.filter(t => t.categoriaId === categoria._id).length;
        const completedCount = appState.tareas.filter(
            t => t.categoriaId === categoria._id && t.estado === 'completada'
        ).length;

        const bgColor = categoria.color || '#1E3A8A';

        return `
            <div class="category-card" style="background: ${bgColor};">
                <div class="category-header">
                    <h3 class="category-name">${categoria.nombre}</h3>
                    <span class="category-icon">📂</span>
                </div>
                ${categoria.descripcion ? `<p class="category-description">${categoria.descripcion}</p>` : ''}
                <div class="category-stats">
                    <span>${completedCount}/${tasksCount} completadas</span>
                </div>
            </div>
        `;
    }
}
