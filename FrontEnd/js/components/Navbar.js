class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    render() {
        const user = ApiService.getUser();
        const currentPage = window.location.pathname.split('/').pop();
        
        this.innerHTML = `
            <nav class="navbar">
                <div class="navbar-content">
                    <div class="navbar-brand">
                        📝 Gestor de Tareas
                    </div>
                    <div class="navbar-menu" style="display: flex; gap: 16px;">
                        <a href="dashboard.html" class="nav-link ${currentPage === 'dashboard.html' ? 'active' : ''}" style="color: var(--text-primary); font-weight: 500; text-decoration: none;">
                            📋 Tareas
                        </a>
                        <a href="categorias.html" class="nav-link ${currentPage === 'categorias.html' ? 'active' : ''}" style="color: var(--text-primary); font-weight: 500; text-decoration: none;">
                            📁 Categorías
                        </a>
                    </div>
                    <div class="navbar-user">
                        <div class="user-info">
                            <span class="user-name">${user?.nombre || 'Usuario'}</span>
                            <span class="user-email">${user?.email || ''}</span>
                        </div>
                        <button class="btn btn-logout" id="logoutBtn">
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    attachEvents() {
        const logoutBtn = this.querySelector('#logoutBtn');
        logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            ApiService.logout();
            window.location.href = 'index.html';
        }
    }
}

customElements.define('app-navbar', AppNavbar);