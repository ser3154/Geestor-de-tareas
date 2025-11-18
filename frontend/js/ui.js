/* =============================================================================
   UTILIDADES DE INTERFAZ DE USUARIO
   ============================================================================= */

class UIHelpers {
    /**
     * Mostrar alerta
     */
    static showAlert(message, type = 'info', duration = 5000) {
        const container = document.getElementById('alerts-container');
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        
        const icons = {
            success: '✓',
            danger: '⚠️',
            warning: '⚠️',
            info: 'ℹ'
        };

        alert.innerHTML = `
            <span class="alert-icon">${icons[type]}</span>
            <span>${message}</span>
            <button class="alert-close">✕</button>
        `;

        container.appendChild(alert);

        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            alert.remove();
        });

        if (duration > 0) {
            setTimeout(() => {
                alert.remove();
            }, duration);
        }

        return alert;
    }

    /**
     * Abrir modal
     */
    static openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Cerrar modal
     */
    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Cambiar vista
     */
    static switchView(viewName) {
        const views = document.querySelectorAll('.view-section');
        views.forEach(view => view.classList.remove('active'));

        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Actualizar título de la página
        const titles = {
            dashboard: 'Dashboard',
            tareas: 'Mis Tareas',
            categorias: 'Categorías',
            notas: 'Notas Rápidas',
            logros: 'Mis Logros'
        };

        const pageTitle = document.getElementById('page-title');
        pageTitle.textContent = titles[viewName] || 'Dashboard';
    }

    /**
     * Mostrar cargador
     */
    static showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const spinner = button.querySelector('.spinner');
            const text = button.querySelector('span:not(.spinner)');
            
            if (spinner) spinner.classList.remove('hidden');
            if (text) text.classList.add('hidden');
            
            button.disabled = true;
        }
    }

    /**
     * Ocultar cargador
     */
    static hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            const spinner = button.querySelector('.spinner');
            const text = button.querySelector('span:not(.spinner)');
            
            if (spinner) spinner.classList.add('hidden');
            if (text) text.classList.remove('hidden');
            
            button.disabled = false;
        }
    }

    /**
     * Formatear fecha
     */
    static formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }

        const options = { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        };

        return date.toLocaleDateString('es-ES', options);
    }

    /**
     * Obtener diferencia de días
     */
    static getDaysDiff(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }

        const today = new Date();
        const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

        if (diff < 0) {
            return `Vencida hace ${Math.abs(diff)} días`;
        } else if (diff === 0) {
            return 'Vence hoy';
        } else if (diff === 1) {
            return 'Vence mañana';
        } else {
            return `Vence en ${diff} días`;
        }
    }

    /**
     * Verificar si está vencida
     */
    static isOverdue(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        return date < today;
    }

    /**
     * Ocultar/mostrar sidebar en móvil
     */
    static toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-hidden');
        }
    }

    /**
     * Cerrar sidebar en móvil
     */
    static closeSidebarMobile() {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.add('mobile-hidden');
        }
    }

    /**
     * Validar formulario
     */
    static validateForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return true;

        const inputs = form.querySelectorAll('[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.parentElement.classList.add('error');
                isValid = false;
            } else {
                input.parentElement.classList.remove('error');
            }
        });

        return isValid;
    }

    /**
     * Limpiar formulario
     */
    static clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            form.querySelectorAll('.error').forEach(el => {
                el.classList.remove('error');
            });
        }
    }

    /**
     * Actualizar avatar del usuario
     */
    static updateUserAvatar(name) {
        const avatar = document.querySelector('.user-avatar');
        if (avatar && name) {
            avatar.textContent = name.charAt(0).toUpperCase();
        }
    }

    /**
     * Actualizar nombre del usuario
     */
    static updateUserName(name) {
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = name || 'Usuario';
        }
    }

    /**
     * Obtener color aleatorio
     */
    static getRandomColor() {
        const colors = [
            '#B8FF00', '#1E3A8A', '#7C3AED', '#06B6D4',
            '#10B981', '#F59E0B', '#EF4444', '#EC4899'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Convertir color hexadecimal a RGB
     */
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

/**
 * Gestión de estado global de la aplicación
 */
class AppState {
    constructor() {
        this.usuario = null;
        this.tareas = [];
        this.categorias = [];
        this.notas = [];
        this.logros = [];
        this.racha = 0;
    }

    reset() {
        this.usuario = null;
        this.tareas = [];
        this.categorias = [];
        this.notas = [];
        this.logros = [];
        this.racha = 0;
    }
}

const appState = new AppState();
