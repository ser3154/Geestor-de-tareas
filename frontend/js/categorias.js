/* =============================================================================
   CATEGORÍAS - GESTOR DE CATEGORÍAS
   ============================================================================= */

class CategoriasManager {
    static {
        this.currentEditingId = null;
        this.initEventListeners();
    }

    static initEventListeners() {
        // Botón nueva categoría
        const newCategoryBtn = document.getElementById('new-category-btn');
        if (newCategoryBtn) {
            newCategoryBtn.addEventListener('click', () => this.newCategory());
        }

        // Formulario de categoría
        const categoryForm = document.getElementById('category-form');
        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => this.handleCategorySubmit(e));
        }

        // Color picker
        const colorInput = document.getElementById('category-color');
        if (colorInput) {
            colorInput.addEventListener('change', (e) => {
                const preview = document.getElementById('color-preview');
                if (preview) preview.style.backgroundColor = e.target.value;
            });
        }

        // Cerrar modal
        const categoryModalClose = document.querySelector('[data-modal="category-modal"]');
        if (categoryModalClose) {
            categoryModalClose.addEventListener('click', () => {
                UIHelpers.closeModal('category-modal');
            });
        }

        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('category-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    UIHelpers.closeModal('category-modal');
                }
            });
        }

        // ✅ NUEVO: Escuchar eventos de los Web Components
        document.addEventListener('category:edit', (e) => {
            this.editCategory(e.detail.id);
        });

        document.addEventListener('category:delete', (e) => {
            this.deleteCategory(e.detail.id);
        });
    }

    static newCategory() {
        this.currentEditingId = null;
        UIHelpers.clearForm('category-form');
        
        const colorInput = document.getElementById('category-color');
        colorInput.value = UIHelpers.getRandomColor();
        
        const preview = document.getElementById('color-preview');
        preview.style.backgroundColor = colorInput.value;

        document.getElementById('category-modal-title').textContent = 'Nueva Categoría';
        UIHelpers.openModal('category-modal');
    }

    static editCategory(id) {
        const categoria = appState.categorias.find(c => c._id === id);
        if (!categoria) return;

        this.currentEditingId = id;

        document.getElementById('category-nombre').value = categoria.nombre;
        document.getElementById('category-descripcion').value = categoria.descripcion || '';
        
        const colorInput = document.getElementById('category-color');
        colorInput.value = categoria.color || '#1E3A8A';
        
        const preview = document.getElementById('color-preview');
        preview.style.backgroundColor = colorInput.value;

        document.getElementById('category-modal-title').textContent = 'Editar Categoría';
        UIHelpers.openModal('category-modal');
    }

    static async handleCategorySubmit(e) {
        e.preventDefault();

        const nombre = document.getElementById('category-nombre').value;
        const descripcion = document.getElementById('category-descripcion').value;
        const color = document.getElementById('category-color').value;

        if (!nombre) {
            UIHelpers.showAlert('El nombre de la categoría es requerido', 'danger');
            return;
        }

        try {
            if (this.currentEditingId) {
                // Editar
                await api.actualizarCategoria(this.currentEditingId, {
                    nombre,
                    descripcion,
                    color
                });
                UIHelpers.showAlert('Categoría actualizada correctamente', 'success');
            } else {
                // Crear
                await api.crearCategoria(appState.usuario._id, {
                    nombre,
                    descripcion,
                    color
                });
                UIHelpers.showAlert('Categoría creada correctamente', 'success');
            }

            UIHelpers.closeModal('category-modal');

            // Recargar categorías
            const categorias = await api.obtenerCategorias(appState.usuario._id);
            appState.categorias = categorias;

            this.renderCategorias();
            DashboardManager.renderDashboard();
            TareasManager.updateFilterCategories();

        } catch (error) {
            UIHelpers.showAlert(error.message, 'danger');
        }
    }

    static async deleteCategory(id) {
        // Verificar si hay tareas usando esta categoría
        const tareas = appState.tareas.filter(t => {
            const tareaCatId = t.categoriaId || 
                (t.categoria && (t.categoria.categoriaId || t.categoria._id));
            return tareaCatId === id;
        });
        
        if (tareas.length > 0) {
            UIHelpers.showAlert(
                `No puedes eliminar una categoría que tiene ${tareas.length} tarea(s)`,
                'warning'
            );
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            try {
                await api.eliminarCategoria(id);
                UIHelpers.showAlert('Categoría eliminada correctamente', 'success');

                // Recargar categorías
                const categorias = await api.obtenerCategorias(appState.usuario._id);
                appState.categorias = categorias;

                this.renderCategorias();
                DashboardManager.renderDashboard();
                TareasManager.updateFilterCategories();

            } catch (error) {
                UIHelpers.showAlert(error.message, 'danger');
            }
        }
    }

    static renderCategorias() {
        const container = document.getElementById('categorias-grid');

        if (appState.categorias.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay categorías aún. ¡Crea una! 📂</p>';
            return;
        }

        // ✅ RENDERIZAR USANDO WEB COMPONENTS
        container.innerHTML = '';
        appState.categorias.forEach(categoria => {
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

            // Crear objeto de categoría con todos los datos necesarios
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