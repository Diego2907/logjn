import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from './config/database.js';
import helmetMiddleware from './middlewares/helmet.js';
import rateLimiter from './middlewares/rateLimit.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ────────────────────────────────────
app.use(helmetMiddleware);
app.use(rateLimiter);
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Archivos estáticos (HTML, JS del frontend) ─────────────
app.use(express.static(path.join(__dirname, '..')));

// ── Rutas de la API ─────────────────────────────────────────
app.use('/api', userRoutes);

// ── Inicio ──────────────────────────────────────────────────
async function start() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a MySQL establecida correctamente.');

        // Sincronizar modelos (crea las tablas si no existen)
        await sequelize.sync();
        console.log('Modelos sincronizados.');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('No se pudo conectar a la base de datos:', err);
        process.exit(1);
    }
}

start();
