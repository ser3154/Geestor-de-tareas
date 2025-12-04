/* =============================================================================
   INICIALIZACIÓN PRINCIPAL DE LA APLICACIÓN
   ============================================================================= */

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar gestores
    initializeEventListeners();

    // Verificar autenticación
    await authManager.checkAuth();

    // Configurar comportamiento responsive
    setupResponsiveHandlers();
});

/**
 * Inicializar event listeners globales
 */
function initializeEventListeners() {
    // Navegación lateral
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Actualizar estado activo
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Cambiar vista
            const viewName = link.getAttribute('data-view');
            UIHelpers.switchView(viewName);
            UIHelpers.closeSidebarMobile();
        });
    });

    // Toggle menú en móvil
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('mobile-hidden');
        });
    }

    // Cerrar sidebar al hacer clic en el botón de cerrar
    const sidebarClose = document.getElementById('sidebar-close');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            UIHelpers.closeSidebarMobile();
        });
    }

    // Cerrar modales al hacer clic en X
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) {
                const modalId = modal.id;
                UIHelpers.closeModal(modalId);
            }
        });
    });

    // Cerrar modales con la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                UIHelpers.closeModal(modal.id);
            });
        }
    });

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                UIHelpers.closeModal(modal.id);
            }
        });
    });

    // Botones de cancelar en modales
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = btn.getAttribute('data-modal');
            UIHelpers.closeModal(modalId);
        });
    });
}

/**
 * Configurar comportamiento responsive
 */
function setupResponsiveHandlers() {
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('mobile-hidden');
        }
    });

    // Cerrar sidebar al hacer clic fuera en móvil
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('mobile-open')) {
            sidebar.classList.add('mobile-hidden');
        }
    });
}

/**
 * Funciones de utilidad globales
 */
window.TareasManager = TareasManager;
window.CategoriasManager = CategoriasManager;
window.NotasManager = NotasManager;
window.LogrosManager = LogrosManager;
window.DashboardManager = DashboardManager;
window.UIHelpers = UIHelpers;

// Logging para desarrollo
console.log('✅ Aplicación Gestor de Tareas iniciada');
console.log('📝 Versión: 1.0');
console.log('🚀 Listo para usar');
