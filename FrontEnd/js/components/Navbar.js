class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    render() {
        const user = ApiService.getUser();
        
        this.innerHTML = `
            <nav class="navbar">
                <div class="navbar-content">
                    <div class="navbar-brand">
                        📝 Gestor de Tareas
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