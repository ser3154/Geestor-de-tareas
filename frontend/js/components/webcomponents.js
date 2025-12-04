/* Web Components ligeros para la app
   - No usamos Shadow DOM para conservar estilos globales (CSS existente)
   - `auth-component` y `app-sidebar` clonan plantillas desde el DOM
   - `geo-button` usa la Geolocation API y emite evento con las coords
*/

class AuthComponent extends HTMLElement {
    connectedCallback() {
        const tpl = document.getElementById('auth-template');
        if (tpl) {
            this.innerHTML = tpl.innerHTML;
        } else {
            this.innerHTML = '<div class="alert alert-danger">Plantilla de autenticación no encontrada</div>';
        }
    }
}

class AppSidebar extends HTMLElement {
    connectedCallback() {
        const tpl = document.getElementById('sidebar-template');
        if (tpl) {
            this.innerHTML = tpl.innerHTML;
        } else {
            this.innerHTML = '<div class="alert alert-danger">Plantilla de sidebar no encontrada</div>';
        }
    }
}

class GeoButton extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="geo-wrapper">
                <button id="geo-btn" class="btn btn-ghost" title="Compartir ubicación">📍</button>
                <span id="geo-coords" class="geo-coords" aria-live="polite"></span>
            </div>
        `;

        this._btn = this.querySelector('#geo-btn');
        this._onClick = () => this.requestLocation(this._btn);
        this._btn.addEventListener('click', this._onClick);
    }

    requestLocation(buttonEl) {
        if (!navigator.geolocation) {
            this.showMessage('Geolocation no soportada');
            return;
        }

        const coordsEl = this.querySelector('#geo-coords');
        const originalText = buttonEl.textContent;
        buttonEl.textContent = '⏳';

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const c = pos.coords;
                const text = `${c.latitude.toFixed(5)}, ${c.longitude.toFixed(5)}`;
                coordsEl.textContent = text;
                buttonEl.textContent = originalText;

                this.dispatchEvent(new CustomEvent('geo:obtained', {
                    detail: { latitude: c.latitude, longitude: c.longitude },
                    bubbles: true,
                    composed: true
                }));
            },
            (err) => {
                coordsEl.textContent = '';
                buttonEl.textContent = originalText;
                this.showMessage('Error ubicación: ' + err.message);
            },
            { enableHighAccuracy: false, timeout: 10000 }
        );
    }

    showMessage(msg) {
        const alerts = document.getElementById('alerts-container');
        if (alerts) {
            const el = document.createElement('div');
            el.className = 'alert alert-info';
            el.textContent = msg;
            alerts.appendChild(el);
            setTimeout(() => el.remove(), 3500);
        } else {
            alert(msg);
        }
    }

    disconnectedCallback() {
        if (this._btn && this._onClick) {
            this._btn.removeEventListener('click', this._onClick);
        }
    }
}

class TaskCard extends HTMLElement {
    connectedCallback() {
        const task = JSON.parse(this.getAttribute('data-task') || '{}');
        const isCompleted = task.estado === 'completada';
        const isOverdue = new Date(task.fecha_vencimiento) < new Date();
        
        this.innerHTML = `
            <div class="task-item ${isCompleted ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${isCompleted ? 'checked' : ''}
                    data-id="${task._id}">
                <div class="task-content">
                    <div class="task-title">${task.titulo || task.nombre || 'Sin título'}</div>
                    ${task.descripcion ? `<div class="task-description">${task.descripcion}</div>` : ''}
                    <div class="task-meta">
                        ${task.categoria?.nombre ? `<span class="task-category">${task.categoria.nombre}</span>` : ''}
                        <span class="task-date ${isOverdue ? 'overdue' : ''}">
                            📅 ${new Date(task.fecha_vencimiento).toLocaleDateString()}
                        </span>
                        ${task.prioridad ? `<span class="task-priority ${task.prioridad}">${task.prioridad}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" data-id="${task._id}">✎</button>
                    <button class="task-btn delete-btn" data-id="${task._id}">🗑</button>
                </div>
            </div>
        `;

        // Event listeners
        this.querySelector('.task-checkbox')?.addEventListener('change', () => {
            this.dispatchEvent(new CustomEvent('task:toggle', {
                detail: { id: task._id },
                bubbles: true
            }));
        });

        this.querySelector('.edit-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('task:edit', {
                detail: { id: task._id },
                bubbles: true
            }));
        });

        this.querySelector('.delete-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('task:delete', {
                detail: { id: task._id },
                bubbles: true
            }));
        });
    }
}

// 2. CATEGORY CARD COMPONENT
class CategoryCard extends HTMLElement {
    connectedCallback() {
        const category = JSON.parse(this.getAttribute('data-category') || '{}');
        const tasksCount = parseInt(this.getAttribute('tasks-count') || '0');
        const completedCount = parseInt(this.getAttribute('completed-count') || '0');
        
        this.innerHTML = `
            <div class="category-card" style="background: ${category.color || '#1E3A8A'};">
                <div class="category-header">
                    <h3 class="category-name">${category.nombre}</h3>
                </div>
                ${category.descripcion ? `<p class="category-description">${category.descripcion}</p>` : ''}
                <div class="category-stats">
                    <span>📊 ${completedCount}/${tasksCount} completadas</span>
                </div>
                <div class="category-actions">
                    <button class="category-btn edit-btn" data-id="${category._id}">Editar</button>
                    <button class="category-btn delete-btn" data-id="${category._id}">Eliminar</button>
                </div>
            </div>
        `;

        // Event listeners
        this.querySelector('.edit-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('category:edit', {
                detail: { id: category._id },
                bubbles: true
            }));
        });

        this.querySelector('.delete-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('category:delete', {
                detail: { id: category._id },
                bubbles: true
            }));
        });
    }
}

// 3. NOTE CARD COMPONENT
class NoteCard extends HTMLElement {
    connectedCallback() {
        const note = JSON.parse(this.getAttribute('data-note') || '{}');
        const bgColor = note.color || '#B8FF00';
        
        this.innerHTML = `
            <div class="note-item" style="background-color: ${bgColor};">
                <div class="note-content">${this.escapeHtml(note.contenido || '')}</div>
                <div class="note-date">${new Date(note.fecha_creacion).toLocaleDateString()}</div>
                <div class="note-actions">
                    <button class="note-btn edit-btn" data-id="${note._id}">✎</button>
                    <button class="note-btn delete-btn" data-id="${note._id}">🗑</button>
                </div>
            </div>
        `;

        // Event listeners
        this.querySelector('.edit-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('note:edit', {
                detail: { id: note._id },
                bubbles: true
            }));
        });

        this.querySelector('.delete-btn')?.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('note:delete', {
                detail: { id: note._id },
                bubbles: true
            }));
        });
    }

    escapeHtml(text) {
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

// 4. STAT CARD COMPONENT
class StatCard extends HTMLElement {
    connectedCallback() {
        const label = this.getAttribute('label') || 'Estadística';
        const value = this.getAttribute('value') || '0';
        const gradient = this.getAttribute('gradient') || 'linear-gradient(135deg, #B8FF00, #06B6D4)';
        
        this.innerHTML = `
            <div class="card card-colored dashboard-card" style="background: ${gradient};">
                <div class="card-body">
                    <div class="stat">
                        <span class="stat-label">${label}</span>
                        <span class="stat-value">${value}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Permitir actualización dinámica
    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            const valueEl = this.querySelector('.stat-value');
            if (valueEl) valueEl.textContent = newValue;
        }
    }
}

// 5. LOGRO CARD COMPONENT
class LogroCard extends HTMLElement {
    connectedCallback() {
        const logro = JSON.parse(this.getAttribute('data-logro') || '{}');
        const isLocked = this.getAttribute('locked') === 'true';
        
        this.innerHTML = `
            <div class="logro-item ${isLocked ? 'locked' : ''}">
                <div class="logro-icon">${logro.icono || '🏆'}</div>
                <div class="logro-name">${logro.nombre}</div>
                <div class="logro-description">${logro.descripcion}</div>
                ${logro.fecha_otorgado && !isLocked ? 
                    `<div class="logro-date">Desbloqueado: ${new Date(logro.fecha_otorgado).toLocaleDateString()}</div>` 
                    : ''}
            </div>
        `;
    }
}

// ============================================================================
// REGISTRAR TODOS LOS COMPONENTES
// ============================================================================

customElements.define('auth-component', AuthComponent);
customElements.define('app-sidebar', AppSidebar);
customElements.define('geo-button', GeoButton);
customElements.define('task-card', TaskCard);
customElements.define('category-card', CategoryCard);
customElements.define('note-card', NoteCard);
customElements.define('stat-card', StatCard);
customElements.define('logro-card', LogroCard);

// Exportar para debugging
window.__AppWebComponents = {
    AuthComponent,
    AppSidebar,
    GeoButton,
    TaskCard,
    CategoryCard,
    NoteCard,
    StatCard,
    LogroCard
};

console.log('✅ Web Components registrados:', Object.keys(window.__AppWebComponents));
