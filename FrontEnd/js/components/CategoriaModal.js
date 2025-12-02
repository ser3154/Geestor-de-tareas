class CategoriaModal extends HTMLElement {
    constructor() {
        super();
        this.categoriaActual = null;
        this.colorSeleccionado = '#3B82F6';
        this.coloresDisponibles = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
            '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
            '#6366F1', '#84CC16', '#06B6D4', '#A855F7',
            '#22D3EE', '#FB923C', '#4ADE80', '#F43F5E'
        ];
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
                        <h2 class="modal-title" id="modalTitle">Nueva Categoría</h2>
                        <button class="btn-close" id="btnCloseModal">×</button>
                    </div>
                    <form class="modal-form" id="categoriaForm">
                        <div class="form-group">
                            <label class="form-label">Nombre *</label>
                            <input type="text" class="form-input" id="categoriaNombre" required maxlength="50">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-input" id="categoriaDescripcion" maxlength="200"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Color</label>
                            <div class="color-picker" id="colorPicker">
                                ${this.coloresDisponibles.map(color => `
                                    <div class="color-option ${color === this.colorSeleccionado ? 'selected' : ''}" 
                                         style="background: ${color}" 
                                         data-color="${color}">
                                    </div>
                                `).join('')}
                            </div>
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
        const form = this.querySelector('#categoriaForm');
        const colorOptions = this.querySelectorAll('.color-option');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.cerrar();
        });

        btnClose.addEventListener('click', () => this.cerrar());
        btnCancel.addEventListener('click', () => this.cerrar());
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => this.seleccionarColor(e));
        });
    }

    seleccionarColor(event) {
        const colorOptions = this.querySelectorAll('.color-option');
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        
        event.target.classList.add('selected');
        this.colorSeleccionado = event.target.dataset.color;
    }

    abrir(categoria = null) {
        this.categoriaActual = categoria;
        const overlay = this.querySelector('#modalOverlay');
        const modalTitle = this.querySelector('#modalTitle');
        const form = this.querySelector('#categoriaForm');

        if (categoria) {
            modalTitle.textContent = 'Editar Categoría';
            this.querySelector('#categoriaNombre').value = categoria.nombre;
            this.querySelector('#categoriaDescripcion').value = categoria.descripcion || '';
            this.colorSeleccionado = categoria.color;
            
            // Actualizar selección de color
            const colorOptions = this.querySelectorAll('.color-option');
            colorOptions.forEach(opt => {
                if (opt.dataset.color === categoria.color) {
                    opt.classList.add('selected');
                } else {
                    opt.classList.remove('selected');
                }
            });
        } else {
            modalTitle.textContent = 'Nueva Categoría';
            form.reset();
            this.colorSeleccionado = '#3B82F6';
            
            // Resetear selección de color
            const colorOptions = this.querySelectorAll('.color-option');
            colorOptions.forEach((opt, index) => {
                opt.classList.toggle('selected', index === 0);
            });
        }

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    cerrar() {
        const overlay = this.querySelector('#modalOverlay');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        this.categoriaActual = null;
    }

    async handleSubmit(event) {
        event.preventDefault();

        const user = ApiService.getUser();
        const datos = {
            nombre: this.querySelector('#categoriaNombre').value,
            descripcion: this.querySelector('#categoriaDescripcion').value,
            color: this.colorSeleccionado,
            usuarioId: user.id
        };

        const btnSubmit = this.querySelector('#btnSubmit');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Guardando...';

        try {
            if (this.categoriaActual) {
                await ApiService.request(`/categorias/${this.categoriaActual._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(datos)
                });
            } else {
                await ApiService.request('/categorias', {
                    method: 'POST',
                    body: JSON.stringify(datos)
                });
            }

            this.cerrar();
            const categorias = document.querySelector('categorias-main');
            await categorias.cargarCategorias();
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            alert('Error al guardar la categoría: ' + error.message);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Guardar';
        }
    }
}

customElements.define('categoria-modal', CategoriaModal);