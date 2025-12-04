// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    console.log('🚀 Aplicación iniciada');

    // Verificar autenticación
    checkAuthentication();

    // Registrar listeners globales
    registerGlobalListeners();

    // Configurar manejo de errores global
    setupGlobalErrorHandling();
}

/**
 * Verifica si el usuario está autenticado
 */
function checkAuthentication() {
    const isAuthenticated = ApiService.isAuthenticated();
    const currentPage = window.location.pathname;

    console.log('Estado de autenticación:', isAuthenticated);

    // Si está en página de login pero ya está autenticado, redirigir
    if (isAuthenticated && currentPage.includes('index.html')) {
        console.log('Usuario ya autenticado, redirigiendo...');
        window.location.href = 'dashboard.html';
    }

    // Si NO está autenticado y está en página protegida, redirigir a login
    if (!isAuthenticated && currentPage.includes('dashboard.html')) {
        console.log('Usuario no autenticado, redirigiendo a login...');
        window.location.href = 'index.html';
    }
}

/**
 * Registra listeners globales de la aplicación
 */
function registerGlobalListeners() {
    // Listener para evento de login exitoso
    window.addEventListener('user-logged-in', () => {
        console.log('✅ Usuario logueado exitosamente');
    });

    // Listener para evento de logout
    window.addEventListener('user-logged-out', () => {
        console.log('👋 Usuario cerró sesión');
        ApiService.logout();
        window.location.href = 'index.html';
    });

    // Listener para errores de autenticación
    window.addEventListener('auth-error', (event) => {
        console.error('❌ Error de autenticación:', event.detail);
        ApiService.logout();
        window.location.href = 'index.html';
    });
}

/**
 * Configura el manejo de errores global
 */
function setupGlobalErrorHandling() {
    // Capturar errores no manejados
    window.addEventListener('error', (event) => {
        console.error('Error global capturado:', event.error);
        // Aquí podrías enviar el error a un servicio de logging
    });

    // Capturar promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promise rechazada no manejada:', event.reason);
        // Aquí podrías enviar el error a un servicio de logging
    });
}

/**
 * Función auxiliar para cerrar sesión
 */
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        window.dispatchEvent(new CustomEvent('user-logged-out'));
    }
}

/**
 * Función auxiliar para formatear fechas
 */
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('es-ES', options);
}

/**
 * Función auxiliar para mostrar notificaciones
 */
function showNotification(message, type = 'info') {
    // Implementación básica - puede mejorarse con una librería de toast
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Ejemplo simple con alert (reemplazar con toast library)
    if (type === 'error') {
        alert(`Error: ${message}`);
    }
}

// Exportar funciones globales
window.logout = logout;
window.formatDate = formatDate;
window.showNotification = showNotification;