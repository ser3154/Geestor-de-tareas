/* =============================================================================
   LOGROS - GESTOR DE LOGROS
   ============================================================================= */

class LogrosManager {
    static renderLogros() {
        const container = document.getElementById('logros-container');

        if (appState.logros.length === 0) {
            container.innerHTML = '<p class="empty-state">Completa tareas para desbloquear logros ✨</p>';
            return;
        }

        // ✅ RENDERIZAR USANDO WEB COMPONENTS
        container.innerHTML = '';
        appState.logros.forEach(logro => {
            // Determinar si el logro está bloqueado o desbloqueado
            const isLocked = !logro.fecha_otorgado;

            // Preparar objeto de logro para el componente
            const logroParaComponente = {
                _id: logro._id,
                nombre: logro.nombre || 'Logro sin nombre',
                descripcion: logro.descripcion || 'Sin descripción',
                icono: logro.icono || '🏆',
                fecha_otorgado: logro.fecha_otorgado || null,
                criterio: logro.criterio || {}
            };

            // Crear el Web Component
            const logroCard = document.createElement('logro-card');
            logroCard.setAttribute('data-logro', JSON.stringify(logroParaComponente));
            logroCard.setAttribute('locked', isLocked);
            container.appendChild(logroCard);
        });
    }
}