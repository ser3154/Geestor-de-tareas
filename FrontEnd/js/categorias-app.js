document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Categorías iniciadas correctamente');
    
    // Verificar autenticación
    if (!ApiService.isAuthenticated()) {
        window.location.href = 'index.html';
    }
});