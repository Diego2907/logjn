import helmet from 'helmet';

const helmetMiddleware = helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
});

export default helmetMiddleware;
