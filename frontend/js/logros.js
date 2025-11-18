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

        container.innerHTML = appState.logros.map(logro => {
            const fecha = logro.fecha_otorgado ? new Date(logro.fecha_otorgado) : new Date();

            return `
                <div class="logro-item">
                    <div class="logro-icon">${logro.icono || '🏆'}</div>
                    <div class="logro-name">${logro.nombre}</div>
                    <div class="logro-description">${logro.descripcion}</div>
                    ${logro.fecha_otorgado ? `<div class="logro-date">Desbloqueado: ${UIHelpers.formatDate(fecha)}</div>` : ''}
                </div>
            `;
        }).join('');
    }
}
