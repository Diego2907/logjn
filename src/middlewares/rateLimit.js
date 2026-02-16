import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutos
    max: 100,                    // máximo 100 peticiones por ventana
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde.' },
});

export default limiter;
