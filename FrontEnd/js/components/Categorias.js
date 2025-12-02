class CategoriasMain extends HTMLElement {
    constructor() {
        super();
        this.categorias = [];
    }

    connectedCallback() {
        this.checkAuth();
        this.render();
        this.attachEvents();
        this.cargarCategorias();
    }

    checkAuth() {
        if (!ApiService.isAuthenticated()) {
            window.location.href = 'index.html';
        }
    }

    render() {
        this.innerHTML = `
            <div class="categorias-container">
                <div class="categorias-header">
                    <h1 class="categorias-title">Mis Categorías</h1>
                    <button class="btn btn-new-categoria" id="btnNewCategoria">
                        ➕ Nueva Categoría
                    </button>
                </div>

                <div class="categorias-stats">
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3 id="statTotal">0</h3>
                            <p>Total de Categorías</p>
                        </div>
                        <div class="stat-icon">📁</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3 id="statMasUsada">-</h3>
                            <p>Más Utilizada</p>
                        </div>
                        <div class="stat-icon">⭐</div>
                    </div>
                </div>

                <div class="categorias-grid" id="categoriasGrid">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                        <p>Cargando categorías...</p>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const btnNew = this.querySelector('#btnNewCategoria');
        btnNew.addEventListener('click', () => this.abrirModal());
    }

    async cargarCategorias() {
        try {
            const user = ApiService.getUser();
            this.categorias = await ApiService.request(`/categorias/usuario/${user.id}`);
            this.actualizarEstadisticas();
            this.renderCategorias();
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            this.mostrarError('Error al cargar las categorías');
        }
    }

    actualizarEstadisticas() {
        const total = this.categorias.length;
        this.querySelector('#statTotal').textContent = total;
        
        // Encontrar la más usada (esto requeriría contar tareas por categoría)
        // Por ahora mostramos la primera
        const masUsada = this.categorias.length > 0 ? this.categorias[0].nombre : '-';
        this.querySelector('#statMasUsada').textContent = masUsada;
    }

    renderCategorias() {
        const grid = this.querySelector('#categoriasGrid');

        if (this.categorias.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">📂</div>
                    <h3>No hay categorías</h3>
                    <p>Crea tu primera categoría para organizar tus tareas</p>
                    <button class="btn btn-primary" onclick="document.querySelector('categorias-main').abrirModal()">
                        Crear Categoría
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.categorias.map(cat => `
            <div class="categoria-card" style="border-left-color: ${cat.color}">
                <div class="categoria-header-card">
                    <div class="categoria-color-badge" style="background: ${cat.color}">
                        📁
                    </div>
                    <h3 class="categoria-name">${cat.nombre}</h3>
                </div>
                <p class="categoria-description">${cat.descripcion || 'Sin descripción'}</p>
                <div class="categoria-meta">
                    <span class="categoria-count">
                        📋 0 tareas
                    </span>
                    <div class="categoria-actions">
                        <button class="btn-icon btn-edit" data-id="${cat._id}" title="Editar">
                            ✏️
                        </button>
                        <button class="btn-icon btn-delete" data-id="${cat._id}" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.attachCategoriaEvents();
    }

    attachCategoriaEvents() {
        const deleteButtons = this.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.eliminarCategoria(e));
        });

        const editButtons = this.querySelectorAll('.btn-edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.editarCategoria(e));
        });
    }

    async eliminarCategoria(event) {
        const id = event.target.dataset.id;
        const categoria = this.categorias.find(c => c._id === id);
        
        if (!confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) return;

        try {
            await ApiService.request(`/categorias/${id}`, {
                method: 'DELETE'
            });
            await this.cargarCategorias();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            alert('Error al eliminar la categoría');
        }
    }

    editarCategoria(event) {
        const id = event.target.dataset.id;
        const categoria = this.categorias.find(c => c._id === id);
        this.abrirModal(categoria);
    }

    abrirModal(categoria = null) {
        const modal = document.querySelector('categoria-modal');
        modal.abrir(categoria);
    }

    mostrarError(mensaje) {
        const grid = this.querySelector('#categoriasGrid');
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">⚠️</div>
                <h3>Error</h3>
                <p>${mensaje}</p>
            </div>
        `;
    }
}

customElements.define('categorias-main', CategoriasMain);