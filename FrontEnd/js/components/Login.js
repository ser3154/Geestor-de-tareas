class LoginScreen extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-logo">📝</div>
                        <h1 class="login-title">Bienvenido</h1>
                        <p class="login-subtitle">Inicia sesión para gestionar tus tareas</p>
                    </div>
                    <div id="loginAlert" class="login-alert login-alert-error hidden"></div>
                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label">Correo Electrónico</label>
                            <input type="email" id="email" class="form-input" placeholder="usuario@ejemplo.com" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Contraseña</label>
                            <input type="password" id="password" class="form-input" placeholder="••••••••" required minlength="6">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        `;
        this.querySelector('#loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }
    
    async handleLogin(e) {
        e.preventDefault();
        const email = this.querySelector('#email').value;
        const password = this.querySelector('#password').value;
        const alert = this.querySelector('#loginAlert');
        const button = this.querySelector('button[type="submit"]');
        
        button.disabled = true;
        button.textContent = 'Iniciando...';
        
        try {
            const response = await ApiService.login(email, password);
            alert.textContent = '¡Login exitoso! Usuario: ' + response.usuario.nombre;
            alert.style.background = 'rgba(16, 185, 129, 0.1)';
            alert.style.border = '1px solid #10B981';
            alert.style.color = '#10B981';
            alert.classList.remove('hidden');
            
            console.log('Login exitoso:', response);
        } catch (error) {
            alert.textContent = error.message || 'Error al iniciar sesión';
            alert.className = 'login-alert login-alert-error';
            alert.classList.remove('hidden');
            button.disabled = false;
            button.textContent = 'Iniciar Sesión';
            
            console.error('Error en login:', error);
        }
    }
}

customElements.define('login-screen', LoginScreen);