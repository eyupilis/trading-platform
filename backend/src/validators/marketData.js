const Joi = require('joi');

const marketDataSchema = {
    // Market listesi için validasyon
    getMarkets: {
        query: Joi.object({
            limit: Joi.number().integer().min(1).max(100).default(20),
            offset: Joi.number().integer().min(0).default(0),
            sort: Joi.string().valid('volume', 'price', 'change').default('volume'),
            order: Joi.string().valid('asc', 'desc').default('desc')
        })
    },

    // Pazar detayı için validasyon
    getMarketDetail: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        })
    },

    // Order book için validasyon
    getOrderBook: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        }),
        query: Joi.object({
            limit: Joi.number().integer().valid(5, 10, 20, 50, 100, 500, 1000).default(100)
        })
    },

    // Son işlemler için validasyon
    getRecentTrades: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        }),
        query: Joi.object({
            limit: Joi.number().integer().min(1).max(1000).default(100)
        })
    },

    // Teknik analiz için validasyon
    getTechnicalAnalysis: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        }),
        query: Joi.object({
            indicators: Joi.array().items(Joi.string()).min(1).default(['RSI', 'MACD', 'MA'])
        })
    },

    // Teknik göstergeler için validasyon
    getTechnicalIndicators: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        }),
        query: Joi.object({
            indicator: Joi.string().required(),
            period: Joi.number().integer().min(1).max(200).default(14)
        })
    },

    // Fiyat verisi için validasyon
    getPrice: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        })
    },

    // Fiyat geçmişi için validasyon
    getPriceHistory: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        }),
        query: Joi.object({
            interval: Joi.string().valid('1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M').default('1h'),
            limit: Joi.number().integer().min(1).max(1000).default(100),
            startTime: Joi.date(),
            endTime: Joi.date().greater(Joi.ref('startTime'))
        })
    },

    // OHLCV verisi için validasyon
    getOHLCV: {
        params: Joi.object({
            symbol: Joi.string().required().pattern(/^[A-Z0-9]{2,20}$/)
        }),
        query: Joi.object({
            interval: Joi.string().valid('1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M').default('1h'),
            limit: Joi.number().integer().min(1).max(1000).default(100)
        })
    },

    // Haberler için validasyon
    getNews: {
        query: Joi.object({
            limit: Joi.number().integer().min(1).max(50).default(20),
            offset: Joi.number().integer().min(0).default(0),
            category: Joi.string().valid('market', 'crypto', 'stock', 'forex').default('market')
        })
    },

    // Haber detayı için validasyon
    getNewsDetail: {
        params: Joi.object({
            id: Joi.string().required().uuid()
        })
    },

    // Etkinlikler için validasyon
    getEvents: {
        query: Joi.object({
            limit: Joi.number().integer().min(1).max(50).default(20),
            offset: Joi.number().integer().min(0).default(0),
            type: Joi.string().valid('earnings', 'dividend', 'split', 'economic').default('all')
        })
    },

    // Ekonomik takvim için validasyon
    getCalendar: {
        query: Joi.object({
            startDate: Joi.date().required(),
            endDate: Joi.date().greater(Joi.ref('startDate')).required(),
            importance: Joi.string().valid('low', 'medium', 'high').default('all'),
            country: Joi.string().alphanum().length(2).uppercase()
        })
    }
};

// Validasyon middleware'i
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.query || req.params || req.body);
    
    if (error) {
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }
    
    next();
};

module.exports = {
    marketDataSchema,
    validate
};
