const winston = require('winston');
const path = require('path');

// Log dosyalarının kaydedileceği dizin
const logDir = path.join(__dirname, '../../logs');

// Winston logger konfigürasyonu
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'trading-platform' },
    transports: [
        // Hata logları için ayrı dosya
        new winston.transports.File({ 
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Tüm loglar için genel dosya
        new winston.transports.File({ 
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Konsol çıktısı (development ortamında)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Test mesajı
logger.info('Logger initialized successfully');

module.exports = logger;
