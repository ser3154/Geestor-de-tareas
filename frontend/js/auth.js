/* =============================================================================
   AUTENTICACIÓN
   ============================================================================= */

class AuthManager {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Toggle links
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        if (showRegister) showRegister.addEventListener('click', (e) => { e.preventDefault(); this.toggleAuthForms(true); });
        if (showLogin) showLogin.addEventListener('click', (e) => { e.preventDefault(); this.toggleAuthForms(false); });

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            UIHelpers.showAlert('Por favor completa todos los campos', 'danger');
            return;
        }

        UIHelpers.showLoading('login-btn');

        try {
            const response = await api.login(email, password);

            // Guardar información del usuario (aceptar 'usuario' o 'user')
            const usuario = response.usuario || response.user || response;
            // Normalizar id para compatibilidad (_id y id)
            usuario._id = usuario._id || usuario.id || usuario.userId;
            appState.usuario = usuario;
            localStorage.setItem('user', JSON.stringify(usuario));

            UIHelpers.showAlert('¡Sesión iniciada correctamente!', 'success', 2000);

            // Cambiar a vista principal después de 2 segundos
            setTimeout(() => {
                this.showMainView();
                UIHelpers.closeSidebarMobile();
            }, 2000);

        } catch (error) {
            const errorMsg = document.getElementById('auth-error-message');
            errorMsg.textContent = error.message || 'Error al iniciar sesión';
            document.getElementById('auth-error').classList.remove('hidden');
            
            UIHelpers.showAlert(error.message, 'danger');
        } finally {
            UIHelpers.hideLoading('login-btn');
        }
    }

    async handleSignup(e) {
        e.preventDefault();

        const nombre = document.getElementById('reg-nombre').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        if (!nombre || !email || !password) {
            UIHelpers.showAlert('Por favor completa todos los campos', 'danger');
            return;
        }

        UIHelpers.showLoading('register-btn');

        try {
            const response = await api.register(nombre, email, password);

            const usuario = response.usuario || response.user || response;
            usuario._id = usuario._id || usuario.id || usuario.userId;
            appState.usuario = usuario;
            localStorage.setItem('user', JSON.stringify(usuario));

            UIHelpers.showAlert('Cuenta creada correctamente. ¡Bienvenido!', 'success', 2000);

            setTimeout(() => {
                this.showMainView();
                UIHelpers.closeSidebarMobile();
            }, 1200);

        } catch (error) {
            const errorMsg = document.getElementById('register-error-message');
            if (errorMsg) errorMsg.textContent = error.message || 'Error al crear cuenta';
            const regErrEl = document.getElementById('register-error');
            if (regErrEl) regErrEl.classList.remove('hidden');
            UIHelpers.showAlert(error.message || 'Error al crear cuenta', 'danger');
        } finally {
            UIHelpers.hideLoading('register-btn');
        }
    }

    toggleAuthForms(showRegister = true) {
        const loginContainer = document.querySelector('.auth-form-container');
        const registerContainer = document.getElementById('register-container');
        const authToggleText = document.getElementById('auth-toggle-text');
        const regToggleText = document.getElementById('register-toggle-text');

        if (showRegister) {
            if (loginContainer) loginContainer.classList.add('hidden');
            if (registerContainer) registerContainer.classList.remove('hidden');
            if (authToggleText) authToggleText.classList.add('hidden');
            if (regToggleText) regToggleText.classList.remove('hidden');
        } else {
            if (loginContainer) loginContainer.classList.remove('hidden');
            if (registerContainer) registerContainer.classList.add('hidden');
            if (authToggleText) authToggleText.classList.remove('hidden');
            if (regToggleText) regToggleText.classList.add('hidden');
        }
    }

    handleLogout() {
        api.logout();
        appState.reset();
        localStorage.removeItem('user');
        
        this.showAuthView();
        UIHelpers.showAlert('Sesión cerrada correctamente', 'info');
    }

    showAuthView() {
        document.getElementById('auth-view').classList.add('active');
        document.getElementById('main-view').classList.remove('active');
        
        // Limpiar formulario
        UIHelpers.clearForm('login-form');
        document.getElementById('auth-error').classList.add('hidden');
        // Evitar que el usuario pueda scrollear y ver el contenido del dashboard
        document.body.classList.add('no-scroll');
    }

    showMainView() {
        document.getElementById('auth-view').classList.remove('active');
        document.getElementById('main-view').classList.add('active');

        // Actualizar información del usuario
        if (appState.usuario) {
            UIHelpers.updateUserName(appState.usuario.nombre || appState.usuario.email);
            UIHelpers.updateUserAvatar(appState.usuario.nombre || appState.usuario.email);
        }

        // Cargar datos
        this.loadInitialData();
        // Permitir scroll cuando el dashboard esté visible
        document.body.classList.remove('no-scroll');
    }

    async loadInitialData() {
        try {
            if (!appState.usuario) return;

            // Cargar tareas
            const tareas = await api.obtenerTareas(appState.usuario._id);
            appState.tareas = tareas;

            // Cargar categorías
            const categorias = await api.obtenerCategorias(appState.usuario._id);
            appState.categorias = categorias;

            // Cargar notas
            const notas = await api.obtenerNotas(appState.usuario._id);
            appState.notas = notas;

            // Cargar logros
            const logros = await api.obtenerLogros(appState.usuario._id);
            appState.logros = logros;

            // Cargar racha
            const racha = await api.obtenerRacha(appState.usuario._id);
            appState.racha = racha.dias || 0;

            // Actualizar vistas
            TareasManager.renderTareas();
            CategoriasManager.renderCategorias();
            NotasManager.renderNotas();
            LogrosManager.renderLogros();
            DashboardManager.renderDashboard();

        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
            UIHelpers.showAlert('Error al cargar los datos', 'danger');
        }
    }

    async checkAuth() {
        if (api.isAuthenticated()) {
            try {
                const decoded = await api.verificarToken();
                if (decoded) {
                    // decoded puede tener userId y email
                    const usuario = {
                        _id: decoded.userId || decoded.id || decoded._id,
                        email: decoded.email || decoded.email
                    };
                    appState.usuario = usuario;
                    this.showMainView();
                    return true;
                }
            } catch (error) {
                console.error('Token inválido:', error);
            }
        }

        this.showAuthView();
        return false;
    }
}

const authManager = new AuthManager();
