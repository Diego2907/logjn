import bcrypt from 'bcrypt';
import User from '../models/User.js';

const SALT_ROUNDS = 10;
const ALLOWED_ROLES = ['admin', 'lector'];

function normalizeRole(roleValue) {
    const role = String(roleValue || '').trim().toLowerCase();

    if (role === 'admin' || role === 'administrador') return 'admin';
    if (role === 'lector' || role === 'reader') return 'lector';

    return role;
}

// POST /api/register
export async function register(req, res) {
    try {
        const { username, password, confirmPassword, role = 'lector' } = req.body;
        const normalizedRole = normalizeRole(role || 'lector');

        // Validaciones
        if (!username || username.length < 2) {
            return res.status(400).json({ error: 'El usuario debe tener al menos 2 caracteres.' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
        }
        if (!ALLOWED_ROLES.includes(normalizedRole)) {
            return res.status(400).json({ error: 'Rol inválido. Debe ser admin o lector.' });
        }

        // Verificar si ya existe
        const existing = await User.findOne({ where: { username } });
        if (existing) {
            return res.status(409).json({ error: 'Ese usuario ya existe.' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Crear usuario
        const user = await User.create({ username, password: hashedPassword, role: normalizedRole });

        return res.status(201).json({
            message: 'Cuenta creada con éxito.',
            user: { id: user.id, username: user.username, role: normalizeRole(user.role) },
        });
    } catch (err) {
        console.error('Error en registro:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

// POST /api/login
export async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Validaciones
        if (!username || username.length < 2) {
            return res.status(400).json({ error: 'El usuario debe tener al menos 2 caracteres.' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        // Buscar usuario
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        // Comparar contraseña
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        return res.json({
            message: 'Login exitoso',
            user: { id: user.id, username: user.username, role: normalizeRole(user.role) },
        });
    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

// GET /api/user/:id
export async function getUser(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: ['id', 'username', 'role', 'createdAt'],
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        return res.json({
            user: {
                ...user.toJSON(),
                role: normalizeRole(user.role),
            },
        });
    } catch (err) {
        console.error('Error al obtener usuario:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

// GET /api/users?requesterId=...
export async function listUsers(req, res) {
    try {
        const { requesterId } = req.query;

        if (!requesterId) {
            return res.status(400).json({ error: 'requesterId es obligatorio.' });
        }

        const requester = await User.findByPk(requesterId);
        if (!requester) {
            return res.status(404).json({ error: 'Usuario solicitante no encontrado.' });
        }

        if (normalizeRole(requester.role) !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
        }

        const users = await User.findAll({
            attributes: ['username', 'password', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });

        return res.json({
            users: users.map((user) => ({
                ...user.toJSON(),
                role: normalizeRole(user.role),
            })),
        });
    } catch (err) {
        console.error('Error al listar usuarios:', err);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
