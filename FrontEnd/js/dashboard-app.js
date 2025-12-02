document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Dashboard iniciado correctamente');
    
    // Verificar autenticación
    if (!ApiService.isAuthenticated()) {
        window.location.href = 'index.html';
    }
});