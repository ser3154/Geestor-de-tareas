/* Web Components ligeros para la app
   - No usamos Shadow DOM para conservar estilos globales (CSS existente)
   - `auth-component` y `app-sidebar` clonan plantillas desde el DOM
   - `geo-button` usa la Geolocation API y emite evento con las coords
*/

class AuthComponent extends HTMLElement {
    connectedCallback() {
        const tpl = document.getElementById('auth-template');
        if (tpl) {
            // Inserta el contenido de la plantilla en el componente
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
        // Crear control simple (usa clases existentes para estilo mínimo)
        this.innerHTML = `
            <div class="geo-wrapper">
                <button id="geo-btn" class="btn btn-ghost" title="Compartir ubicación">📍</button>
                <span id="geo-coords" class="geo-coords" aria-live="polite"></span>
            </div>
        `;

        const btn = this.querySelector('#geo-btn');
        btn.addEventListener('click', () => this.requestLocation(btn));
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

                // Emitir evento con detalles para que la app pueda usar la ubicación
                this.dispatchEvent(new CustomEvent('geo:obtained', {
                    detail: { latitude: c.latitude, longitude: c.longitude },
                    bubbles: true
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
        // Mensaje simple (no dependemos de UIHelpers aquí)
        // Si existe un contenedor de alertas personalizado, añadirlo allí
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
}

customElements.define('auth-component', AuthComponent);
customElements.define('app-sidebar', AppSidebar);
customElements.define('geo-button', GeoButton);

// exportar para debug si es necesario
window.__AppWebComponents = { AuthComponent, AppSidebar, GeoButton };
