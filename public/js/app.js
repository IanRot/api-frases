document.addEventListener('DOMContentLoaded', () => {
    // Manejo de Sesión / UI state
    const token = localStorage.getItem('token');
    const guestEls = document.querySelectorAll('.guest-only');
    const authEls = document.querySelectorAll('.auth-only');

    if (token) {
        guestEls.forEach(el => el.style.display = 'none');
        authEls.forEach(el => el.style.display = 'block');
    } else {
        guestEls.forEach(el => el.style.display = 'block');
        authEls.forEach(el => el.style.display = 'none');
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = '/login';
        });
    }

    // Utilidad para mostrar alertas
    const showAlert = (id, message, type = 'error') => {
        const alertEl = document.getElementById(id);
        if (alertEl) {
            alertEl.textContent = message;
            alertEl.className = `alert ${type}`;
            alertEl.style.display = 'block';
            setTimeout(() => { alertEl.style.display = 'none'; }, 4000);
        }
    };

    // Funciones API
    const API_URL = '';

    const apiFetch = async (endpoint, options = {}) => {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: { ...headers, ...options.headers }
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.mensaje || 'Error en la petición');
        return data;
    };

    // --- FORMULARIO DE LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } catch (err) {
                showAlert('login-alert', err.message);
            }
        });
    }

    // --- FORMULARIO DE REGISTRO ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const codigoAdmin = document.getElementById('codigoAdmin').value;
            
            try {
                await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ nombre, email, password, codigoAdmin })
                });
                showAlert('register-alert', 'Registro exitoso, puedes iniciar sesión', 'success');
                setTimeout(() => window.location.href = '/login', 2000);
            } catch (err) {
                showAlert('register-alert', err.message);
            }
        });
    }

    // --- CARGAR FRASES (Página Principal) ---
    const phrasesContainer = document.getElementById('phrases-container');
    if (phrasesContainer) {
        const loadPhrases = async () => {
            try {
                const data = await apiFetch('/frases');
                if (data.length === 0) {
                    phrasesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No hay frases disponibles. ¡Sé el primero en crear una!</p>';
                    return;
                }
                
                phrasesContainer.innerHTML = data.map(f => {
                    const autorNombre = f.autor ? f.autor.nombre : `Usuario #${f.usuarioId}`;
                    return `
                    <div class="phrase-card glass">
                        <div>
                            <span class="phrase-type">${f.tipo}</span>
                            <p class="phrase-text">"${f.texto}"</p>
                            <small style="color: var(--text-secondary)">Por: ${autorNombre}</small>
                        </div>
                        ${token ? `
                        <div class="card-actions">
                            <a href="/editar-frase/${f.id}" class="btn btn-secondary">Editar</a>
                            <button onclick="deletePhrase(${f.id})" class="btn btn-danger">Eliminar</button>
                        </div>
                        ` : ''}
                    </div>
                `}).join('');
            } catch (err) {
                phrasesContainer.innerHTML = `<p style="grid-column: 1/-1; color: var(--danger);">Error cargando frases: ${err.message}</p>`;
            }
        };
        
        loadPhrases();
        
        // Exponer deletePhrase al window para usar en onclick
        window.deletePhrase = async (id) => {
            if (!confirm('¿Estás seguro de eliminar esta frase?')) return;
            try {
                await apiFetch(`/frases/${id}`, { method: 'DELETE' });
                loadPhrases(); // Recargar tras borrar
            } catch (err) {
                alert(`Error al eliminar: ${err.message}`);
            }
        };
    }

    // --- FRASE ALEATORIA ---
    const randomBtn = document.getElementById('random-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', async () => {
            const randomType = document.getElementById('random-type').value;
            const query = randomType ? `?tipo=${randomType}` : '';
            const resultDiv = document.getElementById('random-result');
            
            try {
                resultDiv.innerHTML = '<span style="color:var(--text-secondary)">Buscando...</span>';
                const data = await apiFetch(`/frases/random${query}`);
                const autorNombre = data.autor ? data.autor.nombre : `Usuario #${data.usuarioId}`;
                resultDiv.innerHTML = `"${data.texto}" <br><small style="color: var(--primary); font-size:0.9rem; margin-top:10px; display:block;">— Por: ${autorNombre} <span style="opacity:0.7">| Tipo: ${data.tipo}</span></small>`;
            } catch (err) {
                resultDiv.innerHTML = `<span style="color:var(--danger)">Error: ${err.message}</span>`;
            }
        });
    }

    // --- FORMULARIO CREAR/EDITAR FRASE ---
    const phraseForm = document.getElementById('phrase-form');
    if (phraseForm) {
        const phraseId = document.getElementById('phraseId').value;
        const isEdit = !!phraseId;
        
        // Si es edición, cargar datos
        if (isEdit) {
            apiFetch(`/frases/${phraseId}`).then(data => {
                document.getElementById('texto').value = data.texto;
                document.getElementById('tipo').value = data.tipo;
            }).catch(err => showAlert('form-alert', 'Error cargando datos: ' + err.message));
        }
        
        phraseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const texto = document.getElementById('texto').value;
            const tipo = document.getElementById('tipo').value;
            
            try {
                const endpoint = isEdit ? `/frases/${phraseId}` : '/frases';
                const method = isEdit ? 'PUT' : 'POST';
                
                await apiFetch(endpoint, {
                    method,
                    body: JSON.stringify({ texto, tipo })
                });
                
                window.location.href = '/';
            } catch (err) {
                showAlert('form-alert', err.message);
            }
        });
    }
});
