import winston from 'winston';
import config from '@/config';

const { combine, timestamp, errors, align, printf, colorize, json } = winston.format;

// Custom console format
const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
    align(),
    printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        const rawLevel = (level as string).replace(/\u001b\[\d+m/g, '');
        return `${timestamp} [${rawLevel.toUpperCase()}]: ${message} ${metaStr}`;
    })
);

const transports: winston.transport[] = [];

if (config.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({ format: consoleFormat })
    );
} else {
    transports.push(
        new winston.transports.Console({
            format: combine(
                timestamp(),
                errors({ stack: true }),
                json()
            ),
        })
    );
}

const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    transports,
    silent: config.NODE_ENV === 'test',
});

export { logger };
