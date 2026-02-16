/* ============================================================
   login.js  –  Lógica de Login y Registro (API REST)
   ============================================================ */

const API_BASE = 'http://localhost:3000/api';

// ── Elementos del DOM ───────────────────────────────────────
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const loginUserError = document.getElementById('loginUserError');
const loginPassError = document.getElementById('loginPassError');
const loginGeneralError = document.getElementById('loginGeneralError');
const btnLogin = document.getElementById('btnLogin');
const btnOpenRegister = document.getElementById('btnOpenRegister');

const registerModal = document.getElementById('registerModal');
const closeRegister = document.getElementById('closeRegister');
const regUser = document.getElementById('regUser');
const regPass = document.getElementById('regPass');
const regPassConfirm = document.getElementById('regPassConfirm');
const regUserError = document.getElementById('regUserError');
const regPassError = document.getElementById('regPassError');
const regPassConfirmError = document.getElementById('regPassConfirmError');
const btnRegister = document.getElementById('btnRegister');

const successModal = document.getElementById('successModal');
const closeSuccess = document.getElementById('closeSuccess');

// ── Helpers ─────────────────────────────────────────────────
function clearErrors(...els) {
    els.forEach(el => (el.textContent = ''));
}

function openModal(modal) { modal.classList.add('active'); }
function closeModalFn(modal) { modal.classList.remove('active'); }

// ── Validaciones del lado del cliente ───────────────────────
function validateUsername(value, errorEl) {
    if (value.length < 2) {
        errorEl.textContent = 'El usuario debe tener al menos 2 caracteres.';
        return false;
    }
    return true;
}

function validatePassword(value, errorEl) {
    if (value.length < 8) {
        errorEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        return false;
    }
    return true;
}

// ── Login ───────────────────────────────────────────────────
btnLogin.addEventListener('click', async () => {
    clearErrors(loginUserError, loginPassError, loginGeneralError);

    const user = loginUser.value.trim();
    const pass = loginPass.value;

    const validUser = validateUsername(user, loginUserError);
    const validPass = validatePassword(pass, loginPassError);
    if (!validUser || !validPass) return;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass }),
        });

        const data = await res.json();

        if (!res.ok) {
            loginGeneralError.textContent = data.error || 'Error al iniciar sesión.';
            return;
        }

        // Éxito
        openModal(successModal);
    } catch (err) {
        loginGeneralError.textContent = 'No se pudo conectar al servidor.';
    }
});

// ── Abrir / cerrar modal de registro ────────────────────────
btnOpenRegister.addEventListener('click', () => {
    clearErrors(regUserError, regPassError, regPassConfirmError);
    regUser.value = '';
    regPass.value = '';
    regPassConfirm.value = '';
    openModal(registerModal);
});

closeRegister.addEventListener('click', () => closeModalFn(registerModal));

registerModal.addEventListener('click', (e) => {
    if (e.target === registerModal) closeModalFn(registerModal);
});

// ── Registro ────────────────────────────────────────────────
btnRegister.addEventListener('click', async () => {
    clearErrors(regUserError, regPassError, regPassConfirmError);

    const user = regUser.value.trim();
    const pass = regPass.value;
    const confirm = regPassConfirm.value;

    const validUser = validateUsername(user, regUserError);
    const validPass = validatePassword(pass, regPassError);

    let validConfirm = true;
    if (pass !== confirm) {
        regPassConfirmError.textContent = 'Las contraseñas no coinciden.';
        validConfirm = false;
    }

    if (!validUser || !validPass || !validConfirm) return;

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass, confirmPassword: confirm }),
        });

        const data = await res.json();

        if (!res.ok) {
            if (data.error.includes('usuario ya existe')) {
                regUserError.textContent = data.error;
            } else {
                regPassError.textContent = data.error;
            }
            return;
        }

        closeModalFn(registerModal);
        alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
    } catch (err) {
        regPassError.textContent = 'No se pudo conectar al servidor.';
    }
});

// ── Cerrar modal de éxito ───────────────────────────────────
closeSuccess.addEventListener('click', () => closeModalFn(successModal));

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) closeModalFn(successModal);
});
