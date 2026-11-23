import winston from 'winston';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    format: combine(
        errors({ stack: true }),
        timestamp(),
        json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

if (!isProduction) {
    logger.add(new winston.transports.Console({
        format: combine(
            colorize(),
            printf(({ level, message, timestamp, stack }) => {
                return `${timestamp} ${level}: ${stack || message}`;
            })
        )
    }));
}

// Ruta de prueba (/loggerTest) heredada de la clase 3
export const loggerTest = (req, res) => {
    logger.http('HTTP');
    logger.debug('DEBUG');
    logger.info('INFO');
    logger.warn('WARN');
    logger.error('ERROR');
    res.send({ status: 'success', message: 'Logs generados: http, debug, info, warn y error' });
};

export default { logger, loggerTest };
