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

        // Actualizar valores en el DOM (mantener compatibilidad con HTML existente)
        const totalEl = document.getElementById('total-tasks');
        if (totalEl) totalEl.textContent = totalTasks;

        const pendingEl = document.getElementById('pending-tasks');
        if (pendingEl) pendingEl.textContent = pendingTasks;

        const completedEl = document.getElementById('completed-tasks');
        if (completedEl) completedEl.textContent = completedTasks;

        const streakEl = document.getElementById('current-streak');
        if (streakEl) streakEl.textContent = `${appState.racha}🔥`;
    }

    static renderUpcomingTasks() {
        const container = document.getElementById('upcoming-tasks');
        
        // Filtrar y ordenar tareas pendientes
        const sorted = [...appState.tareas]
            .filter(t => t.estado === 'pendiente')
            .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento))
            .slice(0, 5); // Solo las primeras 5

        if (sorted.length === 0) {
            container.innerHTML = '<p class="empty-state">¡No hay tareas pendientes! 🎉</p>';
            return;
        }

        // ✅ RENDERIZAR USANDO WEB COMPONENTS
        container.innerHTML = '';
        sorted.forEach(tarea => {
            // Buscar categoría asociada
            const tareaCategoriaId = tarea.categoriaId || 
                (tarea.categoria && (tarea.categoria.categoriaId || tarea.categoria._id));
            const categoria = appState.categorias.find(c => c._id === tareaCategoriaId);

            // Preparar objeto de tarea para el componente
            const tareaParaComponente = {
                _id: tarea._id,
                titulo: tarea.titulo || tarea.nombre,
                nombre: tarea.nombre || tarea.titulo,
                descripcion: tarea.descripcion || '',
                estado: tarea.estado,
                fecha_vencimiento: tarea.fecha_vencimiento,
                prioridad: tarea.prioridad,
                categoria: categoria ? { 
                    _id: categoria._id,
                    nombre: categoria.nombre,
                    color: categoria.color 
                } : null
            };

            // Crear el Web Component
            const taskCard = document.createElement('task-card');
            taskCard.setAttribute('data-task', JSON.stringify(tareaParaComponente));
            container.appendChild(taskCard);
        });
    }

    static renderCategoriesSummary() {
        const container = document.getElementById('dashboard-categories');

        if (appState.categorias.length === 0) {
            container.innerHTML = '<p class="empty-state">Crea categorías para organizar tus tareas 📂</p>';
            return;
        }

        // ✅ RENDERIZAR USANDO WEB COMPONENTS
        container.innerHTML = '';
        
        // Mostrar solo las primeras 4 categorías
        appState.categorias.slice(0, 4).forEach(categoria => {
            // Calcular estadísticas de la categoría
            const tasksCount = appState.tareas.filter(t => {
                const tareaCatId = t.categoriaId || 
                    (t.categoria && (t.categoria.categoriaId || t.categoria._id));
                return tareaCatId === categoria._id;
            }).length;

            const completedCount = appState.tareas.filter(t => {
                const tareaCatId = t.categoriaId || 
                    (t.categoria && (t.categoria.categoriaId || t.categoria._id));
                return tareaCatId === categoria._id && t.estado === 'completada';
            }).length;

            // Preparar objeto de categoría
            const categoriaParaComponente = {
                _id: categoria._id,
                nombre: categoria.nombre,
                descripcion: categoria.descripcion || '',
                color: categoria.color || '#1E3A8A'
            };

            // Crear el Web Component
            const categoryCard = document.createElement('category-card');
            categoryCard.setAttribute('data-category', JSON.stringify(categoriaParaComponente));
            categoryCard.setAttribute('tasks-count', tasksCount);
            categoryCard.setAttribute('completed-count', completedCount);
            container.appendChild(categoryCard);
        });
    }
}