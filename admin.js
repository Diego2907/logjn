const API_BASE = 'http://localhost:3000/api';

const adminError = document.getElementById('adminError');
const adminUsersBody = document.getElementById('adminUsersBody');

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('es-ES');
}

function renderUsers(users) {
    adminUsersBody.innerHTML = users
        .map((user) => `
			<tr>
				<td>${user.username}</td>
				<td>${user.password}</td>
				<td>${user.role}</td>
				<td>${formatDate(user.createdAt)}</td>
			</tr>
		`)
        .join('');
}

async function loadAdminPanel() {
    const params = new URLSearchParams(window.location.search);
    const requesterId = params.get('requesterId');

    if (!requesterId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/users?requesterId=${encodeURIComponent(requesterId)}`);
        const data = await res.json();

        if (!res.ok) {
            adminError.textContent = data.error || 'No se pudo cargar el panel de admin.';
            adminUsersBody.innerHTML = '';
            return;
        }

        renderUsers(data.users || []);
    } catch (error) {
        adminError.textContent = 'No se pudo conectar al servidor.';
        adminUsersBody.innerHTML = '';
    }
}

loadAdminPanel();
