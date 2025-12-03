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

        // ✅ NUEVO: Escuchar eventos de los Web Components
        document.addEventListener('note:edit', (e) => {
            this.editNote(e.detail.id);
        });

        document.addEventListener('note:delete', (e) => {
            this.deleteNote(e.detail.id);
        });

        const grid = document.getElementById('notas-grid');
        if (grid) {
            grid.addEventListener('dragstart', (e) => this.handleDragStart(e));
            grid.addEventListener('dragover', (e) => this.handleDragOver(e));
            grid.addEventListener('drop', (e) => this.handleDrop(e));
            grid.addEventListener('dragend', (e) => this.handleDragEnd(e));
        }
    
    }
    static handleDragStart(e) {
        // Solo permitir arrastrar si es un note-card
        if (e.target.tagName.toLowerCase() !== 'note-card') return;

        this.draggedItem = e.target;
        e.target.classList.add('dragging');
        
        // Efecto visual y datos requeridos por Firefox
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-id'));
    }

    static handleDragOver(e) {
        e.preventDefault(); // Necesario para permitir el "drop"
        e.dataTransfer.dropEffect = 'move';

        const grid = document.getElementById('notas-grid');
        const targetNode = e.target.closest('note-card');

        if (targetNode && targetNode !== this.draggedItem) {
            // Lógica de reordenamiento visual instantáneo
            const bounding = targetNode.getBoundingClientRect();
            const offset = bounding.y + (bounding.height / 2);
            
            if (e.clientY - offset > 0) {
                targetNode.after(this.draggedItem);
            } else {
                targetNode.before(this.draggedItem);
            }
        }
    }

    static handleDrop(e) {
        e.preventDefault();
        // Aquí podrías guardar el nuevo orden en el backend si tuvieras un campo "orden"
        // Por ahora, solo actualizamos el estado local visualmente
        console.log('📍 Nota movida correctamente');
    }

    static handleDragEnd(e) {
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
            this.draggedItem = null;
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

        // RENDERIZAR USANDO WEB COMPONENTS
        container.innerHTML = '';
        appState.notas.forEach(nota => {
            // Crear objeto de nota con todos los datos necesarios
            const notaParaComponente = {
                _id: nota._id,
                contenido: nota.contenido || '',
                color: nota.color || '#B8FF00',
                fecha_creacion: nota.fecha_creacion || new Date().toISOString()
            };

            // Crear el Web Component
            const noteCard = document.createElement('note-card');
            noteCard.setAttribute('data-note', JSON.stringify(notaParaComponente));
            noteCard.setAttribute('draggable', 'true'); 
            // Guardamos el ID para identificarla al arrastrar
            noteCard.setAttribute('data-id', nota._id);
            container.appendChild(noteCard);
        });
    }
}