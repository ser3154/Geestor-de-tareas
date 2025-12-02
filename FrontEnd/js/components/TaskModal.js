class TaskModal extends HTMLElement {
    constructor() {
        super();
        this.tareaActual = null;
    }

    connectedCallback() {
        this.render();
        this.attachEvents();
    }

    render() {
        this.innerHTML = `
            <div class="modal-overlay hidden" id="modalOverlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title" id="modalTitle">Nueva Tarea</h2>
                        <button class="btn-close" id="btnCloseModal">×</button>
                    </div>
                    <form class="modal-form" id="taskForm">
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" class="form-input" id="taskTitulo" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-input" id="taskDescripcion"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Prioridad</label>
                            <select class="form-input" id="taskPrioridad">
                                <option value="baja">Baja</option>
                                <option value="media" selected>Media</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Estado</label>
                            <select class="form-input" id="taskEstado">
                                <option value="pendiente" selected>Pendiente</option>
                                <option value="en_progreso">En Progreso</option>
                                <option value="completada">Completada</option>
                            </select>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-outline" id="btnCancel">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-primary" id="btnSubmit">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const overlay = this.querySelector('#modalOverlay');
        const btnClose = this.querySelector('#btnCloseModal');
        const btnCancel = this.querySelector('#btnCancel');
        const form = this.querySelector('#taskForm');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.cerrar();
        });

        btnClose.addEventListener('click', () => this.cerrar());
        btnCancel.addEventListener('click', () => this.cerrar());
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    abrir(tarea = null) {
        this.tareaActual = tarea;
        const overlay = this.querySelector('#modalOverlay');
        const modalTitle = this.querySelector('#modalTitle');
        const form = this.querySelector('#taskForm');

        if (tarea) {
            modalTitle.textContent = 'Editar Tarea';
            this.querySelector('#taskTitulo').value = tarea.titulo;
            this.querySelector('#taskDescripcion').value = tarea.descripcion || '';
            this.querySelector('#taskPrioridad').value = tarea.prioridad;
            this.querySelector('#taskEstado').value = tarea.estado;
        } else {
            modalTitle.textContent = 'Nueva Tarea';
            form.reset();
        }

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    cerrar() {
        const overlay = this.querySelector('#modalOverlay');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        this.tareaActual = null;
    }

    async handleSubmit(event) {
        event.preventDefault();

        const user = ApiService.getUser();
        const datos = {
            titulo: this.querySelector('#taskTitulo').value,
            descripcion: this.querySelector('#taskDescripcion').value,
            prioridad: this.querySelector('#taskPrioridad').value,
            estado: this.querySelector('#taskEstado').value,
            usuarioId: user.id
        };

        const btnSubmit = this.querySelector('#btnSubmit');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Guardando...';

        try {
            if (this.tareaActual) {
                await ApiService.request(`/tareas/${this.tareaActual._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(datos)
                });
            } else {
                await ApiService.request('/tareas', {
                    method: 'POST',
                    body: JSON.stringify(datos)
                });
            }

            this.cerrar();
            const dashboard = document.querySelector('dashboard-main');
            await dashboard.cargarTareas();
        } catch (error) {
            console.error('Error al guardar tarea:', error);
            alert('Error al guardar la tarea');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Guardar';
        }
    }
}

customElements.define('task-modal', TaskModal);