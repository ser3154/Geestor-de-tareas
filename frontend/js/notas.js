/* =============================================================================
   NOTAS RÁPIDAS - GESTOR DE NOTAS
   ============================================================================= */

class NotasManager {
    static {
        this.currentEditingId = null;
        this.initEventListeners();
    }

    static initEventListeners() {
        // Botón nueva nota
        const newNoteBtn = document.getElementById('new-note-btn');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', () => this.newNote());
        }

        // Formulario de nota
        const noteForm = document.getElementById('note-form');
        if (noteForm) {
            noteForm.addEventListener('submit', (e) => this.handleNoteSubmit(e));
        }

        // Cerrar modal
        const noteModalClose = document.querySelector('[data-modal="note-modal"]');
        if (noteModalClose) {
            noteModalClose.addEventListener('click', () => {
                UIHelpers.closeModal('note-modal');
            });
        }

        // Cerrar modal al hacer clic fuera
        const modal = document.getElementById('note-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    UIHelpers.closeModal('note-modal');
                }
            });
        }
    }

    static newNote() {
        this.currentEditingId = null;
        UIHelpers.clearForm('note-form');
        
        const colorInput = document.getElementById('note-color');
        colorInput.value = '#B8FF00';

        document.getElementById('note-modal-title').textContent = 'Nueva Nota';
        UIHelpers.openModal('note-modal');
    }

    static editNote(id) {
        const nota = appState.notas.find(n => n._id === id);
        if (!nota) return;

        this.currentEditingId = id;

        document.getElementById('note-contenido').value = nota.contenido;
        
        const colorInput = document.getElementById('note-color');
        colorInput.value = nota.color || '#B8FF00';

        document.getElementById('note-modal-title').textContent = 'Editar Nota';
        UIHelpers.openModal('note-modal');
    }

    static async handleNoteSubmit(e) {
        e.preventDefault();

        const contenido = document.getElementById('note-contenido').value;
        const color = document.getElementById('note-color').value;

        if (!contenido) {
            UIHelpers.showAlert('La nota no puede estar vacía', 'danger');
            return;
        }

        try {
            if (this.currentEditingId) {
                // Editar
                await api.actualizarNota(this.currentEditingId, {
                    contenido,
                    color
                });
                UIHelpers.showAlert('Nota actualizada correctamente', 'success');
            } else {
                // Crear
                await api.crearNota(appState.usuario._id, {
                    contenido,
                    color
                });
                UIHelpers.showAlert('Nota creada correctamente', 'success');
            }

            UIHelpers.closeModal('note-modal');

            // Recargar notas
            const notas = await api.obtenerNotas(appState.usuario._id);
            appState.notas = notas;

            this.renderNotas();

        } catch (error) {
            UIHelpers.showAlert(error.message, 'danger');
        }
    }

    static async deleteNote(id) {
        if (confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
            try {
                await api.eliminarNota(id);
                UIHelpers.showAlert('Nota eliminada correctamente', 'success');

                // Recargar notas
                const notas = await api.obtenerNotas(appState.usuario._id);
                appState.notas = notas;

                this.renderNotas();

            } catch (error) {
                UIHelpers.showAlert(error.message, 'danger');
            }
        }
    }

    static renderNotas() {
        const container = document.getElementById('notas-grid');

        if (appState.notas.length === 0) {
            container.innerHTML = '<p class="empty-state">No hay notas aún. ¡Crea una! 📝</p>';
            return;
        }

        container.innerHTML = appState.notas.map(nota => {
            const bgColor = nota.color || '#B8FF00';
            const fecha = new Date(nota.fecha_creacion);

            return `
                <div class="note-item" style="background-color: ${bgColor};">
                    <div class="note-content">${this.escapeHtml(nota.contenido)}</div>
                    <div class="note-date">${UIHelpers.formatDate(fecha)}</div>
                    <div class="note-actions">
                        <button class="note-btn" onclick="NotasManager.editNote('${nota._id}')">✎</button>
                        <button class="note-btn" onclick="NotasManager.deleteNote('${nota._id}')">🗑</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}
