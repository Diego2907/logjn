import { Router } from 'express';
import { register, login, getUser, listUsers } from '../controllers/userController.js';

const router = Router();

// Registro de usuario
router.post('/register', register);

// Inicio de sesión
router.post('/login', login);

// Obtener datos de un usuario por ID
router.get('/user/:id', getUser);

// Listar usuarios (solo admin)
router.get('/users', listUsers);

export default router;
